import {tiny} from './tiny-graphics.js';
// Pull these names into this module's scope for convenience:
const {
    Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4,
    Light, Shape, Material, Shader, Texture, Scene
} = tiny;

import {widgets} from './tiny-graphics-widgets.js';

Object.assign(tiny, widgets);

const Camera_Controls =
    class Camera_Controls extends Scene {                                       // **Movement_Controls** is a Scene that can be attached to a canvas, like any other
        // Scene, but it is a Secondary Scene Component -- meant to stack alongside other
        // scenes.  Rather than drawing anything it embeds both first-person and third-
        // person style controls into the website.  These can be used to manually move your
        // camera or other objects smoothly through your scene using key, mouse, and HTML
        // button controls to help you explore what's in it.
        constructor(camera_closure, transform_closure) {
            super();
            const data_members = {
                roll: 0, look_around_locked: true,
                thrust: vec3(0, 0, 0), pos: vec3(0, 0, 0), z_axis: vec3(0, 0, 0),
                radians_per_frame: 1 / 100, meters_per_frame: 20, speed_multiplier: 1
            };
            Object.assign(this, data_members);

            this.mouse_enabled_canvases = new Set();

            this.matrix = camera_closure;
            this.transform = transform_closure;

            this.x_rotation = 0;
            this.y_rotation = 0;
            this.zoom = 0;
        }

        add_mouse_controls(canvas) {                                       // add_mouse_controls():  Attach HTML mouse events to the drawing canvas.
            // First, measure mouse steering, for rotating the flyaround camera:
            this.mouse = {"from_prev": vec(0, 0), "prev": vec(0, 0), "is_dragging": false};
            const mouse_position = (e, rect = canvas.getBoundingClientRect()) =>
                vec(e.clientX - (rect.left + rect.right) / 2, e.clientY - (rect.bottom + rect.top) / 2);
            // Set up mouse response.  The last one stops us from reacting if the mouse leaves the canvas:
            document.addEventListener("mouseup", e => {
                this.mouse.is_dragging = false;
                this.mouse.anchor = undefined;
                this.mouse.prev = vec(0, 0);
                this.mouse.from_prev = vec(0, 0);
            });
            canvas.addEventListener("mousedown", e => {
                e.preventDefault();
                this.mouse.is_dragging = true;
                this.mouse.anchor = mouse_position(e);
                this.mouse.prev = mouse_position(e);
                //this.mouse.from_prev = vec(0, 0);
            });
            canvas.addEventListener("mousemove", e => {
                e.preventDefault();
                if (this.mouse.is_dragging) {
                    this.mouse.from_prev = mouse_position(e).minus(this.mouse.prev);
                    this.mouse.prev = mouse_position(e);
                    this.x_rotation -= this.mouse.from_prev[0];
                    this.y_rotation += this.mouse.from_prev[1];

                    //this.y_rotation = Math.min(this.y_rotation, Math.PI / this.radians_per_frame / 2);
                    //this.y_rotation = Math.max(this.y_rotation, -Math.PI / this.radians_per_frame / 2);
                    //this.y_rotation = Math.max(this.y_rotation, -Math.PI * this.radians_per_frame / 2);
                    //this.x_rotation = Math.max(this.x_rotation, -Math.PI / 2.5);
                } else {
                    //this.mouse.from_prev = vec(0, 0);
                    //this.mouse.prev = vec(0, 0);
                }

            });
            canvas.addEventListener("wheel", e => {
                e.preventDefault();
                this.zoom += e.deltaY * 5;
                this.zoom = Math.max(this.zoom, -150);
                this.zoom = Math.min(this.zoom, 1000);
                this.transform(Mat4.rotation(this.y_rotation * this.radians_per_frame, 1, 0, 0)
                    .times(Mat4.rotation(this.x_rotation * this.radians_per_frame, 0, 1, 0))
                    .times(Mat4.translation(0, 0, this.zoom)));
            });
            canvas.addEventListener("mouseout", e => {
                if (!this.mouse.anchor) {
                    this.mouse.from_prev = vec(0, 0);
                    this.mouse.prev = vec(0, 0);
                }
            });
        }

        show_explanation(document_element) {
        }

        make_control_panel() {                                 // make_control_panel(): Sets up a panel of interactive HTML elements, including
            // buttons with key bindings for affecting this scene, and live info readouts.
            this.control_panel.innerHTML += "Click and drag the scene to <br> spin your viewpoint around it.<br>";
            this.live_string(box => box.textContent = "Position: " + this.pos[0].toFixed(2) + ", " + this.pos[1].toFixed(2)
                + ", " + this.pos[2].toFixed(2));
            this.new_line();
            // The facing directions are surprisingly affected by the left hand rule:
            this.live_string(box => box.textContent = "Facing: " + ((this.z_axis[0] > 0 ? "West " : "East ")
                + (this.z_axis[1] > 0 ? "Down " : "Up ") + (this.z_axis[2] > 0 ? "North" : "South")));
            this.new_line();
        }

        third_person_arcball(radians_per_frame) {                                           // (Internal helper function)
            // Spin the scene around a point on an axis determined by user mouse drag:
            const dragging_vector = this.mouse.from_prev;
            if (!dragging_vector || dragging_vector.norm() <= 0)
                return;

            this.transform(Mat4.rotation(this.y_rotation * radians_per_frame, 1, 0, 0)
                .times(Mat4.rotation(this.x_rotation * radians_per_frame, 0, 1, 0))
                .times(Mat4.translation(0, 0, this.zoom)));
            //this.mouse.from_prev = vec3(0, 0);
        }

        display(context, graphics_state, dt = graphics_state.animation_delta_time / 1000) {                                                            // The whole process of acting upon controls begins here.
            const r = this.speed_multiplier * this.radians_per_frame;

            if (!this.mouse_enabled_canvases.has(context.canvas)) {
                this.add_mouse_controls(context.canvas);
                this.mouse_enabled_canvases.add(context.canvas)
            }
            //  apply third-person "arcball" camera mode if a mouse drag is occurring:
            if (this.mouse.is_dragging)
                this.third_person_arcball(r);
            // Log some values:
            this.pos = this.matrix().times(vec4(0, 0, 0, 1));
            this.z_axis = this.matrix().times(vec4(0, 0, 1, 0));
        }
    };

export default Camera_Controls;
