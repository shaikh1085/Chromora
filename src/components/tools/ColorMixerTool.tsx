import React, { useState, useMemo } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import {
  getColorData,
  hexToRgb,
  rgbToHsl,
  getContrastRatio,
  rgbToOklch,
} from '../../utils/colorUtils';
import {
  blendColors,
  generateIntermediateSteps,
  MixingMode,
} from '../../utils/colorMixingUtils';
import {
  Sliders,
  Copy,
  Check,
  Sparkles,
  ArrowRightLeft,
  Shuffle,
  Layers,
  ArrowRight,
  Droplets,
  Palette,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { FAQItem, SEOConfig } from '../../types';
import { RecentColorsBar } from '../common/RecentColorsBar';

export const ColorMixerTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { copyToClipboard, showToast, setPaletteFromHexList, activeHex, setActiveHex, addRecentColor } = usePalette();
  const { t } = useI18n();

  const [color1, setColor1] = useState(activeHex || '#3b82f6'); // Blue
  const [color2, setColor2] = useState('#f43f5e'); // Rose
  const [ratio, setRatio] = useState<number>(50); // 0 to 100
  const [mixingMode, setMixingMode] = useState<MixingMode>('oklch');
  const [intermediateCount, setIntermediateCount] = useState<number>(5);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Clean hex inputs
  const cleanColor1 = useMemo(() => {
    let val = color1.trim();
    if (!val.startsWith('#')) val = `#${val}`;
    return /^#[0-9a-fA-F]{6}$/i.test(val) ? val : '#3b82f6';
  }, [color1]);

  const cleanColor2 = useMemo(() => {
    let val = color2.trim();
    if (!val.startsWith('#')) val = `#${val}`;
    return /^#[0-9a-fA-F]{6}$/i.test(val) ? val : '#f43f5e';
  }, [color2]);

  // Mixed result
  const mixedHex = useMemo(() => {
    return blendColors(cleanColor1, cleanColor2, ratio / 100, mixingMode);
  }, [cleanColor1, cleanColor2, ratio, mixingMode]);

  const mixedData = useMemo(() => getColorData(mixedHex), [mixedHex]);
  const color1Data = useMemo(() => getColorData(cleanColor1), [cleanColor1]);
  const color2Data = useMemo(() => getColorData(cleanColor2), [cleanColor2]);

  // Intermediate gradient steps
  const intermediateSteps = useMemo(() => {
    return generateIntermediateSteps(cleanColor1, cleanColor2, intermediateCount, mixingMode);
  }, [cleanColor1, cleanColor2, intermediateCount, mixingMode]);

  const swapColors = () => {
    const temp = color1;
    setColor1(color2);
    setColor2(temp);
    setRatio(100 - ratio);
    showToast('Swapped Colors', 'info');
  };

  const handleCopy = (hex: string, label = 'Hex') => {
    copyToClipboard(hex);
    setCopiedHex(hex);
    showToast(`Copied ${label}: ${hex.toUpperCase()}`, 'success');
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleExportToPalette = () => {
    const list = intermediateSteps.map((s) => s.hex);
    setPaletteFromHexList(list);
    showToast('Exported to Palette Generator', 'success');
    navigate('/color-palette-generator');
  };

  const mixerFaqs: FAQItem[] = [
    {
      question: 'How does digital color mixing differ between OKLCH and standard RGB?',
      answer:
        'Standard RGB blends linearly in electrical signal space, which often produces muddy, desaturated, grayish middles when mixing complementary hues. OKLCH (Oklab) operates in a perceptually uniform color space where lightness and chroma are separated, keeping mixed transitions vivid and natural.',
    },
    {
      question: 'What is the Subtractive / Pigment color mixing mode?',
      answer:
        'Subtractive mixing simulates physical paints, watercolors, and inks. In additive screen mixing (RGB), combining red and green creates yellow. In subtractive mixing, combining yellow and cyan/blue pigments absorbs wavelengths to produce green, just like physical artist paints on paper.',
    },
    {
      question: 'How do I use intermediate color steps in UI and graphic design?',
      answer:
        'Intermediate steps allow you to create harmonious gradient ramps, continuous scale data visualizations, hover/active component states, and smooth color interpolations between two brand signature colors without manual trial and error.',
    },
    {
      question: 'Can I copy the blended intermediate steps as a CSS gradient?',
      answer:
        'Yes! You can copy individual step HEX codes, generate CSS linear-gradient strings with all intermediate stops, or export the full stepped array straight into the Palette Generator.',
    },
    {
      question: 'What does the mix ratio slider represent?',
      answer:
        'A mix ratio of 0% outputs 100% of Color 1 (0% Color 2). A ratio of 50% represents an exact half-and-half balanced blend. A ratio of 100% outputs 100% of Color 2.',
    },
  ];

  const seoConfig: SEOConfig = {
    title: 'Color Mixer Online: Blend Two Colors with Real-Time Steps & OKLCH',
    description:
      'Mix two colors online with custom blending ratios. Explore OKLCH, RGB, HSL, and physical paint subtractive mixing with smooth intermediate steps.',
    canonicalUrl: 'https://chromoraflow.vercel.app/color-mixer',
    keywords: [
      'color mixer online',
      'mix two colors',
      'color blend tool',
      'color blender',
      'combine two colors',
      'oklch color mixer',
      'paint color mixing simulator',
      'intermediate color steps',
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://chromoraflow.vercel.app/' },
      { name: 'Color Mixer', url: 'https://chromoraflow.vercel.app/color-mixer' },
    ],
    faqs: mixerFaqs,
    softwareApp: {
      name: 'Chromora Color Mixer & Blender Tool',
      description: 'Online dual color mixer with OKLCH, RGB, and pigment simulation blending algorithms.',
      applicationCategory: 'DesignApplication',
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO config={seoConfig} />

      <Breadcrumbs
        items={[{ name: 'Tools', url: '/color-picker' }, { name: 'Color Mixer', url: '/color-mixer', isCurrent: true }]}
        onNavigate={navigate}
      />

      {/* Header */}
      <div className="my-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-3">
          <Droplets className="w-3.5 h-3.5" />
          <span>Dual Color Blending & Intermediate Ramps</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Color Mixer Online
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Blend two colors in real-time with customizable mixing ratios and color spaces. View intermediate step gradients and export palette swatches instantly.
        </p>
      </div>

      {/* Recent Colors Cross-Tool Bar */}
      <RecentColorsBar
        navigate={navigate}
        onSelectColor={(hex) => {
          setColor1(hex);
          setActiveHex(hex);
        }}
        className="mb-8"
      />

      {/* Main Dual Color Input Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Color 1 */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                First Color (Color A)
              </label>
              <span className="text-xs font-mono text-zinc-400">{100 - ratio}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={cleanColor1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-white dark:border-zinc-800 shadow-md p-1 bg-zinc-100 dark:bg-zinc-800"
                aria-label="Pick color 1"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl font-mono text-base font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 uppercase"
                />
                <p className="text-xs text-zinc-500 mt-1">{color1Data.name}</p>
              </div>
            </div>
          </div>

          {/* Swap Button Center */}
          <div className="md:col-span-2 flex justify-center py-2 md:py-0">
            <button
              onClick={swapColors}
              className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all shadow-md hover:scale-110 active:scale-95"
              title="Swap Colors"
              aria-label="Swap Color A and Color B"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Color 2 */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Second Color (Color B)
              </label>
              <span className="text-xs font-mono text-zinc-400">{ratio}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={cleanColor2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-white dark:border-zinc-800 shadow-md p-1 bg-zinc-100 dark:bg-zinc-800"
                aria-label="Pick color 2"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl font-mono text-base font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 uppercase"
                />
                <p className="text-xs text-zinc-500 mt-1">{color2Data.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mix Ratio Slider Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Mix Balance Ratio
            </span>
            <div className="flex items-center gap-2">
              {[25, 50, 75].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setRatio(pct)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    ratio === pct
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                  }`}
                >
                  {pct === 50 ? '50/50 Even' : `${100 - pct}/${pct}`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="w-full h-3 rounded-lg cursor-pointer appearance-none accent-indigo-600 shadow-inner"
              style={{
                background: `linear-gradient(to right, ${cleanColor1}, ${mixedHex} 50%, ${cleanColor2})`,
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-zinc-400">
            <span>100% {color1Data.name}</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {100 - ratio}% / {ratio}% Blend
            </span>
            <span>100% {color2Data.name}</span>
          </div>
        </div>

        {/* Mixing Mode & Settings */}
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              Color Space Mixing Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'oklch', label: 'OKLCH (Vivid)' },
                  { id: 'subtractive', label: 'Paint (CMY)' },
                  { id: 'rgb', label: 'Linear RGB' },
                  { id: 'hsl', label: 'HSL Arc' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setMixingMode(mode.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center border ${
                    mixingMode === mode.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              Intermediate Step Granularity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7, 9].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setIntermediateCount(cnt)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center border ${
                    intermediateCount === cnt
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {cnt} Steps
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Mixed Color Result Card */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Resulting Mixed Color
        </h2>

        <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
          <div
            className="h-44 sm:h-56 p-6 sm:p-8 flex flex-col justify-between transition-colors relative"
            style={{ backgroundColor: mixedHex }}
          >
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  mixedData.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black'
                }`}
              >
                {100 - ratio}% {color1Data.name} + {ratio}% {color2Data.name}
              </span>
              <button
                onClick={() => handleCopy(mixedHex, 'Mixed Hex')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${
                  mixedData.isDark
                    ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                {copiedHex === mixedHex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHex === mixedHex ? 'Copied' : 'Copy HEX'}</span>
              </button>
            </div>

            <div>
              <h3
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
                  mixedData.isDark ? 'text-white' : 'text-zinc-900'
                }`}
              >
                {mixedHex.toUpperCase()}
              </h3>
              <p
                className={`text-sm sm:text-base font-medium opacity-90 mt-1 ${
                  mixedData.isDark ? 'text-white' : 'text-zinc-900'
                }`}
              >
                {mixedData.name} • {mixedData.family} family
              </p>
            </div>
          </div>

          {/* Color Values Strip */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-50 dark:bg-zinc-950 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">RGB</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {mixedData.rgb.r}, {mixedData.rgb.g}, {mixedData.rgb.b}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">HSL</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {Math.round(mixedData.hsl.h)}°, {Math.round(mixedData.hsl.s)}%, {Math.round(mixedData.hsl.l)}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">CMYK</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {mixedData.cmyk.c}%, {mixedData.cmyk.m}%, {mixedData.cmyk.y}%, {mixedData.cmyk.k}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">OKLCH</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {mixedData.oklch.l.toFixed(2)} {mixedData.oklch.c.toFixed(2)} {Math.round(mixedData.oklch.h)}°
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Intermediate Steps Gradient Bar & Swatches */}
      <div className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Intermediate Step Transition Swatches
            </h2>
            <p className="text-xs text-zinc-500">
              Evenly interpolated steps between {cleanColor1} and {cleanColor2} in {mixingMode.toUpperCase()} mode.
            </p>
          </div>
          <button
            onClick={handleExportToPalette}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-md transition-all"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Open in Palette Generator</span>
          </button>
        </div>

        {/* Gradient Transition Ribbon */}
        <div className="h-14 sm:h-16 w-full rounded-2xl overflow-hidden flex shadow-lg mb-6 border border-zinc-200 dark:border-zinc-800">
          {intermediateSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => handleCopy(step.hex, `Step ${idx + 1}`)}
              className="flex-1 h-full cursor-pointer relative group transition-transform hover:scale-105"
              style={{ backgroundColor: step.hex }}
              title={`Step ${idx + 1} (${step.ratio}%): ${step.hex}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/25 text-white font-mono text-[10px] font-bold transition-opacity">
                {step.ratio}%
              </div>
            </div>
          ))}
        </div>

        {/* Step Cards Grid */}
        <div
          className="grid gap-3 sm:gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(130px, 1fr))`,
          }}
        >
          {intermediateSteps.map((step, idx) => {
            const data = getColorData(step.hex);
            const isCopied = copiedHex === step.hex;
            return (
              <div
                key={idx}
                onClick={() => handleCopy(step.hex, `Step ${idx + 1}`)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all hover:scale-105 hover:shadow-lg flex flex-col"
              >
                <div
                  className="h-24 p-2.5 flex flex-col justify-between"
                  style={{ backgroundColor: step.hex }}
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                      data.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black'
                    }`}
                  >
                    {step.ratio}%
                  </span>
                  <div
                    className={`self-end p-1 rounded-md transition-opacity ${
                      isCopied
                        ? 'opacity-100 bg-emerald-500 text-white'
                        : 'opacity-0 group-hover:opacity-100 ' +
                          (data.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black')
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-zinc-900 space-y-1 text-left">
                  <span className="font-mono text-xs font-extrabold text-zinc-900 dark:text-zinc-100 block">
                    {step.hex.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-zinc-500 truncate">{data.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Related Tools Links */}
      <div className="my-12 p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Explore Related Color Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/gradient-generator"
            onClick={(e) => {
              e.preventDefault();
              navigate('/gradient-generator');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>CSS Gradient Generator</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Create linear and radial multi-stop CSS gradients with live copy.
            </p>
          </a>

          <a
            href="/color-shades-generator"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-shades-generator');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>Shades & Tints Generator</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Calculate a full 10-step Tailwind 50-900 design token scale.
            </p>
          </a>

          <a
            href="/color-converter"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-converter');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>Multi-Way Color Converter</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Convert between HEX, RGB, HSL, HSV, CMYK, and OKLCH color codes.
            </p>
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection
        faqs={mixerFaqs}
        title="Color Mixing & Blending FAQ"
        subtitle="Learn how optical, digital, and pigment mixing models create smooth color ramps."
      />
    </div>
  );
};
