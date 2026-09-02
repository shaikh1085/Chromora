import React, { useState } from 'react';
import { CONVERTER_PAGES, ConverterPageData } from '../data/converterPagesData';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FAQSection } from '../components/common/FAQSection';
import { usePalette } from '../context/PaletteContext';
import {
  parseColorString,
  getColorData,
  rgbToHex,
  hexToHsl,
  hslToHex,
  hexToCmyk,
  cmykToHex,
  hexToOklch,
  oklchToHex,
} from '../utils/colorUtils';
import {
  ArrowRightLeft,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette,
  Eye,
  Layers,
  Code2,
} from 'lucide-react';

export const ConverterSubPage: React.FC<{
  slug: string;
  navigate: (route: string) => void;
}> = ({ slug, navigate }) => {
  const data: ConverterPageData | undefined = CONVERTER_PAGES[slug];
  const { copyToClipboard, setActiveHex, setPaletteFromHexList, showToast } = usePalette();

  const [inputVal, setInputVal] = useState<string>(() => {
    return data?.sampleDefault || '#4F46E5';
  });

  if (!data) {
    return (
      <div className="min-h-screen py-16 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Converter Not Found</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">The requested converter page does not exist.</p>
        <a
          href="/color-converter"
          onClick={(e) => {
            e.preventDefault();
            navigate('/color-converter');
          }}
          className="mt-6 inline-block px-4 py-2 rounded-xl btn-accent font-bold text-xs"
        >
          View All Converters
        </a>
      </div>
    );
  }

  // Real-time conversion logic
  let derivedHex = '#4f46e5';
  try {
    const parsed = parseColorString(inputVal);
    if (parsed) {
      derivedHex = parsed.hex;
    }
  } catch {
    derivedHex = '#4f46e5';
  }

  const colorData = getColorData(derivedHex);

  // Compute specific format output
  let targetOutput = '';
  if (data.toFormat === 'hex') {
    targetOutput = colorData.hex.toUpperCase();
  } else if (data.toFormat === 'rgb') {
    targetOutput = `rgb(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b})`;
  } else if (data.toFormat === 'hsl') {
    targetOutput = `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, ${colorData.hsl.l}%)`;
  } else if (data.toFormat === 'cmyk') {
    targetOutput = `cmyk(${colorData.cmyk.c}%, ${colorData.cmyk.m}%, ${colorData.cmyk.y}%, ${colorData.cmyk.k}%)`;
  } else if (data.toFormat === 'oklch') {
    targetOutput = `oklch(${colorData.oklch.l} ${colorData.oklch.c} ${colorData.oklch.h})`;
  }

  const samplePresets = [
    '#4F46E5',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#EC4899',
    '#8B5CF6',
    '#06B6D4',
    '#18181B',
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: data.title,
          description: data.metaDescription,
          canonicalUrl: `https://chromoraflow.vercel.app/${data.slug}`,
          keywords: [data.primaryKeyword, 'color converter', 'css colors', 'web design', 'hex code', 'color conversion'],
          breadcrumbs: [
            { name: 'Color Converter', url: '/color-converter' },
            { name: data.h1, url: `/${data.slug}` },
          ],
          faqs: data.faqs,
          softwareApp: {
            name: `${data.h1} Tool`,
            description: data.metaDescription,
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Color Converter', url: '/color-converter' },
            { name: data.h1, url: `/${data.slug}`, isCurrent: true },
          ]}
          onNavigate={navigate}
        />

        {/* Hero Section */}
        <div className="my-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2"
            style={{
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Developer-Ready Mathematical Conversion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {data.h1}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {data.intro}
          </p>
        </div>

        {/* Interactive Conversion Box Above the Fold */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel shadow-xl mb-12 border border-[var(--border-glass)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Side */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Input Value ({data.fromFormat.toUpperCase()})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={`e.g. ${data.sampleDefault}`}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] text-[var(--text-primary)] font-mono text-sm font-bold focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Sample Quick Swatches */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] font-semibold text-[var(--text-muted)]">Presets:</span>
                {samplePresets.map((swatch, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => {
                      if (data.fromFormat === 'hex') setInputVal(swatch);
                      else if (data.fromFormat === 'rgb') {
                        const d = getColorData(swatch);
                        setInputVal(`rgb(${d.rgb.r}, ${d.rgb.g}, ${d.rgb.b})`);
                      } else if (data.fromFormat === 'hsl') {
                        const d = getColorData(swatch);
                        setInputVal(`hsl(${d.hsl.h}, ${d.hsl.s}%, ${d.hsl.l}%)`);
                      } else if (data.fromFormat === 'cmyk') {
                        const d = getColorData(swatch);
                        setInputVal(`cmyk(${d.cmyk.c}%, ${d.cmyk.m}%, ${d.cmyk.y}%, ${d.cmyk.k}%)`);
                      } else if (data.fromFormat === 'oklch') {
                        const d = getColorData(swatch);
                        setInputVal(`oklch(${d.oklch.l} ${d.oklch.c} ${d.oklch.h})`);
                      }
                    }}
                    className="w-6 h-6 rounded-full border border-black/10 transition-transform hover:scale-110 shadow-xs"
                    style={{ backgroundColor: swatch }}
                    aria-label={`Select ${swatch}`}
                  />
                ))}
              </div>
            </div>

            {/* Visual Color Preview */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-lg border border-black/10 transition-all duration-300 transform hover:rotate-3"
                style={{ backgroundColor: colorData.hex }}
              />
              <span className="mt-2 text-xs font-bold font-mono text-[var(--text-secondary)]">
                {colorData.name}
              </span>
            </div>

            {/* Output Side */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Converted Result ({data.toFormat.toUpperCase()})
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3.5 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] text-[var(--text-primary)] font-mono text-sm font-bold flex items-center justify-between">
                  <span className="truncate">{targetOutput}</span>
                </div>
                <button
                  onClick={() => {
                    copyToClipboard(targetOutput, `Copied ${targetOutput}`);
                  }}
                  className="px-5 py-3.5 rounded-2xl btn-accent font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <a
                  href="/wcag-contrast-checker"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveHex(colorData.hex);
                    navigate('/wcag-contrast-checker');
                  }}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Test Contrast</span>
                </a>
                <span className="text-[var(--text-muted)]">•</span>
                <a
                  href="/color-palette-generator"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveHex(colorData.hex);
                    navigate('/color-palette-generator');
                  }}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Generate Palette</span>
                </a>
                <span className="text-[var(--text-muted)]">•</span>
                <a
                  href="/design-preview"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveHex(colorData.hex);
                    navigate('/design-preview');
                  }}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview in UI</span>
                </a>
              </div>
            </div>
          </div>

          {/* All Color Formats Table */}
          <div className="mt-8 pt-6 border-t border-[var(--border-glass-subtle)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Full Spectral Coordinate Breakdown
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass-subtle)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)]">HEX</span>
                <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">{colorData.hex.toUpperCase()}</p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass-subtle)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)]">RGB</span>
                <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">{colorData.rgb.r}, {colorData.rgb.g}, {colorData.rgb.b}</p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass-subtle)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)]">HSL</span>
                <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">{colorData.hsl.h}°, {colorData.hsl.s}%, {colorData.hsl.l}%</p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass-subtle)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)]">CMYK</span>
                <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">{colorData.cmyk.c}%, {colorData.cmyk.m}%, {colorData.cmyk.y}%, {colorData.cmyk.k}%</p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass-subtle)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)]">OKLCH</span>
                <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">{colorData.oklch.l} {colorData.oklch.c} {colorData.oklch.h}°</p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass-subtle)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)]">Luminance</span>
                <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">{Math.round(colorData.luminance * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Formula Banner */}
        <div className="p-6 rounded-2xl glass-card border border-[var(--border-glass)] mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Conversion Formula & Logic</h2>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-glass-subtle)] font-mono text-xs text-[var(--text-primary)] overflow-x-auto">
            {data.formula}
          </div>
        </div>

        {/* In-Depth Educational Guide (500+ Words) */}
        <div className="space-y-8 mb-16 max-w-4xl">
          {data.guideSections.map((section, idx) => (
            <article key={idx} className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                {section.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </article>
          ))}
        </div>

        {/* Related Converter Pages */}
        <div className="my-12 p-6 rounded-3xl glass-card border border-[var(--border-glass)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>Related Color Converters</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.relatedSlugs.map((relSlug) => {
              const relData = CONVERTER_PAGES[relSlug];
              if (!relData) return null;
              return (
                <a
                  key={relSlug}
                  href={`/${relSlug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${relSlug}`);
                  }}
                  className="p-4 rounded-2xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass-subtle)] text-left transition-all hover:border-[var(--accent)] group block"
                >
                  <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors flex items-center justify-between">
                    <span>{relData.h1}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">
                    {relData.metaDescription}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Related Core Chromora Tools */}
        <div className="my-12 p-6 rounded-3xl glass-panel border border-[var(--border-glass)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>Related Chromora Design Tools</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href="/color-picker"
              onClick={(e) => {
                e.preventDefault();
                navigate('/color-picker');
              }}
              className="p-4 rounded-2xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass-subtle)] text-left transition-all hover:border-[var(--accent)] block"
            >
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Online Color Picker</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Interactive visual canvas with harmony generators.</p>
            </a>
            <a
              href="/color-palette-generator"
              onClick={(e) => {
                e.preventDefault();
                navigate('/color-palette-generator');
              }}
              className="p-4 rounded-2xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass-subtle)] text-left transition-all hover:border-[var(--accent)] block"
            >
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Color Palette Studio</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Generate 2 to 10 color harmonious palettes.</p>
            </a>
            <a
              href="/wcag-contrast-checker"
              onClick={(e) => {
                e.preventDefault();
                navigate('/wcag-contrast-checker');
              }}
              className="p-4 rounded-2xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass-subtle)] text-left transition-all hover:border-[var(--accent)] block"
            >
              <h3 className="text-xs font-bold text-[var(--text-primary)]">WCAG Contrast Checker</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Verify text accessibility and compliance.</p>
            </a>
            <a
              href="/gradient-generator"
              onClick={(e) => {
                e.preventDefault();
                navigate('/gradient-generator');
              }}
              className="p-4 rounded-2xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass-subtle)] text-left transition-all hover:border-[var(--accent)] block"
            >
              <h3 className="text-xs font-bold text-[var(--text-primary)]">CSS Gradient Generator</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Linear and radial gradients with CSS exports.</p>
            </a>
          </div>
        </div>

        {/* FAQs */}
        <FAQSection
          title={`Frequently Asked Questions About ${data.h1}`}
          faqs={data.faqs}
        />
      </div>
    </div>
  );
};
