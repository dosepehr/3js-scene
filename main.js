import * as THREE from 'three';
import * as dat from 'lil-gui';

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

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(sizes.w, sizes.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();

