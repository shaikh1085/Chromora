export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface OKLCH {
  l: number; // 0 to 1
  c: number; // 0 to 0.4+
  h: number; // 0 to 360
}

export interface ColorData {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  hsv: HSV;
  cmyk: CMYK;
  oklch: OKLCH;
  name: string;
  family: ColorFamily;
  luminance: number; // 0 to 1
  isDark: boolean;
}

export type ColorFamily =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'gray'
  | 'black'
  | 'white';

export interface ShadeStep {
  step: '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';
  hex: string;
  isDark: boolean;
}

export type PaletteType =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic'
  | 'warm'
  | 'cool'
  | 'pastel'
  | 'neon'
  | 'earthy'
  | 'luxury';

export interface PaletteColor {
  id: string;
  hex: string;
  name: string;
  isLocked: boolean;
  role?: 'primary' | 'secondary' | 'accent' | 'background' | 'surface' | 'text';
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
  type?: PaletteType;
  prompt?: string;
  isFavorite?: boolean;
}

export interface GradientStop {
  id: string;
  color: string;
  position: number; // 0 to 100
  isLocked?: boolean;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  angle: number; // 0 to 360 for linear
  shape?: 'circle' | 'ellipse';
  position?: string; // e.g. 'center', 'top left'
  stops: GradientStop[];
}

export interface ContrastResult {
  ratio: number;
  normalAA: boolean; // >= 4.5
  normalAAA: boolean; // >= 7.0
  largeAA: boolean; // >= 3.0
  largeAAA: boolean; // >= 4.5
  uiAA: boolean; // >= 3.0
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
}

export interface AIPromptPreset {
  id: string;
  prompt: string;
  palette: string[];
  name: string;
  description: string;
  tags: string[];
  category: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string[];
  robots?: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
  breadcrumbs?: { name: string; url: string }[];
  faqs?: FAQItem[];
  softwareApp?: {
    name: string;
    description: string;
    applicationCategory: string;
  };
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

export type WheelHarmonyMode =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic';

export interface WheelHarmonyColor {
  hex: string;
  angle: number; // 0 to 360 degrees
  role: string;
  offsetDeg: number;
  data: ColorData;
}
