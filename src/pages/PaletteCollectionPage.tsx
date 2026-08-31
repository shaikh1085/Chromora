import React, { useState } from 'react';
import { COLLECTION_PAGES, CollectionPageData, SamplePalette } from '../data/collectionPagesData';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FAQSection } from '../components/common/FAQSection';
import { usePalette } from '../context/PaletteContext';
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Eye,
  Palette,
  ShieldCheck,
  Download,
  Shuffle,
  Layers,
  Code2,
  BookOpen,
} from 'lucide-react';

export const PaletteCollectionPage: React.FC<{
  slug: string;
  navigate: (route: string) => void;
}> = ({ slug, navigate }) => {
  const data: CollectionPageData | undefined = COLLECTION_PAGES[slug];
  const { setPaletteFromHexList, setActiveHex, copyToClipboard, showToast } = usePalette();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!data) {
    return (
      <div className="min-h-screen py-16 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Collection Not Found</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">The requested collection does not exist.</p>
        <a
          href="/saved-palettes"
          onClick={(e) => {
            e.preventDefault();
            navigate('/saved-palettes');
          }}
          className="mt-6 inline-block px-4 py-2 rounded-xl btn-accent font-bold text-xs"
        >
          View Collections
        </a>
      </div>
    );
  }

  const handleApplyPalette = (palette: SamplePalette) => {
    setPaletteFromHexList(palette.colors);
    showToast(`Loaded "${palette.name}" into Chromora Studio`);
  };

  const handleCopyPaletteHexes = (palette: SamplePalette, idx: number) => {
    const text = palette.colors.join(', ');
    copyToClipboard(text, `Copied ${palette.name} hex codes`);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: data.title,
          description: data.metaDescription,
          canonicalUrl: `https://chromoraflow.vercel.app/${data.slug}`,
          keywords: [
            data.primaryKeyword,
            `${data.primaryKeyword} ideas`,
            'color palette generator',
            'color schemes',
            'color combinations',
            'design tokens',
          ],
          breadcrumbs: [
            { name: 'Color Collections', url: '/saved-color-palettes' },
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
            { name: 'Color Collections', url: '/saved-color-palettes' },
            { name: data.h1, url: `/${data.slug}`, isCurrent: true },
          ]}
          onNavigate={navigate}
        />

        {/* Hero Header */}
        <div className="my-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2"
            style={{
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Palette Collection & Generator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {data.h1}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {data.intro}
          </p>
        </div>

        {/* Action Bar Above Palettes */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-[var(--border-glass)] mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--text-primary)]">
              {data.samplePalettes.length} Curated Color Schemes
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-glass-card)] text-[var(--text-muted)] border border-[var(--border-glass-subtle)] font-mono">
              Ready to Export
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/color-palette-generator"
              onClick={(e) => {
                e.preventDefault();
                const random = data.samplePalettes[Math.floor(Math.random() * data.samplePalettes.length)];
                handleApplyPalette(random);
                navigate('/color-palette-generator');
              }}
              className="px-3.5 py-2 rounded-xl btn-accent text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Randomize in Studio</span>
            </a>
            <a
              href="/design-preview"
              onClick={(e) => {
                e.preventDefault();
                handleApplyPalette(data.samplePalettes[0]);
                navigate('/design-preview');
              }}
              className="px-3.5 py-2 rounded-xl glass-card border border-[var(--border-glass)] text-[var(--text-primary)] hover:border-[var(--accent)] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview in Live UI</span>
            </a>
          </div>
        </div>

        {/* Curated Palettes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {data.samplePalettes.map((palette, pIdx) => (
            <div
              key={pIdx}
              className="rounded-3xl glass-panel p-5 border border-[var(--border-glass)] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Palette Swatches Bar */}
                <div className="h-24 rounded-2xl overflow-hidden flex shadow-inner border border-black/10 mb-4">
                  {palette.colors.map((hex, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => {
                        setActiveHex(hex);
                        copyToClipboard(hex, `Copied ${hex}`);
                      }}
                      className="flex-1 h-full transition-transform hover:scale-105 relative group/swatch focus:outline-none"
                      style={{ backgroundColor: hex }}
                      title={`Click to copy ${hex}`}
                      aria-label={`Copy color ${hex}`}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover/swatch:opacity-100 bg-black/25 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-mono font-bold text-white px-1 py-0.5 rounded bg-black/50">
                          {hex}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Palette Title & Use Case */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {palette.name}
                  </h2>
                  <button
                    onClick={() => handleCopyPaletteHexes(palette, pIdx)}
                    className="p-1.5 rounded-lg hover:bg-[var(--surface-glass-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
                    title="Copy all HEX codes"
                  >
                    {copiedIndex === pIdx ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  {palette.useCase}
                </p>

                {/* Hex Code Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {palette.colors.map((hex, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => {
                        setActiveHex(hex);
                        copyToClipboard(hex, `Copied ${hex}`);
                      }}
                      className="px-2 py-1 rounded-md bg-[var(--surface-glass-card)] border border-[var(--border-glass-subtle)] text-[11px] font-mono font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
                    >
                      {hex.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[var(--border-glass-subtle)] flex items-center justify-between gap-2">
                <a
                  href="/color-palette-generator"
                  onClick={(e) => {
                    e.preventDefault();
                    handleApplyPalette(palette);
                    navigate('/color-palette-generator');
                  }}
                  className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Open in Studio</span>
                </a>
                <div className="flex items-center gap-1">
                  <a
                    href="/design-preview"
                    onClick={(e) => {
                      e.preventDefault();
                      handleApplyPalette(palette);
                      navigate('/design-preview');
                    }}
                    className="p-2 rounded-xl hover:bg-[var(--surface-glass-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center justify-center"
                    title="Preview in UI Mockup"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/contrast-checker"
                    onClick={(e) => {
                      e.preventDefault();
                      handleApplyPalette(palette);
                      navigate('/contrast-checker');
                    }}
                    className="p-2 rounded-xl hover:bg-[var(--surface-glass-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center justify-center"
                    title="Check WCAG Contrast"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/design-tokens"
                    onClick={(e) => {
                      e.preventDefault();
                      handleApplyPalette(palette);
                      navigate('/design-tokens');
                    }}
                    className="p-2 rounded-xl hover:bg-[var(--surface-glass-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center justify-center"
                    title="Export Tokens"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* In-Depth Guide & Typography Section */}
        <div className="p-8 rounded-3xl glass-panel border border-[var(--border-glass)] mb-16 space-y-8 max-w-4xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Comprehensive Design Guide
            </span>
          </div>

          {data.guideSections.map((sec, sIdx) => (
            <article key={sIdx} className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                {sec.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {sec.content}
              </p>
            </article>
          ))}
        </div>

        {/* Related Collections */}
        <div className="my-12 p-6 rounded-3xl glass-card border border-[var(--border-glass)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>Explore Related Color Collections</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.relatedSlugs.map((relSlug) => {
              const relData = COLLECTION_PAGES[relSlug];
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
            <Code2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>Power Your Workflow with Chromora Tools</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              href="/design-preview"
              onClick={(e) => {
                e.preventDefault();
                navigate('/design-preview');
              }}
              className="p-4 rounded-2xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass-subtle)] text-left transition-all hover:border-[var(--accent)] block"
            >
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Design Color Preview</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Simulate colors on real UI components & mockups.</p>
            </a>
            <a
              href="/contrast-checker"
              onClick={(e) => {
                e.preventDefault();
                navigate('/contrast-checker');
              }}
              className="p-4 rounded-2xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass-subtle)] text-left transition-all hover:border-[var(--accent)] block"
            >
              <h3 className="text-xs font-bold text-[var(--text-primary)]">WCAG Contrast Checker</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Verify text accessibility and compliance.</p>
            </a>
            <a
              href="/design-tokens"
              onClick={(e) => {
                e.preventDefault();
                navigate('/design-tokens');
              }}
              className="p-4 rounded-2xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass-subtle)] text-left transition-all hover:border-[var(--accent)] block"
            >
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Design Token Generator</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Export Tailwind, CSS, SCSS & JSON tokens.</p>
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
