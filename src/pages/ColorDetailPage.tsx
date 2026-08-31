import React from 'react';
import { usePalette } from '../context/PaletteContext';
import {
  parseSlugToHex,
  getColorData,
  generateTailwindShades,
  generatePalette,
  getContrastRatio,
  hexToSlug,
} from '../utils/colorUtils';
import {
  Copy,
  Check,
  Compass,
  Palette,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FAQSection } from '../components/common/FAQSection';

export const ColorDetailPage: React.FC<{
  slug?: string;
  navigate: (route: string) => void;
}> = ({ slug = 'deep-ocean-blue-0b4f6c', navigate }) => {
  const { setActiveHex, setPaletteFromHexList, copyToClipboard, showToast } = usePalette();

  const targetHex = parseSlugToHex(slug);
  const colorData = getColorData(targetHex);
  const shades = generateTailwindShades(targetHex);

  const analogous = generatePalette(targetHex, 'analogous', 5);
  const complementary = generatePalette(targetHex, 'complementary', 4);
  const triadic = generatePalette(targetHex, 'triadic', 3);

  const contrastOnWhite = getContrastRatio(targetHex, '#ffffff');
  const contrastOnBlack = getContrastRatio(targetHex, '#000000');

  const faqs = [
    {
      question: `What are the official color values for ${colorData.name}?`,
      answer: `${colorData.name} has a Hexadecimal code of ${colorData.hex.toUpperCase()}, RGB values of (${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b}), HSL coordinates of (${colorData.hsl.h}°, ${colorData.hsl.s}%, ${colorData.hsl.l}%), CMYK print values of (${colorData.cmyk.c}%, ${colorData.cmyk.m}%, ${colorData.cmyk.y}%, ${colorData.cmyk.k}%), and modern CSS OKLCH of oklch(${colorData.oklch.l} ${colorData.oklch.c} ${colorData.oklch.h}).`,
    },
    {
      question: `Is ${colorData.name} accessible on white backgrounds for text?`,
      answer: `When rendered on pure white (#FFFFFF), ${colorData.name} has a contrast ratio of ${contrastOnWhite.ratio}:1, which ${
        contrastOnWhite.normalAA
          ? 'PASSES WCAG 2.1 AA requirements for normal body text and icons.'
          : 'FAILS WCAG AA requirements for normal body text (4.5:1 required). Use a darker shade from the 50-950 scale for small text.'
      }`,
    },
    {
      question: `Is ${colorData.name} accessible on dark backgrounds?`,
      answer: `When rendered on pure black (#000000), ${colorData.name} has a contrast ratio of ${contrastOnBlack.ratio}:1, which ${
        contrastOnBlack.normalAA
          ? 'PASSES WCAG AA requirements for normal body text in dark mode.'
          : 'FAILS WCAG AA requirements for normal body text. Consider using a lighter tint from the 50-950 scale.'
      }`,
    },
    {
      question: `How do I use ${colorData.name} in Tailwind CSS and CSS Variables?`,
      answer: `In CSS custom properties, define: \`--color-${colorData.family}: ${colorData.hex.toUpperCase()};\`. In Tailwind CSS config, define \`theme.extend.colors['${colorData.family}'] = '${colorData.hex}'\` or use the 11-step 50-950 shade scale.`,
    },
    {
      question: `What colors harmonize best with ${colorData.name}?`,
      answer: `${colorData.name} pairs naturally with its complementary opposite (${complementary[1] || '#ffffff'}), triadic accents (${triadic.join(', ')}), and adjacent analogous tones for smooth visual transitions.`,
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: `${colorData.name} (${colorData.hex.toUpperCase()}) Color Codes & Shades`,
          description: `Explore ${colorData.name} (${colorData.hex}) shades, tints, and hex to color name info. Get RGB, HSL, CMYK, OKLCH codes, palettes, and WCAG contrast ratios.`,
          canonicalUrl: `https://chromora.app/colors/${slug}`,
          faqs,
          breadcrumbs: [
            { name: 'Named Colors', url: '/colors' },
            { name: colorData.name, url: `/colors/${slug}` },
          ],
          softwareApp: {
            name: `${colorData.name} Color Profile`,
            description: `Color details for ${colorData.name}`,
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Color Directory', url: '/colors' },
            { name: colorData.name, url: `/colors/${slug}`, isCurrent: true },
          ]}
          onNavigate={navigate}
        />

        {/* Hero Visual Card */}
        <div
          className="my-8 rounded-3xl p-8 sm:p-12 shadow-xl border transition-all flex flex-col justify-between min-h-[280px]"
          style={{
            backgroundColor: colorData.hex,
            color: colorData.isDark ? '#ffffff' : '#09090b',
            borderColor: colorData.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md"
              style={{
                backgroundColor: colorData.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
              }}
            >
              {colorData.family.toUpperCase()} COLOR FAMILY
            </span>

            <button
              onClick={() => {
                setActiveHex(colorData.hex);
                copyToClipboard(colorData.hex.toUpperCase(), `Copied ${colorData.hex}`);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-md border flex items-center gap-1.5 transition-transform hover:scale-105"
              style={{
                backgroundColor: colorData.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
                borderColor: colorData.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              }}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy HEX</span>
            </button>
          </div>

          <div className="mt-12 space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-xs">
              {colorData.name}
            </h1>
            <p className="text-2xl sm:text-3xl font-mono font-normal opacity-90">
              {colorData.hex.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Quick Conversion Coordinates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">HEX</span>
            <p className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-1 uppercase">
              {colorData.hex}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">RGB</span>
            <p className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {colorData.rgb.r}, {colorData.rgb.g}, {colorData.rgb.b}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">HSL</span>
            <p className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {colorData.hsl.h}°, {colorData.hsl.s}%, {colorData.hsl.l}%
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">HSV</span>
            <p className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {colorData.hsv.h}°, {colorData.hsv.s}%, {colorData.hsv.v}%
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">CMYK</span>
            <p className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {colorData.cmyk.c}, {colorData.cmyk.m}, {colorData.cmyk.y}, {colorData.cmyk.k}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">OKLCH</span>
            <p className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {colorData.oklch.l} {colorData.oklch.c}
            </p>
          </div>
        </div>

        {/* Tailwind Shade Curve 50-950 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Tailwind CSS Shade Scale
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Lightness step curve for {colorData.name}
              </p>
            </div>
            <a
              href="/color-picker"
              onClick={(e) => {
                e.preventDefault();
                setActiveHex(colorData.hex);
                navigate('/color-picker');
              }}
              className="text-xs font-bold text-indigo-500 hover:underline"
            >
              Open in Explorer →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
            {shades.map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  setActiveHex(s.hex);
                  copyToClipboard(s.hex, `Copied shade ${s.step}: ${s.hex}`);
                }}
                className="flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 text-left transition-transform hover:scale-105"
              >
                <div className="h-14 w-full" style={{ backgroundColor: s.hex }} />
                <div className="p-2 bg-zinc-50 dark:bg-zinc-950 flex flex-col">
                  <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{s.hex}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contrast Score on Light & Dark Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* On White */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Contrast on Pure White (#FFFFFF)
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  contrastOnWhite.normalAA
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {contrastOnWhite.ratio}:1
              </span>
            </div>
            <div
              className="p-5 rounded-xl border flex items-center justify-center font-bold text-base"
              style={{ backgroundColor: '#ffffff', color: colorData.hex, borderColor: '#e2e8f0' }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
            <p className="text-xs text-zinc-500">
              WCAG AA Normal: {contrastOnWhite.normalAA ? 'PASS' : 'FAIL'} • WCAG AAA: {contrastOnWhite.normalAAA ? 'PASS' : 'FAIL'}
            </p>
          </div>

          {/* On Black */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Contrast on Pure Black (#000000)
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  contrastOnBlack.normalAA
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {contrastOnBlack.ratio}:1
              </span>
            </div>
            <div
              className="p-5 rounded-xl border flex items-center justify-center font-bold text-base"
              style={{ backgroundColor: '#000000', color: colorData.hex, borderColor: '#334155' }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
            <p className="text-xs text-zinc-500">
              WCAG AA Normal: {contrastOnBlack.normalAA ? 'PASS' : 'FAIL'} • WCAG AAA: {contrastOnBlack.normalAAA ? 'PASS' : 'FAIL'}
            </p>
          </div>
        </div>

        {/* Harmonies & Matching Palettes */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Harmonic Color Pairings
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Mathematical combinations anchored on {colorData.name}
              </p>
            </div>

            <a
              href="/color-palette-generator"
              onClick={(e) => {
                e.preventDefault();
                setPaletteFromHexList(analogous, `${colorData.name} Palette`);
                navigate('/color-palette-generator');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors flex items-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Open in Palette Studio</span>
            </a>
          </div>

          {/* Harmonies rows */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
                Analogous Sequence
              </span>
              <div className="flex h-14 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                {analogous.map((hex, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveHex(hex);
                      copyToClipboard(hex, `Copied ${hex}`);
                    }}
                    className="flex-1 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
                Complementary Set
              </span>
              <div className="flex h-14 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                {complementary.map((hex, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveHex(hex);
                      copyToClipboard(hex, `Copied ${hex}`);
                    }}
                    className="flex-1 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FAQSection
          faqs={faqs}
          title={`${colorData.name} Color Science & Specifications`}
        />
      </div>
    </div>
  );
};
