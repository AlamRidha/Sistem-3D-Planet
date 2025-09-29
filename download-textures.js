const fs = require("fs");
const https = require("https");
const path = require("path");

const textures = {
  sun: "https://images.solarsystemscope.com/textures/download/2k_sun.jpg",
  mercury:
    "https://images.solarsystemscope.com/textures/download/2k_mercury.jpg",
  venus:
    "https://images.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg",
  earth:
    "https://images.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
  mars: "https://images.solarsystemscope.com/textures/download/2k_mars.jpg",
  jupiter:
    "https://images.solarsystemscope.com/textures/download/2k_jupiter.jpg",
  saturn: "https://images.solarsystemscope.com/textures/download/2k_saturn.jpg",
  uranus: "https://images.solarsystemscope.com/textures/download/2k_uranus.jpg",
  neptune:
    "https://images.solarsystemscope.com/textures/download/2k_neptune.jpg",
  stars:
    "https://images.solarsystemscope.com/textures/download/2k_stars_milky_way.jpg",
};

// Create directories
const directories = [
  "./textures/sun",
  "./textures/planets",
  "./textures/background",
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Download function
function downloadTexture(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log(`Downloaded: ${filepath}`);
            resolve();
          });
        } else {
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`)
          );
        }
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => reject(err));
      });
  });
}

// Download all textures
async function downloadAllTextures() {
  console.log("Starting texture downloads from Solar System Scope...");

  try {
    await downloadTexture(textures.sun, "./textures/sun/2k_sun.jpg");
    await downloadTexture(
      textures.mercury,
      "./textures/planets/2k_mercury.jpg"
    );
    await downloadTexture(
      textures.venus,
      "./textures/planets/2k_venus_atmosphere.jpg"
    );
    await downloadTexture(
      textures.earth,
      "./textures/planets/2k_earth_daymap.jpg"
    );
    await downloadTexture(textures.mars, "./textures/planets/2k_mars.jpg");
    await downloadTexture(
      textures.jupiter,
      "./textures/planets/2k_jupiter.jpg"
    );
    await downloadTexture(textures.saturn, "./textures/planets/2k_saturn.jpg");
    await downloadTexture(textures.uranus, "./textures/planets/2k_uranus.jpg");
    await downloadTexture(
      textures.neptune,
      "./textures/planets/2k_neptune.jpg"
    );
    await downloadTexture(
      textures.stars,
      "./textures/background/2k_stars_milky_way.jpg"
    );

    console.log("All textures downloaded successfully!");
  } catch (error) {
    console.error("Error downloading textures:", error);
  }
}

downloadAllTextures();
