import {
  RGB,
  HSL,
  HSV,
  CMYK,
  OKLCH,
  ColorData,
  ColorFamily,
  ShadeStep,
  PaletteType,
  ContrastResult,
  WheelHarmonyMode,
  WheelHarmonyColor,
} from '../types';
import { COLOR_NAMES_DB } from '../data/colorNames';

// Standard CSS named color dictionary for parsing
const CSS_NAMED_COLORS: Record<string, string> = {
  black: '#000000',
  silver: '#c0c0c0',
  gray: '#808080',
  white: '#ffffff',
  maroon: '#800000',
  red: '#ff0000',
  purple: '#800080',
  fuchsia: '#ff00ff',
  green: '#008000',
  lime: '#00ff00',
  olive: '#808000',
  yellow: '#ffff00',
  navy: '#000080',
  blue: '#0000ff',
  teal: '#008080',
  aqua: '#00ffff',
  orange: '#ffa500',
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  blanchedalmond: '#ffebcd',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  oldlace: '#fdf5e6',
  olivedrab: '#6b8e23',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  rebeccapurple: '#663399',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  whitesmoke: '#f5f5f5',
  yellowgreen: '#9acd32',
};

// Clamp number between min and max
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// Convert HEX to RGB
export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  } else if (clean.length === 4) {
    clean = clean
      .slice(0, 3)
      .split('')
      .map((c) => c + c)
      .join('');
  } else if (clean.length === 8) {
    clean = clean.slice(0, 6);
  }

  if (clean.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }

  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Convert RGB to HEX
export function rgbToHex(rgb: RGB): string {
  const r = clamp(Math.round(rgb.r), 0, 255).toString(16).padStart(2, '0');
  const g = clamp(Math.round(rgb.g), 0, 255).toString(16).padStart(2, '0');
  const b = clamp(Math.round(rgb.b), 0, 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toLowerCase();
}

// Convert RGB to HSL
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert HSL to RGB
export function hslToRgb(hsl: HSL): RGB {
  const h = ((hsl.h % 360) + 360) % 360 / 360;
  const s = clamp(hsl.s, 0, 100) / 100;
  const l = clamp(hsl.l, 0, 100) / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let val = t;
    if (val < 0) val += 1;
    if (val > 1) val -= 1;
    if (val < 1 / 6) return p + (q - p) * 6 * val;
    if (val < 1 / 2) return q;
    if (val < 2 / 3) return p + (q - p) * (2 / 3 - val) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

// Convert RGB to HSV
export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

// Convert HSV to RGB
export function hsvToRgb(hsv: HSV): RGB {
  const h = ((hsv.h % 360) + 360) % 360;
  const s = clamp(hsv.s, 0, 100) / 100;
  const v = clamp(hsv.v, 0, 100) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// Convert RGB to CMYK
export function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

// Convert RGB to OKLCH (Accurate mathematical transform via linear sRGB and Oklab)
export function rgbToOklch(rgb: RGB): OKLCH {
  // sRGB gamma expansion to linear sRGB
  const srgbToLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const lr = srgbToLinear(rgb.r);
  const lg = srgbToLinear(rgb.g);
  const lb = srgbToLinear(rgb.b);

  // Linear sRGB to LMS
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // Non-linear cube root transfer
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // LMS to OKLab
  const oklab_L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const oklab_a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const oklab_b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // OKLab to OKLCH
  const chroma = Math.sqrt(oklab_a * oklab_a + oklab_b * oklab_b);
  let hue = (Math.atan2(oklab_b, oklab_a) * 180) / Math.PI;
  if (hue < 0) hue += 360;

  return {
    l: Number(oklab_L.toFixed(3)),
    c: Number(chroma.toFixed(3)),
    h: Number(hue.toFixed(1)),
  };
}

// Convert OKLCH to RGB
export function oklchToRgb(oklch: OKLCH): RGB {
  const hRad = (oklch.h * Math.PI) / 180;
  const a = oklch.c * Math.cos(hRad);
  const b = oklch.c * Math.sin(hRad);
  const L = oklch.l;

  // OKLab to LMS cube-roots
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS to linear sRGB
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // Linear to sRGB gamma
  const linearToSrgb = (c: number) => {
    const v = clamp(c, 0, 1);
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };

  return {
    r: Math.round(linearToSrgb(lr) * 255),
    g: Math.round(linearToSrgb(lg) * 255),
    b: Math.round(linearToSrgb(lb) * 255),
  };
}

// Parse any user string (HEX, RGB, HSL, HSV, OKLCH, CSS name) into canonical HEX
export function parseColorInput(input: string): string | null {
  if (!input) return null;
  const str = input.trim().toLowerCase();

  // Check CSS name
  if (CSS_NAMED_COLORS[str]) {
    return CSS_NAMED_COLORS[str];
  }

  // Check simple HEX (#fff, #123456, fff, 123456)
  const hexRegex = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
  if (hexRegex.test(str)) {
    const hexClean = str.startsWith('#') ? str : `#${str}`;
    const rgb = hexToRgb(hexClean);
    return rgbToHex(rgb);
  }

  // Check rgb/rgba (e.g. rgb(255, 100, 50) or 255 100 50)
  const rgbMatch = str.match(/rgba?\s*\(\s*(\d{1,3})[,\s]+(\d{1,3})[,\s]+(\d{1,3})/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r <= 255 && g <= 255 && b <= 255) {
      return rgbToHex({ r, g, b });
    }
  }

  // Check hsl/hsla (e.g. hsl(210, 50%, 40%) or hsl(210deg 50% 40%))
  const hslMatch = str.match(
    /hsla?\s*\(\s*(\d{1,3}(?:\.\d+)?)(?:deg)?[\s,]+(\d{1,3}(?:\.\d+)?)%?[\s,]+(\d{1,3}(?:\.\d+)?)%?/i
  );
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    const rgb = hslToRgb({ h, s, l });
    return rgbToHex(rgb);
  }

  // Check hsv/hsva / hsb (e.g. hsv(210, 80%, 90%) or hsb(210, 80%, 90%))
  const hsvMatch = str.match(
    /hs[vb]a?\s*\(\s*(\d{1,3}(?:\.\d+)?)(?:deg)?[\s,]+(\d{1,3}(?:\.\d+)?)%?[\s,]+(\d{1,3}(?:\.\d+)?)%?/i
  );
  if (hsvMatch) {
    const h = parseFloat(hsvMatch[1]);
    const s = parseFloat(hsvMatch[2]);
    const v = parseFloat(hsvMatch[3]);
    const rgb = hsvToRgb({ h, s, v });
    return rgbToHex(rgb);
  }

  // Check oklch (e.g. oklch(0.6 0.15 250) or oklch(60% 0.15 250))
  const oklchMatch = str.match(
    /oklch\s*\(\s*(\d{1,3}(?:\.\d+)?%?|\d+(?:\.\d+)?)\s+([\d.]+)\s+([\d.]+)/i
  );
  if (oklchMatch) {
    let l = parseFloat(oklchMatch[1]);
    if (oklchMatch[1].endsWith('%')) l = l / 100;
    const c = parseFloat(oklchMatch[2]);
    const h = parseFloat(oklchMatch[3]);
    const rgb = oklchToRgb({ l, c, h });
    return rgbToHex(rgb);
  }

  // Check cmyk (e.g. cmyk(0%, 80%, 60%, 10%) or cmyk(0, 80, 60, 10))
  const cmykMatch = str.match(
    /cmyk\s*\(\s*(\d{1,3}(?:\.\d+)?)%?[\s,]+(\d{1,3}(?:\.\d+)?)%?[\s,]+(\d{1,3}(?:\.\d+)?)%?[\s,]+(\d{1,3}(?:\.\d+)?)%?\s*\)/i
  );
  if (cmykMatch) {
    const c = parseFloat(cmykMatch[1]);
    const m = parseFloat(cmykMatch[2]);
    const y = parseFloat(cmykMatch[3]);
    const k = parseFloat(cmykMatch[4]);
    return cmykToHex({ c, m, y, k });
  }

  // Check raw numbers like "255, 0, 128"
  const rawRgbMatch = str.match(/^(\d{1,3})[,\s]+(\d{1,3})[,\s]+(\d{1,3})$/);
  if (rawRgbMatch) {
    const r = parseInt(rawRgbMatch[1], 10);
    const g = parseInt(rawRgbMatch[2], 10);
    const b = parseInt(rawRgbMatch[3], 10);
    if (r <= 255 && g <= 255 && b <= 255) {
      return rgbToHex({ r, g, b });
    }
  }

  // Search by nearest name in database
  const foundByName = COLOR_NAMES_DB.find(
    (item) => item.name.toLowerCase() === str
  );
  if (foundByName) {
    return foundByName.hex.toLowerCase();
  }

  return null;
}

// Parse any string into a parsed result or null
export function parseColorString(input: string): { hex: string } | null {
  const hex = parseColorInput(input);
  if (!hex) return null;
  return { hex };
}

// Convert HEX directly to HSL
export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

// Convert HSL directly to HEX
export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

// Convert HEX directly to CMYK
export function hexToCmyk(hex: string): CMYK {
  return rgbToCmyk(hexToRgb(hex));
}

// Convert HSL directly to CMYK
export function hslToCmyk(hsl: HSL): CMYK {
  return rgbToCmyk(hslToRgb(hsl));
}

// Convert CMYK directly to HSL
export function cmykToHsl(cmyk: CMYK): HSL {
  return rgbToHsl(cmykToRgb(cmyk));
}

// Convert CMYK directly to HEX
export function cmykToHex(cmyk: CMYK): string {
  return rgbToHex(cmykToRgb(cmyk));
}

// Convert HEX directly to OKLCH
export function hexToOklch(hex: string): OKLCH {
  return rgbToOklch(hexToRgb(hex));
}

// Convert OKLCH directly to HEX
export function oklchToHex(oklch: OKLCH): string {
  return rgbToHex(oklchToRgb(oklch));
}

// Find closest human-readable name from database using weighted Euclidean RGB distance
export function getNearestColorName(hex: string): { name: string; hex: string; distance: number } {
  const targetRgb = hexToRgb(hex);
  let minDistance = Infinity;
  let closest = { name: 'Custom Color', hex: hex, distance: 0 };

  for (const item of COLOR_NAMES_DB) {
    const itemRgb = hexToRgb(item.hex);
    // Weighted distance prioritizing human eye sensitivity (Red: 2, Green: 4, Blue: 3)
    const dr = targetRgb.r - itemRgb.r;
    const dg = targetRgb.g - itemRgb.g;
    const db = targetRgb.b - itemRgb.b;
    const dist = Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db);

    if (dist < minDistance) {
      minDistance = dist;
      closest = { name: item.name, hex: item.hex, distance: Math.round(dist) };
      if (dist === 0) break;
    }
  }

  return closest;
}

// Classify color into high-level visual family
export function getColorFamily(rgb: RGB, hsl: HSL): ColorFamily {
  const { s, l } = hsl;
  const h = hsl.h;

  if (l <= 12) return 'black';
  if (l >= 93 && s <= 15) return 'white';
  if (s <= 12) return 'gray';

  if (h >= 345 || h < 15) {
    return l < 40 && s > 30 ? 'red' : l > 75 ? 'pink' : 'red';
  }
  if (h >= 15 && h < 45) {
    return l < 45 && s < 70 ? 'brown' : 'orange';
  }
  if (h >= 45 && h < 70) return 'yellow';
  if (h >= 70 && h < 165) return 'green';
  if (h >= 165 && h < 260) return 'blue';
  if (h >= 260 && h < 315) return 'purple';
  if (h >= 315 && h < 345) return 'pink';

  return 'blue';
}

// WCAG 2.1 Relative Luminance (0 to 1)
export function getRelativeLuminance(rgb: RGB): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Calculate WCAG 2.1 Contrast Ratio between two colors
export function getContrastRatio(fgHex: string, bgHex: string): ContrastResult {
  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(bgHex);

  const l1 = getRelativeLuminance(fgRgb);
  const l2 = getRelativeLuminance(bgRgb);

  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (brighter + 0.05) / (darker + 0.05);
  const roundedRatio = Number(ratio.toFixed(2));

  const normalAA = roundedRatio >= 4.5;
  const normalAAA = roundedRatio >= 7.0;
  const largeAA = roundedRatio >= 3.0;
  const largeAAA = roundedRatio >= 4.5;
  const uiAA = roundedRatio >= 3.0;

  let level: 'AAA' | 'AA' | 'AA Large' | 'Fail' = 'Fail';
  if (normalAAA) level = 'AAA';
  else if (normalAA) level = 'AA';
  else if (largeAA) level = 'AA Large';

  return {
    ratio: roundedRatio,
    normalAA,
    normalAAA,
    largeAA,
    largeAAA,
    uiAA,
    level,
  };
}

// Find smart accessible alternative color (adjusts lightness towards pass target)
export function findAccessibleTextColor(bgHex: string, targetRatio = 4.5): string {
  const bgRgb = hexToRgb(bgHex);
  const bgLum = getRelativeLuminance(bgRgb);
  const bgHsl = rgbToHsl(bgRgb);

  // If background is dark, search lighter; if bright, search darker
  const searchLighter = bgLum < 0.5;

  if (searchLighter) {
    // Step upwards
    for (let l = Math.max(bgHsl.l + 20, 60); l <= 100; l += 2) {
      const candidateHex = rgbToHex(hslToRgb({ h: bgHsl.h, s: Math.max(0, bgHsl.s - 20), l }));
      const result = getContrastRatio(candidateHex, bgHex);
      if (result.ratio >= targetRatio) return candidateHex;
    }
    return '#ffffff';
  } else {
    // Step downwards
    for (let l = Math.min(bgHsl.l - 20, 40); l >= 0; l -= 2) {
      const candidateHex = rgbToHex(hslToRgb({ h: bgHsl.h, s: Math.max(0, bgHsl.s - 10), l }));
      const result = getContrastRatio(candidateHex, bgHex);
      if (result.ratio >= targetRatio) return candidateHex;
    }
    return '#09090b';
  }
}

// Determines whether black or white text gives better contrast on a given background
export function getBestTextColor(bgHex: string): {
  textColor: '#ffffff' | '#09090b';
  ratio: number;
  meetsWCAG: boolean;
} {
  const contrastWhite = getContrastRatio('#ffffff', bgHex);
  const contrastBlack = getContrastRatio('#09090b', bgHex);

  if (contrastWhite.ratio >= contrastBlack.ratio) {
    return {
      textColor: '#ffffff',
      ratio: contrastWhite.ratio,
      meetsWCAG: contrastWhite.ratio >= 4.5,
    };
  } else {
    return {
      textColor: '#09090b',
      ratio: contrastBlack.ratio,
      meetsWCAG: contrastBlack.ratio >= 4.5,
    };
  }
}

// Automatically creates an accessible button background & foreground pair
export function getAccessibleAccentButton(accentHex: string): {
  buttonBg: string;
  buttonTextColor: '#ffffff' | '#09090b';
  isAdjusted: boolean;
  tooltip?: string;
  contrastRatio: number;
} {
  const best = getBestTextColor(accentHex);
  if (best.meetsWCAG) {
    return {
      buttonBg: accentHex,
      buttonTextColor: best.textColor,
      isAdjusted: false,
      contrastRatio: best.ratio,
    };
  }

  // If the color alone does not meet 4.5:1 with white or black (e.g. #7f7f7f or pastel/neon edge),
  // compute an adjusted variant that preserves hue & saturation but shifts lightness to achieve >= 4.5:1
  const rgb = hexToRgb(accentHex);
  const hsl = rgbToHsl(rgb);
  const lum = getRelativeLuminance(rgb);

  let adjustedBg = accentHex;
  let adjustedTextColor: '#ffffff' | '#09090b' = lum < 0.5 ? '#ffffff' : '#09090b';

  if (lum < 0.5) {
    // Darken until white text reaches 4.5:1
    for (let l = Math.max(0, hsl.l - 5); l >= 0; l -= 2) {
      const testHex = rgbToHex(hslToRgb({ ...hsl, l }));
      const res = getContrastRatio('#ffffff', testHex);
      if (res.ratio >= 4.5) {
        adjustedBg = testHex;
        adjustedTextColor = '#ffffff';
        break;
      }
    }
  } else {
    // Lighten until black text reaches 4.5:1
    for (let l = Math.min(100, hsl.l + 5); l <= 100; l += 2) {
      const testHex = rgbToHex(hslToRgb({ ...hsl, l }));
      const res = getContrastRatio('#09090b', testHex);
      if (res.ratio >= 4.5) {
        adjustedBg = testHex;
        adjustedTextColor = '#09090b';
        break;
      }
    }
  }

  const finalRatio = getContrastRatio(adjustedTextColor, adjustedBg).ratio;

  return {
    buttonBg: adjustedBg,
    buttonTextColor: adjustedTextColor,
    isAdjusted: true,
    tooltip: 'Adjusted for readability',
    contrastRatio: finalRatio,
  };
}

// Generate comprehensive theme variables for Color Reactive UI
export function getThemeColorVariables(accentHex: string, isDark: boolean) {
  const cleanHex = accentHex.startsWith('#') ? accentHex : `#${accentHex}`;
  const rgb = hexToRgb(cleanHex);
  const hsl = rgbToHsl(rgb);
  const accessibleBtn = getAccessibleAccentButton(cleanHex);

  const lightVariant = rgbToHex(hslToRgb({ ...hsl, l: clamp(hsl.l + (isDark ? 20 : 15), 10, 95) }));
  const darkVariant = rgbToHex(hslToRgb({ ...hsl, l: clamp(hsl.l - (isDark ? 15 : 20), 5, 90) }));

  return {
    accent: cleanHex.toLowerCase(),
    accentRgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    accentLight: lightVariant.toLowerCase(),
    accentDark: darkVariant.toLowerCase(),
    accentSoft: isDark ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
    accentBorder: isDark ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.28)`,
    accentGlow: isDark ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.30)` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`,
    accentForeground: accessibleBtn.buttonTextColor,
    accentButtonBg: accessibleBtn.buttonBg,
    accentButtonText: accessibleBtn.buttonTextColor,
    isAdjusted: accessibleBtn.isAdjusted,
    tooltip: accessibleBtn.tooltip,
    contrastRatio: accessibleBtn.contrastRatio,
  };
}

// Full Color Data constructor
export function getColorData(hex: string): ColorData {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  const oklch = rgbToOklch(rgb);
  const { name } = getNearestColorName(hex);
  const family = getColorFamily(rgb, hsl);
  const luminance = getRelativeLuminance(rgb);
  const isDark = luminance < 0.35;

  return {
    hex: hex.toLowerCase(),
    rgb,
    hsl,
    hsv,
    cmyk,
    oklch,
    name,
    family,
    luminance: Number(luminance.toFixed(3)),
    isDark,
  };
}

// Tailwind 50-950 shade generator with smooth perceptual lightness curve
export function generateTailwindShades(hex: string): ShadeStep[] {
  const hsl = rgbToHsl(hexToRgb(hex));
  const baseHue = hsl.h;
  const baseSat = hsl.s;

  const targetLightnessMap: { step: ShadeStep['step']; l: number; satMultiplier: number }[] = [
    { step: '50', l: 96, satMultiplier: 0.35 },
    { step: '100', l: 91, satMultiplier: 0.5 },
    { step: '200', l: 82, satMultiplier: 0.7 },
    { step: '300', l: 72, satMultiplier: 0.85 },
    { step: '400', l: 60, satMultiplier: 0.95 },
    { step: '500', l: 48, satMultiplier: 1.0 },
    { step: '600', l: 39, satMultiplier: 1.0 },
    { step: '700', l: 31, satMultiplier: 0.95 },
    { step: '800', l: 22, satMultiplier: 0.9 },
    { step: '900', l: 14, satMultiplier: 0.85 },
    { step: '950', l: 8, satMultiplier: 0.8 },
  ];

  return targetLightnessMap.map(({ step, l, satMultiplier }) => {
    const adjustedSat = clamp(Math.round(baseSat * satMultiplier), 0, 100);
    const shadeHex = rgbToHex(hslToRgb({ h: baseHue, s: adjustedSat, l }));
    const shadeRgb = hexToRgb(shadeHex);
    const lum = getRelativeLuminance(shadeRgb);
    return {
      step,
      hex: shadeHex,
      isDark: lum < 0.35,
    };
  });
}

// Palette Harmony generator supporting 12 distinct types
export function generatePalette(
  baseHex: string,
  type: PaletteType = 'analogous',
  count = 5
): string[] {
  const hsl = rgbToHsl(hexToRgb(baseHex));
  const h = hsl.h;
  const s = hsl.s;
  const l = hsl.l;

  const colors: string[] = [];

  switch (type) {
    case 'monochromatic': {
      const minL = 15;
      const maxL = 88;
      const step = (maxL - minL) / (count - 1);
      for (let i = 0; i < count; i++) {
        const curL = Math.round(minL + i * step);
        const curS = clamp(Math.round(s * (0.6 + 0.4 * (1 - Math.abs(curL - 50) / 50))), 10, 100);
        colors.push(rgbToHex(hslToRgb({ h, s: curS, l: curL })));
      }
      break;
    }

    case 'analogous': {
      const angleStep = 30;
      const startAngle = h - Math.floor(count / 2) * angleStep;
      for (let i = 0; i < count; i++) {
        const curH = (startAngle + i * angleStep + 360) % 360;
        const curL = clamp(l + (i % 2 === 0 ? 5 : -5), 25, 80);
        colors.push(rgbToHex(hslToRgb({ h: curH, s: clamp(s, 30, 90), l: curL })));
      }
      break;
    }

    case 'complementary': {
      const compH = (h + 180) % 360;
      // Distribute variations of base and complement
      const half = Math.ceil(count / 2);
      for (let i = 0; i < half; i++) {
        const curL = clamp(l + (i - 1) * 15, 20, 85);
        colors.push(rgbToHex(hslToRgb({ h, s, l: curL })));
      }
      for (let i = 0; i < count - half; i++) {
        const curL = clamp(l + (i - 1) * 15, 25, 80);
        colors.push(rgbToHex(hslToRgb({ h: compH, s, l: curL })));
      }
      break;
    }

    case 'split-complementary': {
      const c1 = (h + 150) % 360;
      const c2 = (h + 210) % 360;
      const hues = [h, c1, c2, (h + 30) % 360, (h - 30 + 360) % 360];
      for (let i = 0; i < count; i++) {
        const curH = hues[i % hues.length];
        const curL = clamp(l + (i % 2 === 0 ? 6 : -6), 25, 80);
        colors.push(rgbToHex(hslToRgb({ h: curH, s: clamp(s, 40, 90), l: curL })));
      }
      break;
    }

    case 'triadic': {
      const h1 = h;
      const h2 = (h + 120) % 360;
      const h3 = (h + 240) % 360;
      const hues = [h1, h2, h3, (h1 + 20) % 360, (h2 + 20) % 360, (h3 + 20) % 360];
      for (let i = 0; i < count; i++) {
        const curH = hues[i % hues.length];
        const curL = clamp(l + (i % 3 === 0 ? 0 : i % 3 === 1 ? -10 : 10), 30, 75);
        colors.push(rgbToHex(hslToRgb({ h: curH, s: clamp(s, 45, 95), l: curL })));
      }
      break;
    }

    case 'tetradic': {
      const hues = [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360, (h + 45) % 360];
      for (let i = 0; i < count; i++) {
        const curH = hues[i % hues.length];
        const curL = clamp(l + (i % 2 === 0 ? 5 : -8), 28, 78);
        colors.push(rgbToHex(hslToRgb({ h: curH, s: clamp(s, 40, 90), l: curL })));
      }
      break;
    }

    case 'warm': {
      // Hues strictly in warm spectrum 0 - 65 and 330 - 360
      const warmHues = [12, 28, 42, 350, 55, 20, 340, 48];
      for (let i = 0; i < count; i++) {
        const curH = warmHues[i % warmHues.length];
        const curS = clamp(60 + (i * 7) % 35, 45, 95);
        const curL = clamp(35 + (i * 12) % 45, 25, 75);
        colors.push(rgbToHex(hslToRgb({ h: curH, s: curS, l: curL })));
      }
      break;
    }

    case 'cool': {
      // Hues in cool spectrum 160 - 270
      const coolHues = [185, 210, 235, 160, 255, 195, 220, 270];
      for (let i = 0; i < count; i++) {
        const curH = coolHues[i % coolHues.length];
        const curS = clamp(55 + (i * 8) % 40, 40, 90);
        const curL = clamp(30 + (i * 11) % 50, 25, 78);
        colors.push(rgbToHex(hslToRgb({ h: curH, s: curS, l: curL })));
      }
      break;
    }

    case 'pastel': {
      const step = 360 / count;
      for (let i = 0; i < count; i++) {
        const curH = (h + i * step) % 360;
        colors.push(rgbToHex(hslToRgb({ h: curH, s: clamp(s * 0.45, 25, 55), l: clamp(82 + (i % 3) * 3, 78, 92) })));
      }
      break;
    }

    case 'neon': {
      const step = 360 / count;
      for (let i = 0; i < count; i++) {
        const curH = (h + i * step) % 360;
        colors.push(rgbToHex(hslToRgb({ h: curH, s: 100, l: clamp(50 + (i % 2) * 5, 45, 58) })));
      }
      break;
    }

    case 'earthy': {
      // Warm muted tones (ochres, moss, clay, umber, sand)
      const earthTones = [
        { h: 32, s: 42, l: 36 },
        { h: 78, s: 32, l: 38 },
        { h: 18, s: 50, l: 44 },
        { h: 42, s: 45, l: 62 },
        { h: 145, s: 28, l: 30 },
        { h: 25, s: 38, l: 24 },
        { h: 88, s: 24, l: 48 },
      ];
      for (let i = 0; i < count; i++) {
        const item = earthTones[i % earthTones.length];
        colors.push(rgbToHex(hslToRgb(item)));
      }
      break;
    }

    case 'luxury': {
      // Deep obsidian, champagne gold, royal sapphire, platinum, emerald velvet
      const luxuryTones = [
        { h: 43, s: 65, l: 52 }, // Rich Gold
        { h: 215, s: 58, l: 18 }, // Deep Sapphire
        { h: 165, s: 60, l: 16 }, // Deep Emerald
        { h: 348, s: 55, l: 22 }, // Royal Burgundy
        { h: 40, s: 25, l: 85 }, // Champagne Pearl
        { h: 220, s: 15, l: 10 }, // Obsidian Slate
        { h: 35, s: 80, l: 62 }, // Bright Gold Accent
      ];
      for (let i = 0; i < count; i++) {
        const item = luxuryTones[i % luxuryTones.length];
        colors.push(rgbToHex(hslToRgb(item)));
      }
      break;
    }
  }

  // Ensure first color is close to base if not already
  if (colors.length > 0 && type !== 'earthy' && type !== 'luxury') {
    colors[0] = baseHex.toLowerCase();
  }

  return colors.slice(0, count);
}

export const generateHarmonicPalette = generatePalette;

// Generate random aesthetic hex color
export function getRandomColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 45) + 50; // 50-95%
  const l = Math.floor(Math.random() * 35) + 35; // 35-70%
  return rgbToHex(hslToRgb({ h, s, l }));
}

// Canvas-based dominant image color extraction via median-cut / quantization
export async function extractDominantColorsFromImage(
  imageSource: File | string,
  colorCount = 6
): Promise<{ hex: string; count: number; name: string }[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        // Scale down for fast client-side performance (max 150x150)
        const maxDim = 150;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h).data;

        // Bucket pixel colors (quantized to 5-bit depth per channel to group similar shades)
        const colorBuckets: Record<string, { r: number; g: number; b: number; count: number }> = {};

        for (let i = 0; i < imgData.length; i += 4) {
          const a = imgData[i + 3];
          if (a < 128) continue; // skip transparent pixels

          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];

          // 5-bit quantization key (0-31)
          const qr = Math.floor(r / 16);
          const qg = Math.floor(g / 16);
          const qb = Math.floor(b / 16);
          const key = `${qr},${qg},${qb}`;

          if (!colorBuckets[key]) {
            colorBuckets[key] = { r, g, b, count: 1 };
          } else {
            colorBuckets[key].r += r;
            colorBuckets[key].g += g;
            colorBuckets[key].b += b;
            colorBuckets[key].count++;
          }
        }

        // Sort by pixel count descending
        const sortedBuckets = Object.values(colorBuckets).sort((a, b) => b.count - a.count);

        // Filter for distinct colors (avoid near duplicates in output)
        const distinctColors: { hex: string; count: number; name: string }[] = [];

        for (const bucket of sortedBuckets) {
          const avgR = Math.round(bucket.r / bucket.count);
          const avgG = Math.round(bucket.g / bucket.count);
          const avgB = Math.round(bucket.b / bucket.count);
          const hex = rgbToHex({ r: avgR, g: avgG, b: avgB });

          // Check distance from existing picked colors
          const isTooClose = distinctColors.some((existing) => {
            const exRgb = hexToRgb(existing.hex);
            const dr = avgR - exRgb.r;
            const dg = avgG - exRgb.g;
            const db = avgB - exRgb.b;
            const dist = Math.sqrt(dr * dr + dg * dg + db * db);
            return dist < 35; // Euclidean threshold
          });

          if (!isTooClose) {
            const { name } = getNearestColorName(hex);
            distinctColors.push({ hex, count: bucket.count, name });
          }

          if (distinctColors.length >= colorCount) break;
        }

        resolve(distinctColors);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for color extraction'));
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageSource);
    }
  });
}

// Alias for image extraction
export const extractDominantColors = extractDominantColorsFromImage;

// CMYK to RGB
export function cmykToRgb(cmyk: CMYK): RGB {
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;

  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));

  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
  };
}

// Slugs for SEO URL routing
export function hexToSlug(name: string, hex: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const cleanHex = hex.replace('#', '').toLowerCase();
  return `${cleanName}-${cleanHex}`;
}

export function parseSlugToHex(slug: string): string {
  if (!slug) return '#0b4f6c';

  const cleanSlug = slug.toLowerCase().trim();

  // 1. Direct hex match (e.g. "6366f1" or "#6366f1")
  const directHex = cleanSlug.replace('#', '');
  if (/^[0-9a-fA-F]{6}$/.test(directHex) || /^[0-9a-fA-F]{3}$/.test(directHex)) {
    return `#${directHex.toLowerCase()}`;
  }

  // 2. Trailing hex in slug (e.g. "navy-blue-000080" or "deep-ocean-blue-0b4f6c")
  const parts = cleanSlug.split('-');
  const lastPart = parts[parts.length - 1];
  if (/^[0-9a-fA-F]{6}$/.test(lastPart) || /^[0-9a-fA-F]{3}$/.test(lastPart)) {
    return `#${lastPart.toLowerCase()}`;
  }

  // 3. CSS Named color match without dashes (e.g. "royalblue", "navy", "coral", "forestgreen")
  const noDash = cleanSlug.replace(/-/g, '');
  if (CSS_NAMED_COLORS[noDash]) {
    return CSS_NAMED_COLORS[noDash];
  }

  // 4. Match in COLOR_NAMES_DB by slugified color name
  const found = COLOR_NAMES_DB.find((item) => {
    const itemSlug = item.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    return itemSlug === cleanSlug;
  });

  if (found) {
    return found.hex;
  }

  // 5. Partial/Fuzzy lookup in COLOR_NAMES_DB
  const partial = COLOR_NAMES_DB.find((item) =>
    cleanSlug.split('-').every((word) => item.name.toLowerCase().includes(word))
  );

  if (partial) {
    return partial.hex;
  }

  return '#0b4f6c'; // Safe fallback default
}

// Suggest accessible color variants for contrast
export function suggestAccessibleColors(baseHex: string, targetRole: 'text' | 'bg' = 'text'): string[] {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb);
  const suggestions: string[] = [];

  if (targetRole === 'text') {
    // For text, generate dark & bright high contrast variations
    suggestions.push(rgbToHex(hslToRgb({ ...hsl, l: 15 }))); // Deep shade
    suggestions.push(rgbToHex(hslToRgb({ ...hsl, l: 25 }))); // Dark shade
    suggestions.push(rgbToHex(hslToRgb({ ...hsl, l: 85 }))); // Very light
    suggestions.push(rgbToHex(hslToRgb({ ...hsl, l: 95 }))); // Ultra light
  } else {
    // For background
    suggestions.push(rgbToHex(hslToRgb({ ...hsl, l: 97, s: Math.min(hsl.s, 40) }))); // Tinted light bg
    suggestions.push(rgbToHex(hslToRgb({ ...hsl, l: 8, s: Math.min(hsl.s, 30) })));  // Dark surface
  }

  return suggestions;
}

// Auto-adjust color to meet target WCAG contrast ratio against a background
export function findCompliantColor(fgHex: string, bgHex: string, minRatio: number = 4.5): string {
  const fgRgb = hexToRgb(fgHex);
  const hsl = rgbToHsl(fgRgb);
  const isBgDark = getColorData(bgHex).isDark;

  // Search by adjusting lightness in direction of contrast
  const step = isBgDark ? 2 : -2;
  let currentL = hsl.l;

  for (let i = 0; i < 45; i++) {
    currentL += step;
    if (currentL < 2 || currentL > 98) break;
    const testHex = rgbToHex(hslToRgb({ ...hsl, l: currentL }));
    const ratio = getContrastRatio(testHex, bgHex).ratio;
    if (ratio >= minRatio) {
      return testHex;
    }
  }

  // Fallback to pure black or pure white
  return isBgDark ? '#ffffff' : '#000000';
}

export type ColorBlindMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'grayscale';

// Mathematically simulate color vision deficiencies
export function simulateColorBlindness(hex: string, mode: ColorBlindMode): string {
  if (mode === 'normal') return hex;
  const rgb = hexToRgb(hex);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  let sr = r;
  let sg = g;
  let sb = b;

  switch (mode) {
    case 'protanopia': // Red-blind (L-cone)
      sr = 0.56667 * r + 0.43333 * g + 0.0 * b;
      sg = 0.55833 * r + 0.44167 * g + 0.0 * b;
      sb = 0.0 * r + 0.24167 * g + 0.75833 * b;
      break;

    case 'deuteranopia': // Green-blind (M-cone)
      sr = 0.625 * r + 0.375 * g + 0.0 * b;
      sg = 0.70 * r + 0.30 * g + 0.0 * b;
      sb = 0.0 * r + 0.30 * g + 0.70 * b;
      break;

    case 'tritanopia': // Blue-blind (S-cone)
      sr = 0.95 * r + 0.05 * g + 0.0 * b;
      sg = 0.0 * r + 0.43333 * g + 0.56667 * b;
      sb = 0.0 * r + 0.475 * g + 0.525 * b;
      break;

    case 'grayscale': // Achromatopsia
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      sr = gray;
      sg = gray;
      sb = gray;
      break;
  }

  const outR = clamp(Math.round(sr * 255), 0, 255);
  const outG = clamp(Math.round(sg * 255), 0, 255);
  const outB = clamp(Math.round(sb * 255), 0, 255);

  return rgbToHex({ r: outR, g: outG, b: outB });
}

// Calculate exact wheel harmonies with angle and metadata for Color Wheel tool
export function getColorWheelHarmonies(
  baseHex: string,
  mode: WheelHarmonyMode,
  options?: { analogousSpread?: number }
): WheelHarmonyColor[] {
  const cleanHex = baseHex.startsWith('#') ? baseHex : `#${baseHex}`;
  const baseRgb = hexToRgb(cleanHex);
  const baseHsl = rgbToHsl(baseRgb);
  const { h, s, l } = baseHsl;

  const spread = options?.analogousSpread ?? 30;
  const list: { angle: number; role: string; offsetDeg: number; sOverride?: number; lOverride?: number }[] = [];

  switch (mode) {
    case 'complementary':
      list.push({ angle: h, role: 'Base Color', offsetDeg: 0 });
      list.push({ angle: (h + 180) % 360, role: 'Complementary', offsetDeg: 180 });
      break;

    case 'analogous':
      list.push({ angle: (h - spread + 360) % 360, role: `Analogous (-${spread}°)`, offsetDeg: -spread });
      list.push({ angle: h, role: 'Base Color', offsetDeg: 0 });
      list.push({ angle: (h + spread) % 360, role: `Analogous (+${spread}°)`, offsetDeg: spread });
      break;

    case 'triadic':
      list.push({ angle: h, role: 'Base Color', offsetDeg: 0 });
      list.push({ angle: (h + 120) % 360, role: 'Triadic (+120°)', offsetDeg: 120 });
      list.push({ angle: (h + 240) % 360, role: 'Triadic (+240°)', offsetDeg: 240 });
      break;

    case 'split-complementary':
      list.push({ angle: h, role: 'Base Color', offsetDeg: 0 });
      list.push({ angle: (h + 150) % 360, role: 'Split Complement 1 (+150°)', offsetDeg: 150 });
      list.push({ angle: (h + 210) % 360, role: 'Split Complement 2 (+210°)', offsetDeg: 210 });
      break;

    case 'tetradic':
      list.push({ angle: h, role: 'Base Color', offsetDeg: 0 });
      list.push({ angle: (h + 90) % 360, role: 'Square (+90°)', offsetDeg: 90 });
      list.push({ angle: (h + 180) % 360, role: 'Opposite (+180°)', offsetDeg: 180 });
      list.push({ angle: (h + 270) % 360, role: 'Square (+270°)', offsetDeg: 270 });
      break;

    case 'monochromatic':
      list.push({
        angle: h,
        role: 'Deep Shade',
        offsetDeg: 0,
        lOverride: clamp(l - 24, 15, 85),
      });
      list.push({
        angle: h,
        role: 'Base Color',
        offsetDeg: 0,
      });
      list.push({
        angle: h,
        role: 'Soft Tint',
        offsetDeg: 0,
        lOverride: clamp(l + 24, 20, 92),
      });
      list.push({
        angle: h,
        role: 'Muted Tone',
        offsetDeg: 0,
        sOverride: clamp(s - 35, 15, 100),
      });
      break;
  }

  return list.map((item) => {
    const itemSat = item.sOverride !== undefined ? item.sOverride : s;
    const itemLit = item.lOverride !== undefined ? item.lOverride : l;
    const hex = rgbToHex(hslToRgb({ h: item.angle, s: itemSat, l: itemLit }));
    const data = getColorData(hex);
    return {
      hex,
      angle: item.angle,
      role: item.role,
      offsetDeg: item.offsetDeg,
      data,
    };
  });
}
