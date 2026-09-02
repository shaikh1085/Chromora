import React, { useState, useMemo } from 'react';
import { COLLECTION_PAGES, CollectionPageData } from '../data/collectionPagesData';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  Palette,
  Search,
  ArrowRight,
  Layers,
  Sparkles,
  SlidersHorizontal,
  FolderHeart,
  Compass,
} from 'lucide-react';

export const PaletteCollectionsDirectoryPage: React.FC<{
  navigate: (route: string) => void;
}> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const allCollections = useMemo(() => {
    return Object.values(COLLECTION_PAGES);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allCollections.forEach((col) => {
      if (col.category) cats.add(col.category);
    });
    return ['All', ...Array.from(cats)];
  }, [allCollections]);

  const filteredCollections = useMemo(() => {
    return allCollections.filter((col) => {
      const matchesCategory =
        selectedCategory === 'All' || col.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        col.title.toLowerCase().includes(query) ||
        col.h1.toLowerCase().includes(query) ||
        col.primaryKeyword.toLowerCase().includes(query) ||
        col.intro.toLowerCase().includes(query) ||
        col.samplePalettes.some((p) =>
          p.name.toLowerCase().includes(query) ||
          p.colors.some((c) => c.toLowerCase().includes(query))
        );

      return matchesCategory && matchesSearch;
    });
  }, [allCollections, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'Color Palette Collections & Schemes Directory — Chromora',
          description:
            'Explore curated color palette collections for UI/UX design, brand identity, SaaS dashboards, weddings, culture, and aesthetic web design.',
          canonicalUrl: 'https://chromoraflow.vercel.app/palettes',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Palette Collections', url: '/palettes', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Hero Banner */}
        <div className="my-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Design Systems & Schemes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Color Palette Collections
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Hand-curated, WCAG-tested color schemes tailored for modern digital applications, 
            creative portfolios, cultural festivities, and brand design systems.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-subtle)] shadow-xs mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections, colors..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Collections Grid */}
        {filteredCollections.length === 0 ? (
          <div className="text-center py-16 bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-subtle)]">
            <FolderHeart className="w-10 h-10 mx-auto text-[var(--text-tertiary)] mb-3" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">No matching collections found</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Try adjusting your search terms or selecting "All" categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((col) => {
              const previewPalette = col.samplePalettes[0]?.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
              return (
                <div
                  key={col.slug}
                  onClick={() => navigate(`/palettes/${col.slug}`)}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-subtle)] hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer"
                >
                  <div>
                    {/* Visual Color Preview Bar */}
                    <div className="h-16 rounded-xl overflow-hidden flex shadow-xs mb-4 border border-black/5 dark:border-white/5 group-hover:scale-[1.01] transition-transform">
                      {previewPalette.map((hex, i) => (
                        <div
                          key={i}
                          className="flex-1 h-full"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>

                    {/* Category & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {col.category || 'Palette Guide'}
                      </span>
                      <span className="text-[10px] font-medium text-[var(--text-tertiary)] flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {col.samplePalettes.length} Palettes
                      </span>
                    </div>

                    {/* Title & Intro */}
                    <h2 className="text-base font-bold text-[var(--text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {col.h1}
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
                      {col.intro}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    <span>Explore Schemes</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Hub Footer Callout */}
        <div className="mt-16 p-8 rounded-3xl bg-linear-to-br from-indigo-500/5 via-[var(--surface-primary)] to-purple-500/5 border border-indigo-500/20 text-center max-w-4xl mx-auto">
          <Palette className="w-10 h-10 mx-auto text-indigo-600 dark:text-indigo-400 mb-3" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Create Custom Palettes in Chromora Studio
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 max-w-xl mx-auto">
            Need a tailored color scheme for your next project? Generate harmonic color palettes, extract hues from photos, or simulate color blindness modes in real time.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/generator')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Studio Generator</span>
            </button>
            <button
              onClick={() => navigate('/guides')}
              className="px-5 py-2.5 rounded-xl bg-[var(--surface-secondary)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold text-xs transition-all"
            >
              Browse Color Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
