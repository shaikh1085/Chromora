import { RGB, HSL, OKLCH } from '../types';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  clamp,
} from './colorUtils';

export type MixingMode = 'oklch' | 'rgb' | 'hsl' | 'subtractive';

/**
 * Blend two colors given a ratio (0 = 100% color1, 1 = 100% color2).
 */
export function blendColors(
  hex1: string,
  hex2: string,
  ratio: number,
  mode: MixingMode = 'oklch'
): string {
  const t = clamp(ratio, 0, 1);
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  switch (mode) {
    case 'oklch': {
      const oklch1 = rgbToOklch(rgb1);
      const oklch2 = rgbToOklch(rgb2);

      // Interpolate Lightness and Chroma linearly
      const l = oklch1.l * (1 - t) + oklch2.l * t;
      const c = oklch1.c * (1 - t) + oklch2.c * t;

      // Interpolate Hue shortest path
      let h1 = oklch1.h;
      let h2 = oklch2.h;
      let dh = h2 - h1;

      if (dh > 180) dh -= 360;
      else if (dh < -180) dh += 360;

      let h = h1 + dh * t;
      if (h < 0) h += 360;
      if (h >= 360) h -= 360;

      const resRgb = oklchToRgb({ l, c, h });
      return rgbToHex(resRgb);
    }

    case 'rgb': {
      // Linear sRGB interpolation
      const r = Math.round(Math.sqrt((1 - t) * (rgb1.r * rgb1.r) + t * (rgb2.r * rgb2.r)));
      const g = Math.round(Math.sqrt((1 - t) * (rgb1.g * rgb1.g) + t * (rgb2.g * rgb2.g)));
      const b = Math.round(Math.sqrt((1 - t) * (rgb1.b * rgb1.b) + t * (rgb2.b * rgb2.b)));
      return rgbToHex({
        r: clamp(r, 0, 255),
        g: clamp(g, 0, 255),
        b: clamp(b, 0, 255),
      });
    }

    case 'hsl': {
      const hsl1 = rgbToHsl(rgb1);
      const hsl2 = rgbToHsl(rgb2);

      let dh = hsl2.h - hsl1.h;
      if (dh > 180) dh -= 360;
      else if (dh < -180) dh += 360;

      let h = (hsl1.h + dh * t + 360) % 360;
      const s = hsl1.s * (1 - t) + hsl2.s * t;
      const l = hsl1.l * (1 - t) + hsl2.l * t;

      return rgbToHex(hslToRgb({ h, s, l }));
    }

    case 'subtractive': {
      // Subtractive / Physical Paint CMY Simulation (e.g. Yellow + Blue = Green)
      const c1 = 1 - rgb1.r / 255;
      const m1 = 1 - rgb1.g / 255;
      const y1 = 1 - rgb1.b / 255;

      const c2 = 1 - rgb2.r / 255;
      const m2 = 1 - rgb2.g / 255;
      const y2 = 1 - rgb2.b / 255;

      // Blend CMY pigment densities
      const c = c1 * (1 - t) + c2 * t;
      const m = m1 * (1 - t) + m2 * t;
      const y = y1 * (1 - t) + y2 * t;

      const r = Math.round((1 - c) * 255);
      const g = Math.round((1 - m) * 255);
      const b = Math.round((1 - y) * 255);

      return rgbToHex({
        r: clamp(r, 0, 255),
        g: clamp(g, 0, 255),
        b: clamp(b, 0, 255),
      });
    }
  }
}

/**
 * Generate N intermediate color steps between color 1 and color 2.
 */
export function generateIntermediateSteps(
  hex1: string,
  hex2: string,
  stepCount: number,
  mode: MixingMode = 'oklch'
): { hex: string; ratio: number; stepIndex: number }[] {
  const total = clamp(stepCount, 2, 20);
  const steps: { hex: string; ratio: number; stepIndex: number }[] = [];

  for (let i = 0; i <= total; i++) {
    const ratio = i / total;
    const hex = blendColors(hex1, hex2, ratio, mode);
    steps.push({
      hex,
      ratio: Math.round(ratio * 100),
      stepIndex: i,
    });
  }

  return steps;
}
