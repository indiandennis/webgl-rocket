import {tiny} from './tiny-graphics.js';
// Pull these names into this module's scope for convenience:
const {
    Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4,
    Light, Shape, Material, Shader, Texture, Scene
} = tiny;

class Body {                                   // **Body** can store and update the properties of a 3D body that incrementally
                                               // moves from its previous place due to velocities.  It conforms to the
                                               // approach outlined in the "Fix Your Timestep!" blog post by Glenn Fiedler.
    constructor(shapes, relative_locations, materials, size, hitbox, children = []) {
        Object.assign(this,
            {shapes, relative_locations, materials, size, children, hitbox})
    }

    emplace(location_matrix, linear_velocity, angular_velocity, spin_axis = vec3(0, 1, 0).normalized()) {                               // emplace(): assign the body's initial values, or overwrite them.
        this.center = location_matrix.times(vec4(0, 0, 0, 1)).to3();
        this.rotation = Mat4.translation(...this.center.times(-1)).times(location_matrix);
        this.previous = {center: this.center.copy(), rotation: this.rotation.copy()};
        // drawn_location gets replaced with an interpolated quantity:
        this.drawn_location = location_matrix;
        this.temp_matrix = Mat4.identity();
        return Object.assign(this, {linear_velocity, angular_velocity, spin_axis})
    }

    advance(time_amount) {                           // advance(): Perform an integration (the simplistic Forward Euler method) to
        // advance all the linear and angular velocities one time-step forward.
        this.previous = {center: this.center.copy(), rotation: this.rotation.copy()};
        // Apply the velocities scaled proportionally to real time (time_amount):
        // Linear velocity first, then angular:
        this.center = this.center.plus(this.linear_velocity.times(time_amount));
        this.rotation.pre_multiply(Mat4.rotation(time_amount * this.angular_velocity, ...this.spin_axis));
    }

    blend_rotation(alpha) {                        // blend_rotation(): Just naively do a linear blend of the rotations, which looks
        // ok sometimes but otherwise produces shear matrices, a wrong result.

        // TODO:  Replace this function with proper quaternion blending, and perhaps
        // store this.rotation in quaternion form instead for compactness.
        return this.rotation.map((x, i) => vec4(...this.previous.rotation[i]).mix(x, alpha));
    }

    blend_state(alpha) {                             // blend_state(): Compute the final matrix we'll draw using the previous two physical
        // locations the object occupied.  We'll interpolate between these two states as
        // described at the end of the "Fix Your Timestep!" blog post.
        this.drawn_location = Mat4.translation(...this.previous.center.mix(this.center, alpha))
            .times(this.blend_rotation(alpha))
            .times(Mat4.scale(...this.size));
    }

    // The following are our various functions for testing a single point,
    // p, against some analytically-known geometric volume formula
    // (within some margin of distance).
    static intersect_cube(p, margin = 0) {
        return p.every(value => value >= -1 - margin && value <= 1 + margin)
    }

    static intersect_sphere(p, margin = 0) {
        return p.dot(p) < 1 + margin;
    }

    check_if_colliding(b, collider) {                                     // check_if_colliding(): Collision detection function.
        // DISCLAIMER:  The collision method shown below is not used by anyone; it's just very quick
        // to code.  Making every collision body an ellipsoid is kind of a hack, and looping
        // through a list of discrete sphere points to see if the ellipsoids intersect is *really* a
        // hack (there are perfectly good analytic expressions that can test if two ellipsoids
        // intersect without discretizing them into points).
        if (this === b)
            return false;                     // Nothing collides with itself.
                                              // Convert sphere b to the frame where a is a unit sphere:
        const T = this.inverse.times(b.drawn_location, this.temp_matrix);

        const {intersect_test, points, leeway} = collider;
        // For each vertex in that b, shift to the coordinate frame of
        // a_inv*b.  Check if in that coordinate frame it penetrates
        // the unit sphere at the origin.  Leave some leeway.
        return points.arrays.position.some(p =>
            intersect_test(T.times(p.to4(1)).to3(), leeway));
    }
}

export default Body;
