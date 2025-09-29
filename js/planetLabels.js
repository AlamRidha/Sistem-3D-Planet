import * as THREE from "three";

export class PlanetLabels {
  constructor(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.labels = new Map();
    this.labelContainer = document.createElement("div");
    this.labelContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 10;
        `;
    document.body.appendChild(this.labelContainer);
  }

  createLabel(planet, name) {
    const label = document.createElement("div");
    label.className = "planet-label";
    label.setAttribute("data-planet", name);
    label.textContent = this.formatPlanetName(name);

    this.labelContainer.appendChild(label);
    this.labels.set(planet, label);
  }

  formatPlanetName(name) {
    const names = {
      sun: "MATAHARI",
      mercury: "MERKURIUS",
      venus: "VENUS",
      earth: "BUMI",
      mars: "MARS",
      jupiter: "JUPITER",
      saturn: "SATURNUS",
      uranus: "URANUS",
      neptune: "NEPTUNUS",
    };
    return names[name] || name.toUpperCase();
  }

  updateLabels(solarSystem) {
    const { sun, planets } = solarSystem;

    // Update sun label
    if (sun && !this.labels.has(sun)) {
      this.createLabel(sun, "sun");
    }

    // Update planet labels
    planets.forEach((planetData) => {
      if (planetData.mesh && !this.labels.has(planetData.mesh)) {
        this.createLabel(planetData.mesh, planetData.name);
      }
    });

    // Update positions
    this.updateLabelPositions();
  }

  updateLabelPositions() {
    const vector = new THREE.Vector3();

    this.labels.forEach((label, planet) => {
      // Get planet position in screen coordinates
      vector.setFromMatrixPosition(planet.matrixWorld);
      vector.project(this.camera);

      // Convert to screen coordinates
      const x = (vector.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
      const y =
        (-(vector.y * 0.5) + 0.5) * this.renderer.domElement.clientHeight;

      // Update label position
      label.style.transform = `translate(${x}px, ${y}px)`;
      label.style.display = "block";

      // Add offset to prevent overlapping with planet
      label.style.transform += ` translate(-50%, -60px)`;
    });
  }

  setLabelsVisibility(visible) {
    this.labels.forEach((label) => {
      label.style.display = visible ? "block" : "none";
    });
  }
}
