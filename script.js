import * as THREE from 'https://unpkg.com/three@0.150.0/build/three.module.js';

// now THREE.Scene, THREE.Mesh, etc. will resolve correctly

// script.js

// Create scene, camera, renderer
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ensure default clear is fully transparent:
renderer.setClearColor(0x000000, 0);
document
  .getElementById('canvas-container')
  .appendChild(renderer.domElement);

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

// ——— Floating Orb ———
const orbGeometry = new THREE.SphereGeometry(0.7, 32, 32);
const orbMaterial = new THREE.MeshStandardMaterial({
  color: 0x10AFB5,          // your chosen teal
  emissive: 0x10AFB5,       // same glow color
  emissiveIntensity: 0.6,
});
const orb = new THREE.Mesh(orbGeometry, orbMaterial);

// position it in the scene
orb.position.set(0, 2, -5);
scene.add(orb);

// gentle bobbing animation (±0.5 units)
gsap.to(orb.position, {
  y: orb.position.y + 0.5,
  duration: 2,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut",
});
// ——— Rotating Photo Frame ———
// Load texture
const textureLoader = new THREE.TextureLoader();
const photoTexture = textureLoader.load('2023-06-05(4).jpg');

// Create a plane mesh
const photoGeometry = new THREE.PlaneGeometry(3, 2);
const photoMaterial = new THREE.MeshStandardMaterial({ map: photoTexture });
const photoMesh = new THREE.Mesh(photoGeometry, photoMaterial);
photoMesh.position.set(3, 0, -5);
scene.add(photoMesh);

// Continuous rotation
gsap.to(photoMesh.rotation, {
  y: Math.PI * 2,
  duration: 10,
  repeat: -1,
  ease: 'linear'
});

// ——— Hover Logic ———
function onMouseMove(event) {
  // normalize mouse coords
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(photoMesh);
  
  // show or hide the HTML overlay
  const noteEl = document.getElementById('photo-note');
  if (hits.length) {
    noteEl.style.display = 'block';
  } else {
    noteEl.style.display = 'none';
  }
}

// attach the hover listener
renderer.domElement.addEventListener('mousemove', onMouseMove);

animate();

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

