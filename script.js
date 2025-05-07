import * as THREE from 'https://unpkg.com/three@0.150.0/build/three.module.js';

// now THREE.Scene, THREE.Mesh, etc. will resolve correctly

// script.js

// Create scene, camera, renderer
const scene    = new THREE.Scene();
scene.background = new THREE.Color(0x6516A9); // = rgb(101,22,169
const camera   = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Attach renderer to our container
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('canvas-container').appendChild( renderer.domElement );

// Position the camera
camera.position.set( 0, 0, 10 );

// Soft ambient glow
const ambientLight = new THREE.AmbientLight(0xB510AF, 0.6);
scene.add(ambientLight);

// Gentle point highlights
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// ——— Raycaster setup ———
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ——— Create Daisy Flower ———
const flowerGroup = new THREE.Group();

// Yellow center
const centerGeo = new THREE.SphereGeometry(0.2, 32, 32);
const centerMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const centerMesh = new THREE.Mesh(centerGeo, centerMat);
flowerGroup.add(centerMesh);

// White petals (12 planes)
const petalGeo = new THREE.PlaneGeometry(0.15, 0.6);
const petalMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
for (let i = 0; i < 12; i++) {
  const petal = new THREE.Mesh(petalGeo, petalMat);
  petal.position.set(0, 0.35, 0);
  petal.rotation.z = (i * Math.PI) / 6;
  flowerGroup.add(petal);
}

// Position & initial scale
flowerGroup.position.set(-3, 0, -5);
flowerGroup.scale.set(1, 1, 1);
scene.add(flowerGroup);

// ——— Click to Bloom & Show Message ———
function onClick(event) {
  // Convert mouse to normalized device coords
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Raycast
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(flowerGroup, true);
  if (hits.length > 0) {
    // Bloom animation
    gsap.to(flowerGroup.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
    });
    // Show overlay
    document.getElementById("flower-message").style.display = "block";
  }
}
renderer.domElement.addEventListener("click", onClick);



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

