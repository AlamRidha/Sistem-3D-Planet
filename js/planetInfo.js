export class PlanetInfoSystem {
  constructor() {
    this.planetData = {
      sun: {
        name: "Matahari",
        latin: "Sol",
        icon: "☀️",
        distance: "0 km",
        diameter: "1.392.700 km",
        mass: "1.989 × 10³⁰ kg",
        gravity: "274 m/s²",
        orbitPeriod: "Tidak ada",
        rotationPeriod: "27 hari",
        description:
          "Matahari adalah bintang di pusat tata surya kita. Ini adalah bola plasma panas yang hampir sempurna, dipanaskan hingga pijar oleh reaksi fusi nuklir di intinya. Matahari menyediakan energi yang diperlukan untuk kehidupan di Bumi.",
        funFact: "Matahari mengandung 99.86% dari seluruh massa di tata surya!",
      },
      mercury: {
        name: "Merkurius",
        latin: "Mercury",
        icon: "🪐",
        distance: "57.9 juta km",
        diameter: "4.879 km",
        mass: "3.301 × 10²³ kg",
        gravity: "3.7 m/s²",
        orbitPeriod: "88 hari",
        rotationPeriod: "1.408 jam",
        description:
          "Merkurius adalah planet terkecil dan terdekat dengan Matahari dalam tata surya kita. Planet ini tidak memiliki satelit alami dan atmosfer yang signifikan.",
        funFact:
          "Satu hari di Merkurius (dari matahari terbit ke terbit berikutnya) lebih lama dari satu tahunnya!",
      },
      venus: {
        name: "Venus",
        latin: "Venus",
        icon: "♀️",
        distance: "108.2 juta km",
        diameter: "12.104 km",
        mass: "4.867 × 10²⁴ kg",
        gravity: "8.87 m/s²",
        orbitPeriod: "225 hari",
        rotationPeriod: "2.802 jam",
        description:
          'Venus adalah planet terdekat kedua dari Matahari. Planet ini sering disebut "kembaran Bumi" karena ukuran dan massanya yang mirip, tetapi memiliki atmosfer yang sangat berbeda.',
        funFact:
          "Venus berotasi searah jarum jam, berbeda dengan planet lain yang berlawanan arah jarum jam!",
      },
      earth: {
        name: "Bumi",
        latin: "Terra",
        icon: "🌍",
        distance: "149.6 juta km",
        diameter: "12.742 km",
        mass: "5.972 × 10²⁴ kg",
        gravity: "9.807 m/s²",
        orbitPeriod: "365.25 hari",
        rotationPeriod: "23.93 jam",
        description:
          "Bumi adalah planet ketiga dari Matahari dan satu-satunya objek astronomi yang diketahui mendukung kehidupan. Permukaannya terdiri dari 71% air dan 29% daratan.",
        funFact:
          "Bumi adalah satu-satunya planet di tata surya yang tidak dinamai dari dewa mitologi!",
      },
      mars: {
        name: "Mars",
        latin: "Mars",
        icon: "♂️",
        distance: "227.9 juta km",
        diameter: "6.779 km",
        mass: "6.417 × 10²³ kg",
        gravity: "3.71 m/s²",
        orbitPeriod: "687 hari",
        rotationPeriod: "24.62 jam",
        description:
          'Mars adalah planet keempat dari Matahari dan sering disebut "Planet Merah" karena penampilannya yang kemerahan akibat besi oksida di permukaannya.',
        funFact:
          "Mars memiliki gunung tertinggi di tata surya, Olympus Mons, yang tingginya 3x gunung Everest!",
      },
      jupiter: {
        name: "Jupiter",
        latin: "Jupiter",
        icon: "♃",
        distance: "778.5 juta km",
        diameter: "139.820 km",
        mass: "1.898 × 10²⁷ kg",
        gravity: "24.79 m/s²",
        orbitPeriod: "11.86 tahun",
        rotationPeriod: "9.93 jam",
        description:
          "Jupiter adalah planet terbesar di tata surya kita. Planet ini terutama terdiri dari hidrogen dan helium, dan dikenal dengan Bintik Merah Besarnya, badai raksasa yang telah berlangsung selama berabad-abad.",
        funFact:
          "Jupiter begitu besar sehingga semua planet lain di tata surya bisa muat di dalamnya!",
      },
      saturn: {
        name: "Saturnus",
        latin: "Saturnus",
        icon: "♄",
        distance: "1.434 miliar km",
        diameter: "116.460 km",
        mass: "5.683 × 10²⁶ kg",
        gravity: "10.44 m/s²",
        orbitPeriod: "29.46 tahun",
        rotationPeriod: "10.66 jam",
        description:
          "Saturnus adalah planet keenam dari Matahari dan terkenal dengan sistem cincinnya yang menakjubkan. Planet ini adalah raksasa gas seperti Jupiter.",
        funFact:
          "Saturnus memiliki kepadatan yang lebih rendah dari air - artinya akan mengapung jika ditempatkan di lautan yang cukup besar!",
      },
      uranus: {
        name: "Uranus",
        latin: "Uranus",
        icon: "♅",
        distance: "2.871 miliar km",
        diameter: "50.724 km",
        mass: "8.681 × 10²⁵ kg",
        gravity: "8.87 m/s²",
        orbitPeriod: "84.01 tahun",
        rotationPeriod: "17.24 jam",
        description:
          "Uranus adalah planet ketujuh dari Matahari. Planet ini adalah raksasa es dengan komposisi yang berbeda dari raksasa gas Jupiter dan Saturnus.",
        funFact:
          "Uranus berotasi pada sisinya, dengan kemiringan sumbu hampir 98 derajat!",
      },
      neptune: {
        name: "Neptunus",
        latin: "Neptune",
        icon: "♆",
        distance: "4.495 miliar km",
        diameter: "49.244 km",
        mass: "1.024 × 10²⁶ kg",
        gravity: "11.15 m/s²",
        orbitPeriod: "164.8 tahun",
        rotationPeriod: "16.11 jam",
        description:
          "Neptunus adalah planet terjauh dari Matahari dalam tata surya kita. Planet ini adalah raksasa es seperti Uranus dan memiliki angin terkuat di tata surya.",
        funFact:
          "Neptunus membutuhkan 165 tahun Bumi untuk menyelesaikan satu orbit mengelilingi Matahari!",
      },
    };
  }

  getPlanetInfo(planetName) {
    return this.planetData[planetName] || null;
  }

  showPlanetInfo(planetName) {
    const info = this.getPlanetInfo(planetName);
    if (!info) return false;

    // Update UI elements
    document.getElementById("planetIcon").textContent = info.icon;
    document.getElementById("planetName").textContent = info.name;
    document.getElementById("planetLatin").textContent = info.latin;
    document.getElementById("planetDistance").textContent = info.distance;
    document.getElementById("planetDiameter").textContent = info.diameter;
    document.getElementById("planetMass").textContent = info.mass;
    document.getElementById("planetGravity").textContent = info.gravity;
    document.getElementById("planetOrbitPeriod").textContent = info.orbitPeriod;
    document.getElementById("planetRotationPeriod").textContent =
      info.rotationPeriod;
    document.getElementById("planetDescription").textContent = info.description;
    document.getElementById("planetFunFact").textContent = info.funFact;

    // Set planet-specific styling
    const infoPanel = document.getElementById("planetInfoPanel");
    infoPanel.className = "planet-" + planetName;

    // Show panel
    document.getElementById("infoOverlay").classList.add("active");
    infoPanel.classList.add("active");

    return true;
  }

  hidePlanetInfo() {
    document.getElementById("infoOverlay").classList.remove("active");
    document.getElementById("planetInfoPanel").classList.remove("active");
  }

  setupEventListeners() {
    // Close button
    document.getElementById("closeInfoPanel").addEventListener("click", () => {
      this.hidePlanetInfo();
    });

    // Overlay click to close
    document.getElementById("infoOverlay").addEventListener("click", () => {
      this.hidePlanetInfo();
    });

    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hidePlanetInfo();
      }
    });
  }
}
