/**
 * Image Processor for PixelMath:
 * - Downsamples imported images/URLs to target grid dimensions (12x12, 16x16, 24x24, 32x32)
 * - Performs K-Means color quantization to reduce colors to user-specified palette size (3 - 10)
 * - Returns matrix grid and generated palette
 */

export function processImageFile(file, gridWidth, gridHeight, maxColors) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const result = processImageElement(img, gridWidth, gridHeight, maxColors);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Loads an image from an HTTP/HTTPS URL and processes it.
 * Uses CORS proxy fallback if direct load encounters CORS restriction.
 */
export function processImageUrl(imageUrl, gridWidth, gridHeight, maxColors) {
  return new Promise((resolve, reject) => {
    const tryLoad = (url, isProxy = false) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const result = processImageElement(img, gridWidth, gridHeight, maxColors);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        if (!isProxy) {
          // Fallback to CORS proxy
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
          tryLoad(proxyUrl, true);
        } else {
          reject(new Error('No se pudo cargar la imagen desde la URL especificada (error CORS/red).'));
        }
      };

      img.src = url;
    };

    tryLoad(imageUrl);
  });
}

function processImageElement(img, targetWidth, targetHeight, maxColors) {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  // Draw image scaled down to grid dimensions
  ctx.imageSmoothingEnabled = false; // Sharp pixel rendering for sprites!
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const pixels = imgData.data;

  // Extract non-transparent RGB pixels
  const rgbList = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a > 128) {
      rgbList.push([r, g, b]);
    }
  }

  if (rgbList.length === 0) {
    throw new Error('La imagen dada es completamente transparente.');
  }

  // Perform K-Means Color Quantization
  const paletteK = kMeansQuantize(rgbList, Math.min(maxColors, rgbList.length));

  // Build grid matrix and color palette items
  const palette = paletteK.map((rgb, idx) => ({
    id: idx + 1,
    hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
    name: getColorName(rgb[0], rgb[1], rgb[2], idx + 1)
  }));

  const grid = [];
  let pixelIndex = 0;
  for (let y = 0; y < targetHeight; y++) {
    const row = [];
    for (let x = 0; x < targetWidth; x++) {
      const i = pixelIndex * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a <= 128) {
        row.push(0); // Empty / transparent
      } else {
        const closestColorIdx = findNearestColor([r, g, b], paletteK);
        row.push(closestColorIdx + 1); // 1-based palette ID
      }
      pixelIndex++;
    }
    grid.push(row);
  }

  return {
    width: targetWidth,
    height: targetHeight,
    grid,
    palette
  };
}

// Simple K-Means implementation for RGB pixels
function kMeansQuantize(pixels, k, iterations = 10) {
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push([...pixels[Math.min(i * step, pixels.length - 1)]]);
  }

  for (let iter = 0; iter < iterations; iter++) {
    const clusters = Array.from({ length: k }, () => []);

    for (const p of pixels) {
      const nearestIdx = findNearestColor(p, centroids);
      clusters[nearestIdx].push(p);
    }

    const newCentroids = clusters.map((cluster, idx) => {
      if (cluster.length === 0) return centroids[idx];
      const sum = cluster.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
      return [
        Math.round(sum[0] / cluster.length),
        Math.round(sum[1] / cluster.length),
        Math.round(sum[2] / cluster.length)
      ];
    });

    centroids = newCentroids;
  }

  return centroids;
}

function findNearestColor(pixel, palette) {
  let minDistance = Infinity;
  let nearestIdx = 0;

  for (let i = 0; i < palette.length; i++) {
    const p = palette[i];
    const dist = (pixel[0] - p[0]) ** 2 + (pixel[1] - p[1]) ** 2 + (pixel[2] - p[2]) ** 2;
    if (dist < minDistance) {
      minDistance = dist;
      nearestIdx = i;
    }
  }

  return nearestIdx;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function getColorName(r, g, b, defaultId) {
  if (r > 200 && g > 200 && b > 200) return 'Blanco / Claro';
  if (r < 50 && g < 50 && b < 50) return 'Negro / Oscuro';
  if (r > g + 50 && r > b + 50) return 'Rojo';
  if (g > r + 30 && g > b + 30) return 'Verde';
  if (b > r + 30 && b > g + 30) return 'Azul';
  if (r > 180 && g > 180 && b < 100) return 'Amarillo';
  if (r > 180 && g > 100 && b < 80) return 'Naranja';
  if (r > 150 && b > 150 && g < 100) return 'Púrpura / Morado';
  if (r > 200 && g > 150 && b > 150) return 'Rosa';
  if (r > 100 && g > 60 && b < 50) return 'Marrón';
  return `Color ${defaultId}`;
}
