import * as THREE from "three";

export function setupPlanetInteractions(camera, renderer, solarSystem) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(
      solarSystem.planets.map((p) => p.mesh).concat([solarSystem.sun])
    );

    if (intersects.length > 0) {
      const object = intersects[0].object;
      showPlanetInfo(object);
    }
  }

  function showPlanetInfo(planetObject) {
    const infoPanel = document.getElementById("infoPanel");
    const planetInfo = document.getElementById("planetInfo");

    // Find planet data
    let planetName = "Matahari";
    solarSystem.planets.forEach((planet) => {
      if (planet.mesh === planetObject) {
        planetName = planet.name;
      }
    });

    planetInfo.textContent = `Planet: ${planetName.toUpperCase()}`;
    infoPanel.style.display = "block";

    // Hide info after 5 seconds
    setTimeout(() => {
      infoPanel.style.display = "none";
    }, 5000);
  }

  window.addEventListener("click", onMouseClick, false);
}
