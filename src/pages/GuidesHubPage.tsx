import React, { useState } from 'react';
import { GUIDES_DATABASE, GuideArticle } from '../data/guidesData';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BookOpen, Clock, ArrowRight, Sparkles, Filter, ChevronRight, Layers } from 'lucide-react';

export const GuidesHubPage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const allGuides = Object.values(GUIDES_DATABASE);

  const categories = ['all', 'Color Formats', 'Accessibility', 'UI & Web Design', 'Color Theory'];

  const filteredGuides =
    activeCategory === 'all'
      ? allGuides
      : allGuides.filter((g) => g.category === activeCategory);

  const guidesFaqs = [
    {
      question: 'What color guides are available on Chromora?',
      answer:
        'Chromora provides in-depth technical guides on color formats (HEX vs RGB vs HSL, OKLCH), accessibility (WCAG 2.1 contrast compliance), UI/UX design (how to choose website colors, 60-30-10 rule), and color theory (harmony rules, additive optics).',
    },
    {
      question: 'Are Chromora color guides free to read and cite?',
      answer:
        'Yes, all Chromora color engineering guides and articles are 100% free and open for designers, developers, and educators.',
    },
    {
      question: 'How do I test the concepts explained in these guides?',
      answer:
        'Every guide includes direct interactive links to Chromora’s free tools, such as the WCAG Contrast Checker, Color Converter, Palette Generator, and Design Preview Studio.',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'Color Guides & Tutorials for Designers and Developers — Chromora',
          description:
            'Free in-depth color guides for frontend developers and UI/UX designers. Learn HEX vs RGB vs HSL, OKLCH, WCAG accessibility, color harmonies, and modern design systems.',
          canonicalUrl: 'https://chromoraflow.vercel.app/guides',
          keywords: [
            'color guides for developers',
            'color tutorials',
            'web design color theory',
            'hex vs rgb vs hsl',
            'what is oklch',
            'wcag contrast guide',
            'how to choose website colors',
          ],
          breadcrumbs: [{ name: 'Guides & Tutorials', url: '/guides' }],
          faqs: guidesFaqs,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: 'Guides & Tutorials', url: '/guides', isCurrent: true }]} onNavigate={navigate} />

        {/* Hero Header */}
        <div className="my-8 text-center max-w-3xl mx-auto space-y-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
            style={{
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Educational Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Color Guides &amp; Engineering Tutorials
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            In-depth, practical guides on color theory, digital spaces, modern CSS formats, WCAG accessibility compliance, and UI design systems.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                activeCategory === cat
                  ? 'btn-accent shadow-md'
                  : 'bg-[var(--surface-glass-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)]'
              }`}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <a
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/guides/${guide.slug}`);
              }}
              className="p-6 rounded-2xl glass-card hover:border-[var(--accent)] hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--accent-soft)',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent-border)',
                    }}
                  >
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                    <Clock className="w-3 h-3" />
                    <span>{guide.readTime}</span>
                  </span>
                </div>

                <h2 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-2">
                  {guide.h1}
                </h2>

                <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {guide.summary}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[var(--border-glass-subtle)] flex items-center justify-between text-xs font-bold text-[var(--accent)]">
                <span>Read Full Guide</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        {/* Topic Quick Jump Section */}
        <div className="mt-20 p-8 rounded-3xl glass-panel border border-[var(--border-glass)]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Explore Chromora by Topic
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Jump straight to our dedicated category hubs and interactive toolkits.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Color Tools', route: '/color-tools', desc: 'Picker, shades, and wheel' },
              { name: 'Palette Tools', route: '/palette-tools', desc: 'Harmonies, AI, and collections' },
              { name: 'Color Converters', route: '/color-converter', desc: 'HEX, RGB, HSL, OKLCH, CMYK' },
              { name: 'Accessibility Tools', route: '/accessibility-tools', desc: 'WCAG contrast & blindness' },
              { name: 'Developer Tools', route: '/developer-color-tools', desc: 'Tokens, shades, and CSS exports' },
            ].map((topic) => (
              <a
                key={topic.route}
                href={topic.route}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(topic.route);
                }}
                className="p-4 rounded-xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass)] text-left group transition-all"
              >
                <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {topic.name}
                </div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                  {topic.desc}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
