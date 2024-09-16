/*globals THREE*/

let renderer,
  scene,
  camera,
  model,
  controls,
  sphereClouds,
  oceanPlane,
  oceanTexture,
  displacementMap;

function init() {
  // renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("myCanvas"),
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // camera
  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );
  camera.position.set(90, 30, 0); // Position the camera
  camera.lookAt(0, 10, 0);

  //Trackball Controls for Camera
  //const controls = new THREE.TrackballControls(camera, renderer.domElement);
  // controls.rotateSpeed = 4;
  //controls.dynamicDampingFactor = 0.15;

  // scene
  scene = new THREE.Scene();

  // Add point light
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(50, 50, 50);
  scene.add(pointLight);

  // Load the GLTF model
  const loader = new THREE.GLTFLoader();
  loader.load(
    "https://cdn.glitch.global/712fdd67-4137-4c3b-b2d8-9dfc5e15ac74/seascenetest04.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      model.scale.set(10, 10, 10);
      model.position.set(0, 0, 0);
      model.rotation.set(0, (240 * Math.PI) / 180, 0); // Convert degrees to radians
      // Find and store the Sphere_Clouds mesh
      sphereClouds = model.getObjectByName("Sphere_Clouds");
      // Find and store the OceanPlane mesh
      oceanPlane = model.getObjectByName("OceanPlane");

      if (oceanPlane) 
      {
        // Load the displacement map texture
        const textureLoader = new THREE.TextureLoader();
        oceanTexture = textureLoader.load(
          "https://cdn.glitch.global/712fdd67-4137-4c3b-b2d8-9dfc5e15ac74/oceanTexture.jpg?");
        displacementMap = textureLoader.load(
          "https://cdn.glitch.global/712fdd67-4137-4c3b-b2d8-9dfc5e15ac74/noiseTexture.png?v=1726150121038");

        // Apply new material with displacement map
        oceanPlane.material = new THREE.MeshStandardMaterial({
          color: 0x006994, // Ocean blue color
          displacementMap: displacementMap,
          displacementScale: 0.02, // Scale the height of the displacement
          metalness: 0.1, // Small metalness for shine
          roughness: 0.7, // High roughness for a non-glossy look
        });

        // Set UV scaling and animation properties
        displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;
        displacementMap.repeat.set(4, 4); // Repeat the texture for finer waves
      }
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );

  // Resize listener
  window.addEventListener("resize", onWindowResize);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  //controls.update();
  if (sphereClouds) {
    sphereClouds.rotation.y += 0.00001; // Slowly rotate along the Y-axis
  }
  // Animate displacement map by offsetting it over time
  if (displacementMap) {
    displacementMap.offset.y += 0.001; // Move the displacement map vertically
  }

  renderer.render(scene, camera);
}

// Window Resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
