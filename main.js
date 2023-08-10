import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { handleResize, handleFullscreen } from './helpers/helpers';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * debug
 */
const gui = new dat.GUI();

// canvas
const canvas = document.querySelector('canvas.webgl');

/**
 * scene
 */
const scene = new THREE.Scene();
const sizes = {
    w: window.innerWidth,
    h: window.innerHeight,
};

/**
 * camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.w / sizes.h, 0.1, 100);

camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

/**
 * loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'white' })
);

scene.add(cube);
/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(sizes.w, sizes.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * helpers
 */
window.onresize = () => handleResize(sizes, camera, renderer);
window.ondblclick = () => handleFullscreen(canvas);
const tick = () => {
    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();

