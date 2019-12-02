import {tiny} from './tiny-graphics.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4,
    Light, Shape, Material, Shader, Texture, Scene
} = tiny;


class Simulation extends Scene {                                         // **Simulation** manages the stepping of simulation time.  Subclass it when making
                                                                         // a Scene that is a physics demo.  This technique is careful to totally decouple
                                                                         // the simulation from the frame rate (see below).
    constructor() {
        super();
        Object.assign(this, {time_accumulator: 0, time_scale: 1, t: 0, dt: 1 / 20, bodies: [], steps_taken: 0});
    }

    simulate(frame_time) {                                     // simulate(): Carefully advance time according to Glenn Fiedler's
        // "Fix Your Timestep" blog post.
        // This line gives ourselves a way to trick the simulator into thinking
        // that the display framerate is running fast or slow:
        if (!this.bodies[0].enabled)
            return;
        frame_time = this.time_scale * frame_time;

        // Avoid the spiral of death; limit the amount of time we will spend
        // computing during this timestep if display lags:
        this.time_accumulator += Math.min(frame_time, 0.1);
        //this.time_accumulator += frame_time;
        // Repeatedly step the simulation until we're caught up with this frame:
        while (Math.abs(this.time_accumulator) >= this.dt) {                                                       // Single step of the simulation for all bodies:
            this.update_state(this.dt);
            for (let b of this.bodies)
                if (b.enabled)
                    b.advance(this.dt);

            this.check_collisions();
            // Following the advice of the article, de-couple
            // our simulation time from our frame rate:
            this.t += Math.sign(frame_time) * this.dt;
            this.time_accumulator -= Math.sign(frame_time) * this.dt;
            this.steps_taken++;
        }
        // Store an interpolation factor for how close our frame fell in between
        // the two latest simulation time steps, so we can correctly blend the
        // two latest states and display the result.
        let alpha = this.time_accumulator / this.dt;
        for (let b of this.bodies) b.blend_state(alpha);
    }

    make_control_panel() {                       // make_control_panel(): Create the buttons for interacting with simulation time.
        this.key_triggered_button("Speed up time", ["Shift", "T"], () => this.time_scale *= 5);
        this.key_triggered_button("Slow down time", ["t"], () => this.time_scale /= 5);
        this.new_line();
        this.live_string(box => {
            box.textContent = "Time scale: " + this.time_scale
        });
        this.new_line();
        this.live_string(box => {
            box.textContent = "Fixed simulation time step size: " + this.dt
        });
        this.new_line();
        this.live_string(box => {
            box.textContent = this.steps_taken + " timesteps were taken so far."
        });
    }

    display(context, program_state) {                                     // display(): advance the time and state of our whole simulation.
        if (program_state.animate)
            this.simulate(program_state.animation_delta_time);
        // Draw each shape at its current location:
        for (let b of this.bodies) {
            if (b.enabled)
                for (const [i, s] of b.shapes.entries()) {
                    s.draw(context, program_state, b.drawn_location.times(b.relative_locations[i]), b.materials[i]);
                }
        }
    }

    update_state(dt)      // update_state(): Your subclass of Simulation has to override this abstract function.
    {
        throw "Override this"
    }

    check_collisions() {
        throw "Override this"
    }
}

export default Simulation;

