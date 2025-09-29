import * as THREE from "three";

export class SolarSystemTextureLoader {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.textures = {};
  }

  async loadAllTextures(progressCallback = null) {
    // Fallback colors untuk setiap texture
    const fallbackColors = {
      sun: 0xffff00,
      mercury: 0x8c7853,
      venus: 0xe39e1c,
      earth: 0x6b93d6,
      mars: 0xcc6a4c,
      jupiter: 0xc19b6b,
      saturn: 0xe4cf9e,
      uranus: 0x4fd0e7,
      neptune: 0x4b70dd,
      stars: 0x000033,
    };

    const texturePaths = {
      sun: "./textures/sun/2k_sun.jpg",
      mercury: "./textures/planets/2k_mercury.jpg",
      venus: "./textures/planets/2k_venus_atmosphere.jpg",
      earth: "./textures/planets/2k_earth_daymap.jpg",
      mars: "./textures/planets/2k_mars.jpg",
      jupiter: "./textures/planets/2k_jupiter.jpg",
      saturn: "./textures/planets/2k_saturn.jpg",
      uranus: "./textures/planets/2k_uranus.jpg",
      neptune: "./textures/planets/2k_neptune.jpg",
      stars: "./textures/background/2k_stars_milky_way.jpg",
    };

    const loadPromises = Object.entries(texturePaths).map(([name, path]) =>
      this.loadTextureWithFallback(
        name,
        path,
        fallbackColors[name],
        progressCallback
      )
    );

    await Promise.allSettled(loadPromises);
    console.log("✅ All textures processed");
    return this.textures;
  }

  loadTextureWithFallback(name, url, fallbackColor, progressCallback) {
    return new Promise((resolve) => {
      this.textureLoader.load(
        url,
        (texture) => {
          // Success
          texture.colorSpace = THREE.SRGBColorSpace;
          this.textures[name] = texture;
          console.log(`✅ Loaded texture: ${name}`);
          if (progressCallback) progressCallback(name);
          resolve(texture);
        },
        undefined,
        (error) => {
          // Error - use fallback
          console.warn(`⚠️ Using fallback for: ${name}`);
          this.textures[name] = {
            isFallback: true,
            color: fallbackColor,
          };
          if (progressCallback) progressCallback(name);
          resolve(null);
        }
      );
    });
  }

  getTexture(name) {
    return this.textures[name];
  }

  isFallback(texture) {
    return texture && texture.isFallback;
  }
}
