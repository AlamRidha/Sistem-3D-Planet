import * as THREE from "three";

export class PlanetLabels {
  constructor(camera, renderer, planetInfoSystem) {
    this.camera = camera;
    this.renderer = renderer;
    this.planetInfoSystem = planetInfoSystem;
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

    // Enable pointer events untuk label
    label.style.pointerEvents = "auto";
    label.style.cursor = "pointer";

    // Add click event listener
    label.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log(`🏷️ Label clicked: ${name}`);
      this.planetInfoSystem.showPlanetInfo(name);

      // Add visual feedback
      this.highlightLabel(label);
    });

    // Add hover effects
    label.addEventListener("mouseenter", () => {
      label.classList.add("pulse");
    });

    label.addEventListener("mouseleave", () => {
      label.classList.remove("pulse");
    });

    this.labelContainer.appendChild(label);
    this.labels.set(planet, { element: label, name: name });
  }

  highlightLabel(clickedLabel) {
    // Remove highlight dari semua label
    this.labels.forEach((labelData, planet) => {
      labelData.element.style.transform =
        labelData.element.style.transform.replace("scale(1.1)", "scale(1)");
      labelData.element.style.background =
        labelData.element.style.background.replace("0.5", "0.3");
    });

    // Highlight label yang diklik
    const currentTransform = clickedLabel.style.transform;
    const baseTransform = currentTransform.replace("scale(1.1)", "scale(1)");
    clickedLabel.style.transform = baseTransform + " scale(1.1)";
    clickedLabel.style.background = clickedLabel.style.background.replace(
      "0.3",
      "0.5"
    );

    // Reset setelah 1 detik
    setTimeout(() => {
      clickedLabel.style.transform = baseTransform;
      clickedLabel.style.background = clickedLabel.style.background.replace(
        "0.5",
        "0.3"
      );
    }, 1000);
  }

  formatPlanetName(name) {
    const names = {
      sun: "MATAHARI 🌞",
      mercury: "MERKURIUS 🪐",
      venus: "VENUS ♀️",
      earth: "BUMI 🌍",
      mars: "MARS ♂️",
      jupiter: "JUPITER ♃",
      saturn: "SATURNUS ♄",
      uranus: "URANUS ♅",
      neptune: "NEPTUNUS ♆",
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

    this.labels.forEach((labelData, planet) => {
      // Get planet position in screen coordinates
      vector.setFromMatrixPosition(planet.matrixWorld);
      vector.project(this.camera);

      // Convert to screen coordinates
      const x = (vector.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
      const y =
        (-(vector.y * 0.5) + 0.5) * this.renderer.domElement.clientHeight;

      // Update label position dengan offset yang lebih baik
      const baseTransform = `translate(${x}px, ${y}px) translate(-50%, -80px)`;
      labelData.element.style.transform = baseTransform;
      labelData.element.style.display = "block";
    });
  }

  setLabelsVisibility(visible) {
    this.labels.forEach((labelData) => {
      labelData.element.style.display = visible ? "block" : "none";
    });
  }
}
