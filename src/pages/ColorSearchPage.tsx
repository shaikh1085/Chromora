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
          title: 'Color Names List & Hex Code Finder — Chromora',
          description:
            'Explore our comprehensive color names list and hex code finder for over 1,265 named colors. Search by pigment, explore shade scales, and filter by family.',
          canonicalUrl: 'https://chromora.app/colors',
          faqs: directoryFaqs,
          softwareApp: {
            name: 'Chromora Color Names List & Finder',
            description: 'Catalog of 400+ named colors with filter by hue and tone.',
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Pigment Encyclopedia</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Named Colors Directory
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Search 400+ curated shades, historical pigments, and UI design standards. Click any swatch for full coordinate breakdowns.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search color by name, hex (e.g. #0b4f6c), or tag..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Tone filter */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setToneFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  toneFilter === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                All Tones
              </button>
              <button
                onClick={() => setToneFilter('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  toneFilter === 'light'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setToneFilter('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  toneFilter === 'dark'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
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
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {fam.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Showing <strong className="text-zinc-900 dark:text-zinc-100">{filteredColors.length}</strong> matching colors
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
                  className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between block"
                >
                  {/* Swatch Head */}
                  <div
                    className="h-28 w-full relative p-2.5 flex items-end justify-between transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: color.hex }}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleCopy(color.hex, e)}
                      className="p-1.5 rounded-lg bg-black/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
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
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {color.name}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span className="uppercase">{color.hex}</span>
                      <span className="capitalize">{color.family}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-16 space-y-3">
            <Layers className="w-8 h-8 mx-auto text-zinc-400" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              No matching colors found
            </h3>
            <p className="text-xs text-zinc-500">
              Try adjusting your query or family filter to discover other shades.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedFamily('all');
                setToneFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold"
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
