import React, { useState, useMemo } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import { getColorData, hexToRgb, rgbToHex } from '../../utils/colorUtils';
import {
  findNearestPantone,
  findNearestRal,
  searchPantoneRal,
  PANTONE_DATABASE,
  RAL_DATABASE,
  PantoneEntry,
  RalEntry,
} from '../../data/pantoneRalData';
import {
  Search,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Printer,
  Layers,
  Info,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { FAQItem, SEOConfig } from '../../types';
import { RecentColorsBar } from '../common/RecentColorsBar';

export const PantoneRalConverterTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { copyToClipboard, showToast, addRecentColor, activeHex: globalActiveHex, setActiveHex } = usePalette();
  const { t } = useI18n();

  const [inputHex, setInputHex] = useState(globalActiveHex || '#0055b8'); // Pantone Classic Reflex Blue
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Validate hex
  const activeHex = useMemo(() => {
    let clean = inputHex.trim();
    if (!clean.startsWith('#')) clean = `#${clean}`;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(clean)) {
      if (clean.length === 4) {
        clean = `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
      }
      return clean.toLowerCase();
    }
    return '#0055b8';
  }, [inputHex]);

  const colorData = useMemo(() => getColorData(activeHex), [activeHex]);

  // Find nearest matches
  const nearestPantoneList = useMemo(() => {
    return findNearestPantone(activeHex, 6);
  }, [activeHex]);

  const nearestRalList = useMemo(() => {
    return findNearestRal(activeHex, 6);
  }, [activeHex]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchPantoneRal(searchQuery).slice(0, 8);
  }, [searchQuery]);

  const handleCopy = (text: string, key: string, label = 'Code') => {
    copyToClipboard(text);
    setCopiedKey(key);
    showToast(`Copied ${label}: ${text}`, 'success');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSelectSearchResult = (hex: string) => {
    setInputHex(hex);
    setSearchQuery('');
    addRecentColor(hex);
    showToast('Loaded standard swatch match', 'info');
  };

  const pantoneFaqs: FAQItem[] = [
    {
      question: 'What is the Pantone Matching System (PMS) and why is it used in physical production?',
      answer:
        'The Pantone Matching System (PMS) is a standardized proprietary color reproduction system used globally in graphic design, offset printing, fashion, packaging, and plastic manufacturing. By standardizing spot ink formulas, brands ensure exact color consistency regardless of printer hardware or substrate.',
    },
    {
      question: 'What is the difference between Pantone Coated (C) and Uncoated (U)?',
      answer:
        'Pantone Solid Coated (e.g., PANTONE 185 C) indicates formulation for glossy, smooth coated paper stocks where ink sits on top, producing brighter, high-vibrancy tones. Uncoated (e.g., PANTONE 185 U) simulates porous uncoated matte stock where ink absorbs deeper into the paper fibers.',
    },
    {
      question: 'What is the RAL Color Standard?',
      answer:
        'RAL is a European color matching system primarily used in architecture, industrial coatings, powder-coating, plastics, and automotive construction. The RAL Classic collection consists of standard 4-digit color codes widely referenced by engineers and fabricators.',
    },
    {
      question: 'How is the color similarity match distance calculated?',
      answer:
        'Our converter converts sRGB colors into the CIE Lab / OKLCH perceptual color space and computes Euclidean Delta E distance. A lower distance score indicates a visually tighter, nearly indistinguishable match under standard D65 daylight illumination.',
    },
    {
      question: 'Can digital sRGB screens perfectly display all Pantone spot colors?',
      answer:
        'Digital RGB computer displays and physical Pantone spot inks have differing color gamuts. While many Pantone hues map cleanly into sRGB, highly fluorescent or ultra-deep cyan/orange spot colors cannot be rendered 100% identically on standard sRGB screens without calibrated wide-gamut (Display P3) hardware and physical swatch book proofing.',
    },
  ];

  const seoConfig: SEOConfig = {
    title: 'Pantone & RAL Color Converter: HEX to PMS & RAL Classic Match',
    description:
      'Convert HEX, RGB, and digital colors to the closest Pantone Solid Coated (PMS) and RAL Classic standards with accurate Delta E perceptual distance scores.',
    canonicalUrl: 'https://chromora.app/pantone-color-converter',
    keywords: [
      'pantone color converter',
      'hex to pantone',
      'pantone to hex',
      'ral color converter',
      'hex to ral',
      'pms color finder',
      'pantone match online',
      'ral to hex converter',
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://chromora.app/' },
      { name: 'Pantone & RAL Color Converter', url: 'https://chromora.app/pantone-color-converter' },
    ],
    faqs: pantoneFaqs,
    softwareApp: {
      name: 'Chromora Pantone & RAL Color Converter',
      description: 'Physical print and industrial coating matching engine for Pantone Solid Coated and RAL Classic standards.',
      applicationCategory: 'DesignApplication',
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO config={seoConfig} />

      <Breadcrumbs
        items={[{ name: 'Tools', url: '/color-picker' }, { name: 'Pantone Color Converter', url: '/pantone-color-converter', isCurrent: true }]}
        onNavigate={navigate}
      />

      {/* Hero Header */}
      <div className="my-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
          <Printer className="w-3.5 h-3.5" />
          <span>Pantone Matching System (PMS) & RAL Classic Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Pantone & RAL Color Converter
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Bridge digital UI design and physical print/manufacturing production. Match any digital HEX or RGB color to the closest standard Pantone PMS spot ink and RAL industrial coating.
        </p>
      </div>

      {/* Recent Colors Cross-Tool Bar */}
      <RecentColorsBar
        navigate={navigate}
        onSelectColor={(hex) => {
          setInputHex(hex);
          setActiveHex(hex);
        }}
        className="mb-8"
      />

      {/* Input & Search Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Pick Digital Color Input */}
          <div className="lg:col-span-6 space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Enter Digital Color (HEX / Pick Color)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={activeHex}
                onChange={(e) => setInputHex(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-white dark:border-zinc-800 shadow-md p-1 bg-zinc-100 dark:bg-zinc-800"
                aria-label="Pick color for Pantone matching"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={inputHex}
                  onChange={(e) => setInputHex(e.target.value)}
                  placeholder="#0055B8"
                  className="w-full px-4 py-3 rounded-xl font-mono text-lg font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <p className="text-xs text-zinc-500 mt-1 font-medium">
                  {colorData.name} • {colorData.rgb.r}, {colorData.rgb.g}, {colorData.rgb.b}
                </p>
              </div>
            </div>
          </div>

          {/* Reverse Search by Pantone / RAL Name */}
          <div className="lg:col-span-6 space-y-3 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 pt-6 lg:pt-0 lg:pl-8">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Or Reverse Lookup (Search PMS or RAL Name)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Pantone 286 C, RAL 9005, Reflex Blue..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Quick Search Autocomplete Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 max-h-48 overflow-y-auto shadow-lg">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSearchResult(item.hex)}
                    className="p-2 rounded-xl hover:bg-white dark:hover:bg-zinc-900 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-lg border border-black/10 shadow-xs"
                        style={{ backgroundColor: item.hex }}
                      />
                      <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {item.code}
                        </span>
                        <span className="text-[11px] text-zinc-500 ml-2">
                          {item.name} ({item.system})
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-zinc-400">{item.hex.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOP MATCH HERO COMPARISON SECTION */}
      {nearestPantoneList[0] && nearestRalList[0] && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Top Pantone Match Card */}
          <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl flex flex-col justify-between">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Pantone PMS Match
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(nearestPantoneList[0].matchScore)}% Match Accuracy
                </span>
              </div>
              <button
                onClick={() => handleCopy(nearestPantoneList[0].item.code, 'pms-top', 'Pantone Code')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                {copiedKey === 'pms-top' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Code</span>
              </button>
            </div>

            {/* Split Visual Comparison: Source vs Pantone */}
            <div className="grid grid-cols-2 h-44 border-b border-zinc-100 dark:border-zinc-800">
              <div
                className="p-4 flex flex-col justify-between"
                style={{ backgroundColor: activeHex }}
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-white self-start">
                  Your Digital Input
                </span>
                <span className="font-mono text-xs font-bold text-white drop-shadow">
                  {activeHex.toUpperCase()}
                </span>
              </div>

              <div
                className="p-4 flex flex-col justify-between"
                style={{ backgroundColor: nearestPantoneList[0].item.hex }}
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-white self-start">
                  Closest Pantone
                </span>
                <span className="font-mono text-xs font-bold text-white drop-shadow">
                  {nearestPantoneList[0].item.hex.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-2 bg-white dark:bg-zinc-900">
              <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                {nearestPantoneList[0].item.code}
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                {nearestPantoneList[0].item.name} • {nearestPantoneList[0].item.system}
              </p>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>RGB: {nearestPantoneList[0].item.rgb.r}, {nearestPantoneList[0].item.rgb.g}, {nearestPantoneList[0].item.rgb.b}</span>
                <span>Distance: ΔE {nearestPantoneList[0].distance.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Top RAL Match Card */}
          <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl flex flex-col justify-between">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  RAL Classic Match
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(nearestRalList[0].matchScore)}% Match Accuracy
                </span>
              </div>
              <button
                onClick={() => handleCopy(nearestRalList[0].item.code, 'ral-top', 'RAL Code')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                {copiedKey === 'ral-top' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Code</span>
              </button>
            </div>

            {/* Split Visual Comparison: Source vs RAL */}
            <div className="grid grid-cols-2 h-44 border-b border-zinc-100 dark:border-zinc-800">
              <div
                className="p-4 flex flex-col justify-between"
                style={{ backgroundColor: activeHex }}
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-white self-start">
                  Your Digital Input
                </span>
                <span className="font-mono text-xs font-bold text-white drop-shadow">
                  {activeHex.toUpperCase()}
                </span>
              </div>

              <div
                className="p-4 flex flex-col justify-between"
                style={{ backgroundColor: nearestRalList[0].item.hex }}
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-white self-start">
                  Closest RAL Standard
                </span>
                <span className="font-mono text-xs font-bold text-white drop-shadow">
                  {nearestRalList[0].item.hex.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-2 bg-white dark:bg-zinc-900">
              <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                {nearestRalList[0].item.code}
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                {nearestRalList[0].item.name} • {nearestRalList[0].item.system}
              </p>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>RGB: {nearestRalList[0].item.rgb.r}, {nearestRalList[0].item.rgb.g}, {nearestRalList[0].item.rgb.b}</span>
                <span>Distance: ΔE {nearestRalList[0].distance.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED RUNNER-UP MATCH TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
        {/* Top 6 Pantone Matches */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Printer className="w-4 h-4 text-amber-500" />
              <span>Top Pantone PMS Matches Ranked</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">By Perceptual Distance</span>
          </div>

          <div className="space-y-2.5">
            {nearestPantoneList.map((match, idx) => {
              const isCopied = copiedKey === `pms-list-${idx}`;
              return (
                <div
                  key={idx}
                  onClick={() => handleCopy(match.item.code, `pms-list-${idx}`, 'Pantone Code')}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 hover:border-amber-500 cursor-pointer flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-black/10 shadow-xs shrink-0"
                      style={{ backgroundColor: match.item.hex }}
                    />
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        {match.item.code}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {match.item.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                        {Math.round(match.matchScore)}% Match
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        ΔE {match.distance.toFixed(1)}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 6 RAL Matches */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Top RAL Classic Matches Ranked</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">By Perceptual Distance</span>
          </div>

          <div className="space-y-2.5">
            {nearestRalList.map((match, idx) => {
              const isCopied = copiedKey === `ral-list-${idx}`;
              return (
                <div
                  key={idx}
                  onClick={() => handleCopy(match.item.code, `ral-list-${idx}`, 'RAL Code')}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 hover:border-blue-500 cursor-pointer flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-black/10 shadow-xs shrink-0"
                      style={{ backgroundColor: match.item.hex }}
                    />
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {match.item.code}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {match.item.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                        {Math.round(match.matchScore)}% Match
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        ΔE {match.distance.toFixed(1)}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Related Tools Links */}
      <div className="my-12 p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Explore Related Color Conversion Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/color-converter"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-converter');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>Multi-Way Color Converter</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Convert HEX to RGB, HSL, HSV, CMYK, and OKLCH with zero data loss.
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
              Calculate a full 10-step Tailwind 50-900 tonal scale for any spot color.
            </p>
          </a>

          <a
            href="/contrast-checker"
            onClick={(e) => {
              e.preventDefault();
              navigate('/contrast-checker');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>WCAG Contrast Checker</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Verify legibility standards against dark and light print backgrounds.
            </p>
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection
        faqs={pantoneFaqs}
        title="Pantone PMS & RAL Conversion FAQ"
        subtitle="Learn how to translate digital RGB pixels into physical ink formulas and industrial coating standards."
      />
    </div>
  );
};
