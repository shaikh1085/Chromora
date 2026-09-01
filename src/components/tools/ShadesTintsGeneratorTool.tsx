import React, { useState, useMemo } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import {
  getColorData,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  getContrastRatio,
  clamp,
} from '../../utils/colorUtils';
import {
  Copy,
  Check,
  Sparkles,
  Sliders,
  Code,
  Download,
  Shuffle,
  Layers,
  ArrowRight,
  Info,
  Palette,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { FAQItem, SEOConfig } from '../../types';
import { RecentColorsBar } from '../common/RecentColorsBar';

interface ShadeTintStep {
  step: number; // 50, 100, 200, ..., 900, 950
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
  isBase?: boolean;
  contrastOnWhite: number;
  contrastOnBlack: number;
  isDark: boolean;
}

const PRESET_COLORS = [
  { name: 'Indigo Brand', hex: '#6366f1' },
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Emerald Mint', hex: '#10b981' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Rose Red', hex: '#f43f5e' },
  { name: 'Violet Glow', hex: '#8b5cf6' },
  { name: 'Teal Cyan', hex: '#0d9488' },
  { name: 'Slate Neutral', hex: '#64748b' },
];

export const ShadesTintsGeneratorTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { copyToClipboard, showToast, activeHex: globalActiveHex, setActiveHex, addRecentColor } = usePalette();
  const { t } = useI18n();

  const [inputHex, setInputHex] = useState(globalActiveHex || '#6366f1');
  const [scaleAlgorithm, setScaleAlgorithm] = useState<'oklch' | 'hsl' | 'tint-shade'>('oklch');
  const [stepDistribution, setStepDistribution] = useState<'tailwind' | 'uniform' | 'material'>('tailwind');
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  // Validate hex
  const activeHex = useMemo(() => {
    let clean = inputHex.trim();
    if (!clean.startsWith('#')) clean = `#${clean}`;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(clean)) {
      if (clean.length === 4) {
        clean = `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
      }
      return clean.toLowerCase();
    }
    return '#6366f1';
  }, [inputHex]);

  const colorData = useMemo(() => getColorData(activeHex), [activeHex]);

  // Compute 11-step scale (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
  const stepsData = useMemo<ShadeTintStep[]>(() => {
    const rgb = hexToRgb(activeHex);
    const hsl = rgbToHsl(rgb);
    const oklch = rgbToOklch(rgb);

    const stepWeights =
      stepDistribution === 'tailwind'
        ? [
            { step: 50, factor: 0.95 },
            { step: 100, factor: 0.9 },
            { step: 200, factor: 0.8 },
            { step: 300, factor: 0.7 },
            { step: 400, factor: 0.6 },
            { step: 500, factor: 0.5, isBase: true },
            { step: 600, factor: 0.4 },
            { step: 700, factor: 0.3 },
            { step: 800, factor: 0.2 },
            { step: 900, factor: 0.12 },
            { step: 950, factor: 0.06 },
          ]
        : stepDistribution === 'material'
        ? [
            { step: 50, factor: 0.96 },
            { step: 100, factor: 0.88 },
            { step: 200, factor: 0.78 },
            { step: 300, factor: 0.68 },
            { step: 400, factor: 0.58 },
            { step: 500, factor: 0.5, isBase: true },
            { step: 600, factor: 0.42 },
            { step: 700, factor: 0.32 },
            { step: 800, factor: 0.22 },
            { step: 900, factor: 0.14 },
            { step: 950, factor: 0.08 },
          ]
        : [
            { step: 50, factor: 0.92 },
            { step: 100, factor: 0.84 },
            { step: 200, factor: 0.76 },
            { step: 300, factor: 0.68 },
            { step: 400, factor: 0.6 },
            { step: 500, factor: 0.5, isBase: true },
            { step: 600, factor: 0.4 },
            { step: 700, factor: 0.3 },
            { step: 800, factor: 0.2 },
            { step: 900, factor: 0.1 },
            { step: 950, factor: 0.05 },
          ];

    return stepWeights.map(({ step, factor, isBase }) => {
      let stepHex = activeHex;

      if (scaleAlgorithm === 'oklch') {
        // OKLCH Perceptual Scale
        let targetL = factor;
        let targetC = oklch.c;

        // Taper chroma near white and black to avoid gamut clipping
        if (targetL > 0.85) {
          targetC *= (1 - targetL) / 0.15;
        } else if (targetL < 0.2) {
          targetC *= targetL / 0.2;
        }

        const stepRgb = oklchToRgb({
          l: targetL,
          c: clamp(targetC, 0, 0.37),
          h: oklch.h,
        });
        stepHex = rgbToHex(stepRgb);
      } else if (scaleAlgorithm === 'hsl') {
        // HSL Lightness Model
        const targetL = factor * 100;
        const targetS = hsl.s * (factor > 0.85 ? 0.7 : factor < 0.2 ? 0.8 : 1);
        stepHex = rgbToHex(hslToRgb({ h: hsl.h, s: targetS, l: targetL }));
      } else {
        // Pure Tint (mix with white) / Shade (mix with black)
        if (factor >= 0.5) {
          // Tint (mix with white)
          const tintRatio = (factor - 0.5) * 2; // 0 to 1
          const r = Math.round(rgb.r + (255 - rgb.r) * tintRatio);
          const g = Math.round(rgb.g + (255 - rgb.g) * tintRatio);
          const b = Math.round(rgb.b + (255 - rgb.b) * tintRatio);
          stepHex = rgbToHex({ r: clamp(r, 0, 255), g: clamp(g, 0, 255), b: clamp(b, 0, 255) });
        } else {
          // Shade (mix with black)
          const shadeRatio = factor / 0.5; // 0 to 1
          const r = Math.round(rgb.r * shadeRatio);
          const g = Math.round(rgb.g * shadeRatio);
          const b = Math.round(rgb.b * shadeRatio);
          stepHex = rgbToHex({ r: clamp(r, 0, 255), g: clamp(g, 0, 255), b: clamp(b, 0, 255) });
        }
      }

      const stepRgbObj = hexToRgb(stepHex);
      const stepHslObj = rgbToHsl(stepRgbObj);
      const stepOklchObj = rgbToOklch(stepRgbObj);

      const contrastWhite = getContrastRatio(stepHex, '#ffffff').ratio;
      const contrastBlack = getContrastRatio(stepHex, '#000000').ratio;

      return {
        step,
        name: `${colorData.name} ${step}`,
        hex: stepHex,
        rgb: `rgb(${stepRgbObj.r}, ${stepRgbObj.g}, ${stepRgbObj.b})`,
        hsl: `hsl(${Math.round(stepHslObj.h)}, ${Math.round(stepHslObj.s)}%, ${Math.round(stepHslObj.l)}%)`,
        oklch: `oklch(${stepOklchObj.l.toFixed(2)} ${stepOklchObj.c.toFixed(3)} ${Math.round(stepOklchObj.h)})`,
        isBase: isBase || false,
        contrastOnWhite: contrastWhite,
        contrastOnBlack: contrastBlack,
        isDark: contrastWhite > contrastBlack,
      };
    });
  }, [activeHex, colorData.name, scaleAlgorithm, stepDistribution]);

  const handleCopyStep = (step: ShadeTintStep) => {
    copyToClipboard(step.hex);
    setCopiedStep(step.step);
    showToast(`Copied ${step.step}: ${step.hex.toUpperCase()}`, 'success');
    setTimeout(() => setCopiedStep(null), 1500);
  };

  const copyAsTailwindConfig = () => {
    const colorKey = colorData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const obj: Record<string, string> = {};
    stepsData.forEach((s) => {
      obj[s.step.toString()] = s.hex;
    });

    const snippet = `// Tailwind CSS Color Scale Config
module.exports = {
  theme: {
    extend: {
      colors: {
        '${colorKey}': ${JSON.stringify(obj, null, 2)}
      }
    }
  }
};`;
    copyToClipboard(snippet);
    showToast('Copied Tailwind CSS Config', 'success');
  };

  const copyAsCssVariables = () => {
    const colorKey = colorData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const lines = stepsData.map((s) => `  --color-${colorKey}-${s.step}: ${s.hex};`);
    const snippet = `:root {\n${lines.join('\n')}\n}`;
    copyToClipboard(snippet);
    showToast('Copied CSS Variables', 'success');
  };

  const copyAsJson = () => {
    const json = JSON.stringify(
      stepsData.reduce((acc, curr) => ({ ...acc, [curr.step]: curr.hex }), {}),
      null,
      2
    );
    copyToClipboard(json);
    showToast('Copied JSON Color Map', 'success');
  };

  const shadesFaqs: FAQItem[] = [
    {
      question: 'What is the difference between color shades, tints, and tones?',
      answer:
        'A tint is created by adding pure white to a base hue, increasing lightness (e.g. steps 50 to 400). A shade is created by adding pure black to a base hue, decreasing lightness and brightness (e.g. steps 600 to 950). A tone is produced by mixing grey with a color, reducing its chromatic intensity without necessarily shifting pure lightness.',
    },
    {
      question: 'Why does the Tailwind CSS 50–900 scale use non-linear lightness curves?',
      answer:
        'Tailwind CSS and Material Design use perceptually balanced curves rather than rigid linear math. The human eye has non-linear sensitivity to lightness differences, especially in yellow and cyan versus blue. Using perceptual color spaces like OKLCH preserves chroma and avoids muddy or washed-out intermediary shades.',
    },
    {
      question: 'What is the benefit of using OKLCH for generating shades and tints?',
      answer:
        'OKLCH (Oklab Lightness Chroma Hue) is a perceptually uniform color model standardized in CSS Color Module Level 4. Unlike RGB or HSL, adjusting lightness in OKLCH does not cause unintended hue shifts (such as blues turning purple or yellows turning olive), creating ultra-smooth, uniform design token scales.',
    },
    {
      question: 'How do I choose accessible text colors on shade scale swatches?',
      answer:
        'For steps 50 through 400, use dark text (such as step 900 or #0f172a) to exceed the WCAG 4.5:1 minimum contrast ratio. For steps 600 through 950, use white text (#ffffff) or step 50. Step 500 often sits near the 4.5:1 boundary, so check the live contrast indicator before assigning body copy.',
    },
    {
      question: 'Can I export these color shades directly into Tailwind CSS and Figma?',
      answer:
        'Yes! Use the "Copy as Tailwind Config" button to insert the generated swatch scale into your tailwind.config.js theme.extend.colors object, or copy the CSS custom properties directly into your design system stylesheet.',
    },
  ];

  const seoConfig: SEOConfig = {
    title: 'Color Shades Generator: Tailwind & Material 50-900 Scale Tool',
    description:
      'Generate a complete 10-step shade and tint scale from any HEX color. Export instantly to Tailwind CSS, CSS variables, and JSON design tokens.',
    canonicalUrl: 'https://chromoraflow.vercel.app/color-shades-generator',
    keywords: [
      'color shades generator',
      'tailwind color shades',
      'tint and shade generator',
      'color tint generator',
      'material design color scale',
      'css color shades',
      'oklch shade generator',
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://chromoraflow.vercel.app/' },
      { name: 'Color Shades Generator', url: 'https://chromoraflow.vercel.app/color-shades-generator' },
    ],
    faqs: shadesFaqs,
    softwareApp: {
      name: 'Chromora Color Shades & Tints Generator',
      description: 'Generates 10-step accessible tint and shade scales with Tailwind CSS and CSS variables export.',
      applicationCategory: 'DesignApplication',
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO config={seoConfig} />

      <Breadcrumbs
        items={[{ name: 'Tools', url: '/color-picker' }, { name: 'Color Shades Generator', url: '/color-shades-generator', isCurrent: true }]}
        onNavigate={navigate}
      />

      {/* Header Section */}
      <div className="my-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Tailwind 50–900 & Material Design Token Scale</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Color Shades & Tints Generator
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          Input any base color to automatically calculate a perceptually uniform 10-step tint and shade palette. Complete with WCAG contrast ratings, CSS variables, and one-click Tailwind config export.
        </p>
      </div>

      {/* Recent Colors Cross-Tool Bar */}
      <RecentColorsBar
        navigate={navigate}
        onSelectColor={(hex) => {
          setInputHex(hex);
          setActiveHex(hex);
        }}
        className="mb-8"
      />

      {/* Input & Control Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Color Picker & Hex Input */}
          <div className="lg:col-span-5 space-y-4">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Base Seed Color
            </label>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <input
                  type="color"
                  value={activeHex}
                  onChange={(e) => setInputHex(e.target.value)}
                  className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-white dark:border-zinc-800 shadow-md p-1 bg-zinc-100 dark:bg-zinc-800"
                  aria-label="Pick base seed color"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="relative">
                  <input
                    type="text"
                    value={inputHex}
                    onChange={(e) => setInputHex(e.target.value)}
                    placeholder="#6366F1"
                    maxLength={9}
                    className="w-full px-4 py-3 rounded-xl font-mono text-lg font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                  {colorData.name} • {colorData.family} family
                </p>
              </div>
            </div>

            {/* Quick Preset Swatches */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                Popular Seed Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => setInputHex(preset.hex)}
                    className={`w-7 h-7 rounded-lg border transition-transform hover:scale-110 ${
                      activeHex.toLowerCase() === preset.hex.toLowerCase()
                        ? 'ring-2 ring-indigo-500 scale-110'
                        : 'border-black/10'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={`${preset.name} (${preset.hex})`}
                    aria-label={`Select preset ${preset.name}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Middle: Algorithm and Curve Options */}
          <div className="lg:col-span-4 space-y-4 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 pt-6 lg:pt-0 lg:pl-8">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                Color Interpolation Space
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'oklch', label: 'OKLCH (Best)', desc: 'Perceptual' },
                    { id: 'hsl', label: 'HSL Cylindrical', desc: 'Standard' },
                    { id: 'tint-shade', label: 'Tint/Shade', desc: 'Black/White' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setScaleAlgorithm(opt.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center border ${
                      scaleAlgorithm === opt.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                Step Weight Distribution
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'tailwind', label: 'Tailwind' },
                    { id: 'material', label: 'Material' },
                    { id: 'uniform', label: 'Linear' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setStepDistribution(opt.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center border ${
                      stepDistribution === opt.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Action Exports */}
          <div className="lg:col-span-3 space-y-2.5 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 pt-6 lg:pt-0 lg:pl-8">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              Export Scale
            </span>
            <button
              onClick={copyAsTailwindConfig}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md"
            >
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>Tailwind Config</span>
              </span>
              <Copy className="w-3.5 h-3.5 opacity-80" />
            </button>
            <button
              onClick={copyAsCssVariables}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>CSS Variables</span>
              </span>
              <Copy className="w-3.5 h-3.5 opacity-80" />
            </button>
            <button
              onClick={copyAsJson}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>JSON Object</span>
              </span>
              <Copy className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 10-Step Interactive Swatch Grid */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span>Generated 11-Step Tonal Swatches</span>
            <span className="text-xs font-normal text-zinc-500">
              (Click any swatch to copy HEX & RGB)
            </span>
          </h2>
        </div>

        {/* Large Visual Strip Bar */}
        <div className="h-16 sm:h-20 w-full rounded-2xl overflow-hidden flex shadow-lg mb-6 border border-zinc-200 dark:border-zinc-800">
          {stepsData.map((step) => (
            <div
              key={step.step}
              onClick={() => handleCopyStep(step)}
              className="flex-1 h-full cursor-pointer relative group transition-transform hover:scale-105"
              style={{ backgroundColor: step.hex }}
              title={`${step.step}: ${step.hex}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 text-white font-mono text-[10px] font-bold transition-opacity">
                {step.step}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Swatch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {stepsData.map((step) => {
            const isCopied = copiedStep === step.step;
            return (
              <div
                key={step.step}
                onClick={() => handleCopyStep(step)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  step.isBase
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 dark:ring-indigo-400/30'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                } bg-white dark:bg-zinc-900 flex flex-col`}
              >
                {/* Color Block */}
                <div
                  className="h-28 sm:h-32 p-3 flex flex-col justify-between transition-colors relative"
                  style={{ backgroundColor: step.hex }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                        step.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black'
                      }`}
                    >
                      {step.step}
                    </span>
                    {step.isBase && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-indigo-700 shadow-xs uppercase tracking-wider">
                        Base Seed
                      </span>
                    )}
                  </div>

                  {/* Copy Badge Indicator on Hover */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-opacity ${
                        isCopied
                          ? 'opacity-100 bg-emerald-500 text-white'
                          : 'opacity-0 group-hover:opacity-100 ' +
                            (step.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black')
                      }`}
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px]">{isCopied ? 'Copied' : 'Copy'}</span>
                    </div>
                  </div>
                </div>

                {/* Info Metadata */}
                <div className="p-3.5 space-y-2 bg-white dark:bg-zinc-900 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                        {step.hex.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {step.contrastOnWhite}:1 W
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
                      {step.rgb}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>{step.hsl}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Export Preview Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
        {/* Tailwind Config Preview */}
        <div className="p-6 rounded-2xl bg-zinc-950 text-zinc-200 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-zinc-100">tailwind.config.js</span>
            </div>
            <button
              onClick={copyAsTailwindConfig}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300">
            {`colors: {
  '${colorData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}': {
${stepsData.map((s) => `    ${s.step}: '${s.hex}',`).join('\n')}
  }
}`}
          </pre>
        </div>

        {/* CSS Variables Preview */}
        <div className="p-6 rounded-2xl bg-zinc-950 text-zinc-200 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-zinc-100">:root CSS Custom Properties</span>
            </div>
            <button
              onClick={copyAsCssVariables}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300">
            {`:root {
${stepsData.map((s) => `  --color-${s.step}: ${s.hex};`).join('\n')}
}`}
          </pre>
        </div>
      </div>

      {/* Related Tools Navigation Links */}
      <div className="my-12 p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
          Explore Related Design & Color Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/color-palette-generator"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-palette-generator');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>Color Palette Generator</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Generate 5-color harmonic systems with lock controls and export formats.
            </p>
          </a>

          <a
            href="/contrast-checker"
            onClick={(e) => {
              e.preventDefault();
              navigate('/contrast-checker');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>WCAG Contrast Checker</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Verify AA & AAA compliance on background combinations in real-time.
            </p>
          </a>

          <a
            href="/color-mixer"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-mixer');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>Color Mixer Online</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Blend two colors in OKLCH or Subtractive space with intermediate steps.
            </p>
          </a>
        </div>
      </div>

      {/* FAQs Section */}
      <FAQSection
        faqs={shadesFaqs}
        title="Color Shades & Tint Scale FAQ"
        subtitle="Master perceptual color scaling, design token generation, and accessible interface typography."
      />
    </div>
  );
};
