// script.js

// Create scene, camera, renderer
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Attach renderer to our container
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('canvas-container').appendChild( renderer.domElement );

// Position the camera
camera.position.set( 0, 0, 10 );

// Basic render loop
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

