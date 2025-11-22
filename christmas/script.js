// === CHRISTMAS TREE ANIMATION USING THREE.JS === //
let scene, camera, renderer, tree, snowParticles;

init();
animate();

function init() {
  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 6);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("treeCanvas"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const pointLight = new THREE.PointLight(0xffffff, 1.2);
  pointLight.position.set(0, 5, 5);
  scene.add(pointLight);

  // Tree Trunk
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16),
    trunkMaterial
  );
  trunk.position.y = -2.5;
  scene.add(trunk);

  // Tree Layers
  const treeMaterial = new THREE.MeshStandardMaterial({
    color: 0x006400,
    roughness: 0.5,
  });
  tree = new THREE.Group();
  const layers = [
    { radius: 2, height: 2.2, y: -0.5 },
    { radius: 1.5, height: 2, y: 0.8 },
    { radius: 1, height: 1.8, y: 1.8 },
  ];
  layers.forEach((layer) => {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(layer.radius, layer.height, 32),
      treeMaterial
    );
    cone.position.y = layer.y;
    tree.add(cone);
  });
  scene.add(tree);
  // 🌟 Yellow Glowing Rotating Star on Top of Tree
  const starGeometry = new THREE.OctahedronGeometry(0.4, 1);
  const starMaterial = new THREE.MeshStandardMaterial({
    color: 0xffe700, // bright yellow
    emissive: 0xffe700, // glow color
    emissiveIntensity: 1.8, // glow strength
    metalness: 0.8,
    roughness: 0.2,
  });

  // Create the star
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.y = 3; // place on top of tree
  scene.add(star);

  // ✨ Add glowing light from the star
  const starLight = new THREE.PointLight(0xffe700, 2, 10);
  starLight.position.set(0, 3.2, 0);
  scene.add(starLight);

  // 🌠 Animate star rotation (slow smooth rotation)
  function animateStar() {
    requestAnimationFrame(animateStar);
    star.rotation.y += 0.02; // rotate horizontally
    star.rotation.x += 0.01; // slight tilt for 3D effect
  }
  animateStar();

  // Colorful Lights
  const lightColors = [0xff0000, 0x00ff00, 0x00ffff, 0xff00ff, 0xffff00];
  for (let i = 0; i < 60; i++) {
    const color = lightColors[Math.floor(Math.random() * lightColors.length)];
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshStandardMaterial({ emissive: color, emissiveIntensity: 1 })
    );
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.5 + Math.random() * 2;
    const height = -0.5 + Math.random() * 2.5;
    bulb.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
    tree.add(bulb);
  }
  // Falling Snow
  const snowGeo = new THREE.BufferGeometry();
  const snowCount = 600;
  const positions = [];

  for (let i = 0; i < snowCount; i++) {
    positions.push((Math.random() - 0.5) * 20);
    positions.push(Math.random() * 10);
    positions.push((Math.random() - 0.5) * 20);
  }

  snowGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  const snowMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
  const snow = new THREE.Points(snowGeo, snowMat);
  scene.add(snow);
  snowParticles = snowGeo.attributes.position;

  // Handle Resize
  window.addEventListener("resize", onWindowResize);
}

// Animate Scene
function animate() {
  requestAnimationFrame(animate);
  tree.rotation.y += 0.01; // Tree rotation

  // Falling snow effect
  const pos = snowParticles.array;
  for (let i = 1; i < pos.length; i += 3) {
    pos[i] -= 0.02;
    if (pos[i] < -2) pos[i] = 10; // reset snowflake to top
  }
  snowParticles.needsUpdate = true;

  renderer.render(scene, camera);
}

// Resize Handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
