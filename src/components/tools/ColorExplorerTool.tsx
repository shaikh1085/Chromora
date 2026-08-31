import React, { useState, useEffect } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
  getColorData,
  parseColorInput,
  generateTailwindShades,
  generatePalette,
  hexToSlug,
} from '../../utils/colorUtils';
import {
  Copy,
  Check,
  Sparkles,
  Sliders,
  Palette,
  CheckCircle,
  ExternalLink,
  Info,
  Layers,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';

export const ColorExplorerTool: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  const { activeHex, setActiveHex, copyToClipboard, setPaletteFromHexList, showToast } = usePalette();
  const [inputValue, setInputValue] = useState(activeHex);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewBg, setPreviewBg] = useState(false);

  useEffect(() => {
    setInputValue(activeHex);
  }, [activeHex]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    const parsed = parseColorInput(val);
    if (parsed) {
      setActiveHex(parsed);
    }
  };

  const handleNativePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setActiveHex(val);
  };

  const colorData = getColorData(activeHex);
  const shades = generateTailwindShades(activeHex);
  const quickAnalogous = generatePalette(activeHex, 'analogous', 5);
  const quickTriadic = generatePalette(activeHex, 'triadic', 3);
  const quickComplementary = generatePalette(activeHex, 'complementary', 4);

  const copyField = (key: string, text: string) => {
    copyToClipboard(text, `Copied ${key.toUpperCase()}`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const formatRows = [
    { key: 'hex', label: 'HEX', val: colorData.hex.toUpperCase() },
    { key: 'rgb', label: 'RGB', val: `rgb(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b})` },
    { key: 'hsl', label: 'HSL', val: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, ${colorData.hsl.l}%)` },
    { key: 'hsv', label: 'HSV', val: `hsv(${colorData.hsv.h}°, ${colorData.hsv.s}%, ${colorData.hsv.v}%)` },
    { key: 'cmyk', label: 'CMYK', val: `cmyk(${colorData.cmyk.c}%, ${colorData.cmyk.m}%, ${colorData.cmyk.y}%, ${colorData.cmyk.k}%)` },
    { key: 'oklch', label: 'OKLCH', val: `oklch(${colorData.oklch.l} ${colorData.oklch.c} ${colorData.oklch.h})` },
    { key: 'css-var', label: 'CSS Variable', val: `--color-${colorData.name.toLowerCase().replace(/\s+/g, '-')}: ${colorData.hex};` },
    { key: 'tailwind', label: 'Tailwind Token', val: `'${colorData.name.toLowerCase().replace(/\s+/g, '-')}': '${colorData.hex}'` },
  ];

  const explorerFaqs = [
    {
      question: 'What color formats does the Chromora Smart Explorer support?',
      answer:
        'Chromora normalizes standard 3/6-digit HEX codes (#0b4f6c), RGB / RGBA strings, HSL / HSLA coordinates, HSV / HSB color space, CMYK print approximations, OKLCH perceptual lightness values, and standard W3C CSS color keywords (e.g. "rebeccapurple", "crimson", "teal").',
    },
    {
      question: 'Why use OKLCH instead of standard sRGB or HSL?',
      answer:
        'OKLCH provides uniform perceptual lightness and chroma. Unlike HSL where pure yellow (#ffff00) appears vastly brighter than pure blue (#0000ff) at the same lightness value, OKLCH ensures consistent contrast ratios across all hues, making it superior for modern accessible design systems.',
    },
    {
      question: 'How are color names resolved?',
      answer:
        'Chromora cross-references your color against an extensive index of over 400 named pigments and Pantone shades using eye-weighted Euclidean distance in color space to find the closest human-readable name.',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: `Color Picker & Smart Explorer — ${colorData.name} (${colorData.hex.toUpperCase()})`,
          description: `Analyze ${colorData.name} (${colorData.hex}). Convert between HEX, RGB, HSL, HSV, CMYK, and OKLCH color spaces, generate Tailwind 50-950 shades, and export production design tokens.`,
          keywords: [
            'color picker online with hex codes',
            'html color code finder and explorer',
            'smart color picker tool free',
            'hex to rgb hsl converter picker',
            'tailwind shade explorer',
            'css color inspector tool',
          ],
          canonicalUrl: `https://chromora.app/color-picker`,
          faqs: explorerFaqs,
          softwareApp: {
            name: 'Chromora Color Picker & Explorer',
            description: 'Intelligent color picker, inspector, and multi-space conversion tool.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Color Explorer & Picker', url: '/color-picker', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Header Title */}
        <div className="my-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Color Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {colorData.name}{' '}
            <span className="text-zinc-400 font-mono font-normal text-2xl sm:text-3xl">
              {colorData.hex.toUpperCase()}
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Input any HEX, RGB, HSL, HSV, OKLCH, or CSS name to inspect color space coordinates, Tailwind shade scales, and exportable design tokens.
          </p>
        </div>

        {/* Main Interactive Input Bar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Color Swatch / Native Picker */}
            <div className="relative w-full sm:w-20 h-16 sm:h-14 rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 shrink-0 shadow-inner group cursor-pointer">
              <div
                className="w-full h-full transition-colors"
                style={{ backgroundColor: colorData.hex }}
              />
              <input
                type="color"
                value={colorData.hex}
                onChange={handleNativePicker}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Pick color from palette"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold pointer-events-none transition-opacity">
                Pick
              </div>
            </div>

            {/* Smart Text Input */}
            <div className="flex-1 w-full relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter HEX, RGB (255, 100, 50), HSL (210, 80%, 40%), OKLCH or name..."
                className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm font-mono placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Color input string"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setPreviewBg(!previewBg)}
                className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  previewBg
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                title="Preview color as page background"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{previewBg ? 'Exit Canvas' : 'Preview Canvas'}</span>
              </button>

              <a
                href="/color-palette-generator"
                onClick={(e) => {
                  e.preventDefault();
                  const palette = generatePalette(activeHex, 'analogous', 5);
                  setPaletteFromHexList(palette, `${colorData.name} Harmony`);
                  navigate('/color-palette-generator');
                }}
                className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shrink-0"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Build Palette</span>
              </a>
            </div>
          </div>
        </div>

        {/* Live Canvas Background Preview */}
        {previewBg && (
          <div
            className="w-full rounded-2xl p-8 mb-8 border transition-all flex flex-col items-center justify-center text-center gap-4 min-h-[220px]"
            style={{
              backgroundColor: colorData.hex,
              color: colorData.isDark ? '#ffffff' : '#09090b',
              borderColor: colorData.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }}
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {colorData.name} Canvas Preview
            </h3>
            <p className="max-w-md text-xs sm:text-sm opacity-90 leading-relaxed font-sans">
              Relative Luminance: {colorData.luminance} • Classification: {colorData.family.toUpperCase()}
            </p>
            <button
              onClick={() => setPreviewBg(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold border backdrop-blur-md"
              style={{
                backgroundColor: colorData.isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
                borderColor: colorData.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                color: colorData.isDark ? '#ffffff' : '#09090b',
              }}
            >
              Dismiss Canvas
            </button>
          </div>
        )}

        {/* Two-Column Grid: Values Table & Color Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Values Table (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span>Color Space Transformations</span>
              </h2>
              <span className="text-xs text-zinc-400 font-mono">Normalized W3C values</span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {formatRows.map((row) => (
                <div key={row.key} className="py-3 flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 w-28 shrink-0">
                    {row.label}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 truncate flex-1 text-left">
                    {row.val}
                  </span>
                  <button
                    onClick={() => copyField(row.key, row.val)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                    aria-label={`Copy ${row.label}`}
                    title={`Copy ${row.label}`}
                  >
                    {copiedKey === row.key ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Color Insights & Harmonious Sets (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Metrics Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Optical Properties
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-medium">Luminance</span>
                  <p className="text-base font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {(colorData.luminance * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-medium">Color Family</span>
                  <p className="text-base font-bold capitalize text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {colorData.family}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-medium">Tone Mode</span>
                  <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {colorData.isDark ? 'Dark Tone' : 'Light Tone'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-medium">Hue Angle</span>
                  <p className="text-base font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {colorData.hsl.h}°
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="/contrast-checker"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contrast-checker');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Run WCAG Accessibility Audit</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>

                <a
                  href={`/colors/${hexToSlug(colorData.name, colorData.hex)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/colors/${hexToSlug(colorData.name, colorData.hex)}`);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-indigo-500" />
                    <span>Dedicated Color Page ({colorData.name})</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tailwind 50-950 Shade Spectrum */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Tailwind CSS Shade Scale (50–950)
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Mathematically balanced lightness curve ready for your tailwind.config.js
              </p>
            </div>
            <button
              onClick={() => {
                const shadeCode = shades.map((s) => `  ${s.step}: '${s.hex}',`).join('\n');
                copyToClipboard(`'${colorData.name.toLowerCase().replace(/\s+/g, '-')}': {\n${shadeCode}\n}`, 'Copied Tailwind Shade Object');
              }}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors self-start sm:self-auto"
            >
              Copy Shade Scale
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5">
            {shades.map((shade) => (
              <button
                key={shade.step}
                onClick={() => {
                  setActiveHex(shade.hex);
                  showToast(`Selected shade ${shade.step}`, shade.hex, 'info');
                }}
                className="group flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 text-left transition-transform hover:scale-105 focus:outline-none"
              >
                <div
                  className="h-16 w-full flex items-end p-2 transition-colors"
                  style={{ backgroundColor: shade.hex }}
                >
                  <span
                    className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: shade.isDark ? '#ffffff' : '#09090b' }}
                  >
                    Select
                  </span>
                </div>
                <div className="p-2 bg-zinc-50 dark:bg-zinc-950 flex flex-col">
                  <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                    {shade.step}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">
                    {shade.hex}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Harmonies Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Analogous Harmony</h3>
              <a
                href="/color-palette-generator"
                onClick={(e) => {
                  e.preventDefault();
                  setPaletteFromHexList(quickAnalogous, 'Analogous Harmony');
                  navigate('/color-palette-generator');
                }}
                className="text-[11px] text-indigo-500 hover:underline font-semibold"
              >
                Open
              </a>
            </div>
            <div className="flex h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              {quickAnalogous.map((hex, i) => (
                <div
                  key={i}
                  onClick={() => setActiveHex(hex)}
                  className="flex-1 cursor-pointer transition-transform hover:opacity-90"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Complementary Set</h3>
              <a
                href="/color-palette-generator"
                onClick={(e) => {
                  e.preventDefault();
                  setPaletteFromHexList(quickComplementary, 'Complementary Set');
                  navigate('/color-palette-generator');
                }}
                className="text-[11px] text-indigo-500 hover:underline font-semibold"
              >
                Open
              </a>
            </div>
            <div className="flex h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              {quickComplementary.map((hex, i) => (
                <div
                  key={i}
                  onClick={() => setActiveHex(hex)}
                  className="flex-1 cursor-pointer transition-transform hover:opacity-90"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Triadic Balance</h3>
              <a
                href="/color-palette-generator"
                onClick={(e) => {
                  e.preventDefault();
                  setPaletteFromHexList(quickTriadic, 'Triadic Balance');
                  navigate('/color-palette-generator');
                }}
                className="text-[11px] text-indigo-500 hover:underline font-semibold"
              >
                Open
              </a>
            </div>
            <div className="flex h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              {quickTriadic.map((hex, i) => (
                <div
                  key={i}
                  onClick={() => setActiveHex(hex)}
                  className="flex-1 cursor-pointer transition-transform hover:opacity-90"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>
        </div>

        {/* SEO FAQ Section */}
        <FAQSection
          faqs={explorerFaqs}
          title="Color Explorer & Coordinate Science"
          subtitle="Everything you need to know about color conversions, accuracy, and digital reproduction."
        />
      </div>
    </div>
  );
};
