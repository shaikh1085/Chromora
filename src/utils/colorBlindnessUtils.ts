import { hexToRgb, rgbToHex, clamp } from './colorUtils';

export type VisionDeficiency =
  | 'normal'
  | 'protanopia'
  | 'protanomaly'
  | 'deuteranopia'
  | 'deuteranomaly'
  | 'tritanopia'
  | 'tritanomaly'
  | 'achromatopsia';

export interface DeficiencyInfo {
  id: VisionDeficiency;
  name: string;
  type: string;
  populationRate: string;
  affectedCone: string;
  description: string;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Total';
}

export const DEFICIENCY_INFO_LIST: DeficiencyInfo[] = [
  {
    id: 'normal',
    name: 'Normal Vision',
    type: 'Trichromacy',
    populationRate: '~92% worldwide',
    affectedCone: 'All 3 functional (L, M, S)',
    description: 'Standard color vision with full perception of red, green, and blue wavelengths.',
    severity: 'None',
  },
  {
    id: 'deuteranopia',
    name: 'Deuteranopia',
    type: 'Dichromacy',
    populationRate: '~1.2% males, 0.01% females',
    affectedCone: 'Green (M-cone absent)',
    description: 'Complete green blindness. Confusion between red, yellow, and green tones.',
    severity: 'Severe',
  },
  {
    id: 'deuteranomaly',
    name: 'Deuteranomaly',
    type: 'Anomalous Trichromacy',
    populationRate: '~5.0% males, 0.4% females',
    affectedCone: 'Green (M-cone shifted)',
    description: 'Green-weakness, the most common form of color vision deficiency.',
    severity: 'Moderate',
  },
  {
    id: 'protanopia',
    name: 'Protanopia',
    type: 'Dichromacy',
    populationRate: '~1.0% males, 0.02% females',
    affectedCone: 'Red (L-cone absent)',
    description: 'Complete red blindness. Red colors appear significantly darker or black.',
    severity: 'Severe',
  },
  {
    id: 'protanomaly',
    name: 'Protanomaly',
    type: 'Anomalous Trichromacy',
    populationRate: '~1.0% males, 0.03% females',
    affectedCone: 'Red (L-cone shifted)',
    description: 'Red-weakness. Reds appear less vivid and can be confused with greens and browns.',
    severity: 'Mild',
  },
  {
    id: 'tritanopia',
    name: 'Tritanopia',
    type: 'Dichromacy',
    populationRate: '~0.003% of population',
    affectedCone: 'Blue (S-cone absent)',
    description: 'Complete blue-yellow blindness. Blues look greenish and yellows look violet or light grey.',
    severity: 'Severe',
  },
  {
    id: 'tritanomaly',
    name: 'Tritanomaly',
    type: 'Anomalous Trichromacy',
    populationRate: '~0.01% of population',
    affectedCone: 'Blue (S-cone shifted)',
    description: 'Blue-weakness. Reduced sensitivity to short blue wavelengths.',
    severity: 'Mild',
  },
  {
    id: 'achromatopsia',
    name: 'Achromatopsia',
    type: 'Monochromacy',
    populationRate: '~0.003% (1 in 30,000)',
    affectedCone: 'All cones non-functional',
    description: 'Total color blindness. Perception relies entirely on rods (greyscale brightness values).',
    severity: 'Total',
  },
];

// 3x3 Linear Transformation Matrices
const SIMULATION_MATRICES: Record<VisionDeficiency, [number, number, number, number, number, number, number, number, number]> = {
  normal: [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ],
  protanopia: [
    0.56667, 0.43333, 0.0,
    0.55833, 0.44167, 0.0,
    0.0, 0.24167, 0.75833,
  ],
  protanomaly: [
    0.81667, 0.18333, 0.0,
    0.33333, 0.66667, 0.0,
    0.0, 0.125, 0.875,
  ],
  deuteranopia: [
    0.625, 0.375, 0.0,
    0.70, 0.30, 0.0,
    0.0, 0.30, 0.70,
  ],
  deuteranomaly: [
    0.80, 0.20, 0.0,
    0.25833, 0.74167, 0.0,
    0.0, 0.14167, 0.85833,
  ],
  tritanopia: [
    0.95, 0.05, 0.0,
    0.0, 0.43333, 0.56667,
    0.0, 0.475, 0.525,
  ],
  tritanomaly: [
    0.96667, 0.03333, 0.0,
    0.0, 0.73333, 0.26667,
    0.0, 0.18333, 0.81667,
  ],
  achromatopsia: [
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
  ],
};

/**
 * Simulate single HEX color under selected vision deficiency.
 */
export function simulateDeficiency(hex: string, deficiency: VisionDeficiency): string {
  if (deficiency === 'normal') return hex;
  const rgb = hexToRgb(hex);
  const m = SIMULATION_MATRICES[deficiency];

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const sr = m[0] * r + m[1] * g + m[2] * b;
  const sg = m[3] * r + m[4] * g + m[5] * b;
  const sb = m[6] * r + m[7] * g + m[8] * b;

  const outR = clamp(Math.round(sr * 255), 0, 255);
  const outG = clamp(Math.round(sg * 255), 0, 255);
  const outB = clamp(Math.round(sb * 255), 0, 255);

  return rgbToHex({ r: outR, g: outG, b: outB });
}

/**
 * Apply real-time color blindness filter directly onto an HTML Canvas ImageData.
 */
export function applyCanvasDeficiencyFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  deficiency: VisionDeficiency
): void {
  if (deficiency === 'normal') return;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const m = SIMULATION_MATRICES[deficiency];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    const sr = m[0] * r + m[1] * g + m[2] * b;
    const sg = m[3] * r + m[4] * g + m[5] * b;
    const sb = m[6] * r + m[7] * g + m[8] * b;

    data[i] = clamp(Math.round(sr * 255), 0, 255);
    data[i + 1] = clamp(Math.round(sg * 255), 0, 255);
    data[i + 2] = clamp(Math.round(sb * 255), 0, 255);
  }

  ctx.putImageData(imgData, 0, 0);
}
