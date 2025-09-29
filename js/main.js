import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createPlanets } from "./planets.js";
import { OrbitLines } from "./orbitLines.js";
import { PlanetLabels } from "./planetLabels.js";
import { PlanetInfoSystem } from "./planetInfo.js";

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

  // Camera - SESUAIKAN untuk ukuran yang lebih besar
  const camera = new THREE.PerspectiveCamera(
    60, // Lebar field of view untuk melihat lebih banyak
    window.innerWidth / window.innerHeight,
    0.1,
    5000 // Perbesar far plane
  );
  camera.position.set(0, 80, 200); // Posisi awal yang lebih jauh

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3; // Sedikit lebih terang

  document.getElementById("container3D").appendChild(renderer.domElement);

  // Enhanced Lighting System - LEBIH BANYAK LIGHT
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(100, 100, 100);
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0x443333, 0x111122, 0.8);
  scene.add(hemisphereLight);

  // Orbit Controls - SESUAIKAN untuk ukuran besar
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 30; // Bisa zoom lebih dekat
  controls.maxDistance = 1000; // Bisa zoom lebih jauh
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;

  // Create planet info system
  const planetInfoSystem = new PlanetInfoSystem();
  planetInfoSystem.setupEventListeners();

  // Create orbit lines system
  const orbitLines = new OrbitLines(scene);

  // Create planet labels system - PASS planetInfoSystem
  const planetLabels = new PlanetLabels(camera, renderer, planetInfoSystem);

  // Create solar system
  console.log("🌌 Creating solar system...");
  const solarSystem = await createPlanets(scene, updateProgress);

  // Create orbit lines for planets
  const planetData = solarSystem.planets.map((p) => ({
    name: p.name,
    distance: p.data.distance,
  }));
  orbitLines.createOrbitLines(planetData);

  // Raycaster untuk click detection pada planet
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPlanetClick(event) {
    // Calculate mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Check intersections dengan planet dan sun
    const planetMeshes = solarSystem.planets.map((p) => p.mesh);
    const allMeshes = [...planetMeshes, solarSystem.sun];

    const intersects = raycaster.intersectObjects(allMeshes, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      let planetName = "sun";

      // Cari planet mana yang diklik
      solarSystem.planets.forEach((planet) => {
        if (
          planet.mesh === clickedObject ||
          planet.mesh.children.includes(clickedObject) ||
          (planet.mesh === saturn && clickedObject === saturnRing)
        ) {
          planetName = planet.name;
        }
      });

      // Jika sun diklik langsung
      if (
        clickedObject === solarSystem.sun ||
        solarSystem.sun.children.includes(clickedObject)
      ) {
        planetName = "sun";
      }

      console.log(`🪐 Planet clicked: ${planetName}`);
      planetInfoSystem.showPlanetInfo(planetName);
      highlightPlanet(planetName);
    }
  }

  function highlightPlanet(planetName) {
    // Reset semua material
    solarSystem.planets.forEach((planet) => {
      if (planet.mesh.material.emissive) {
        planet.mesh.material.emissive.setHex(0x000000);
      }
    });

    if (solarSystem.sun.material.emissive) {
      solarSystem.sun.material.emissive.setHex(0x000000);
    }

    // Highlight planet yang diklik
    if (planetName === "sun") {
      if (solarSystem.sun.material.emissive) {
        solarSystem.sun.material.emissive.setHex(0x333300);
      }
    } else {
      const planet = solarSystem.planets.find((p) => p.name === planetName);
      if (planet && planet.mesh.material.emissive) {
        planet.mesh.material.emissive.setHex(0x222222);
      }
    }
  }

  // Add click event listener untuk planet
  window.addEventListener("click", onPlanetClick);

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
      case "i":
        // Show info panel untuk testing
        planetInfoSystem.showPlanetInfo("earth");
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

  console.log("🚀 SOLAR SYSTEM READY - EPIC SIZE!");
  console.log("🎮 CONTROLS:");
  console.log("   • R - Toggle auto-rotate");
  console.log("   • O - Toggle orbit lines");
  console.log("   • L - Toggle labels");
  console.log("   • I - Show info panel (test)");
  console.log("   • CLICK PLANET - Show detailed info");
  console.log("   • CLICK LABEL - Show detailed info");
  console.log("   • ESC - Close info panel");
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
