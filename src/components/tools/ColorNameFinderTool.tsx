import React, { useState, useMemo } from 'react';
import {
  getNearestColorNames,
  generateTailwindShades,
  parseColorInput,
  hexToSlug,
} from '../../utils/colorUtils';
import { Search, Copy, Check, ArrowRight, Tag, Palette } from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { FAQItem, SEOConfig } from '../../types';

export const ColorNameFinderTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const [input, setInput] = useState('#6366f1');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const parsedHex = useMemo(() => parseColorInput(input), [input]);
  const results = useMemo(
    () => (parsedHex ? getNearestColorNames(parsedHex, 5) : []),
    [parsedHex]
  );
  const closestShades = useMemo(
    () => (results.length > 0 ? generateTailwindShades(results[0].hex) : []),
    [results]
  );

  const finderFaqs: FAQItem[] = [
    {
      question: 'How does the color name finder match my hex code?',
      answer:
        'The finder compares your hex code against 1,265 named colors using a weighted RGB distance that mirrors human eye sensitivity (green weighted highest, then blue, then red). The closest matches are ranked by distance, so rank 1 is the nearest named color to your input.',
    },
    {
      question: 'What happens if my hex code has no exact named color?',
      answer:
        'Most hex codes have no exact named match. The finder returns the closest named colors instead, with a distance score — a distance of 0 means an exact match, and small distances mean the named color is visually almost identical to your input.',
    },
    {
      question: 'Can I look up any hex code, like #6366f1 or #0d9488?',
      answer:
        'Yes. Type or paste any 3-digit or 6-digit hex code — with or without the leading # — and the finder instantly returns the closest named colors, their hex values, and a full shade scale for the closest match.',
    },
  ];

  const seoConfig: SEOConfig = {
    title: 'Color Name Finder — Find the Name of Any Hex Color',
    description:
      'Enter any hex color code and instantly find its closest named color from 1,265 named colors, plus matching shades. Free hex to color name lookup, no sign-up.',
    canonicalUrl: 'https://chromoraflow.vercel.app/color-name-finder',
    keywords: [
      'color name finder',
      'find color name from hex',
      'hex to color name',
      'what color is this hex',
      'closest named color',
      'hex code name lookup',
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://chromoraflow.vercel.app/' },
      { name: 'Color Name Finder', url: 'https://chromoraflow.vercel.app/color-name-finder' },
    ],
    faqs: finderFaqs,
    softwareApp: {
      name: 'Chromora Color Name Finder Tool',
      description: 'Find the closest named color for any hex code from a 1,265-color database.',
      applicationCategory: 'DesignApplication',
    },
  };

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1500);
    } catch {
      // Clipboard unavailable (e.g. non-secure context); ignore silently.
    }
  };

  const presetHexes = ['#6366f1', '#0d9488', '#f59e0b', '#e11d48', '#0ea5e9'];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO config={seoConfig} />

      <Breadcrumbs
        items={[
          { name: 'Tools', url: '/color-picker' },
          { name: 'Color Name Finder', url: '/color-name-finder', isCurrent: true },
        ]}
        onNavigate={navigate}
      />

      {/* Header */}
      <div className="my-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-3">
          <Tag className="w-3.5 h-3.5" />
          <span>Hex to Name Lookup · 1,265 Named Colors</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Color Name Finder
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          Have a hex code but no name for it? Type any hex color and instantly find the
          closest named colors from our database, with a full shade scale for the best match.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl mb-10">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="color"
            value={parsedHex ?? '#6366f1'}
            onChange={(e) => setInput(e.target.value)}
            className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-white dark:border-zinc-800 shadow-md p-1 bg-zinc-100 dark:bg-zinc-800 shrink-0"
            aria-label="Pick a color"
          />
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a hex code, e.g. #6366f1"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl font-mono text-base font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 uppercase"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-1.5">
            Try:
          </span>
          {presetHexes.map((hex) => (
            <button
              key={hex}
              onClick={() => setInput(hex)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: hex }}
              />
              {hex}
            </button>
          ))}
        </div>
        {!parsedHex && (
          <p className="mt-4 text-sm text-red-500">
            That does not look like a valid hex code. Try a 3-digit or 6-digit hex, with or
            without the # sign.
          </p>
        )}
      </div>

      {/* Results */}
      {parsedHex && results.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            Closest named colors to {parsedHex}
          </h2>

          {/* Closest match hero */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl mb-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div
              className="w-24 h-24 rounded-2xl border border-black/10 shrink-0 shadow-md"
              style={{ backgroundColor: results[0].hex }}
            />
            <div className="flex-1">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Closest match
              </p>
              <p className="text-2xl font-extrabold text-[var(--text-primary)]">
                {results[0].name}
              </p>
              <p className="font-mono text-sm text-[var(--text-secondary)] mt-1">
                {results[0].hex}
                {results[0].distance === 0
                  ? ' · exact match'
                  : ` · distance ${results[0].distance}`}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Your input {parsedHex} is visually closest to this named color.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyHex(results[0].hex)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                {copiedHex === results[0].hex ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy HEX
              </button>
              <button
                onClick={() => navigate(`/colors/${hexToSlug(results[0].name, results[0].hex)}`)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                View color
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Next closest matches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {results.slice(1).map((match) => (
              <div
                key={`${match.name}-${match.hex}`}
                className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl border border-black/10 shrink-0"
                  style={{ backgroundColor: match.hex }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[var(--text-primary)] truncate">
                    {match.name}
                  </p>
                  <p className="font-mono text-xs text-[var(--text-secondary)]">
                    {match.hex} · distance {match.distance}
                  </p>
                </div>
                <button
                  onClick={() => copyHex(match.hex)}
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
                  aria-label={`Copy ${match.hex}`}
                >
                  {copiedHex === match.hex ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Shade scale for closest match */}
          {closestShades.length > 0 && (
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-[var(--text-primary)] mb-1">
                {results[0].name} shade scale
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-4">
                Full 50–950 tonal scale generated from the closest match. Click a swatch to
                copy its hex.
              </p>
              <div className="grid grid-cols-11 gap-1">
                {closestShades.map((shade) => (
                  <button
                    key={shade.step}
                    onClick={() => copyHex(shade.hex)}
                    title={`${shade.step}: ${shade.hex}`}
                    className="rounded-lg h-12 border border-black/10 hover:scale-105 transition-transform"
                    style={{ backgroundColor: shade.hex }}
                    aria-label={`Shade ${shade.step}: ${shade.hex}`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-11 gap-1 mt-1">
                {closestShades.map((shade) => (
                  <span
                    key={shade.step}
                    className="text-center text-[10px] font-mono text-[var(--text-muted)]"
                  >
                    {shade.step}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAQ Section */}
      <FAQSection
        faqs={finderFaqs}
        title="Color Name Finder FAQ"
        subtitle="How hex-to-name matching works and what the distance score means."
      />
    </div>
  );
};
