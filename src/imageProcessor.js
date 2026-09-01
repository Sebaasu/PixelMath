/**
 * Image Processor for PixelMath:
 * - Downsamples imported images/URLs to target grid dimensions (12x12, 16x16, 24x24, 32x32)
 * - Performs K-Means color quantization to reduce colors to user-specified palette size (3 - 10)
 * - Snaps colors to a clean, child-friendly base palette with unique Spanish color names.
 */

// Child-friendly standard color palette for snapping and clear naming
const FRIENDLY_COLOR_DICTIONARY = [
  { name: 'Blanco', rgb: [255, 255, 255], hex: '#ffffff' },
  { name: 'Negro', rgb: [25, 25, 25], hex: '#191919' },
  { name: 'Gris Claro', rgb: [200, 200, 200], hex: '#c8c8c8' },
  { name: 'Gris', rgb: [128, 128, 128], hex: '#808080' },
  { name: 'Gris Oscuro', rgb: [70, 70, 70], hex: '#464646' },
  { name: 'Rojo', rgb: [225, 30, 40], hex: '#e11e28' },
  { name: 'Rojo Oscuro', rgb: [140, 15, 25], hex: '#8c0f19' },
  { name: 'Rojo Carmesí', rgb: [180, 20, 60], hex: '#b4143c' },
  { name: 'Naranja', rgb: [245, 120, 20], hex: '#f57814' },
  { name: 'Naranja Claro', rgb: [255, 170, 60], hex: '#ffaa3c' },
  { name: 'Amarillo', rgb: [250, 210, 20], hex: '#fad214' },
  { name: 'Amarillo Claro', rgb: [255, 240, 120], hex: '#fff078' },
  { name: 'Verde', rgb: [35, 175, 65], hex: '#23af41' },
  { name: 'Verde Claro', rgb: [130, 220, 70], hex: '#82dc46' },
  { name: 'Verde Oscuro', rgb: [15, 100, 40], hex: '#0f6428' },
  { name: 'Verde Menta', rgb: [140, 230, 180], hex: '#8ce6b4' },
  { name: 'Celeste', rgb: [80, 200, 250], hex: '#50c8fa' },
  { name: 'Azul', rgb: [30, 110, 235], hex: '#1e6eeB' },
  { name: 'Azul Oscuro', rgb: [15, 35, 130], hex: '#0f2382' },
  { name: 'Turquesa', rgb: [20, 185, 185], hex: '#14b9b9' },
  { name: 'Morado', rgb: [145, 50, 210], hex: '#9132d2' },
  { name: 'Violeta', rgb: [95, 20, 160], hex: '#5f14a0' },
  { name: 'Rosa', rgb: [255, 115, 175], hex: '#ff73af' },
  { name: 'Rosa Claro', rgb: [255, 190, 215], hex: '#ffbed7' },
  { name: 'Marrón', rgb: [135, 65, 20], hex: '#874114' },
  { name: 'Marrón Claro', rgb: [185, 120, 60], hex: '#b9783c' },
  { name: 'Piel / Crema', rgb: [255, 215, 175], hex: '#ffd7af' }
];

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

  ctx.imageSmoothingEnabled = false;
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

  // K-Means Color Quantization
  const rawCentroids = kMeansQuantize(rgbList, Math.min(maxColors, rgbList.length));

  // Snap centroids to friendly base colors and resolve name collisions
  const snappedPalette = buildFriendlyPalette(rawCentroids);

  // Build grid matrix
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
        row.push(0); // Transparent
      } else {
        const closestColorIdx = findNearestColorIndex([r, g, b], rawCentroids);
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
    palette: snappedPalette
  };
}

// Snaps K-means centroids to clear child-friendly color names and hexes with unique names
function buildFriendlyPalette(centroids) {
  const usedNamesCount = new Map();

  return centroids.map((rgb, idx) => {
    // Find closest match in friendly color dictionary
    let bestMatch = FRIENDLY_COLOR_DICTIONARY[0];
    let minDistance = Infinity;

    for (const fc of FRIENDLY_COLOR_DICTIONARY) {
      // Weighted RGB distance (human perception weights: R:30%, G:59%, B:11%)
      const dist =
        0.3 * (rgb[0] - fc.rgb[0]) ** 2 +
        0.59 * (rgb[1] - fc.rgb[1]) ** 2 +
        0.11 * (rgb[2] - fc.rgb[2]) ** 2;

      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = fc;
      }
    }

    // Handle name collisions so names are always unique
    const count = (usedNamesCount.get(bestMatch.name) || 0) + 1;
    usedNamesCount.set(bestMatch.name, count);

    let finalName = bestMatch.name;
    if (count > 1) {
      finalName = `${bestMatch.name} (${count})`;
    }

    // Use bright snapped hex color for crisp pencil-matching swatches
    const snappedHex = rgbToHex(rgb[0], rgb[1], rgb[2]);

    return {
      id: idx + 1,
      hex: snappedHex,
      name: finalName
    };
  });
}

function kMeansQuantize(pixels, k, iterations = 10) {
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push([...pixels[Math.min(i * step, pixels.length - 1)]]);
  }

  for (let iter = 0; iter < iterations; iter++) {
    const clusters = Array.from({ length: k }, () => []);

    for (const p of pixels) {
      const nearestIdx = findNearestColorIndex(p, centroids);
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

function findNearestColorIndex(pixel, palette) {
  let minDistance = Infinity;
  let nearestIdx = 0;

  for (let i = 0; i < palette.length; i++) {
    const p = palette[i];
    const dist =
      0.3 * (pixel[0] - p[0]) ** 2 +
      0.59 * (pixel[1] - p[1]) ** 2 +
      0.11 * (pixel[2] - p[2]) ** 2;

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
