# Team Rocket - A Simulated Rocket Launch
__Team Members: Ameya Thakur, Jason Lai, Xiangkun Zhao__

![launch](https://user-images.githubusercontent.com/5963035/70024040-0d1f2a00-154e-11ea-9dec-8e951a3162e9.gif)

To run this project, clone or download the repository (it's large, we left in the raw files used to create the models and textures), and run a webserver in the root project directory (or run host.command or host.bat).
## Project Controls:

| Action                       | Input         |
| -------------                | ------------- |
| Zoom in/out                  | Scroll up or down with mouse wheel/touchpad  |
| Rotate camera around rocket  | Click and drag: up/down for rotation around x-axis, right/left for rotation around y-axis |
| Detach stage or activate next stage  | Spacebar |


## Project Summary:
Our project is a cartoonish simulation of a rocket launch. For this simulation, a simplified model of the Russian Proton rocket starts on the ground connected to its launch pad. After user input, the rocket’s boosters will fire and the rocket will begin accelerating and ascending upwards in a straight trajectory. After a certain amount of time, the rocket’s first stage boosters will deplete its fuel, at which point the exhaust of the rocket will disappear and the user must give input again to separate the boosters from the rocket and start the rocket’s second stage thrusters. This repeats for a total of four stages of firing, depleting, and separating, until the rocket is left without any boosters and the payload is delivered to Earth’s orbit. While the simulation is rather simple with a straightforward objective of reaching space, there are ways for the simulation to go awry; should the user fail to detach and fire the rocket’s next stage of boosters while in the air, the rocket will be affected by gravity and plummet back to Earth, in which case, it will explode upon hitting the ground. In the event of a crash, the simulation must be refreshed.

This simulation was made to demonstrate some basic and advanced graphics principles through the use of rudimentary transformations and concepts, as well as complex shaders and animations.

While, we did try to implement all portions of our environment and animations to be realistic within feasible means, some parts of the simulation’s physics and scene were adjusted to fit the format of a 5-minute presentation. Such changes include speeding up the physics so that the rocket accelerates faster when it is ascending or falling due to gravity, and making the sky transition from blue to black sooner by lowering the altitude range that its linear interpolation is based on, so the simulation is not exactly 1 to 1 scale with the real world.

For user interaction, we implemented controls for the activation of the rocket’s boosters and its separation phases with the use of a single action key: spacebar. In addition to this, we implemented a rotating camera that follows and focuses on the rocket at all times; the user can control this camera by clicking and dragging to achieve different viewing angles of the rocket, and can scroll to zoom in and out on the rocket.


# Individual Contributions:
## Ameya Thakur
In order to handle the physically based simulation of objects and the states of connected objects, I created what ended up being a simplified scene graph. It exists as an array of bodies, in which each stage of the rocket is included independently. Each body has many arrays included in it, such as the shapes that make up the body, the materials used for each shape, and the relative positions of each shape to the center of the body. In order to simulate the physics behind the motion of the bodies, I modified the TinyGraphics simulation example. The simulation works independently of the frame rate by applying numerical integration with a separate time step from the display function. It updates the positions, velocities, and accelerations of each body, then checks for collisions repeatedly until it is caught up with the display time. Then, the current state is blended with a previous state depending on how close it is to the display time in order to account for leftover time. The state of the top body is calculated first, and the state of lower bodies (stages of the rocket) are calculated based on that if they are attached. In order to simulate realistic physics, the acceleration of the rocket increases over time until it hits a peak value, and the maximum velocity when falling back to Earth is limited to a terminal velocity.

I also created many of the graphical features in our project. I created a billboarded particle shader based on a tutorial (cited) that I restructured and modified heavily to work with TinyGraphics and the scene graph structure I created. This particle shader simulates the explosion effects entirely on the GPU by generating a fixed array of velocities and spread offsets at construction, which are then copied to GPU buffers. The particles are billboarded quads with a custom texture, which are billboarded by scaling the x and y coordinates of the corners according to the camera up and right vectors. The shader takes animation time as an input so that it can move the particles to different locations based on their velocities depending on how much time has passed. The shader also transitions the color of the particles from a bright yellow-white through orange to light grey to give the effect of a stylized rocket exhaust. In addition to the particle shader, I created a billboarded explosion shader. 

This shader uses the same technique for billboarding, but uses multiple texture atlases to animate between 100 frames over the 4 seconds that it exists. By taking time since the enabling of the explosion as input, the current texture atlas and selection of the texture atlas used to shade the fragments of the billboarded quad can be changed once every 1/25 seconds, resulting in a realistic animated explosion. In addition, I created a modified plain texture shader to take the brightness of a grayscale image as it’s transparency, which allowed us to use NASA’s non-transparent Blue Marble cloud layer image to texture the cloud layer in our simulation. I also modelled the rocket and created textures to apply to the rocket shapes and launchpad.

Finally, I created a custom camera module based on the one provided in TinyGraphics that stays attached to the rocket and allows rotation around the rocket based on clicking and dragging. This allows for less confusing mouse control by only moving when the user moves their mouse instead of continuously moving when the mouse is moved from the click location, like the example does. I also added zoom to the camera using the scroll wheel (or touchpad) by capturing the wheel event and increasing or decreasing the z axis offset of the camera. 


## Jason Lai
![separation](https://user-images.githubusercontent.com/5963035/70024403-d5fd4880-154e-11ea-93e2-4fbdd458a4bd.gif)
> Stage separation: On detach, each body separates away from the main rocket realistically


![image4](https://user-images.githubusercontent.com/5963035/70021539-e957e600-1545-11ea-9a5d-90c76534477d.png)
> Space environment, sky transition to darkness, and clouds

![image5](https://user-images.githubusercontent.com/5963035/70021551-efe65d80-1545-11ea-993d-59e55d9396a9.png)
> Sun, sky, smoke

## Xiangkun Zhao

![collision](https://user-images.githubusercontent.com/5963035/70024701-b581be00-154f-11ea-8e35-241153802805.gif)
> Collision detection between bodies

To simulate and to detect the collision between objects and ground or objects with each other, we used a standard axis aligned bounding box. At first, we simply used the variable center that stores the location of the moving objects from the body class and adds with some offset based on the model to create the hitbox. Later, we modeled the boosters of the rocket to be spinning at an angle, so another more general function is specifically made to calculate the hitbox of objects that are in any type of motion by multiplying the drawn location matrix to all 8 vertices of the bounding box, and then creating a new axis aligned bounding box containing the transformed hitbox.

# Citations/Resources Used:
* [Billboarded Particle Tutorial](http://www.chinedufn.com/webgl-particle-effect-billboard-tutorial)
* [Particle Blending Issue Solution](https://stackoverflow.com/questions/23281898/native-webgl-particle-system-opacity-issue)
* [Hitbox Recalculation After Rotation](https://stackoverflow.com/questions/6053522/how-to-recalculate-axis-aligned-bounding-box-after-translate-rotate)
* [3D Collision Detection Techniques](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection)
* [Explosion Image Sequence Flipbook](https://blogs.unity3d.com/2016/11/28/free-vfx-image-sequences-flipbooks/)
* [Multiple Textures in One Shader Guide](https://webglfundamentals.org/webgl/lessons/webgl-2-textures.html)
* [NASA Blue Marble Earth Images](https://visibleearth.nasa.gov/collection/1484/blue-marble)
* [Concrete Texture](https://opengameart.org/node/27640)
* [Linear Interpolation Wiki](https://en.wikipedia.org/wiki/Linear_interpolation)


