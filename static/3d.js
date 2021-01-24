import * as THREE from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("game");
const { width, height } = canvas.getBoundingClientRect();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setSize(width, height);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0xaa0000 });

const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

const ambientlight = new THREE.AmbientLight(0x6688cc);
scene.add(ambientlight);

const fillLight1 = new THREE.DirectionalLight(0xff9999, 0.5);
fillLight1.position.set(-1, 1, 2);
scene.add(fillLight1);

const fillLight2 = new THREE.DirectionalLight(0x8888ff, 0.2);
fillLight2.position.set(0, -1, 0);
scene.add(fillLight2);

const directionalLight = new THREE.DirectionalLight(0xffffaa, 1.2);
directionalLight.position.set(0, 25, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = -30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = -0.00006;
scene.add(directionalLight);

window.addEventListener(
    "resize",
    () => {
        const { width, height } = canvas.getBoundingClientRect();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        render();
    },
    false
);

// Render Loop
const animate = function () {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    controls.update();
    renderer.render(scene, camera);
};

animate();
