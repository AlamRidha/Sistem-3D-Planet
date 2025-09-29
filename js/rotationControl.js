export class RotationControlSystem {
  constructor(controls, solarSystem) {
    this.controls = controls;
    this.solarSystem = solarSystem;

    // Rotation state
    this.rotationSpeed = 1;
    this.baseSpeeds = {
      sun: 0.001,
      mercury: 0.01,
      venus: 0.007,
      earth: 0.005,
      mars: 0.004,
      jupiter: 0.002,
      saturn: 0.001,
      uranus: 0.0007,
      neptune: 0.0005,
    };

    this.isPaused = false;
    this.isAutoRotate = true;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // Speed control buttons
    document.querySelectorAll(".rotate-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const speed = parseFloat(e.currentTarget.getAttribute("data-speed"));
        this.setRotationSpeed(speed);
      });
    });

    // Auto rotate toggle
    document
      .getElementById("autoRotateToggle")
      .addEventListener("click", () => {
        this.toggleAutoRotate();
      });

    // Pause/resume button
    document.getElementById("pauseResumeBtn").addEventListener("click", () => {
      this.togglePause();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          this.togglePause();
          break;
        case "ArrowUp":
          e.preventDefault();
          this.increaseSpeed();
          break;
        case "ArrowDown":
          e.preventDefault();
          this.decreaseSpeed();
          break;
        case "r":
          if (e.ctrlKey) {
            e.preventDefault();
            this.reverseRotation();
          }
          break;
        case "0":
          this.setRotationSpeed(0);
          break;
        case "1":
          this.setRotationSpeed(0.5);
          break;
        case "2":
          this.setRotationSpeed(1);
          break;
        case "3":
          this.setRotationSpeed(2);
          break;
      }
    });
  }

  setRotationSpeed(speed) {
    this.rotationSpeed = speed;

    // Update controls auto rotate
    this.controls.autoRotate = speed !== 0 && this.isAutoRotate;
    this.controls.autoRotateSpeed = Math.abs(speed) * 0.5;

    this.updateUI();
    this.showSpeedFeedback();
  }

  increaseSpeed() {
    const speeds = [0, 0.5, 1, 2];
    const currentIndex = speeds.indexOf(this.rotationSpeed);
    const nextIndex = Math.min(currentIndex + 1, speeds.length - 1);
    this.setRotationSpeed(speeds[nextIndex]);
  }

  decreaseSpeed() {
    const speeds = [0, 0.5, 1, 2];
    const currentIndex = speeds.indexOf(this.rotationSpeed);
    const nextIndex = Math.max(currentIndex - 1, 0);
    this.setRotationSpeed(speeds[nextIndex]);
  }

  reverseRotation() {
    this.setRotationSpeed(-this.rotationSpeed);
  }

  toggleAutoRotate() {
    this.isAutoRotate = !this.isAutoRotate;
    this.controls.autoRotate = this.isAutoRotate && this.rotationSpeed !== 0;
    this.updateUI();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.updateUI();

    if (this.isPaused) {
      this.showNotification("⏸️ Rotasi Dijeda");
    } else {
      this.showNotification("▶️ Rotasi Dilanjutkan");
    }
  }

  updateUI() {
    // Update speed value
    const speedValue = document.getElementById("speedValue");
    const speedText = this.getSpeedText(this.rotationSpeed);
    speedValue.textContent = speedText;
    speedValue.style.color = this.getSpeedColor(this.rotationSpeed);

    // Update direction
    const directionArrow = document.getElementById("directionArrow");
    const directionValue = document.getElementById("directionValue");

    if (this.rotationSpeed < 0) {
      directionArrow.textContent = "↺";
      directionArrow.classList.add("reverse");
      directionValue.textContent = "MUNDUR";
      directionValue.style.color = "#9b59b6";
    } else {
      directionArrow.textContent = "↻";
      directionArrow.classList.remove("reverse");
      directionValue.textContent = "MAJU";
      directionValue.style.color = "#6bcf7f";
    }

    // Update auto rotate toggle
    const toggleSwitch = document.getElementById("toggleSwitch");
    if (this.isAutoRotate) {
      toggleSwitch.classList.add("active");
    } else {
      toggleSwitch.classList.remove("active");
    }

    // Update pause/resume button
    const pauseResumeBtn = document.getElementById("pauseResumeBtn");
    if (this.isPaused) {
      pauseResumeBtn.innerHTML = "<span>▶️</span><span>LANJUTKAN</span>";
      pauseResumeBtn.style.background =
        "linear-gradient(135deg, #6bcf7f, #4d96ff)";
    } else {
      pauseResumeBtn.innerHTML = "<span>⏸️</span><span>JEDA SEMUA</span>";
      pauseResumeBtn.style.background =
        "linear-gradient(135deg, #ffd93d, #ffa726)";
    }

    // Update button states
    document.querySelectorAll(".rotate-btn").forEach((btn) => {
      const btnSpeed = parseFloat(btn.getAttribute("data-speed"));
      if (btnSpeed === this.rotationSpeed) {
        btn.style.transform = "scale(1.1)";
        btn.style.boxShadow = "0 0 20px currentColor";
      } else {
        btn.style.transform = "";
        btn.style.boxShadow = "";
      }
    });
  }

  getSpeedText(speed) {
    switch (speed) {
      case 0:
        return "BERHENTI";
      case 0.5:
        return "LAMBAT";
      case 1:
        return "NORMAL";
      case 2:
        return "CEPAT";
      case -0.5:
        return "LAMBAT (MUNDUR)";
      case -1:
        return "NORMAL (MUNDUR)";
      case -2:
        return "CEPAT (MUNDUR)";
      default:
        return "KUSTOM";
    }
  }

  getSpeedColor(speed) {
    const absSpeed = Math.abs(speed);
    if (absSpeed === 0) return "#ff6b6b";
    if (absSpeed === 0.5) return "#6bcf7f";
    if (absSpeed === 1) return "#4d96ff";
    if (absSpeed === 2) return "#ffd93d";
    return "#ffffff";
  }

  showSpeedFeedback() {
    const feedback = document.createElement("div");
    feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 2px solid ${this.getSpeedColor(this.rotationSpeed)};
        `;
    feedback.textContent = this.getSpeedText(this.rotationSpeed);
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.opacity = "0";
      feedback.style.transform = "translate(-50%, -50%) scale(0.8)";
      setTimeout(() => {
        document.body.removeChild(feedback);
      }, 300);
    }, 1000);
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 2px solid #ffd93d;
            box-shadow: 0 5px 15px rgba(255, 217, 61, 0.3);
        `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateX(-50%) translateY(-20px)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }

  update(deltaTime) {
    if (this.isPaused) return;

    const effectiveSpeed = this.rotationSpeed;

    // Update sun rotation
    if (this.solarSystem.sun) {
      this.solarSystem.sun.rotation.y += this.baseSpeeds.sun * effectiveSpeed;
    }

    // Update planets
    if (this.solarSystem.planets) {
      this.solarSystem.planets.forEach((planet) => {
        // Planet rotation (axial)
        planet.mesh.rotation.y += 0.005 * effectiveSpeed;

        // Orbit rotation (revolution)
        planet.orbitGroup.rotation.y += planet.speed * effectiveSpeed;
      });
    }

    // Update controls auto rotate speed
    if (this.controls.autoRotate) {
      this.controls.autoRotateSpeed = Math.abs(effectiveSpeed) * 0.5;
    }
  }

  // Public methods untuk external control
  pause() {
    this.isPaused = true;
    this.updateUI();
  }

  resume() {
    this.isPaused = false;
    this.updateUI();
  }

  setSpeed(speed) {
    this.setRotationSpeed(speed);
  }

  getState() {
    return {
      speed: this.rotationSpeed,
      isPaused: this.isPaused,
      isAutoRotate: this.isAutoRotate,
      direction: this.rotationSpeed < 0 ? "reverse" : "forward",
    };
  }
}
