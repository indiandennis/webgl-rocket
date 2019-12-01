import {tiny, defs} from './common.js';
import Body from './body.js';
import Simulation from './simulation.js';
import Camera_Controls from './camera-controls.js'
// Pull these names into this module's scope for convenience:
const {
    Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4, Light, Shape, Material, Shader, Texture, Scene,
    Canvas_Widget, Code_Widget, Text_Widget
} = tiny;

// Now we have loaded everything in the files tiny-graphics.js, tiny-graphics-widgets.js, and common.js.
// This yielded "tiny", an object wrapping the stuff in the first two files, and "defs" for wrapping all the rest.

// ******************** Extra step only for when executing on a local machine:
//                      Load any more files in your directory and copy them into "defs."
//                      (On the web, a server should instead just pack all these as well
//                      as common.js into one file for you, such as "dependencies.js")

/*const Minimal_Webgl_Demo = defs.Minimal_Webgl_Demo;
import {Axes_Viewer, Axes_Viewer_Test_Scene}
    from "./examples/axes-viewer.js"
import {Inertia_Demo, Collision_Demo}
    from "./examples/collisions-demo.js"
import {Many_Lights_Demo}
    from "./examples/many-lights-demo.js"
import {Obj_File_Demo}
    from "./examples/obj-file-demo.js"
import {Scene_To_Texture_Demo}
    from "./examples/scene-to-texture-demo.js"
import {Surfaces_Demo}
    from "./examples/surfaces-demo.js"
import {Text_Demo}
    from "./examples/text-demo.js"
import {Transforms_Sandbox}
    from "./examples/transforms-sandbox.js"

Object.assign(defs,
    {Axes_Viewer, Axes_Viewer_Test_Scene},
    {Inertia_Demo, Collision_Demo},
    {Many_Lights_Demo},
    {Obj_File_Demo},
    {Scene_To_Texture_Demo},
    {Surfaces_Demo},
    {Text_Demo},
    {Transforms_Sandbox});*/

// ******************** End extra step

// (Can define Main_Scene's class here)

class Main_Scene extends Simulation {
    constructor() {
        super();

        this.textures = {
            metal: new Texture("assets/textures/metal.jpg"),
            earth: new Texture("assets/textures/earth.png", "LINEAR_MIPMAP_LINEAR"),
            body: new Texture("assets/textures/stage-2-body.png"),

            // TODO: TEXTURES
            sky: new Texture("assets/textures/gradient.png", "LINEAR_MIPMAP_LINEAR"),
            space: new Texture("assets/textures/space.png", "LINEAR_MIPMAP_LINEAR"),
            sun: new Texture("assets/textures/sun-from-earth.png"),
            smoke: new Texture("assets/textures/sphere.png", "LINEAR"),
        };

        this.shapes = {
            "sphere": new defs.Subdivision_Sphere(8),
            "earth": new defs.Shape_From_File("assets/objects/earth.obj"),
            "booster-nose": new defs.Shape_From_File("assets/objects/booster-nose.obj"),
            "booster-body": new defs.Shape_From_File("assets/objects/booster-body.obj"),
            "booster-engine": new defs.Shape_From_File("assets/objects/booster-engine.obj"),
            "stage-2-body": new defs.Shape_From_File("assets/objects/stage-2-body.obj"),
            "stage-2-engine": new defs.Shape_From_File("assets/objects/stage-2-engine.obj"),
            "stage-3-body": new defs.Shape_From_File("assets/objects/stage-3-body.obj"),
            "stage-3-engine": new defs.Shape_From_File("assets/objects/stage-3-engine.obj"),
            "stage-4-body": new defs.Shape_From_File("assets/objects/stage-4-body.obj"),
            "stage-4-engine": new defs.Shape_From_File("assets/objects/stage-4-engine.obj"),
            "payload-fairing-half": new defs.Shape_From_File("assets/objects/payload-fairing-half.obj"),
            "cloud-1": new defs.Shape_From_File("assets/objects/cloud1.obj"),

            // TODO: OBJECTS
            "sky": new defs.Internal_Subdivision_Sphere(4),
            "space": new defs.Internal_Subdivision_Sphere(4),
            "sun": new defs.Square(),

        };

        this.emitters = {
            "booster": new defs.Particle_Emitter(10000),
            "stage-2": new defs.Particle_Emitter(10000),
            "stage-3": new defs.Particle_Emitter(10000),
            "stage-4": new defs.Particle_Emitter(10000),
        };

        this.booster_smoke_material = new Material(new defs.Particle_Shader(.5), {
            color: color(0, 0, 0, 1),
            texture: this.textures.smoke,
        });

        this.stage_2_smoke_material = new Material(new defs.Particle_Shader(2.0), {
            color: color(0, 0, 0, 1),
            texture: this.textures.smoke,
        });


        this.body_material = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: .6,
            specularity: .2,
            diffusivity: .3,
            texture: this.textures.body
        });

        this.widget_options = {
            show_explanation: false,
            make_editor: false, make_code_nav: false
        };

        this.rocket_material = new Material(new defs.Phong_Shader(), {
            color: color(.9, .9, .9, 1),
            ambient: .4,
            specularity: .2,
            diffusivity: .4
        });

        this.metal_material = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: 1,
            specularity: .8,
            diffusivity: .1,
            texture: this.textures.metal,
        });

        this.cloud = new Material(new defs.Phong_Shader(), {
            color: color(1, 1, 1, 1),
            ambient: .6,
            specularity: .1,
            diffusivity: .3
        });

        this.earth_material = new Material(new defs.Textured_Phong(), {
            color: color(.05, .05, .05, 1),
            ambient: .9,
            specularity: 0,
            diffusivity: .25,
            texture: this.textures.earth,
        });

        // TODO: MATERIALS
        this.sky_material = new Material(new defs.Textured_Phong(), {
            color: color(0.443, 0.694, 0.91, 1),
            ambient: 1,
            specularity: 0,
            diffusivity: 0,
            texture: this.textures.sky,
        });
        this.space_material = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: 1,
            specularity: 0,
            diffusivity: 0,
            texture: this.textures.space,
        });
        this.sun_material = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: 1,
            texture: this.textures.sun,
        });


        this.scale_factor = vec3(1, 1, 1);

        this.bottom_body = 9;

        this.bodies = [
            new Body(
                [this.shapes["payload-fairing-half"], this.shapes["payload-fairing-half"]],
                [Mat4.translation(0, 0, 0), Mat4.rotation(Math.PI, 0, 1, 0)],
                [this.rocket_material, this.rocket_material],
                this.scale_factor,
                [vec3(-4, 0, -4), vec3(4, 18, 4)]
            ).emplace(Mat4.translation(0, 56, 0), vec3(0, 0, 0), 0, false),
            new Body(
                [this.shapes["stage-4-body"], this.shapes["stage-4-engine"], this.emitters["stage-4"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 0, 0), Mat4.translation(0, -1, 0)],
                [this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec3(-3, -1, -3), vec3(3, 6, 3)] //TODO: verify this is correct
            ).emplace(Mat4.translation(0, 50, 0), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["stage-3-body"], this.shapes["stage-3-engine"], this.shapes["stage-3-engine"], this.shapes["stage-3-engine"], this.shapes["stage-3-engine"], this.emitters["stage-3"], this.emitters["stage-3"], this.emitters["stage-3"], this.emitters["stage-3"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 0, 0), Mat4.translation(-2.5, 0, 0), Mat4.translation(-2.5, 0, +2.5), Mat4.translation(0, 0, +2.5), Mat4.translation(1.25, -1, -1.25), Mat4.translation(-1.25, -1, -1.25), Mat4.translation(-1.25, -1, +1.25), Mat4.translation(+1.25, -1, +1.25)],
                [this.body_material, this.metal_material, this.metal_material, this.metal_material, this.metal_material, this.booster_smoke_material, this.booster_smoke_material, this.booster_smoke_material, this.booster_smoke_material],
                this.scale_factor,
                [vec3(-3, -1, -3), vec3(3, 25, 3)]
            ).emplace(Mat4.translation(0, 25, 0), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["stage-2-body"], this.shapes["stage-2-engine"], this.emitters["stage-2"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 0, 0), Mat4.translation(0, -2.5, 0)],
                [this.rocket_material, this.metal_material, this.stage_2_smoke_material],
                this.scale_factor,
                [vec3(-3, -2, -3), vec3(3, 25, 3)]
            ).emplace(Mat4.translation(0, 0, 0), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.rocket_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec3(-1.5, -1, -1.5), vec3(1.5, 24, 1.5)]
            ).emplace(Mat4.translation(-4.5, 0, 0), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.rocket_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec3(-1.5, -1, -1.5), vec3(1.5, 24, 1.5)]
            ).emplace(Mat4.translation(4.5, 0, 0).times(Mat4.rotation(Math.PI, 0, 1, 0)), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.rocket_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec3(-1.5, -1, -1.5), vec3(1.5, 24, 1.5)]
            ).emplace(Mat4.translation(4.5 / 2, 0, Math.sqrt(3) / 2 * 4.5).times(Mat4.rotation(2 * Math.PI / 3, 0, 1, 0)), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.rocket_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec3(-1.5, -1, -1.5), vec3(1.5, 24, 1.5)]
            ).emplace(Mat4.translation(-4.5 / 2, 0, Math.sqrt(3) / 2 * 4.5).times(Mat4.rotation(Math.PI / 3, 0, 1, 0)), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.rocket_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec3(-1.5, -1, -1.5), vec3(1.5, 24, 1.5)]
            ).emplace(Mat4.translation(4.5 / 2, 0, -Math.sqrt(3) / 2 * 4.5).times(Mat4.rotation(4 * Math.PI / 3, 0, 1, 0)), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.rocket_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec3(-1.5, -1, -1.5), vec3(1.5, 24, 1.5)]
            ).emplace(Mat4.translation(-4.5 / 2, 0, -Math.sqrt(3) / 2 * 4.5).times(Mat4.rotation(5 * Math.PI / 3, 0, 1, 0)), vec3(0, 0, 0), 0),
        ];
        console.log(this.bodies);

        //camera
        //this.camera_zoom = Math.PI / 5;
        this.camera_offset = Mat4.translation(0, 0, 200);
        this.movement_transform = Mat4.identity();

        // TODO: LINEAR INTERPOLATION FOR SKY COLOR
        this.color_lerp = 0;

        // TODO: SEPARATION STAGE ANIMATION FLAGS
        this.separation_count = 0;
        this.booster_count = 0;
        this.booster_angles = [
            0,
            Math.PI,
            2 * Math.PI / 3,
            Math.PI / 3,
            4 * Math.PI / 3,
            5 * Math.PI / 3,
        ];
        this.just_detached = false;

        // TODO: CHECK IF ENGINES ARE FIRING
        this.currently_firing = false;

        // TODO: BOOSTER FUEL CAPACITY
        this.fuel_cap1 = 30;
        this.fuel_cap2 = 40;
        this.fuel_cap3 = 40;
        this.fuel_cap4 = 20;

    }

    make_control_panel() {                           // make_control_panel(): Create the buttons for using the viewer.
        this.key_triggered_button("Action", ["b"], () => this.action());
    }

    action() {
        if (!this.bodies[this.bottom_body].activated) {
            this.currently_firing = true;
            let i = this.bottom_body;
            do {
                this.bodies[i].activated = true;
                this.bodies[i].shapes[this.bodies[i].shapes.length - 1].enable();
                this.bodies[0].linear_acceleration = vec3(0, .4, 0);
                i--;
            } while (i > 3);

        } else {
            this.currently_firing = false;
            this.just_detached = true;
            do {
                this.bodies[this.bottom_body].attached = false;
                this.bodies[this.bottom_body].activated = false;
                this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                this.bottom_body--;
                if (this.bottom_body < 0)
                    alert("End of Simulation");
            } while (this.bottom_body > 3);
            this.separation_count += 1;
        }
    }

    update_state(dt) {
        //only called once per frame, handle all bodies here

        //TODO: update this to handle checking boosters, collisions, accelerations, and stuff
        for (let [i, b] of this.bodies.entries()) {
            if (i === 0) {
                if (this.bodies[this.bottom_body].activated && this.currently_firing) {
                    if (b.linear_acceleration[1] < 6 * 9.8 * this.scale_factor[1])
                        b.linear_acceleration = b.linear_acceleration.plus(vec3(0, .1 * this.scale_factor[1], 0).times(dt / 1000));
                    b.linear_velocity = b.linear_velocity.plus(b.linear_acceleration.times(dt));
                    //console.log("hit")
                } else {
                    if (this.bodies[this.bottom_body].center[1] <= 0) {
                        b.linear_acceleration = vec3(0, 0, 0);
                        b.linear_velocity = vec3(0, 0, 0);
                    } else {
                        b.linear_acceleration = vec3(0, 0, 0);
                        b.linear_velocity = b.linear_velocity.plus(vec3(0, -9.8 * this.scale_factor[0], 0).times(dt / 1000));
                        b.angular_acceleration = 0;
                        b.angular_velocity += b.angular_acceleration * dt;
                    }
                }
            } else if (b.attached) {
                b.linear_acceleration = this.bodies[0].linear_acceleration;
                b.linear_velocity = this.bodies[0].linear_velocity;
                b.angular_velocity = this.bodies[0].angular_velocity;
                b.angular_acceleration = this.bodies[0].angular_velocity;
                b.spin_axis = this.bodies[0].spin_axis;
            } else {
                if (b.center[1] <= 0) {
                    b.linear_acceleration = vec3(0, 0, 0);
                    b.linear_velocity = vec3(0, 0, 0);
                } else {
                    b.linear_acceleration = vec3(0, 0, 0);
                    //b.linear_velocity = b.linear_velocity.plus(vec3(0, -9.8 * this.scale_factor[0], 0).times(dt / 1000));
                    b.angular_acceleration = 0;

                    // TODO: ANIMATE DRIFTING OF DEBRIS
                    if(this.just_detached) {
                        switch(i) {
                            case 1:
                                b.linear_velocity = b.linear_velocity.plus(vec3(-500, -9.8 * this.scale_factor[0], 500).times(dt / 1000));
                                break;
                            case 2:
                                b.linear_velocity = b.linear_velocity.plus(vec3(-950, -9.8 * this.scale_factor[0], 300).times(dt / 1000));
                                break;
                            case 3:
                                b.linear_velocity = b.linear_velocity.plus(vec3(500, -9.8 * this.scale_factor[0], 750).times(dt / 1000));
                                break;
                            case 4:
                                b.linear_velocity = b.linear_velocity.plus(vec3(-1000, -9.8 * this.scale_factor[0], 0).times(dt / 1000));
                                break;
                            case 5:
                                b.linear_velocity = b.linear_velocity.plus(vec3(1000, -9.8 * this.scale_factor[0], 0).times(dt / 1000));
                                break;
                            case 6:
                                b.linear_velocity = b.linear_velocity.plus(vec3(500, -9.8 * this.scale_factor[0], (Math.sqrt(3) / 2) * 1000).times(dt / 1000));
                                break;
                            case 7:
                                b.linear_velocity = b.linear_velocity.plus(vec3(-500, -9.8 * this.scale_factor[0], (Math.sqrt(3) / 2) * 1000).times(dt / 1000));
                                break;
                            case 8:
                                b.linear_velocity = b.linear_velocity.plus(vec3(500, -9.8 * this.scale_factor[0], -(Math.sqrt(3) / 2) * 1000).times(dt / 1000));
                                break;
                            case 9:
                                b.linear_velocity = b.linear_velocity.plus(vec3(-500, -9.8 * this.scale_factor[0], -(Math.sqrt(3) / 2) * 1000).times(dt / 1000));
                                break;
                            default:
                                b.linear_velocity = b.linear_velocity.plus(vec3(0, -9.8 * this.scale_factor[0], 0).times(dt / 1000));
                        }
                    }


                    // TODO: ANIMATE ROTATION OF DEBRIS
                    if(this.separation_count === 1 && i > 3 && i < 10) {
                        switch(this.booster_angles[this.booster_count]) {
                            case 0:
                                b.spin_axis = vec3(0, 0, 1);
                                break;
                            case Math.PI:
                                b.spin_axis = vec3(0, 0, -1);
                                break;
                            case 2 * Math.PI / 3:
                                b.spin_axis = vec3(Math.sqrt(3) / 2, 0, -1 / 2);
                                break;
                            case Math.PI / 3:
                                b.spin_axis = vec3(Math.sqrt(3) / 2, 0, 1 / 2);
                                break;
                            case 4 * Math.PI / 3:
                                b.spin_axis = vec3(-Math.sqrt(3) / 2, 0, -1 / 2);
                                break;
                            case 5 * Math.PI / 3:
                                b.spin_axis = vec3(-Math.sqrt(3) / 2, 0, 1 / 2);
                                break;
                        }
                        b.angular_velocity = 0.1;
                        this.booster_count += 1;
                    }
                    else if(this.separation_count === 2 && i === 3) {
                        b.spin_axis = vec3(0.5, 0, -0.75);
                        b.angular_velocity = 0.01;
                    }
                    else if(this.separation_count === 3 && i === 2) {
                        b.spin_axis = vec3(-0.95, 0, 0.30);
                        b.angular_velocity = 0.01;
                    }
                    else if(this.separation_count === 4 && i === 1) {
                        b.spin_axis = vec3(0.5, 0, 0.5);
                        b.angular_velocity = 0.01;
                    }
                    else {
                        b.angular_velocity += b.angular_acceleration * dt;
                    }

                }

                //console.log("hit2")

            }
        }
        this.just_detached = false;

        if(this.currently_firing) {
            switch(this.separation_count) {
                case 0:
                    if(this.fuel_cap1 > 0) {
                        this.fuel_cap1 -= (dt / 10);
                    }
                    else {
                        this.currently_firing = false;
                        this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                    }
                    break;
                case 1:
                    if(this.fuel_cap2 > 0) {
                        this.fuel_cap2 -= (dt / 10);
                    }
                    else {
                        this.currently_firing = false;
                        this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                    }
                    break;
                case 2:
                    if(this.fuel_cap3 > 0) {
                        this.fuel_cap3 -= (dt / 10);
                    }
                    else {
                        this.currently_firing = false;
                        this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                    }
                    break;
                case 3:
                    if(this.fuel_cap4 > 0) {
                        this.fuel_cap4 -= (dt / 10);
                    }
                    else {
                        this.currently_firing = false;
                        this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                    }
                    break;
            }
        }
    }

    check_collisions() {
        for (let i = 1; i < this.bodies.length; i++) {
            let b = this.bodies[i];
            for (let j = i + 1; j < this.bodies.length; j++) {
                //only check collisions if at least one body is not attached
                if ((!b.attached || !this.bodies[j].attached) && b.check_collision(this.bodies[j].hitbox, this.bodies[j].center)) {
                    //console.log("boom");b

                }
            }
        }
    }


    display(context, program_state) {
        //display bodies
        super.display(context, program_state);


        //can move this stuff to the constructor if it doesn't change by t (but it probably will)
        // TODO: SUNLIGHT
        program_state.lights = [new Light(vec4(100, 500, 250, 0), color(1, 1, 1, 1), 1000000)];

        // TODO: BOOSTER LIGHTS
        if(this.currently_firing) {
            program_state.lights.push(new Light(vec4(
                this.bodies[this.bottom_body].center[0],
                this.bodies[this.bottom_body].center[1] - 4,
                this.bodies[this.bottom_body].center[2],
                1), color(1, 0.682, 0.259, 1), 100000));
        }

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new Camera_Controls(() => program_state.camera_transform, (mat) => this.movement_transform = mat));

            // Locate the camera here (inverted matrix) (keeping this in here doesn't allow the camera to follow objects).
            //uncomment this to view origin (after commenting below)
            //program_state.set_camera(Mat4.inverse(this.bodies[0].drawn_location.times(Mat4.translation(0, -10, 100))));

            //view earth
            //program_state.set_camera(Mat4.translation(0, 1000, -50000));

            program_state.projection_transform = Mat4.perspective(Math.PI / 6, context.width / context.height, 10, 6000000);
        }
        let camera = Mat4.scale(this.scale_factor[0], this.scale_factor[1], this.scale_factor[2])
            .times(Mat4.translation(this.bodies[0].center[0], this.bodies[0].center[1], this.bodies[0].center[2])).times(this.movement_transform).times(this.camera_offset);
        program_state.set_camera(camera);
        const t = program_state.animation_time, dt = program_state.animation_delta_time;


        //draw non physically animated shapes here
        let model_transform = Mat4.identity();
        this.shapes["cloud-1"].draw(context, program_state, Mat4.translation(100, 10000, 0), this.cloud);
        //this.shapes["sphere"].draw(context, program_state, Mat4.translation(0, -63100, 0).times(Mat4.scale(63100, 63100, 63100)), this.cloud);
        this.shapes["sphere"].draw(context, program_state, Mat4.translation(0, -6309884, 0).times(Mat4.scale(6310000, 6310000, 6310000)).times(Mat4.rotation(Math.PI / 2, 1, .5, 1)), this.earth_material);

        // TODO: DRAW SKY, SPACE, AND SUN
        // Color endpoints of the linear interpolation
        let sky_blue = vec4(0.443, 0.694, 0.91, 1);
        //let space_black = vec4(0.122, 0.349, 0.722, 0);
        let space_black = vec4(0, 0, 0, 1);

        // If the rocket is below 15km, color is sky blue
        // If the rocket is above 600km, color is black
        // In between, adjust color according to height
        if (this.bodies[0].center[1] < 30000.0) {
            this.color_lerp = 0;
        } else if (this.bodies[0].center[1] > 70000.0) {
            this.color_lerp = 1;
        } else {
            this.color_lerp = ((this.bodies[0].center[1] - 30000.0) / 40000.0);
        }
        // Linear interpolation equation
        const sky_color = (sky_blue.times(1 - this.color_lerp)).plus(space_black.times(this.color_lerp));

        // Change color of space sphere
        this.sky_material.color = color(sky_color[0], sky_color[1], sky_color[2], sky_color[3]);
        this.shapes["sky"].draw(context, program_state, Mat4.translation(0, -6309884, 0).times(Mat4.scale(7500000, 7500000, 7500000)), this.sky_material);
        //this.shapes["space"].draw(context, program_state, Mat4.translation(0, -6309884, 0).times(Mat4.scale(7600000, 7600000, 7600000)), this.space_material);
        this.shapes["sun"].draw(context, program_state, Mat4.translation(100000, 500000, 250000)
                                                        .times(Mat4.scale(50000, 50000, 50000))
                                                        .times(Mat4.rotation(0.9, -0.5, 0, -0.2)), this.sun_material);

        //particle effects
        //this.smoke_emitter.draw(context, program_state, Mat4.translation(20, 50, 0), this.smoke_material);
    }
}

const
    Additional_Scenes = [];

export {
    Main_Scene
    ,
    Additional_Scenes
    ,
    Canvas_Widget
    ,
    Code_Widget
    ,
    Text_Widget
    ,
    defs
}