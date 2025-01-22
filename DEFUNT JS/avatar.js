import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.onload = () => loadModel();

function loadModel() {
  const loader = new GLTFLoader();
  loader.load('ani.glb',
    (gltf) => {
      setupScene(gltf);
      document.getElementById('avatar-loading').style.display = 'none';
    }, 
    (xhr) => {
      const percentCompletion = Math.round((xhr.loaded / xhr.total) * 100);
      document.getElementById('avatar-loading').innerText = `LOADING... ${percentCompletion}%`
      console.log(`Loading model... ${percentCompletion}%`);
    }, 
    (error) => {
      console.log(error);
    }
  );
}

function setupScene(gltf) {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  
  const container = document.getElementById('avatar-container');
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    45, container.clientWidth / container.clientHeight);
  camera.position.set(0.2, 0.5, 1);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minDistance = 3;
  controls.minPolarAngle = 1.4;
  controls.maxPolarAngle = 1.4;
  controls.target = new THREE.Vector3(0, 0.75, 0);
  controls.update();

  // Scene setup
  const scene = new THREE.Scene();

  // Lighting setup
  scene.add(new THREE.AmbientLight());

  const spotlight = new THREE.SpotLight(0xffffff, 20, 8, 1);
  spotlight.penumbra = 0.5;
  spotlight.position.set(0, 4, 2);
  spotlight.castShadow = true;
  scene.add(spotlight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2);
  keyLight.position.set(1, 1, 2);
  keyLight.lookAt(new THREE.Vector3());
  scene.add(keyLight);

  // Load avatar
  const avatar = gltf.scene;
  avatar.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(avatar);

  // Create pedestal
  const groundGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 64);
  const groundMaterial = new THREE.MeshStandardMaterial();
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.castShadow = false;
  groundMesh.receiveShadow = true;
  groundMesh.position.y -= 0.05;
  scene.add(groundMesh);


  const models = [];

  // Function to load models and add to the scene
  function loadModeln(url, position, color) { // Color parameter is optional
    const nloader = new GLTFLoader();
    nloader.load(url, (gltf) => {
      const model = gltf.scene;
      model.position.set(position.x, position.y, position.z);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Apply color if specified
          if (color !== undefined) {
            child.material = new THREE.MeshStandardMaterial({ color: color });
          }
        }
      });
      scene.add(model);
      models.push(model); // Add model to the array
    });
  }

  // Load models
  loadModeln('bawl.glb', { x: 1, y: 0.75, z: 0 });  // Use default color for 'bawl'
  loadModeln('iron.glb', { x: -1, y: 0.75, z: 0 }, 0xb3072f); // Green color for 'iron'
  loadModeln('guitar.glb', { x: 0, y: 0.75, z: -1 }, 0x855103); // Blue color for 'guitar'

  //loadModel('path_to_model_2.glb', { x: -1, y: 0.75, z: 0 }); // Second model

  // Create an array to hold the cubes
  /*
  const cubePositions = [
    { x: 1, y: 0.75, z: 0 },   // First cube position
    { x: -1, y: 0.75, z: 0 }, 
    {x: 0, y: 0.75, z: 1 },   // First cube position
    { x: 0, y: 0.75, z: -1 },
      // Second cube position
  ];
  const cubes = [];
  
  // Loop to create and position cubes
  cubePositions.forEach((pos) => {
    const cubeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xdbbd27 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(pos.x, pos.y, pos.z); // Set position for each cube
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    cubes.push(cube); // Add the cube to the array
  });*/

  // Load animations
  const mixer = new THREE.AnimationMixer(avatar);
  const clips = gltf.animations;
  const waveClip = THREE.AnimationClip.findByName(clips, 'thanos');
  const stumbleClip = THREE.AnimationClip.findByName(clips, 'cools');
  const chClip = THREE.AnimationClip.findByName(clips, 'chi');
  const waveAction = mixer.clipAction(waveClip);
  const stumbleAction = mixer.clipAction(stumbleClip);
  const chiAction = mixer.clipAction(chClip);

  let isStumbling = false;
  let isChi = false;
  const raycaster = new THREE.Raycaster();
  container.addEventListener('mousedown', (ev) => {
    const coords = {
      x: (ev.offsetX / container.clientWidth) * 2 - 1,
      y: -(ev.offsetY / container.clientHeight) * 2 + 1
    };

    raycaster.setFromCamera(coords, camera);
    const intersections = raycaster.intersectObject(avatar);

    if (intersections.length > 0) {
      if (isStumbling) return;

      isStumbling = true;
      stumbleAction.reset();
      stumbleAction.play();
      waveAction.crossFadeTo(stumbleAction, 0.3);

      setTimeout(() => {
        waveAction.reset();
        waveAction.play();
        stumbleAction.crossFadeTo(waveAction, 1);
        setTimeout(() => isStumbling = false, 1000);
      }, 4000)
    }
  });

  container.addEventListener('mouseout', (ev) => {
    if (isStumbling || isChi) return;  // Prevent jumping while stumbling
  
    isChi = true;
    chiAction.reset();
    chiAction.play();
  
    // After jumping, return to waving action
    setTimeout(() => {
      waveAction.reset();
      waveAction.play();
      chiAction.crossFadeTo(waveAction, 1);
      setTimeout(() => isChi = false, 1000);
    }, 3000);  // Adjust time for the jump duration
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    mixer.update(clock.getDelta());
    
    // Rotate the cube
    var rotations = [{x: 0.05, y: 0.05, z: 0.00}, {x: 0.00, y: 0.02, z: 0.00}, {x:0, y:-0.01, z:0}]
    for (let i = 0; i < models.length; i++) {
      const cube = models[i];
      cube.rotation.x += rotations[i].x;
      cube.rotation.y += rotations[i].y;
      cube.rotation.z += rotations[i].z;
    }

    renderer.render(scene, camera);
  }

  animate();
  waveAction.play();
}
