import React, { useState, useEffect } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
  getColorData,
  parseColorInput,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToCmyk,
  rgbToOklch,
  cmykToRgb,
  rgbToHsv,
  clamp,
} from '../../utils/colorUtils';
import { Repeat, Copy, Check, Sparkles, ArrowRight, Layers, ArrowRightLeft } from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { CONVERTER_PAGES } from '../../data/converterPagesData';
import { RecentColorsBar } from '../common/RecentColorsBar';

export const ColorConverterTool: React.FC<{
  navigate: (route: string) => void;
  defaultMode?: 'all' | 'hex-to-rgb' | 'rgb-to-hex';
}> = ({ navigate, defaultMode = 'all' }) => {
  const { activeHex, setActiveHex, copyToClipboard } = usePalette();
  const [hexInput, setHexInput] = useState(activeHex);
  const [rgbR, setRgbR] = useState(11);
  const [rgbG, setRgbG] = useState(79);
  const [rgbB, setRgbB] = useState(108);

  const [hslH, setHslH] = useState(198);
  const [hslS, setHslS] = useState(82);
  const [hslL, setHslL] = useState(23);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync state with activeHex
  useEffect(() => {
    const data = getColorData(activeHex);
    setHexInput(data.hex);
    setRgbR(data.rgb.r);
    setRgbG(data.rgb.g);
    setRgbB(data.rgb.b);
    setHslH(data.hsl.h);
    setHslS(data.hsl.s);
    setHslL(data.hsl.l);
  }, [activeHex]);

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const parsed = parseColorInput(val);
    if (parsed) {
      setActiveHex(parsed);
    }
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    const clampedR = clamp(r, 0, 255);
    const clampedG = clamp(g, 0, 255);
    const clampedB = clamp(b, 0, 255);
    setRgbR(clampedR);
    setRgbG(clampedG);
    setRgbB(clampedB);
    const hex = rgbToHex({ r: clampedR, g: clampedG, b: clampedB });
    setActiveHex(hex);
  };

  const handleHslChange = (h: number, s: number, l: number) => {
    const clampedH = clamp(h, 0, 360);
    const clampedS = clamp(s, 0, 100);
    const clampedL = clamp(l, 0, 100);
    setHslH(clampedH);
    setHslS(clampedS);
    setHslL(clampedL);
    const rgb = hslToRgb({ h: clampedH, s: clampedS, l: clampedL });
    const hex = rgbToHex(rgb);
    setActiveHex(hex);
  };

  const colorData = getColorData(activeHex);

  const copy = (key: string, val: string) => {
    copyToClipboard(val, `Copied ${key.toUpperCase()}`);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const pageTitle =
    defaultMode === 'hex-to-rgb'
      ? 'HEX to RGB Color Converter'
      : defaultMode === 'rgb-to-hex'
      ? 'RGB to HEX Color Converter'
      : 'Multi-Space Color Converter (HEX, RGB, HSL, CMYK, OKLCH)';

  const converterFaqs = [
    {
      question: 'How do you convert HEX to RGB mathematically?',
      answer:
        'A standard 6-digit hex code #RRGGBB uses base-16 notation. Red is parseInt(RR, 16), Green is parseInt(GG, 16), and Blue is parseInt(BB, 16). For example, #0B4F6C becomes RGB(11, 79, 108).',
    },
    {
      question: 'How is CMYK print color calculated from digital RGB?',
      answer:
        'RGB to CMYK conversion first calculates Black (Key) as K = 1 - max(R\', G\', B\'), then computes Cyan as (1 - R\' - K)/(1 - K), Magenta as (1 - G\' - K)/(1 - K), and Yellow as (1 - B\' - K)/(1 - K).',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: `${pageTitle} — Free Multi-Format Color Space Converter`,
          description:
            'Convert colors across HEX, RGB, HSL, HSV, CMYK, and OKLCH spaces in real time. Precise color conversions for web developers, UI designers, and print media.',
          keywords: [
            'color converter online free',
            'hex to rgb converter tool',
            'hex to oklch converter online',
            'oklch to hex converter',
            'cmyk to hex converter for print',
            'rgb to hsl converter web development',
            'css color space translator',
          ],
          canonicalUrl: `https://chromoraflow.vercel.app${
            defaultMode === 'hex-to-rgb'
              ? '/hex-to-rgb'
              : defaultMode === 'rgb-to-hex'
              ? '/rgb-to-hex'
              : '/color-converter'
          }`,
          faqs: converterFaqs,
          softwareApp: {
            name: 'Chromora Color Converter',
            description: 'Multi-space color converter utility supporting HEX, RGB, HSL, HSV, CMYK, and OKLCH.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            {
              name: defaultMode === 'hex-to-rgb' ? 'HEX to RGB' : defaultMode === 'rgb-to-hex' ? 'RGB to HEX' : 'Color Converter',
              url: '/color-converter',
              isCurrent: true,
            },
          ]}
          onNavigate={navigate}
        />

        {/* Header */}
        <div className="my-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 mb-2">
            <Repeat className="w-3.5 h-3.5" />
            <span>Mathematical Color Space Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Live interactive transformation between web, digital display, CSS color levels, and print representations.
          </p>
        </div>

        {/* Recent Colors Cross-Tool Bar */}
        <RecentColorsBar
          navigate={navigate}
          onSelectColor={(hex) => handleHexChange(hex)}
          className="mb-8"
        />

        {/* Main Swatch & Interactive Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Swatch & Quick Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div
                className="w-full h-48 rounded-xl shadow-inner border border-black/10 transition-colors flex items-end p-4 mb-4"
                style={{ backgroundColor: colorData.hex }}
              >
                <span
                  className="text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-md"
                  style={{
                    backgroundColor: colorData.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
                    color: colorData.isDark ? '#ffffff' : '#000000',
                  }}
                >
                  {colorData.name}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {colorData.name}
                </p>
                <p className="text-xs text-zinc-400 font-mono">
                  {colorData.hex.toUpperCase()} • {colorData.family} family
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="/color-picker"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveHex(colorData.hex);
                  navigate('/color-picker');
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span>Inspect in Smart Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Format Inputs (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
            {/* HEX Input */}
            <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  HEX Code (Base-16)
                </span>
                <button
                  onClick={() => copy('hex', colorData.hex.toUpperCase())}
                  className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1"
                >
                  {copiedField === 'hex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'hex' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <input
                type="text"
                value={hexInput.toUpperCase()}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-sm uppercase text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* RGB Sliders */}
            <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  RGB Channels (0–255)
                </span>
                <button
                  onClick={() => copy('rgb', `rgb(${rgbR}, ${rgbG}, ${rgbB})`)}
                  className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1"
                >
                  {copiedField === 'rgb' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'rgb' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-rose-500 font-bold">Red</span>
                    <span>{rgbR}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbR}
                    onChange={(e) => handleRgbChange(Number(e.target.value), rgbG, rgbB)}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-emerald-500 font-bold">Green</span>
                    <span>{rgbG}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbG}
                    onChange={(e) => handleRgbChange(rgbR, Number(e.target.value), rgbB)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-sky-500 font-bold">Blue</span>
                    <span>{rgbB}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbB}
                    onChange={(e) => handleRgbChange(rgbR, rgbG, Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* HSL Sliders */}
            <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  HSL Coordinate Values
                </span>
                <button
                  onClick={() => copy('hsl', `hsl(${hslH}, ${hslS}%, ${hslL}%)`)}
                  className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1"
                >
                  {copiedField === 'hsl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'hsl' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-500 font-bold">Hue</span>
                    <span>{hslH}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hslH}
                    onChange={(e) => handleHslChange(Number(e.target.value), hslS, hslL)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-indigo-500 font-bold">Saturation</span>
                    <span>{hslS}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hslS}
                    onChange={(e) => handleHslChange(hslH, Number(e.target.value), hslL)}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-purple-500 font-bold">Lightness</span>
                    <span>{hslL}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hslL}
                    onChange={(e) => handleHslChange(hslH, hslS, Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Read-Only CMYK & OKLCH row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-500">CMYK (Print)</span>
                  <p className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                    cmyk({colorData.cmyk.c}%, {colorData.cmyk.m}%, {colorData.cmyk.y}%, {colorData.cmyk.k}%)
                  </p>
                </div>
                <button
                  onClick={() => copy('cmyk', `cmyk(${colorData.cmyk.c}%, ${colorData.cmyk.m}%, ${colorData.cmyk.y}%, ${colorData.cmyk.k}%)`)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-500">OKLCH (Perceptual)</span>
                  <p className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                    oklch({colorData.oklch.l} {colorData.oklch.c} {colorData.oklch.h})
                  </p>
                </div>
                <button
                  onClick={() => copy('oklch', `oklch(${colorData.oklch.l} ${colorData.oklch.c} ${colorData.oklch.h})`)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Fast Conversion Tools */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRightLeft className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Dedicated Format Converters
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Object.values(CONVERTER_PAGES).map((conv) => (
              <a
                key={conv.slug}
                href={`/${conv.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${conv.slug}`);
                }}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[var(--accent)] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-[var(--accent)]">
                    {conv.fromFormat.toUpperCase()} → {conv.toFormat.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--accent)] transition-colors mt-0.5">
                    {conv.h1}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {conv.metaDescription}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
                  <span>Open Converter</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <FAQSection
          faqs={converterFaqs}
          title="Color Conversion Formulas & Colorimetry FAQ"
          subtitle="Understanding RGB gamut, base-16 hexadecimal values, and perceptual uniform spaces."
        />
      </div>
    </div>
  );
};
