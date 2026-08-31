import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import {
  getColorData,
  getRandomColor,
  generateHarmonicPalette,
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  clamp,
} from '../../utils/colorUtils';
import {
  Shuffle,
  Copy,
  Check,
  Sparkles,
  Sliders,
  ArrowRight,
  Palette,
  Eye,
  Layers,
  Lock,
  Unlock,
  Download,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { FAQItem, SEOConfig } from '../../types';

type MoodFilter = 'any' | 'pastel' | 'neon' | 'warm' | 'cool' | 'dark' | 'earthy' | 'monochrome';

function generateFilteredRandomColor(filter: MoodFilter): string {
  if (filter === 'any') return getRandomColor();

  let h = Math.floor(Math.random() * 360);
  let s = Math.floor(Math.random() * 80) + 20; // 20 - 100
  let l = Math.floor(Math.random() * 60) + 20; // 20 - 80

  switch (filter) {
    case 'pastel':
      s = Math.floor(Math.random() * 30) + 60; // 60-90%
      l = Math.floor(Math.random() * 15) + 80; // 80-95%
      break;
    case 'neon':
      s = Math.floor(Math.random() * 15) + 85; // 85-100%
      l = Math.floor(Math.random() * 20) + 50; // 50-70%
      break;
    case 'warm':
      // Red, Orange, Yellow, Pink
      h = (Math.floor(Math.random() * 90) + 330) % 360;
      s = Math.floor(Math.random() * 40) + 60;
      l = Math.floor(Math.random() * 40) + 40;
      break;
    case 'cool':
      // Green, Cyan, Blue, Violet
      h = Math.floor(Math.random() * 160) + 150;
      s = Math.floor(Math.random() * 40) + 55;
      l = Math.floor(Math.random() * 40) + 40;
      break;
    case 'dark':
      s = Math.floor(Math.random() * 50) + 30;
      l = Math.floor(Math.random() * 20) + 10; // 10-30%
      break;
    case 'earthy':
      // Ochre, Olive, Clay, Forest
      h = Math.floor(Math.random() * 90) + 20;
      s = Math.floor(Math.random() * 35) + 30;
      l = Math.floor(Math.random() * 30) + 35;
      break;
    case 'monochrome':
      s = Math.floor(Math.random() * 8); // 0-8% saturation
      l = Math.floor(Math.random() * 80) + 10;
      break;
  }

  const rgb = hslToRgb({ h, s, l });
  return rgbToHex(rgb);
}

export const RandomColorGeneratorTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { copyToClipboard, showToast, setPaletteFromHexList } = usePalette();
  const { t } = useI18n();

  const [mode, setMode] = useState<'single' | 'palette'>('single');
  const [filter, setFilter] = useState<MoodFilter>('any');
  const [singleColor, setSingleColor] = useState<string>('#3b82f6');
  const [paletteCount, setPaletteCount] = useState<number>(5);
  const [paletteColors, setPaletteColors] = useState<string[]>([
    '#3b82f6',
    '#ec4899',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
  ]);
  const [lockedIndices, setLockedIndices] = useState<number[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Single color data
  const singleData = useMemo(() => getColorData(singleColor), [singleColor]);

  // Generate single
  const rollSingleColor = useCallback(() => {
    const nextHex = generateFilteredRandomColor(filter);
    setSingleColor(nextHex);
  }, [filter]);

  // Generate palette
  const rollPalette = useCallback(() => {
    const nextList = [...paletteColors];
    for (let i = 0; i < paletteCount; i++) {
      if (!lockedIndices.includes(i)) {
        nextList[i] = generateFilteredRandomColor(filter);
      }
    }
    setPaletteColors(nextList.slice(0, paletteCount));
  }, [filter, paletteCount, lockedIndices, paletteColors]);

  // Handle spacebar press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (mode === 'single') rollSingleColor();
        else rollPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, rollSingleColor, rollPalette]);

  const toggleLock = (index: number) => {
    setLockedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopy = (text: string, key: string, label = 'Hex') => {
    copyToClipboard(text);
    setCopiedKey(key);
    showToast(`Copied ${label}: ${text.toUpperCase()}`, 'success');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const exportToMainPalette = () => {
    if (mode === 'single') {
      const harmonic = generateHarmonicPalette(singleColor, 'analogous');
      setPaletteFromHexList(harmonic);
    } else {
      setPaletteFromHexList(paletteColors);
    }
    showToast('Exported to Palette Studio', 'success');
    navigate('/color-palette-generator');
  };

  const randomFaqs: FAQItem[] = [
    {
      question: 'How does the random color algorithm generate aesthetic color families?',
      answer:
        'Instead of purely uniform mathematical randomization across 16.7 million 24-bit RGB values (which often generates muddy grays or harsh greens), our engine uses bounded HSL and OKLCH color spaces. Filtering for Pastel, Neon, Warm, or Earthy constrains saturation and lightness bands to create visually delightful, usable design tones.',
    },
    {
      question: 'Can I generate random colors using my keyboard?',
      answer:
        'Yes! Simply press the Spacebar on your keyboard at any time while viewing this page to instantly re-roll and generate a fresh random color or full palette.',
    },
    {
      question: 'How do the palette lock icons work?',
      answer:
        'When in Palette Mode, click the Lock icon on any swatch you love. When you press Spacebar or click "Generate New", your locked colors will stay firmly in place while all unlocked swatches are randomized around them.',
    },
    {
      question: 'In what formats can I copy the random colors?',
      answer:
        'You can copy values in standard HEX, RGB, HSL, CSS background declarations, or export the whole generated set directly into the Palette Generator for contrast checking and styling.',
    },
    {
      question: 'How many colors can I generate simultaneously in a random palette?',
      answer:
        'You can choose between 3, 5, and 7 color palette sizes, perfect for triadic logos, 5-color UI themes, and rich multi-step illustration palettes.',
    },
  ];

  const seoConfig: SEOConfig = {
    title: 'Random Color Generator: Instant Palette & Mood Filters',
    description:
      'Generate random colors and harmonious 5-color palettes with mood filters (Pastel, Neon, Warm, Cool, Earthy). Spacebar to roll, one-click copy HEX & CSS.',
    canonicalUrl: 'https://chromora.app/random-color-generator',
    keywords: [
      'random color generator',
      'random color picker',
      'random palette generator',
      'random hex color',
      'pastel color generator',
      'neon color generator',
      'random color palette',
      'generate random rgb',
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://chromora.app/' },
      { name: 'Random Color Generator', url: 'https://chromora.app/random-color-generator' },
    ],
    faqs: randomFaqs,
    softwareApp: {
      name: 'Chromora Random Color & Palette Generator',
      description: 'Random color generator with mood-based saturation and lightness filters and keyboard controls.',
      applicationCategory: 'DesignApplication',
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO config={seoConfig} />

      <Breadcrumbs
        items={[{ name: 'Tools', url: '/color-picker' }, { name: 'Random Color Generator', url: '/random-color-generator', isCurrent: true }]}
        onNavigate={navigate}
      />

      {/* Header */}
      <div className="my-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 mb-3">
          <Shuffle className="w-3.5 h-3.5" />
          <span>Press Spacebar to Generate</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Random Color & Palette Generator
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Instantly discover aesthetic random colors and color palettes. Apply mood filters for pastels, neons, warm, or cool tones, lock your favorites, and copy CSS codes.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Mode & Count */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl flex">
              <button
                onClick={() => setMode('single')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'single'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                Single Color
              </button>
              <button
                onClick={() => setMode('palette')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'palette'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                Palette Mode
              </button>
            </div>

            {mode === 'palette' && (
              <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl flex items-center gap-1">
                {[3, 5, 7].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => {
                      setPaletteCount(cnt);
                      if (paletteColors.length < cnt) {
                        const needed = cnt - paletteColors.length;
                        const added = Array.from({ length: needed }, () =>
                          generateFilteredRandomColor(filter)
                        );
                        setPaletteColors([...paletteColors, ...added]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      paletteCount === cnt
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    {cnt} Colors
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mood Filter Selectors */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'any', label: 'All Moods' },
                { id: 'pastel', label: 'Pastel' },
                { id: 'neon', label: 'Neon' },
                { id: 'warm', label: 'Warm' },
                { id: 'cool', label: 'Cool' },
                { id: 'dark', label: 'Dark' },
                { id: 'earthy', label: 'Earthy' },
                { id: 'monochrome', label: 'Mono' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setFilter(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  filter === m.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Roll Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={mode === 'single' ? rollSingleColor : rollPalette}
              className="px-6 py-3 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>Generate (Space)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SINGLE COLOR MODE VIEW */}
      {mode === 'single' && (
        <div className="space-y-8 mb-12">
          <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
            <div
              className="h-64 sm:h-80 p-8 flex flex-col justify-between transition-colors duration-300 relative"
              style={{ backgroundColor: singleColor }}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    singleData.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black'
                  }`}
                >
                  {singleData.family} • {filter.toUpperCase()} MOOD
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(singleColor, 'hero-hex')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
                      singleData.isDark
                        ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    {copiedKey === 'hero-hex' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'hero-hex' ? 'Copied' : 'Copy HEX'}</span>
                  </button>
                </div>
              </div>

              <div>
                <h2
                  className={`text-4xl sm:text-6xl font-black font-mono tracking-tight ${
                    singleData.isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {singleColor.toUpperCase()}
                </h2>
                <p
                  className={`text-base sm:text-lg font-medium opacity-90 mt-1 ${
                    singleData.isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {singleData.name}
                </p>
              </div>
            </div>

            {/* Quick Copy Chips */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-50 dark:bg-zinc-950 text-xs">
              <div
                onClick={() => handleCopy(`rgb(${singleData.rgb.r}, ${singleData.rgb.g}, ${singleData.rgb.b})`, 'single-rgb', 'RGB')}
                className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold mb-1">
                  <span>RGB</span>
                  {copiedKey === 'single-rgb' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </div>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                  {singleData.rgb.r}, {singleData.rgb.g}, {singleData.rgb.b}
                </span>
              </div>

              <div
                onClick={() => handleCopy(`hsl(${Math.round(singleData.hsl.h)}, ${Math.round(singleData.hsl.s)}%, ${Math.round(singleData.hsl.l)}%)`, 'single-hsl', 'HSL')}
                className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold mb-1">
                  <span>HSL</span>
                  {copiedKey === 'single-hsl' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </div>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                  {Math.round(singleData.hsl.h)}°, {Math.round(singleData.hsl.s)}%, {Math.round(singleData.hsl.l)}%
                </span>
              </div>

              <div
                onClick={() => handleCopy(`background-color: ${singleColor};`, 'single-css', 'CSS')}
                className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold mb-1">
                  <span>CSS Declaration</span>
                  {copiedKey === 'single-css' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </div>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                  bg: {singleColor};
                </span>
              </div>

              <div
                onClick={exportToMainPalette}
                className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 cursor-pointer hover:bg-indigo-100 transition-colors flex flex-col justify-between"
              >
                <div className="text-indigo-600 dark:text-indigo-400 text-[10px] uppercase font-bold">
                  Harmonics Studio
                </div>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                  <span>Build Palette</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PALETTE MODE VIEW */}
      {mode === 'palette' && (
        <div className="space-y-6 mb-12">
          {/* Main Interactive Swatches Grid */}
          <div
            className="grid gap-3 sm:gap-4 h-96 sm:h-[450px]"
            style={{
              gridTemplateColumns: `repeat(${paletteCount}, minmax(0, 1fr))`,
            }}
          >
            {paletteColors.slice(0, paletteCount).map((col, idx) => {
              const data = getColorData(col);
              const isLocked = lockedIndices.includes(idx);
              const isCopied = copiedKey === `pal-${idx}`;

              return (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 relative group shadow-xl border border-black/5"
                  style={{ backgroundColor: col }}
                >
                  {/* Top: Lock & Index */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        data.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black'
                      }`}
                    >
                      0{idx + 1}
                    </span>

                    <button
                      onClick={() => toggleLock(idx)}
                      className={`p-2 rounded-xl transition-all ${
                        isLocked
                          ? 'bg-amber-400 text-zinc-950 shadow-md'
                          : data.isDark
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-black/20 text-black hover:bg-black/30'
                      }`}
                      title={isLocked ? 'Unlock color' : 'Lock color from randomizing'}
                      aria-label={isLocked ? `Unlock color ${idx + 1}` : `Lock color ${idx + 1}`}
                    >
                      {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Middle hover copy */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleCopy(col, `pal-${idx}`)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all ${
                        isCopied
                          ? 'bg-emerald-500 text-white opacity-100'
                          : data.isDark
                          ? 'bg-white text-zinc-900 shadow-md'
                          : 'bg-zinc-900 text-white shadow-md'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Bottom Hex & Name */}
                  <div>
                    <h3
                      className={`font-mono text-sm sm:text-lg font-black tracking-tight ${
                        data.isDark ? 'text-white' : 'text-zinc-900'
                      }`}
                    >
                      {col.toUpperCase()}
                    </h3>
                    <p
                      className={`text-[11px] font-medium truncate opacity-90 ${
                        data.isDark ? 'text-white' : 'text-zinc-900'
                      }`}
                    >
                      {data.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Palette Actions Bar */}
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-zinc-500 font-medium">
              Tip: Click the lock on individual swatches to hold them while re-rolling the rest.
            </span>
            <button
              onClick={exportToMainPalette}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-md transition-all"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Export Palette to Studio</span>
            </button>
          </div>
        </div>
      )}

      {/* Related Tools Links */}
      <div className="my-12 p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Explore Related Color Discovery Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/color-palette-generator"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-palette-generator');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>Color Palette Generator</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Harmonic palettes, monochromatic, triad, and tetradic color systems.
            </p>
          </a>

          <a
            href="/color-shades-generator"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-shades-generator');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>Shades & Tints Generator</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Create a 10-step Tailwind 50-900 tonal scale for any random seed color.
            </p>
          </a>

          <a
            href="/color-mixer"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-mixer');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>Color Mixer Online</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Blend two random colors in OKLCH or Subtractive paint space.
            </p>
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection
        faqs={randomFaqs}
        title="Random Color & Palette Generation FAQ"
        subtitle="Learn how mood-constrained color spaces generate balanced design harmonies."
      />
    </div>
  );
};
