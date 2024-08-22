import * as THREE from 'three';

const scene = new THREE.Scene();
const container = document.getElementById('top-graphic')
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( container.offsetWidth, container.offsetHeight);
renderer.setAnimationLoop( animate );
container.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 2, 1 );
const material = new THREE.MeshMatcapMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
	cube.rotation.x += 0.005;
	cube.rotation.y += 0.005;
	renderer.render( scene, camera );
}

// Resize

window.addEventListener('resize', () => {
	camera.aspect = container.offsetWidth / container.offsetHeight
	camera.updateProjectionMatrix()
	renderer.setSize(container.offsetWidth, container.offsetHeight)
})

const loop = () => {
	animate()
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop)
}
loop()