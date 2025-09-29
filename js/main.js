import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createPlanets } from "./planets.js";
import { OrbitLines } from "./orbitLines.js";
import { PlanetLabels } from "./planetLabels.js";

// Progress tracking
let loadedTextures = 0;
const totalTextures = 10;

function updateProgress(textureName) {
  loadedTextures++;
  const progress = (loadedTextures / totalTextures) * 100;
  const progressBar = document.getElementById("progressBar");
  const loadingText = document.getElementById("loadingText");

  if (progressBar) progressBar.style.width = `${progress}%`;
  if (loadingText)
    loadingText.textContent = `Memuat: ${textureName}... (${loadedTextures}/${totalTextures})`;
}

async function init() {
  // Scene setup dengan background yang colorful
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 50, 120);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  document.getElementById("container3D").appendChild(renderer.domElement);

  // Enhanced Lighting System
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(50, 50, 50);
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0x443333, 0x111122, 0.6);
  scene.add(hemisphereLight);

  // Orbit Controls dengan auto-rotate
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 20;
  controls.maxDistance = 500;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  // Create orbit lines system
  const orbitLines = new OrbitLines(scene);

  // Create planet labels system
  const planetLabels = new PlanetLabels(camera, renderer);

  // Create solar system
  console.log("🌌 Creating solar system...");
  const solarSystem = await createPlanets(scene, updateProgress);

  // ✅ PERBAIKAN: Gunakan planetData yang sudah disimpan
  const planetData = solarSystem.planets.map((p) => ({
    name: p.name,
    distance: p.data.distance, // ✅ Sekarang p.data ada
  }));

  orbitLines.createOrbitLines(planetData);

  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 1000);
    }
  }, 1000);

  // Keyboard controls
  window.addEventListener("keydown", (event) => {
    switch (event.key.toLowerCase()) {
      case "r":
        controls.autoRotate = !controls.autoRotate;
        console.log(`Auto-rotate: ${controls.autoRotate ? "ON" : "OFF"}`);
        break;
      case "o":
        const orbitVisible =
          orbitLines.orbitLines.length > 0 && orbitLines.orbitLines[0].visible;
        orbitLines.updateOrbitLinesVisibility(!orbitVisible);
        console.log(`Orbit lines: ${!orbitVisible ? "ON" : "OFF"}`);
        break;
      case "l":
        const labels = document.querySelectorAll(".planet-label");
        const labelsVisible =
          labels.length > 0 && labels[0].style.display !== "none";
        planetLabels.setLabelsVisibility(!labelsVisible);
        console.log(`Labels: ${!labelsVisible ? "ON" : "OFF"}`);
        break;
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    planetLabels.updateLabelPositions();
  });

  // Click event for planet info
  window.addEventListener("click", (event) => {
    // Implement planet click info here
    console.log("Planet clicked - Add your info panel logic here");
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Update solar system animations
    solarSystem.update();

    // Update planet labels
    planetLabels.updateLabels(solarSystem);

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  console.log("🚀 Solar System Ready!");
  console.log("🎮 Controls:");
  console.log("   • R - Toggle auto-rotate");
  console.log("   • O - Toggle orbit lines");
  console.log("   • L - Toggle labels");
  console.log("   • Mouse drag - Rotate camera");
  console.log("   • Scroll - Zoom in/out");
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("❌ Global error:", e.error);
  const loadingText = document.getElementById("loadingText");
  if (loadingText) {
    loadingText.innerHTML =
      "Error loading solar system.<br>Please check console for details.";
    loadingText.style.color = "#ff6b6b";
  }
});

init();
