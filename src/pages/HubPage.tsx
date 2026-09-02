import React from 'react';
import { HUB_CATEGORIES, HubCategorySEO, TOOLS_KEYWORD_MAP, ToolKeywordEntry } from '../data/seoKeywordMap';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FAQSection } from '../components/common/FAQSection';
import {
  Compass,
  Palette,
  Sparkles,
  ImageIcon,
  CheckCircle,
  Eye,
  Sliders,
  Repeat,
  Layers,
  Droplets,
  Shuffle,
  Printer,
  Globe,
  Layout,
  ArrowRight,
  ShieldCheck,
  Code2,
  BookOpen,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  'color-picker': Compass,
  'color-palette-generator': Palette,
  'ai-palette-generator': Sparkles,
  'image-color-extractor': ImageIcon,
  'wcag-contrast-checker': CheckCircle,
  'gradient-generator': Sliders,
  'color-converter': Repeat,
  'color-shades-generator': Layers,
  'color-mixer': Droplets,
  'color-blindness-simulator': Eye,
  'random-color-generator': Shuffle,
  'pantone-color-converter': Printer,
  'favicon-generator': Globe,
  'color-wheel': Compass,
  'design-preview': Layout,
};

export const HubPage: React.FC<{
  categorySlug: string;
  navigate: (route: string) => void;
}> = ({ categorySlug, navigate }) => {
  const hubData: HubCategorySEO | undefined = HUB_CATEGORIES[categorySlug];

  if (!hubData) {
    return (
      <div className="min-h-screen py-16 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Category Hub Not Found</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">The requested tool category does not exist.</p>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="mt-6 inline-block px-4 py-2 rounded-xl btn-accent font-bold text-xs"
        >
          Return to Home
        </a>
      </div>
    );
  }

  // Get tools associated with this hub
  const tools: ToolKeywordEntry[] = hubData.toolIds
    .map((id) => TOOLS_KEYWORD_MAP.find((t) => t.id === id))
    .filter((t): t is ToolKeywordEntry => Boolean(t));

  // Get other sister hubs for cross-linking
  const sisterHubs = Object.values(HUB_CATEGORIES).filter((h) => h.slug !== categorySlug);

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: hubData.seoTitle,
          description: hubData.metaDescription,
          canonicalUrl: hubData.canonicalUrl,
          keywords: [
            hubData.name.toLowerCase(),
            'free online color tools',
            'design tools for web developers',
            'color palette tools',
            'wcag accessibility tools',
          ],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: hubData.name, url: hubData.route },
          ],
          faqs: hubData.faqs,
          softwareApp: {
            name: `Chromora ${hubData.name}`,
            description: hubData.metaDescription,
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: hubData.name, url: hubData.route, isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Hero Header */}
        <div className="my-8 text-left max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Tool Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {hubData.h1}
          </h1>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
            {hubData.leadParagraph}
          </p>
        </div>

        {/* Categorized Tools Grid */}
        <div className="my-10">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Featured {hubData.name}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => {
              const IconComp = ICON_MAP[tool.id] || Sparkles;
              return (
                <div
                  key={tool.id}
                  className="p-6 rounded-3xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] hover:border-indigo-500/60 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50 group-hover:scale-105 transition-transform">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {tool.name}
                          </h3>
                          <span className="text-xs text-[var(--text-muted)] font-mono">
                            {tool.route}
                          </span>
                        </div>
                      </div>

                      <a
                        href={tool.route}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(tool.route);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                      >
                        <span>Launch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                      {tool.metaDescription}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-[var(--border-glass-subtle)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Core Capabilities
                      </span>
                      <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                        {tool.usefulContentHighlights.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                            <span className="line-clamp-2">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[var(--border-glass-subtle)] flex items-center justify-between">
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Primary Intent: {tool.primarySearchIntent}
                    </span>
                    <a
                      href={tool.route}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(tool.route);
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Educational Guides Section */}
        <div className="my-14 space-y-8 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Technical Best Practices & Knowledge Guide</span>
          </div>

          {hubData.guides.map((guide, idx) => (
            <article
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] space-y-3"
            >
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {guide.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {guide.content}
              </p>
            </article>
          ))}
        </div>

        {/* Sister Topic Hubs Cross-Linking */}
        <div className="my-14 p-6 sm:p-8 rounded-3xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            <span>Explore Other Chromora Tool Categories</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sisterHubs.map((sister) => (
              <a
                key={sister.slug}
                href={sister.route}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(sister.route);
                }}
                className="p-4 rounded-2xl bg-[var(--bg-page)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass-subtle)] hover:border-indigo-500 transition-all text-left group block"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sister.name}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                  {sister.metaDescription}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <FAQSection
          faqs={hubData.faqs}
          title={`${hubData.name} FAQ`}
          subtitle="Answers to common questions about using Chromora's tools in professional workflows."
        />
      </div>
    </div>
  );
};
