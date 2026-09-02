import React from 'react';
import { GUIDES_DATABASE, GuideArticle } from '../data/guidesData';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FAQSection } from '../components/common/FAQSection';
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Lightbulb,
  Info,
  AlertTriangle,
  Layers,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { usePalette } from '../context/PaletteContext';

export const GuideDetailPage: React.FC<{
  slug: string;
  navigate: (route: string) => void;
}> = ({ slug, navigate }) => {
  const guide: GuideArticle | undefined = GUIDES_DATABASE[slug];
  const { showToast, copyToClipboard } = usePalette();

  if (!guide) {
    return (
      <div className="min-h-[60vh] py-20 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Guide Not Found</h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          The requested color guide does not exist or may have been moved.
        </p>
        <button
          onClick={() => navigate('/guides')}
          className="mt-6 px-6 py-2.5 rounded-xl btn-accent font-bold text-xs"
        >
          Browse All Guides
        </button>
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    copyToClipboard(url, 'Guide link copied to clipboard');
  };

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: guide.title,
          description: guide.metaDescription,
          canonicalUrl: `https://chromoraflow.vercel.app/guides/${guide.slug}`,
          keywords: [
            guide.primaryKeyword,
            `${guide.primaryKeyword} guide`,
            'color guide for developers',
            'web design colors',
            'color theory',
            'UI color palette',
          ],
          breadcrumbs: [
            { name: 'Guides', url: '/guides' },
            { name: guide.h1, url: `/guides/${guide.slug}` },
          ],
          faqs: guide.faqs,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Guides', url: '/guides' },
            { name: guide.h1, url: `/guides/${guide.slug}`, isCurrent: true },
          ]}
          onNavigate={navigate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6">
          {/* Main Guide Content (8 cols) */}
          <article className="lg:col-span-8">
            {/* Header / Meta */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent-border)',
                  }}
                >
                  {guide.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{guide.readTime}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Updated {guide.lastUpdated}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
                {guide.h1}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed border-l-4 border-[var(--accent)] pl-4 py-1">
                {guide.summary}
              </p>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border-glass)]">
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  Author: <strong>Chromora Color Engineering Team</strong>
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors px-3 py-1.5 rounded-lg bg-[var(--surface-glass-card)] border border-[var(--border-glass)]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Guide</span>
                </button>
              </div>
            </div>

            {/* Quick In-Page Table of Contents */}
            <nav className="glass-card rounded-2xl p-5 mb-8 border border-[var(--border-glass)]" aria-label="Table of contents">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                Table of Contents
              </h2>
              <ul className="space-y-2 text-xs">
                {guide.sections.map((sec, idx) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-2 py-0.5"
                    >
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">0{idx + 1}.</span>
                      <span>{sec.heading}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Structured Content Sections */}
            <div className="space-y-10">
              {guide.sections.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-24 space-y-4">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                    {sec.heading}
                  </h2>

                  <div className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </div>

                  {sec.callout && (
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3 my-4 ${
                        sec.callout.type === 'tip'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
                          : sec.callout.type === 'warning'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-200'
                          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-950 dark:text-indigo-200'
                      }`}
                    >
                      {sec.callout.type === 'tip' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                      {sec.callout.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
                      {sec.callout.type === 'info' && <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />}
                      <div className="text-xs sm:text-sm">
                        <strong className="block font-bold mb-0.5">{sec.callout.title}</strong>
                        <span>{sec.callout.text}</span>
                      </div>
                    </div>
                  )}

                  {sec.codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-[var(--border-glass)] bg-slate-950 text-slate-100 font-mono text-xs my-4 shadow-xl">
                      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{sec.codeSnippet.language.toUpperCase()} Snippet</span>
                        <button
                          onClick={() => copyToClipboard(sec.codeSnippet!.code, 'Code snippet copied')}
                          className="hover:text-white transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto leading-relaxed">
                        <code>{sec.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Embedded Interactive Tools Callout */}
            <div className="mt-14 glass-panel rounded-2xl p-6 sm:p-8 border border-[var(--border-glass)] shadow-xl relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  background: 'radial-gradient(circle at top right, var(--accent) 0%, transparent 70%)',
                }}
              />
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  Try It In The Studio
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">
                  Put This Color Guide into Practice
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 mb-6">
                  Explore Chromora’s free, instant web tools to calculate color conversions, test contrast, and build design tokens.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guide.relatedTools.map((tool) => (
                    <a
                      key={tool.route}
                      href={tool.route}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(tool.route);
                      }}
                      className="p-4 rounded-xl glass-card hover:border-[var(--accent)] transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--surface-glass-card)] px-2 py-0.5 rounded-full border border-[var(--border-glass)]">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-[var(--border-glass-subtle)] flex items-center justify-between text-[11px] font-bold text-[var(--accent)]">
                        <span>Launch Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Guides List */}
            {guide.relatedGuides && guide.relatedGuides.length > 0 && (
              <div className="mt-14">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                  Related Color Guides &amp; Articles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guide.relatedGuides.map((relSlug) => {
                    const relGuide = GUIDES_DATABASE[relSlug];
                    if (!relGuide) return null;
                    return (
                      <a
                        key={relSlug}
                        href={`/guides/${relSlug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/guides/${relSlug}`);
                        }}
                        className="p-4 rounded-xl glass-card hover:border-[var(--accent)] transition-all group block"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                          {relGuide.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] mt-1 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                          {relGuide.title}
                        </h4>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2">
                          {relGuide.summary}
                        </p>
                        <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[var(--accent)]">
                          <span>Read Guide</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Tool Launch Widget */}
            <div className="glass-panel rounded-2xl p-6 border border-[var(--border-glass)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                Featured Tools for this Topic
              </h3>
              <div className="space-y-2.5">
                {guide.relatedTools.map((tool) => (
                  <a
                    key={tool.route}
                    href={tool.route}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(tool.route);
                    }}
                    className="block p-3 rounded-xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass)] transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {tool.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">
                      {tool.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* Popular Guides in Sidebar */}
            <div className="glass-panel rounded-2xl p-6 border border-[var(--border-glass)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                More Color Guides
              </h3>
              <div className="space-y-3">
                {Object.values(GUIDES_DATABASE)
                  .filter((g) => g.slug !== guide.slug)
                  .slice(0, 5)
                  .map((g) => (
                    <a
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/guides/${g.slug}`);
                      }}
                      className="block group"
                    >
                      <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">
                        {g.category}
                      </span>
                      <h4 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {g.h1}
                      </h4>
                    </a>
                  ))}
              </div>
              <div className="pt-2 border-t border-[var(--border-glass-subtle)]">
                <a
                  href="/guides"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/guides');
                  }}
                  className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <span>View All 9 Guides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Structured FAQ Section */}
        {guide.faqs && guide.faqs.length > 0 && (
          <div className="mt-16">
            <FAQSection
              faqs={guide.faqs}
              title={`Frequently Asked Questions: ${guide.h1}`}
              subtitle="Quick answers to common questions about this color topic."
            />
          </div>
        )}
      </div>
    </div>
  );
};
