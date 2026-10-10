// Fully Customizable Math Generation Engine for PixelMath

export const DEFAULT_MATH_CONFIG = {
  operators: ['+', '-'], // '+' | '-' | '×' | '÷'
  minTarget: 1,
  maxTarget: 20,
  equationsCount: 1, // Exactly 1 math problem per color
  targetAssignment: 'sequential'
};

export const MATH_PRESETS = [
  {
    id: 'prek',
    name: 'Preescolar (Sumas 1 a 5)',
    config: { operators: ['+'], minTarget: 1, maxTarget: 5, equationsCount: 1, targetAssignment: 'sequential' }
  },
  {
    id: 'grade1',
    name: '1º Grado (Sumas y Restas 1 a 20)',
    config: { operators: ['+', '-'], minTarget: 1, maxTarget: 20, equationsCount: 1, targetAssignment: 'sequential' }
  },
  {
    id: 'grade2',
    name: '2º Grado (Sumas y Restas 1 a 50)',
    config: { operators: ['+', '-'], minTarget: 5, maxTarget: 50, equationsCount: 1, targetAssignment: 'sequential' }
  },
  {
    id: 'grade3',
    name: '3º Grado (Tablas de Multiplicar)',
    config: { operators: ['×'], minTarget: 4, maxTarget: 50, equationsCount: 1, targetAssignment: 'sequential' }
  },
  {
    id: 'grade4',
    name: '4º Grado (Divisiones y Operaciones Mixtas)',
    config: { operators: ['+', '-', '×', '÷'], minTarget: 2, maxTarget: 60, equationsCount: 1, targetAssignment: 'sequential' }
  }
];

/**
 * Checks if a color represents White (should not be colored on paper)
 */
export function isWhiteColor(colorItem) {
  if (!colorItem) return true;
  const hex = (colorItem.hex || '').toLowerCase().trim();
  const name = (colorItem.name || '').toLowerCase().trim();
  return hex === '#ffffff' || hex === '#fff' || name === 'blanco' || name.startsWith('blanco');
}

/**
 * Generates custom math operations for each color in the palette based on user configuration.
 * Automatically excludes White color because paper is already white.
 */
export function generateMathForPalette(palette, config = DEFAULT_MATH_CONFIG) {
  const {
    operators = ['+'],
    minTarget = 1,
    maxTarget = 20,
    equationsCount = 1,
    targetAssignment = 'sequential'
  } = config;

  const activeOperators = operators.length > 0 ? operators : ['+'];

  // Filter out White / Background colors from the math exercises list
  const activePalette = (palette || []).filter(item => !isWhiteColor(item));

  return activePalette.map((colorItem, index) => {
    let targetValue;

    if (targetAssignment === 'sequential') {
      targetValue = minTarget + index;
    } else {
      const step = Math.max(1, Math.floor((maxTarget - minTarget) / Math.max(1, activePalette.length - 1)));
      targetValue = minTarget + index * step;
    }

    // Generate N equations for this target number using selected operators
    const equations = generateCustomEquations(targetValue, activeOperators, minTarget, maxTarget, equationsCount);

    return {
      ...colorItem,
      targetValue,
      equation: equations[0] || `${targetValue} + 0`, // Single primary equation
      equations
    };
  });
}

function generateCustomEquations(target, allowedOperators, minVal, maxVal, count) {
  const equations = new Set();
  let maxAttempts = 50;

  while (equations.size < count && maxAttempts > 0) {
    maxAttempts--;

    const op = allowedOperators[Math.floor(Math.random() * allowedOperators.length)];

    if (op === '+') {
      const a = Math.floor(Math.random() * Math.max(1, target));
      const b = target - a;
      if (a >= 0 && b >= 0) {
        equations.add(`${a} + ${b}`);
      }
    } else if (op === '-') {
      const extra = Math.floor(Math.random() * 15) + 1;
      const a = target + extra;
      const b = extra;
      equations.add(`${a} - ${b}`);
    } else if (op === '×') {
      const factors = [];
      for (let i = 1; i <= Math.min(12, target); i++) {
        if (target % i === 0) {
          factors.push([i, target / i]);
        }
      }
      if (factors.length > 0) {
        const [f1, f2] = factors[Math.floor(Math.random() * factors.length)];
        equations.add(`${f1} × ${f2}`);
      } else {
        equations.add(`${target} × 1`);
      }
    } else if (op === '÷') {
      const divisor = Math.floor(Math.random() * 8) + 2;
      const dividend = target * divisor;
      equations.add(`${dividend} ÷ ${divisor}`);
    }
  }

  while (equations.size < count) {
    equations.add(`${target} + 0`);
  }

  return Array.from(equations).slice(0, count);
}
