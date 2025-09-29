import * as THREE from "three";

export class OrbitLines {
  constructor(scene) {
    this.scene = scene;
    this.orbitLines = [];
    this.colors = [
      0xff6b6b, // Mercury - Red
      0xffd93d, // Venus - Yellow
      0x6bcf7f, // Earth - Green
      0xffa726, // Mars - Orange
      0xc19b6b, // Jupiter - Brown
      0xe4cf9e, // Saturn - Gold
      0x4fd0e7, // Uranus - Cyan
      0x4b70dd, // Neptune - Blue
    ];
  }

  createOrbitLines(planetData) {
    // Clear existing orbit lines
    this.orbitLines.forEach((line) => this.scene.remove(line));
    this.orbitLines = [];

    planetData.forEach((planet, index) => {
      // Create orbit circle
      const orbitGeometry = new THREE.RingGeometry(
        planet.distance - 0.3,
        planet.distance + 0.3,
        128 // More segments for smoother circle
      );

      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: this.colors[index % this.colors.length],
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });

      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      orbit.name = `${planet.name}_orbit`;

      this.scene.add(orbit);
      this.orbitLines.push(orbit);

      // Create dashed line for better visual effect
      this.createDashedOrbit(
        planet.distance,
        this.colors[index % this.colors.length]
      );
    });

    console.log("✅ Orbit lines created");
  }

  createDashedOrbit(radius, color) {
    const points = [];
    const segments = 64;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
      color: color,
      dashSize: 0.5,
      gapSize: 0.3,
      transparent: true,
      opacity: 0.2,
    });

    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    line.rotation.x = Math.PI / 2;
    this.scene.add(line);
    this.orbitLines.push(line);
  }

  updateOrbitLinesVisibility(visible) {
    this.orbitLines.forEach((line) => {
      line.visible = visible;
    });
  }
}
