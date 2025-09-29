export class ParticleSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.particles = [];
    this.init();
  }

  init() {
    this.createParticles(50); // Buat 50 particles
    this.animate();
  }

  createParticles(count) {
    for (let i = 0; i < count; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random position
    const left = Math.random() * 100;
    const size = Math.random() * 6 + 2;
    const duration = Math.random() * 8 + 4;
    const delay = Math.random() * 5;

    // Random color
    const colors = ["#ff0080", "#ff8c00", "#40e0d0", "#ffd93d", "#9b59b6"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        `;

    this.container.appendChild(particle);
    this.particles.push(particle);

    // Remove particle setelah selesai animasi dan buat yang baru
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
      this.particles = this.particles.filter((p) => p !== particle);
      this.createParticle();
    }, (duration + delay) * 1000);
  }

  animate() {
    // Animation loop untuk efek tambahan
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.particles.forEach((particle) => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
  }
}
