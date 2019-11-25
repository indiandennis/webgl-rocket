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
        constructor(camera_closure, inverse_closure, rotation_closure) {
            super();
            const data_members = {
                roll: 0, look_around_locked: true,
                thrust: vec3(0, 0, 0), pos: vec3(0, 0, 0), z_axis: vec3(0, 0, 0),
                radians_per_frame: 1 / 200, meters_per_frame: 20, speed_multiplier: 1
            };
            Object.assign(this, data_members);

            this.mouse_enabled_canvases = new Set();

            this.matrix = camera_closure;
            this.inverse = inverse_closure;
            this.rotation = rotation_closure;
        }

        add_mouse_controls(canvas) {                                       // add_mouse_controls():  Attach HTML mouse events to the drawing canvas.
            // First, measure mouse steering, for rotating the flyaround camera:
            this.mouse = {"from_center": vec(0, 0)};
            const mouse_position = (e, rect = canvas.getBoundingClientRect()) =>
                vec(e.clientX - (rect.left + rect.right) / 2, e.clientY - (rect.bottom + rect.top) / 2);
            // Set up mouse response.  The last one stops us from reacting if the mouse leaves the canvas:
            document.addEventListener("mouseup", e => {
                this.mouse.anchor = undefined;
            });
            canvas.addEventListener("mousedown", e => {
                e.preventDefault();
                this.mouse.anchor = mouse_position(e);
            });
            canvas.addEventListener("mousemove", e => {
                e.preventDefault();
                this.mouse.from_center = mouse_position(e);
            });
            canvas.addEventListener("mouseout", e => {
                if (!this.mouse.anchor) this.mouse.from_center.scale_by(0)
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
            const dragging_vector = this.mouse.from_center.minus(this.mouse.anchor);
            if (dragging_vector.norm() <= 0)
                return;

            const rotation = Mat4.rotation(radians_per_frame * dragging_vector.norm(),
                dragging_vector[1], dragging_vector[0], 0);
            this.rotation().post_multiply(rotation);
        }

        display(context, graphics_state, dt = graphics_state.animation_delta_time / 1000) {                                                            // The whole process of acting upon controls begins here.
            const m = this.speed_multiplier * this.meters_per_frame,
                r = this.speed_multiplier * this.radians_per_frame;

            if (!this.mouse_enabled_canvases.has(context.canvas)) {
                this.add_mouse_controls(context.canvas);
                this.mouse_enabled_canvases.add(context.canvas)
            }
            //  apply third-person "arcball" camera mode if a mouse drag is occurring:
            if (this.mouse.anchor)
                this.third_person_arcball(dt * r);
            // Log some values:
            this.pos = this.matrix().times(vec4(0, 0, 0, 1));
            this.z_axis = this.matrix().times(vec4(0, 0, 1, 0));
        }
    };

export default Camera_Controls;
