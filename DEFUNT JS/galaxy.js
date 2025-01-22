import * as THREE from 'three';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha makes the canvas transparent
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
const container = document.getElementById('background');
container.appendChild(renderer.domElement);

// Add spiral galaxy (Replace with your galaxy logic)
function createGalaxy() {
  const particles = 10000;
  const positions = [];
  const colors = [];
  const sizes = [];
  const particleGeometry = new THREE.BufferGeometry();

  for (let i = 0; i < particles; i++) {
    const radius = Math.random() * 5;
    const angle = radius * 10; // Spiral effect
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = Math.random() * 2 - 1;

    positions.push(x, y, z);

    // Colors and sizes
    colors.push(0.5, 0.5, 1); // Light blue
    sizes.push(0.02 + Math.random() * 0.03);
  }

  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  const particlesMesh = new THREE.Points(particleGeometry, material);
  scene.add(particlesMesh);
}

createGalaxy();

// Position camera
camera.position.z = 10;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.002; // Rotate galaxy for animation
  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
