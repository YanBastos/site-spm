//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


//create a Three.js Scene
const scene = new THREE.Scene();

//create a new camera with position and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

//keep track of the mouse positions, so we can make the chess move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//keep the 3d object on a global variable so we can acess it later
let object;

//OrbitControls allow the camera to move araoud the scene
let controls;

//Set wich objetct to render 
let objToRender = 'chess';

//Instantiate a loader for the .gltf
const loader = new GLTFLoader();

//Load the file
loader.load(
    `models/${objToRender}/scene.gltf`,
    function (gltf) {
        //If the file is loaded, add it to the scene
        object = gltf.scene;
        scene.add(object); //add object
    },
    function (xhr) {
        //While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '%l loaded');
    },
    function (error) {
        //If ther is an error, log it
        console.error(error);
    }
);

//Instantiate a new render and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(800, 500);
document.body.appendChild(renderer.domElement);

//Add the render to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "chess" ? 400 : 500;

//Add light to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff,5); //(color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const AmbientLight = new THREE.AmbientLight(0xffffff, objToRender === "chess" ? 5 : 1);
scene.add(AmbientLight);

//This add control to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "chess") {
    controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
    requestAnimationFrame(animate);
    //Here we could add some code to update the scene, adding some automatic movment

    //Make chess move on mouse move
    // if (object && objToRender === "chess") {
    //     //I1ve playesd with the constants her until it look good
    //     object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    //     object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    // }
    //Auto rotate animation
    object.rotation.y -= 0.01;
    object.rotation.z -= 0.01;
    // object.rotation.x -= 0.015;

    renderer.render(scene, camera);
}

let isMouseDown = false;

//Add stop rotation
window.addEventListener("mouseDown", function () {
    isMouseDown = true;
    //stop auto rotation
    object.rotationy -= 0;
    object.rotation.z -= 0;
    object.rotation.x -= 0;
})

window.addEventListener("mouseUp", function () {
    isMouseDown = false;
})

//Add mouse move control
document.onmousemove = (e) => {
    if (isMouseDown) {
        const rotationSpeed = 0.01;
        object.rotation.y += (e.movementX * rotationSpeed) / window.innerWidth;
        object.rotation.x += (e.movementY * rotationSpeed) / window.innerHeight;

        //limit rotation angles if needed
        const maxRotationX = Math.PI / 4; // Adjust the maximum rotation as needed
        object.rotation.x = Math.max(-maxRotationX, Math.min(maxRotationX.object.rotation.x));
    }
}

const render = () => {
    renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(document.getElementById("container3D").offsetWidth, window.innerHeight);
});

//Start the 3D rendering
animate();