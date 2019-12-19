import {tiny, defs} from './common.js';
import Body from './body.js';
import Simulation from './simulation.js';
import Camera_Controls from './camera-controls.js'
// Pull these names into this module's scope for convenience:
const {
    Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4, Light, Shape, Material, Shader, Texture, Scene,
    Canvas_Widget, Code_Widget, Text_Widget
} = tiny;


class Main_Scene extends Simulation {
    constructor() {
        super();

        this.textures = {
            metal: new Texture("assets/textures/metal.jpg"),
            concrete: new Texture("assets/textures/concrete.png"),
            earth: new Texture("assets/textures/earth.png", "LINEAR_MIPMAP_LINEAR"),
            booster: new Texture("assets/textures/booster-body.png"),
            stage_2: new Texture("assets/textures/stage-2-body.png"),
            stage_3: new Texture("assets/textures/stage-3-body.png"),
            stage_4: new Texture("assets/textures/stage-4-body.png"),
            payload: new Texture("assets/textures/payload.png"),
            sky: new Texture("assets/textures/gradient.png", "LINEAR_MIPMAP_LINEAR"),
            cloud_layer: new Texture("assets/textures/cloud_layer.png", "LINEAR_MIPMAP_LINEAR"),
            space: new Texture("assets/textures/space.png", "LINEAR_MIPMAP_LINEAR"),
            sun: new Texture("assets/textures/sun-from-earth.png"),
            smoke: new Texture("assets/textures/sphere.png", "LINEAR"),
            explosion_atlas_0: new Texture("assets/textures/explosion_atlas_0.png", "LINEAR"),
            explosion_atlas_1: new Texture("assets/textures/explosion_atlas_1.png", "LINEAR"),
            explosion_atlas_2: new Texture("assets/textures/explosion_atlas_2.png", "LINEAR"),
            explosion_atlas_3: new Texture("assets/textures/explosion_atlas_3.png", "LINEAR"),
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

            "platform": new defs.Shape_From_File("assets/objects/platform.obj"),
            "elevator": new defs.Shape_From_File("assets/objects/elevator.obj"),
            "tower": new defs.Shape_From_File("assets/objects/tower.obj"),
            "payload_bridge": new defs.Shape_From_File("assets/objects/payload_bridge.obj"),
            "stable_bridge": new defs.Shape_From_File("assets/objects/stable_bridgeX2.obj"),

            "cloud_layer": new defs.Internal_Subdivision_Sphere(8),
            "sky": new defs.Internal_Subdivision_Sphere(4),
            "space": new defs.Internal_Subdivision_Sphere(4),
            "sun": new defs.Square(),

        };

        this.emitters = {
            "booster": new defs.Particle_Emitter(5000),
            "stage-2": new defs.Particle_Emitter(5000),
            "stage-3": new defs.Particle_Emitter(5000),
            "stage-4": new defs.Particle_Emitter(5000),
        };

        this.booster_smoke_material = new Material(new defs.Particle_Shader(.5), {
            color: color(0, 0, 0, 1),
            texture: this.textures.smoke,
        });

        this.stage_2_smoke_material = new Material(new defs.Particle_Shader(2.0), {
            color: color(0, 0, 0, 1),
            texture: this.textures.smoke,
        });

        this.booster_material = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: .6,
            specularity: .2,
            diffusivity: .3,
            texture: this.textures.booster
        });

        this.stage_2_material = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: .6,
            specularity: .2,
            diffusivity: .3,
            texture: this.textures.stage_2
        });

        this.stage_3_material = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: .6,
            specularity: .2,
            diffusivity: .3,
            texture: this.textures.stage_3
        });

        this.stage_4_material = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: .6,
            specularity: .2,
            diffusivity: .3,
            texture: this.textures.stage_4
        });

        this.payload = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: .6,
            specularity: .2,
            diffusivity: .3,
            texture: this.textures.payload
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

        this.tower_material = new Material(new defs.Phong_Shader(), {
            color: color(.67, .18, 0, 1),
            ambient: .4,
            specularity: .4,
            diffusivity: .4,
        });

        this.platform_material = new Material(new defs.Textured_Phong(), {
            color: color(0, 0, 0, 1),
            ambient: .4,
            specularity: .2,
            diffusivity: .4,
            texture: this.textures.concrete,
        });


        this.earth_material = new Material(new defs.Textured_Phong(), {
            color: color(.05, .05, .05, 1),
            ambient: .9,
            specularity: 0,
            diffusivity: .25,
            texture: this.textures.earth,
        });

        this.cloud_layer_material = new Material(new defs.Alpha_Textured(), {
            color: color(0, 0, 0, 1),
            ambient: 1,
            specularity: 0,
            diffusivity: 0.5,
            texture: this.textures.cloud_layer,
        });

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
            diffusivity: 0,
            texture: this.textures.sun,
        });

        this.explosion_material = new Material(new defs.Billboard_Explosion_Shader(), {
            color: color(0, 0, 0, 1),
            texture0: this.textures.explosion_atlas_0,
            texture1: this.textures.explosion_atlas_1,
            texture2: this.textures.explosion_atlas_2,
            texture3: this.textures.explosion_atlas_3,
        });


        this.scale_factor = vec3(1, 1, 1);

        this.bottom_body = 9;

        this.bodies = [
            new Body(
                [this.shapes["payload-fairing-half"], this.shapes["payload-fairing-half"]],
                [Mat4.translation(0, 0, 0), Mat4.rotation(Math.PI, 0, 1, 0)],
                [this.payload, this.payload],
                this.scale_factor,
                [vec4(-4, 0, -4, 1), vec4(4, 0, -4, 1), vec4(4, 0, 4, 1), vec4(-4, 0, 4, 1), vec4(-4, 18, -4, 1), vec4(4, 18, -4, 1), vec4(4, 18, 4, 1), vec4(-4, 18, 4, 1)]
            ).emplace(Mat4.translation(0, 56, 0), vec3(0, 0, 0), 0, false),
            new Body(
                [this.shapes["stage-4-body"], this.shapes["stage-4-engine"], this.emitters["stage-4"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 0, 0), Mat4.translation(0, -1, 0)],
                [this.stage_4_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec4(-3, 0, -3, 1), vec4(3, 0, -3, 1), vec4(3, 0, 3, 1), vec4(-3, 0, 3, 1), vec4(3, 6, 3, 1), vec4(-3, 6, 3, 1), vec4(-3, 6, -3, 1), vec4(3, 6, -3, 1),] //TODO: verify this is correct
            ).emplace(Mat4.translation(0, 50, 0), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["stage-3-body"], this.shapes["stage-3-engine"], this.shapes["stage-3-engine"], this.shapes["stage-3-engine"], this.shapes["stage-3-engine"], this.emitters["stage-3"], this.emitters["stage-3"], this.emitters["stage-3"], this.emitters["stage-3"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 0, 0), Mat4.translation(-2.5, 0, 0), Mat4.translation(-2.5, 0, +2.5), Mat4.translation(0, 0, +2.5), Mat4.translation(1.25, -1, -1.25), Mat4.translation(-1.25, -1, -1.25), Mat4.translation(-1.25, -1, +1.25), Mat4.translation(+1.25, -1, +1.25)],
                [this.stage_3_material, this.metal_material, this.metal_material, this.metal_material, this.metal_material, this.booster_smoke_material, this.booster_smoke_material, this.booster_smoke_material, this.booster_smoke_material],
                this.scale_factor,
                [vec4(-3, 0, -3, 1), vec4(3, 0, -3, 1), vec4(3, 0, 3, 1), vec4(-3, 0, 3, 1), vec4(3, 25, 3, 1), vec4(-3, 25, 3, 1), vec4(-3, 25, -3, 1), vec4(3, 25, -3, 1)]
            ).emplace(Mat4.translation(0, 25, 0), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["stage-2-body"], this.shapes["stage-2-engine"], this.emitters["stage-2"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 0, 0), Mat4.translation(0, -2.5, 0)],
                [this.stage_2_material, this.metal_material, this.stage_2_smoke_material],
                this.scale_factor,
                [vec4(-3, 0, -3, 1), vec4(3, 0, -3, 1), vec4(3, 0, 3, 1), vec4(-3, 0, 3, 1), vec4(3, 25, 3, 1), vec4(-3, 25, 3, 1), vec4(-3, 25, -3, 1), vec4(3, 25, -3, 1)]
            ).emplace(Mat4.translation(0, 0, 0), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.booster_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec4(-1.5, -1, -1.5, 1), vec4(1.5, -1, -1.5, 1), vec4(1.5, -1, 1.5, 1), vec4(-1.5, -1, 1.5, 1), vec4(1.5, 24, 1.5, 1), vec4(-1.5, 24, 1.5, 1), vec4(-1.5, 24, -1.5, 1), vec4(1.5, 24, -1.5, 1)]
            ).emplace(Mat4.translation(-4.5, 0, 0), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.booster_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec4(-1.5, -1, -1.5, 1), vec4(1.5, -1, -1.5, 1), vec4(1.5, -1, 1.5, 1), vec4(-1.5, -1, 1.5, 1), vec4(1.5, 24, 1.5, 1), vec4(-1.5, 24, 1.5, 1), vec4(-1.5, 24, -1.5, 1), vec4(1.5, 24, -1.5, 1)]
            ).emplace(Mat4.translation(4.5, 0, 0).times(Mat4.rotation(Math.PI, 0, 1, 0)), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.booster_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec4(-1.5, -1, -1.5, 1), vec4(1.5, -1, -1.5, 1), vec4(1.5, -1, 1.5, 1), vec4(-1.5, -1, 1.5, 1), vec4(1.5, 24, 1.5, 1), vec4(-1.5, 24, 1.5, 1), vec4(-1.5, 24, -1.5, 1), vec4(1.5, 24, -1.5, 1)]
            ).emplace(Mat4.translation(4.5 / 2, 0, Math.sqrt(3) / 2 * 4.5).times(Mat4.rotation(2 * Math.PI / 3, 0, 1, 0)), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.booster_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec4(-1.5, -1, -1.5, 1), vec4(1.5, -1, -1.5, 1), vec4(1.5, -1, 1.5, 1), vec4(-1.5, -1, 1.5, 1), vec4(1.5, 24, 1.5, 1), vec4(-1.5, 24, 1.5, 1), vec4(-1.5, 24, -1.5, 1), vec4(1.5, 24, -1.5, 1)]
            ).emplace(Mat4.translation(-4.5 / 2, 0, Math.sqrt(3) / 2 * 4.5).times(Mat4.rotation(Math.PI / 3, 0, 1, 0)), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.booster_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec4(-1.5, -1, -1.5, 1), vec4(1.5, -1, -1.5, 1), vec4(1.5, -1, 1.5, 1), vec4(-1.5, -1, 1.5, 1), vec4(1.5, 24, 1.5, 1), vec4(-1.5, 24, 1.5, 1), vec4(-1.5, 24, -1.5, 1), vec4(1.5, 24, -1.5, 1)]
            ).emplace(Mat4.translation(4.5 / 2, 0, -Math.sqrt(3) / 2 * 4.5).times(Mat4.rotation(4 * Math.PI / 3, 0, 1, 0)), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["booster-body"], this.shapes["booster-nose"], this.shapes["booster-engine"], this.emitters["booster"]],
                [Mat4.translation(0, 0, 0), Mat4.translation(0, 18, 0), Mat4.translation(0, 0, 0), Mat4.translation(.25, -1.1, .1)],
                [this.booster_material, this.rocket_material, this.metal_material, this.booster_smoke_material],
                this.scale_factor,
                [vec4(-1.5, -1, -1.5, 1), vec4(1.5, -1, -1.5, 1), vec4(1.5, -1, 1.5, 1), vec4(-1.5, -1, 1.5, 1), vec4(1.5, 24, 1.5, 1), vec4(-1.5, 24, 1.5, 1), vec4(-1.5, 24, -1.5, 1), vec4(1.5, 24, -1.5, 1)]
            ).emplace(Mat4.translation(-4.5 / 2, 0, -Math.sqrt(3) / 2 * 4.5).times(Mat4.rotation(5 * Math.PI / 3, 0, 1, 0)), vec3(0, 0, 0), 0),
            new Body(
                [this.shapes["platform"]],
                [Mat4.translation(0, 0, 0)],
                [this.platform_material],
                this.scale_factor,
                [vec4(-50, 0, -50, 1), vec4(50, 0, -50, 1), vec4(50, 0, 50, 1), vec4(-50, 0, 50, 1), vec4(50, 6, 50, 1), vec4(-50, 6, 50, 1), vec4(-50, 6, -50, 1), vec4(50, 6, -50, 1)]
            ).emplace(Mat4.translation(0, -8, 0), vec3(0, 0, 0), 0, false, true),
            new Body(
                [this.shapes["tower"]],
                [Mat4.translation(0, 0, 0)],
                [this.tower_material],
                this.scale_factor,
                [vec4(-12, 0, -10, 1), vec4(11, 0, -10, 1), vec4(11, 0, 10, 1), vec4(-12, 0, 10, 1), vec4(-12, 94, -10, 1), vec4(11, 94, -10, 1), vec4(11, 94, 10, 1), vec4(-12, 94, 10, 1),]
            ).emplace(Mat4.translation(-18, -2, 0), vec3(0, 0, 0), 0, false),
        ];
        console.log(this.bodies);

        //camera
        //this.camera_zoom = Math.PI / 5;
        this.camera_offset = Mat4.translation(0, 0, 200);
        this.movement_transform = Mat4.identity();

        this.color_lerp = 0;

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
        this.just_activated = false;
        this.launched = false;

        this.bridge_scale = Mat4.identity();

        this.currently_firing = false;

        this.fuel_cap1 = 25;
        this.fuel_cap2 = 35;
        this.fuel_cap3 = 35;
        this.fuel_cap4 = 10;


        this.explosions = [
            //create initial explosion to prevent lag later
            {
                "shape": new defs.Billboard_Quad(),
                "mat": Mat4.translation(0, -10, 0)
            }
        ];
    }

    make_control_panel() {                           // make_control_panel(): Create the buttons for using the viewer.
        this.key_triggered_button("Action", [" "], () => this.action());
    }

    action() {
        if (!this.bodies[this.bottom_body].activated) {
            this.currently_firing = true;
            let i = this.bottom_body;
            if (i === 9)
                setTimeout(() => this.launched = true, 500);

            this.just_activated = true;
            if (this.bottom_body > 0) {
                do {
                    this.bodies[i].activated = true;
                    this.bodies[i].shapes[this.bodies[i].shapes.length - 1].enable();
                    this.bodies[0].linear_acceleration = vec3(0, .4, 0);
                    i--;
                } while (i > 3);
            }

        } else {
            this.currently_firing = false;
            this.just_detached = true;

            do {
                this.bodies[this.bottom_body].ignore_collisions = true;
                let i = this.bottom_body;
                setTimeout(() => {
                    this.bodies[i].ignore_collisions = false;
                    console.log(i)
                }, 2000);
                this.bodies[this.bottom_body].attached = false;
                this.bodies[this.bottom_body].activated = false;
                this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                if (this.bottom_body > 0)
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
        for (let i = 0; i < 10; i++) {
            let b = this.bodies[i];

            if (b.enabled) {
                if (i === 0) {
                    if (this.bodies[this.bottom_body].activated && this.currently_firing) {
                        if (this.just_activated) {
                            b.linear_acceleration = b.linear_acceleration.plus(vec3(0, 1, 0));
                        }
                        if (b.linear_acceleration[1] < 10 * 9.8)
                            b.linear_acceleration = b.linear_acceleration.plus(vec3(0, .5, 0).times(dt / 1000));
                        b.linear_velocity = b.linear_velocity.plus(b.linear_acceleration.times(dt / 5));
                        //console.log("hit")
                    } else if (this.bodies[this.bottom_body].center[1] <= 0) {
                        if (this.launched) {
                            let bb = this.bodies[this.bottom_body];
                            this.explosions.push({
                                "shape": new defs.Billboard_Quad(),
                                "mat": Mat4.translation(bb.center[0], bb.center[1] + bb.hitbox[4][1] / 2, bb.center[2])
                                    .times(Mat4.scale(bb.hitbox[4][1] + 15, bb.hitbox[4][1] + 15, bb.hitbox[4][1] + 15))
                            });
                            //derender body
                            bb.enabled = false;
                            if (this.bottom_body > 0)
                                this.bottom_body--;
                            else {
                                bb.linear_acceleration = vec3(0, 0, 0);
                                bb.linear_velocity = vec3(0, 0, 0);
                            }
                        } else {
                            b.linear_acceleration = vec3(0, 0, 0);
                            b.linear_velocity = vec3(0, 0, 0);
                            b.angular_velocity = 0;
                            b.angular_acceleration = 0;
                        }
                    } else {
                        b.linear_acceleration = vec3(0, -9.8, 0);
                        if (b.linear_velocity[1] > -70)
                            b.linear_velocity = b.linear_velocity.plus(b.linear_acceleration.times(dt / 15));
                        b.angular_acceleration = 0;
                        b.angular_velocity += b.angular_acceleration * dt / 1000;
                    }
                } else if (b.attached) {
                    b.linear_acceleration = this.bodies[0].linear_acceleration;
                    b.linear_velocity = this.bodies[0].linear_velocity;
                    b.angular_velocity = this.bodies[0].angular_velocity;
                    b.angular_acceleration = this.bodies[0].angular_velocity;
                    b.spin_axis = this.bodies[0].spin_axis;
                } else {
                    if (b.calculate_AABB()[0][1] <= 0) {
                        if (this.launched) {
                            this.explosions.push({
                                "shape": new defs.Billboard_Quad(),
                                "mat": Mat4.translation(b.center[0], b.center[1] + b.hitbox[4][1] / 2, b.center[2])
                                    .times(Mat4.scale(b.hitbox[4][1] + 15, b.hitbox[4][1] + 15, b.hitbox[4][1] + 15))
                            });
                            //derender body
                            this.bodies[i].enabled = false;
                        }
                    }
                    b.linear_acceleration = vec3(0, -9.8, 0);
                    if (b.linear_velocity[1] > -70)
                        b.linear_velocity = b.linear_velocity.plus(b.linear_acceleration.times(dt / 15));
                    b.angular_acceleration = 0;

                    // TODO: ANIMATE DRIFTING OF DEBRIS
                    if (this.just_detached) {
                        switch (i) {
                            case 1:
                                b.linear_velocity = b.linear_velocity.plus(vec3(-.5 / 5, -.25 / 5, .500 / 5));
                                break;
                            case 2:
                                b.linear_velocity = b.linear_velocity.plus(vec3(-.95 / 5, -.25 / 5, .300 / 5));
                                break;
                            case 3:
                                b.linear_velocity = b.linear_velocity.plus(vec3(.50 / 5, -.25 / 5, .750 / 5));
                                break;
                            case 4:
                                b.spin_axis = vec3(0, 0, 1);
                                b.linear_velocity = b.linear_velocity.plus(vec3(-1.000 / 5, 0, 0));
                                break;
                            case 5:
                                b.spin_axis = vec3(0, 0, -1);
                                b.linear_velocity = b.linear_velocity.plus(vec3(1.000 / 5, 0, 0));
                                break;
                            case 6:
                                b.spin_axis = vec3(Math.sqrt(3) / 2, 0, -1 / 2);
                                b.linear_velocity = b.linear_velocity.plus(vec3(.5 / 5, 0, (Math.sqrt(3) / 2) / 5));
                                break;
                            case 7:
                                b.spin_axis = vec3(Math.sqrt(3) / 2, 0, 1 / 2);
                                b.linear_velocity = b.linear_velocity.plus(vec3(-.5 / 5, 0, (Math.sqrt(3) / 2) / 5));
                                break;
                            case 8:
                                b.spin_axis = vec3(-Math.sqrt(3) / 2, 0, -1 / 2);
                                b.linear_velocity = b.linear_velocity.plus(vec3(.5 / 5, 0, -(Math.sqrt(3) / 2) / 5));
                                break;
                            case 9:
                                b.spin_axis = vec3(-Math.sqrt(3) / 2, 0, 1 / 2);
                                b.linear_velocity = b.linear_velocity.plus(vec3(.5 / 5, 0, -(Math.sqrt(3) / 2) / 5));
                                break;
                        }
                    }


                    // TODO: ANIMATE ROTATION OF DEBRIS
                    if (this.separation_count === 1 && i > 3 && i < 10) {
                        b.angular_velocity = .02;
                    } else if (this.separation_count === 2 && i === 3) {
                        b.spin_axis = vec3(0.5, 0, -0.75);
                        b.angular_velocity = .01;
                    } else if (this.separation_count === 3 && i === 2) {
                        b.spin_axis = vec3(-0.95, 0, 0.30);
                        b.angular_velocity = .01;
                    } else if (this.separation_count === 4 && i === 1) {
                        b.spin_axis = vec3(0.5, 0, 0.5);
                        b.angular_velocity = .01;
                    } else {
                        b.angular_velocity += b.angular_acceleration * dt / 1000;
                    }
                }
            }


            if (this.currently_firing) {
                switch (this.separation_count) {
                    case 0:
                        if (this.fuel_cap1 > 0) {
                            this.fuel_cap1 -= (dt / 100);
                        } else {
                            this.currently_firing = false;
                            this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                        }
                        break;
                    case 1:
                        if (this.fuel_cap2 > 0) {
                            this.fuel_cap2 -= (dt / 100);
                        } else {
                            this.currently_firing = false;
                            this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                        }
                        break;
                    case 2:
                        if (this.fuel_cap3 > 0) {
                            this.fuel_cap3 -= (dt / 100);
                        } else {
                            this.currently_firing = false;
                            this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                        }
                        break;
                    case 3:
                        if (this.fuel_cap4 > 0) {
                            this.fuel_cap4 -= (dt / 100);
                        } else {
                            this.currently_firing = false;
                            this.bodies[this.bottom_body].shapes[this.bodies[this.bottom_body].shapes.length - 1].enabled = false;
                        }
                        break;
                }
            }
        }

        this.just_detached = false;
        this.just_activated = false;
    }

    check_collisions() {
        for (let i = 1; i < this.bodies.length; i++) {
            let b = this.bodies[i];
            if (!b.enabled)
                continue;
            for (let j = i + 1; j < this.bodies.length; j++) {
                let c = this.bodies[j];
                if (c.enabled &&
                    //no collision between tower and launchpad
                    (!(i === 10 && j === 11) && !(j === 10 && i === 11)) &&
                    //no collision with launchpad if rocket not launched
                    (!(i === 11 || j === 11) || this.launched) &&
                    //no collision if both attached
                    !(b.attached && c.attached) &&
                    //no collision if one is attached and other is ignore_collisions
                    !((b.attached && c.ignore_collisions) || (c.attached && b.ignore_collisions)) &&
                    //check collisions
                    b.check_collision(c.hitbox, c.drawn_location)
                ) {
                    //blow up non-launchpad body
                    if (i !== 10) {
                        //add explosion to draw
                        this.explosions.push({
                            "shape": new defs.Billboard_Quad(),
                            "mat": Mat4.translation(b.center[0], b.center[1] + b.hitbox[4][1] / 2, b.center[2])
                                .times(Mat4.scale(b.hitbox[4][1] + 15, b.hitbox[4][1] + 15, b.hitbox[4][1] + 15))
                        });
                        //derender body
                        this.bodies[i].enabled = false;
                    }
                    //blow up non launchpad body
                    if (j !== 10) {
                        this.explosions.push({
                            "shape": new defs.Billboard_Quad(),
                            "mat": Mat4.translation(c.center[0], c.center[1] + c.hitbox[4][1] / 2, c.center[2])
                                .times(Mat4.scale(c.hitbox[4][1] + 15, c.hitbox[4][1] + 15, c.hitbox[4][1] + 15))
                        });
                        this.bodies[j].enabled = false;
                    }

                    if (i <= this.bottom_body) {
                        this.currently_firing = false;
                        this.bottom_body = i - 1;
                    }
                    if (j <= this.bottom_body) {
                        this.currently_firing = false;
                        this.bottom_body = j - 1;
                    }
                    //
                    console.log("boom: " + i + ", " + j);

                }
            }
        }
    }


    display(context, program_state) {
        //display bodies
        super.display(context, program_state);


        //can move this stuff to the constructor if it doesn't change by t (but it probably will)
        program_state.lights = [new Light(vec4(100, 500, 250, 0), color(1, 1, 1, 1), 1000000)];

        if (this.currently_firing) {
            program_state.lights[1] = new Light(vec4(
                this.bodies[this.bottom_body].center[0],
                this.bodies[this.bottom_body].center[1] - 4,
                this.bodies[this.bottom_body].center[2],
                1), color(1, 0.682, 0.259, 1), 10000);
        } else {
            program_state.lights[1] = new Light(vec4(0, -100, 0, 1),
                color(1, 0.682, 0.259, 1), 0);
        }

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new Camera_Controls(() => program_state.camera_transform, (mat) => this.movement_transform = mat));

            // Locate the camera here (inverted matrix) (keeping this in here doesn't allow the camera to follow objects).
            //uncomment this to view origin (after commenting below)
            //program_state.set_camera(Mat4.inverse(this.bodies[0].drawn_location.times(Mat4.translation(0, -10, 100))));

            //view earth
            //program_state.set_camera(Mat4.translation(0, 1000, -50000));

            program_state.projection_transform = Mat4.perspective(Math.PI / 5, context.width / context.height, 15, 8000000);
        }

        let camera = this.bodies[0].drawn_location.times(this.movement_transform).times(this.camera_offset);
        program_state.set_camera(camera);
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;


        //draw non physically animated shapes here
        let model_transform = Mat4.identity();
        //this.shapes["cloud-1"].draw(context, program_state, Mat4.translation(100, 10000, 0).times(Mat4.scale(100, 100, 100)), this.cloud);
        //this.shapes["sphere"].draw(context, program_state, Mat4.translation(0, -63100, 0).times(Mat4.scale(63100, 63100, 63100)), this.cloud);

        if (this.bodies[this.bottom_body].activated && this.bodies[0].center[1] < 100) {
            this.bridge_scale = Mat4.scale(Math.max(1 - .2 * t, 0), 1, 1)
        }
        this.shapes["payload_bridge"].draw(context, program_state, Mat4.translation(-22, 65, 0).times(this.bridge_scale), this.metal_material);
        this.shapes["stable_bridge"].draw(context, program_state, Mat4.translation(-22, 38, 0).times(this.bridge_scale), this.metal_material);
        this.shapes["elevator"].draw(context, program_state, Mat4.translation(-18, -2, 0), this.platform_material);

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
        this.shapes["sphere"].draw(context, program_state, Mat4.translation(0, -6309890, 0).times(Mat4.scale(6310000, 6310000, 6310000)).times(Mat4.rotation(Math.PI / 2, 1, 0.5, 1)), this.earth_material);

        this.shapes["sky"].draw(context, program_state, Mat4.translation(0, -6309890, 0).times(Mat4.scale(8000000, 8000000, 8000000)), this.sky_material);
        //this.shapes["space"].draw(context, program_state, Mat4.translation(0, -6309884, 0).times(Mat4.scale(7600000, 7600000, 7600000)), this.space_material);
        this.shapes["sun"].draw(context, program_state, Mat4.translation(100000, 1500000, 250000)
            .times(Mat4.scale(85000, 85000, 85000))
            .times(Mat4.rotation(1.2, -0.8, 0, -0.2)), this.sun_material);

        // TODO: DRAW CLOUD LAYER
        this.shapes["cloud_layer"].draw(context, program_state, Mat4.translation(0, -6309890, 0)
            .times(Mat4.scale(6330000, 6330000, 6330000))
            .times(Mat4.rotation(3 * Math.PI / 2, 1, 0.5, 1)), this.cloud_layer_material);

        //particle effects
        //this.smoke_emitter.draw(context, program_state, Mat4.translation(20, 50, 0), this.smoke_material);

        //this.shapes["explosion"].draw(context, program_state, Mat4.translation(50, 50, 0).times(Mat4.scale(20, 20, 20)), this.explosion_material);

        for (let e of this.explosions) {
            e.shape.draw(context, program_state, e.mat, this.explosion_material);
        }
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