import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { handleResize, handleFullscreen } from './helpers/helpers';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * debug
 */
const debugObject = {
    clearColor: '#201919',
};
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
 * particles
 */
const particleGeometry = new THREE.BufferGeometry();
const particlesCount = 30;
const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
    positionArray[i * 3 + 1] = Math.random() * 1.5;
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
}
particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionArray, 3)
);
/**
 * material
 */
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
});
const fireflies = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(fireflies);

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
 * materials
 */
//baked material
const bakedTexture = textureLoader.load('baked1.jpg');
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: '#ffffe5' });
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: '#fff' });
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
/**
 * model
 */
gltfLoader.load('portal.glb', (gltf) => {
    // gltf.scene.traverse((child) => {
    //     child.material = bakedMaterial;
    // });
    const bakedMesh = gltf.scene.children.find(
        (child) => child.name == 'baked'
    );

    const portalLight = gltf.scene.children.find(
        (child) => child.name === 'portalLight'
    );
    const poleLightA = gltf.scene.children.find(
        (child) => child.name === 'poleLightA'
    );
    const poleLightB = gltf.scene.children.find(
        (child) => child.name === 'poleLightB'
    );

    bakedMesh.material = bakedMaterial;

    portalLight.material = portalLightMaterial;
    portalLight.material.side = THREE.DoubleSide;

    poleLightA.material = poleLightMaterial;
    poleLightA.material.side = THREE.DoubleSide;

    poleLightB.material = poleLightMaterial;
    poleLightB.material.side = THREE.DoubleSide;

    scene.add(gltf.scene);
});

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(sizes.w, sizes.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(debugObject.clearColor);

/**
 * controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

gui.addColor(debugObject, 'clearColor').onChange(() =>
    renderer.setClearColor(debugObject.clearColor)
);

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

