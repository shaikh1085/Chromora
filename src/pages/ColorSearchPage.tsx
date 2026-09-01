import React, { useState, useMemo } from 'react';
import { usePalette } from '../context/PaletteContext';
import { namedColorsDatabase, ColorFamily } from '../data/colorNames';
import { getColorData, hexToSlug } from '../utils/colorUtils';
import { Search, Filter, Copy, Check, ExternalLink, Layers, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FAQSection } from '../components/common/FAQSection';

export const ColorSearchPage: React.FC<{
  initialFamily?: string;
  initialQuery?: string;
  navigate: (route: string) => void;
}> = ({ initialFamily, initialQuery = '', navigate }) => {
  const { setActiveHex, copyToClipboard } = usePalette();
  const [query, setQuery] = useState(initialQuery);
  const [selectedFamily, setSelectedFamily] = useState<string>(initialFamily || 'all');
  const [toneFilter, setToneFilter] = useState<'all' | 'light' | 'dark'>('all');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const families: { id: string; label: string }[] = [
    { id: 'all', label: 'All Families' },
    { id: 'red', label: 'Reds' },
    { id: 'blue', label: 'Blues' },
    { id: 'green', label: 'Greens' },
    { id: 'yellow', label: 'Yellows' },
    { id: 'purple', label: 'Purples' },
    { id: 'orange', label: 'Oranges' },
    { id: 'pink', label: 'Pinks' },
    { id: 'brown', label: 'Browns & Earthy' },
    { id: 'gray', label: 'Grays & Monos' },
  ];

  const enrichedColors = useMemo(() => {
    return namedColorsDatabase.map((c) => {
      const data = getColorData(c.hex);
      return {
        ...c,
        family: data.family,
        isDark: data.isDark,
      };
    });
  }, []);

  const filteredColors = useMemo(() => {
    return enrichedColors.filter((c) => {
      // Family check
      if (selectedFamily !== 'all' && c.family !== selectedFamily) {
        return false;
      }
      // Tone check
      if (toneFilter === 'light' && c.isDark) return false;
      if (toneFilter === 'dark' && !c.isDark) return false;

      // Query check
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesHex = c.hex.toLowerCase().includes(q);
        const matchesFamily = c.family.toLowerCase().includes(q);
        if (!matchesName && !matchesHex && !matchesFamily) {
          return false;
        }
      }

      return true;
    });
  }, [enrichedColors, selectedFamily, toneFilter, query]);

  const handleCopy = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(hex.toUpperCase(), `Copied ${hex}`);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const directoryFaqs = [
    {
      question: 'How are the 400+ named colors cataloged in Chromora?',
      answer:
        'The database compiles historical pigment names (e.g. Cobalt Blue, Alizarin Crimson, Viridian), modern W3C CSS level 4 named colors, Pantone standard shades, and digital UI palettes organized into 9 primary color families.',
    },
    {
      question: 'Can I look up any hex code by name or slug?',
      answer:
        'Yes! Every color has a unique canonical slug (e.g. /colors/crimson-dc143c) with dedicated contrast ratios, Tailwind shade spectra, and harmonic pairings.',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'Color Names Directory & Hex Code Search — Browse 400+ Curated Shades',
          description:
            'Browse our curated color names directory with exact HEX codes and RGB values. Search historical pigments, modern CSS named colors, and brand color swatches.',
          keywords: [
            'color names list with hex codes',
            'html color code search engine',
            'hex code finder by color name',
            'curated color names directory',
            'pantone color names list',
            'css named colors reference chart',
          ],
          canonicalUrl: 'https://chromoraflow.vercel.app/colors',
          faqs: directoryFaqs,
          softwareApp: {
            name: 'Chromora Color Names Directory & Finder',
            description: 'Catalog of 400+ named colors with filtering by hue family, brightness, and hex code.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Named Colors Directory', url: '/colors', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Page Header */}
        <div className="my-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Pigment Encyclopedia</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Named Colors Directory
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
            Search 400+ curated shades, historical pigments, and UI design standards. Click any swatch for full coordinate breakdowns.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm mb-8 space-y-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search color by name, hex (e.g. #0b4f6c), or tag..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-input)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Tone filter */}
            <div className="flex items-center gap-1 bg-[var(--surface-glass-input)] p-1 rounded-xl border border-[var(--border-glass)] shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setToneFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  toneFilter === 'all'
                    ? 'bg-[var(--surface-glass-card)] text-[var(--text-primary)] shadow-xs border border-[var(--border-glass-subtle)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                All Tones
              </button>
              <button
                onClick={() => setToneFilter('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  toneFilter === 'light'
                    ? 'bg-[var(--surface-glass-card)] text-[var(--text-primary)] shadow-xs border border-[var(--border-glass-subtle)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setToneFilter('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  toneFilter === 'dark'
                    ? 'bg-[var(--surface-glass-card)] text-[var(--text-primary)] shadow-xs border border-[var(--border-glass-subtle)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Families Pill Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {families.map((fam) => (
              <button
                key={fam.id}
                onClick={() => setSelectedFamily(fam.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  selectedFamily === fam.id
                    ? 'bg-[var(--text-primary)] text-[var(--bg-page)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border-glass-subtle)]'
                }`}
              >
                {fam.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[var(--text-muted)]">
          <span>
            Showing <strong className="text-[var(--text-primary)]">{filteredColors.length}</strong> matching colors
          </span>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-indigo-500 hover:underline font-semibold"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Color Swatches Grid */}
        {filteredColors.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-16">
            {filteredColors.map((color) => {
              const slug = hexToSlug(color.name, color.hex);
              return (
                <a
                  key={color.hex + color.name}
                  href={`/colors/${slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveHex(color.hex);
                    navigate(`/colors/${slug}`);
                  }}
                  className="group rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] hover:border-[var(--accent)] overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between block backdrop-blur-md"
                >
                  {/* Swatch Head */}
                  <div
                    className="h-28 w-full relative p-2.5 flex items-end justify-between transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: color.hex }}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleCopy(color.hex, e)}
                      className="p-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                      title="Copy HEX"
                    >
                      {copiedHex === color.hex ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Details Bottom */}
                  <div className="p-3 space-y-1">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-indigo-500 transition-colors">
                      {color.name}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                      <span className="uppercase">{color.hex}</span>
                      <span className="capitalize">{color.family}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] mb-16 space-y-3 backdrop-blur-md">
            <Layers className="w-8 h-8 mx-auto text-[var(--text-muted)]" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              No matching colors found
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Try adjusting your query or family filter to discover other shades.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedFamily('all');
                setToneFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* FAQs */}
        <FAQSection
          faqs={directoryFaqs}
          title="Color Names & Taxonomy FAQ"
          subtitle="Understanding naming conventions and color family classification."
        />
      </div>
    </div>
  );
};
