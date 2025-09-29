import * as THREE from "three";
import { SolarSystemTextureLoader } from "./textureLoader.js";

export async function createPlanets(scene, progressCallback = null) {
  const planets = [];

  // Load textures
  const textureLoader = new SolarSystemTextureLoader();
  const textures = await textureLoader.loadAllTextures(progressCallback);

  console.log("🌌 Creating background...");
  // Create background - PERBESAR background
  const backgroundGeometry = new THREE.SphereGeometry(2000, 32, 32);
  let backgroundMaterial;

  if (textures.stars && !textureLoader.isFallback(textures.stars)) {
    backgroundMaterial = new THREE.MeshBasicMaterial({
      map: textures.stars,
      side: THREE.BackSide,
    });
    console.log("✅ Using stars texture for background");
  } else {
    backgroundMaterial = new THREE.MeshBasicMaterial({
      color: 0x000033,
      side: THREE.BackSide,
    });
    console.log("⚠️ Using fallback color for background");
  }

  const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  scene.add(background);
  console.log("✅ Background created");

  console.log("☀️ Creating sun...");
  // Create Sun - PERBESAR ukuran
  const sunGeometry = new THREE.SphereGeometry(15, 64, 64); // Diperbesar dari 8 ke 15
  let sunMaterial;

  if (textures.sun && !textureLoader.isFallback(textures.sun)) {
    sunMaterial = new THREE.MeshBasicMaterial({
      map: textures.sun,
    });
    console.log("✅ Using sun texture");
  } else {
    sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
    });
    console.log("⚠️ Using fallback color for sun");
  }

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);
  console.log("✅ Sun created");

  // Sun light - BUAT LEBIH TERANG untuk ukuran yang lebih besar
  const sunLight = new THREE.PointLight(0xffffff, 5, 3000); // Diperkuat
  sun.add(sunLight);

  // Tambahkan lebih banyak light untuk efek yang lebih dramatis
  const sunLight2 = new THREE.PointLight(0xffd93d, 2, 2000);
  sun.add(sunLight2);
  console.log("✅ Sun lights added");

  // Planet data - PERBESAR semua ukuran dan jarak
  const planetData = [
    {
      name: "mercury",
      radius: 1.5, // Diperbesar dari 0.8
      distance: 25, // Diperbesar dari 15
      speed: 0.01,
      color: 0x8c7853,
    },
    {
      name: "venus",
      radius: 2.2, // Diperbesar dari 1.2
      distance: 35, // Diperbesar dari 22
      speed: 0.007,
      color: 0xe39e1c,
    },
    {
      name: "earth",
      radius: 2.4, // Diperbesar dari 1.3
      distance: 45, // Diperbesar dari 30
      speed: 0.005,
      color: 0x6b93d6,
    },
    {
      name: "mars",
      radius: 1.7, // Diperbesar dari 0.9
      distance: 55, // Diperbesar dari 38
      speed: 0.004,
      color: 0xcc6a4c,
    },
    {
      name: "jupiter",
      radius: 5.0, // Diperbesar dari 2.8
      distance: 75, // Diperbesar dari 50
      speed: 0.002,
      color: 0xc19b6b,
    },
    {
      name: "saturn",
      radius: 4.5, // Diperbesar dari 2.4
      distance: 95, // Diperbesar dari 65
      speed: 0.001,
      color: 0xe4cf9e,
    },
    {
      name: "uranus",
      radius: 3.2, // Diperbesar dari 1.8
      distance: 115, // Diperbesar dari 80
      speed: 0.0007,
      color: 0x4fd0e7,
    },
    {
      name: "neptune",
      radius: 3.2, // Diperbesar dari 1.8
      distance: 135, // Diperbesar dari 95
      speed: 0.0005,
      color: 0x4b70dd,
    },
  ];

  console.log("🪐 Creating planets...");
  // Create planets dengan material yang tepat
  planetData.forEach((data) => {
    const geometry = new THREE.SphereGeometry(data.radius, 64, 64); // Tingkatkan detail
    let material;

    const texture = textures[data.name];
    if (texture && !textureLoader.isFallback(texture)) {
      material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0.1,
      });
      console.log(`✅ Using texture for ${data.name}`);
    } else {
      material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.7,
        metalness: 0.1,
      });
      console.log(`⚠️ Using fallback color for ${data.name}`);
    }

    const planet = new THREE.Mesh(geometry, material);
    planet.name = data.name;

    // Create orbit group
    const orbitGroup = new THREE.Group();
    orbitGroup.name = `${data.name}_orbit`;
    orbitGroup.add(planet);

    // Position planet in orbit
    planet.position.x = data.distance;

    scene.add(orbitGroup);

    planets.push({
      mesh: planet,
      orbitGroup: orbitGroup,
      speed: data.speed,
      name: data.name,
      data: data,
    });
  });

  // Saturn rings - PERBESAR juga
  console.log("💍 Creating Saturn rings...");
  const saturnRingGeometry = new THREE.RingGeometry(5, 7, 64); // Diperbesar
  const saturnRingMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0e6a2,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  });
  const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
  saturnRing.rotation.x = Math.PI / 2;
  planets[5].mesh.add(saturnRing);

  console.log("✅ Solar system creation completed");
  console.log("Total planets created:", planets.length);

  // Animation update function
  function update() {
    // Rotate sun
    sun.rotation.y += 0.001;

    // Update planets
    planets.forEach((planet) => {
      // Rotate planet
      planet.mesh.rotation.y += 0.005;
      // Revolve around sun
      planet.orbitGroup.rotation.y += planet.speed;
    });
  }

  return {
    update: update,
    planets: planets,
    sun: sun,
    planetData: planetData,
  };
}
