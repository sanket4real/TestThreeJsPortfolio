import "./style.css";

import * as THREE from "https://unpkg.com/three@0.129.0/build/three.module.js";
import { AmbientLight, Camera, MathUtils, PointLightHelper } from "three";

import { OrbitControls } from "https://unpkg.com/three@0.129.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGL1Renderer({
	canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const spaceTorusTexture = new THREE.TextureLoader().load("night.jpg");
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
	color: 0xff6347,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(geometry, material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(100));
	star.position.set(x, y, z);
	scene.add(star);
}

const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

const sanketTexture = new THREE.TextureLoader().load("profile.jpg");

const sanket = new THREE.Mesh(
	new THREE.BoxGeometry(3, 3, 3),
	new THREE.MeshBasicMaterial({ map: sanketTexture })
);

scene.add(sanket);

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
	new THREE.SphereGeometry(3, 32, 32),
	new THREE.MeshStandardMaterial({
		map: moonTexture,
		normalMap: normalTexture,
	})
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

Array(200).fill().forEach(addStar);

function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	moon.rotation.x += 0.05;
	moon.rotation.y += 0.075;
	moon.rotation.z += 0.05;

	sanket.rotation.y += 0.01;
	sanket.rotation.z += 0.01;

	camera.position.z = t * -0.01;
	camera.position.x = t * -0.0002;
	camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
	requestAnimationFrame(animate);

	torus.rotation.x += 0.01;
	torus.rotation.y += 0.0005;
	torus.rotation.z += 0.01;

	controls.update();

	renderer.render(scene, camera);
}

animate();
