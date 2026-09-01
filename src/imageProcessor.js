/**
 * Image Processor for PixelMath:
 * - Downsamples imported images/URLs to target grid dimensions (12x12, 16x16, 24x24, 32x32)
 * - Automatically detects distinct child-friendly colors without forcing duplicate names (e.g. Gris, Gris 2).
 * - Merges similar shades into clean, unique friendly base colors.
 */

// Child-friendly standard color dictionary for automatic color snapping
const FRIENDLY_COLOR_DICTIONARY = [
  { name: 'Blanco', rgb: [255, 255, 255], hex: '#ffffff' },
  { name: 'Negro', rgb: [25, 25, 25], hex: '#191919' },
  { name: 'Gris Claro', rgb: [200, 200, 200], hex: '#c8c8c8' },
  { name: 'Gris', rgb: [120, 120, 120], hex: '#787878' },
  { name: 'Gris Oscuro', rgb: [60, 60, 60], hex: '#3c3c3c' },
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
  { name: 'Azul', rgb: [30, 110, 235], hex: '#1e6eeb' },
  { name: 'Azul Oscuro', rgb: [15, 35, 130], hex: '#0f2382' },
  { name: 'Turquesa', rgb: [20, 185, 185], hex: '#14b9b9' },
  { name: 'Morado', rgb: [145, 50, 210], hex: '#9132d2' },
  { name: 'Violeta', rgb: [95, 20, 160], hex: '#5f14a0' },
  { name: 'Rosa', rgb: [255, 115, 175], hex: '#ff73af' },
  { name: 'Rosa Claro', rgb: [255, 190, 215], hex: '#ffbed7' },
  { name: 'Marrón', rgb: [135, 65, 20], hex: '#874114' },
  { name: 'Marrón Claro', rgb: [185, 120, 60], hex: '#b9783c' },
  { name: 'Crema / Piel', rgb: [255, 215, 175], hex: '#ffd7af' }
];

export function processImageFile(file, gridWidth, gridHeight, maxColors = 8) {
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

export function processImageUrl(imageUrl, gridWidth, gridHeight, maxColors = 8) {
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

function processImageElement(img, targetWidth, targetHeight, maxColors = 8) {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const pixels = imgData.data;

  // 1. Group pixels by friendly color index
  const colorCounts = new Map(); // friendlyIdx -> frequency count
  const pixelFriendlyIndices = [];
  let pixelIndex = 0;

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const i = pixelIndex * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a <= 128) {
        pixelFriendlyIndices.push(-1); // Transparent
      } else {
        const friendlyIdx = findNearestFriendlyIndex([r, g, b]);
        pixelFriendlyIndices.push(friendlyIdx);
        colorCounts.set(friendlyIdx, (colorCounts.get(friendlyIdx) || 0) + 1);
      }
      pixelIndex++;
    }
  }

  if (colorCounts.size === 0) {
    throw new Error('La imagen dada es completamente transparente.');
  }

  // 2. Automatically select distinct unique colors (up to maxColors cap if needed)
  const sortedFriendlyIndices = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1]) // most frequent first
    .slice(0, maxColors)
    .map(entry => entry[0]);

  // 3. Build unique palette items
  const friendlyIndexToPaletteId = new Map();
  const palette = sortedFriendlyIndices.map((fIdx, pIdx) => {
    const fColor = FRIENDLY_COLOR_DICTIONARY[fIdx];
    const paletteId = pIdx + 1;
    friendlyIndexToPaletteId.set(fIdx, paletteId);

    return {
      id: paletteId,
      hex: fColor.hex,
      name: fColor.name
    };
  });

  // 4. Build grid matrix with pixel mapping
  const grid = [];
  let pIdx = 0;
  for (let y = 0; y < targetHeight; y++) {
    const row = [];
    for (let x = 0; x < targetWidth; x++) {
      const fIdx = pixelFriendlyIndices[pIdx];
      if (fIdx === -1) {
        row.push(0); // Transparent
      } else if (friendlyIndexToPaletteId.has(fIdx)) {
        row.push(friendlyIndexToPaletteId.get(fIdx));
      } else {
        // Fallback for pixels of truncated colors: match to closest color in selected palette
        const pixelRgb = [pixels[pIdx * 4], pixels[pIdx * 4 + 1], pixels[pIdx * 4 + 2]];
        const closestPaletteId = findNearestPaletteColorId(pixelRgb, palette);
        row.push(closestPaletteId);
      }
      pIdx++;
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

function findNearestFriendlyIndex(rgb) {
  let minDistance = Infinity;
  let nearestIdx = 0;

  for (let i = 0; i < FRIENDLY_COLOR_DICTIONARY.length; i++) {
    const fc = FRIENDLY_COLOR_DICTIONARY[i];
    const dist =
      0.3 * (rgb[0] - fc.rgb[0]) ** 2 +
      0.59 * (rgb[1] - fc.rgb[1]) ** 2 +
      0.11 * (rgb[2] - fc.rgb[2]) ** 2;

    if (dist < minDistance) {
      minDistance = dist;
      nearestIdx = i;
    }
  }

  return nearestIdx;
}

function findNearestPaletteColorId(rgb, palette) {
  let minDistance = Infinity;
  let bestId = 1;

  for (const pItem of palette) {
    const fc = FRIENDLY_COLOR_DICTIONARY.find(f => f.name === pItem.name) || FRIENDLY_COLOR_DICTIONARY[0];
    const dist =
      0.3 * (rgb[0] - fc.rgb[0]) ** 2 +
      0.59 * (rgb[1] - fc.rgb[1]) ** 2 +
      0.11 * (rgb[2] - fc.rgb[2]) ** 2;

    if (dist < minDistance) {
      minDistance = dist;
      bestId = pItem.id;
    }
  }

  return bestId;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
