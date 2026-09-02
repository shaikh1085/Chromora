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
import { isColorIndexable } from '../data/colorQualityAudit';

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

  const indexable = isColorIndexable(slug) && isColorIndexable(colorData.name);

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: `${colorData.name} (${colorData.hex.toUpperCase()}) Color Codes & Shades`,
          description: `Explore ${colorData.name} (${colorData.hex}) shades, tints, and hex to color name info. Get RGB, HSL, CMYK, OKLCH codes, palettes, and WCAG contrast ratios.`,
          canonicalUrl: `https://chromoraflow.vercel.app/colors/${slug}`,
          robots: indexable ? 'index, follow' : 'noindex, follow',
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
          <div className="p-4 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm backdrop-blur-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">HEX</span>
            <p className="text-sm font-mono font-bold text-[var(--text-primary)] mt-1 uppercase">
              {colorData.hex}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm backdrop-blur-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">RGB</span>
            <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-1">
              {colorData.rgb.r}, {colorData.rgb.g}, {colorData.rgb.b}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm backdrop-blur-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">HSL</span>
            <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-1">
              {colorData.hsl.h}°, {colorData.hsl.s}%, {colorData.hsl.l}%
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm backdrop-blur-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">HSV</span>
            <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-1">
              {colorData.hsv.h}°, {colorData.hsv.s}%, {colorData.hsv.v}%
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm backdrop-blur-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">CMYK</span>
            <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-1">
              {colorData.cmyk.c}, {colorData.cmyk.m}, {colorData.cmyk.y}, {colorData.cmyk.k}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm backdrop-blur-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">OKLCH</span>
            <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-1">
              {colorData.oklch.l} {colorData.oklch.c}
            </p>
          </div>
        </div>

        {/* Tailwind Shade Curve 50-950 */}
        <div className="p-6 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm mb-12 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Tailwind CSS Shade Scale
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
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
                className="flex flex-col rounded-xl overflow-hidden border border-[var(--border-glass-subtle)] text-left transition-transform hover:scale-105"
              >
                <div className="h-14 w-full" style={{ backgroundColor: s.hex }} />
                <div className="p-2 bg-[var(--surface-glass-input)] flex flex-col">
                  <span className="text-[11px] font-bold text-[var(--text-primary)]">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">{s.hex}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contrast Score on Light & Dark Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* On White */}
          <div className="p-6 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
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
              style={{ backgroundColor: '#ffffff', color: colorData.hex, borderColor: 'var(--border-glass-subtle)' }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              WCAG AA Normal: {contrastOnWhite.normalAA ? 'PASS' : 'FAIL'} • WCAG AAA: {contrastOnWhite.normalAAA ? 'PASS' : 'FAIL'}
            </p>
          </div>

          {/* On Black */}
          <div className="p-6 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
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
              style={{ backgroundColor: '#000000', color: colorData.hex, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              WCAG AA Normal: {contrastOnBlack.normalAA ? 'PASS' : 'FAIL'} • WCAG AAA: {contrastOnBlack.normalAAA ? 'PASS' : 'FAIL'}
            </p>
          </div>
        </div>

        {/* Harmonies & Matching Palettes */}
        <div className="p-6 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm mb-12 space-y-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Harmonic Color Pairings
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
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
              <span className="text-xs font-bold text-[var(--text-secondary)] block mb-2">
                Analogous Sequence
              </span>
              <div className="flex h-14 rounded-xl overflow-hidden border border-[var(--border-glass-subtle)]">
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
              <span className="text-xs font-bold text-[var(--text-secondary)] block mb-2">
                Complementary Set
              </span>
              <div className="flex h-14 rounded-xl overflow-hidden border border-[var(--border-glass-subtle)]">
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
