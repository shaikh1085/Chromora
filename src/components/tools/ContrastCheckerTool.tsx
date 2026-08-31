import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import {
  getContrastRatio,
  getColorData,
  suggestAccessibleColors,
  findCompliantColor,
  findAccessibleTextColor,
  simulateColorBlindness,
  ColorBlindMode,
} from '../../utils/colorUtils';
import {
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Sparkles,
  Wand2,
  Check,
  Copy,
  Info,
  ShieldCheck,
  Eye,
  Type,
  RotateCcw,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';

interface SamplePreset {
  id: string;
  label: string;
  sample: string;
}

const SAMPLE_TEXTS: SamplePreset[] = [
  {
    id: 'body',
    label: 'Standard Body',
    sample: 'Accessible design elevates readability and digital inclusion for everyone across modern web applications.',
  },
  {
    id: 'headline',
    label: 'Display Headline',
    sample: 'Empowering Creators with Beautiful, Harmonious Color Systems',
  },
  {
    id: 'ui',
    label: 'UI Components',
    sample: 'Save Changes · Export Palette · Test WCAG Contrast',
  },
  {
    id: 'caption',
    label: 'Small Caption',
    sample: 'Minimum contrast ratio of 4.5:1 recommended for normal text under WCAG 2.1 Level AA specifications.',
  },
  {
    id: 'code',
    label: 'Code & Monospace',
    sample: 'const theme = { primary: "#6366f1", contrast: 5.2 };',
  },
];

export const ContrastCheckerTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { copyToClipboard, showToast } = usePalette();
  const { t } = useI18n();
  const [fgHex, setFgHex] = useState('#0f172a'); // Slate 900
  const [bgHex, setBgHex] = useState('#f8fafc'); // Slate 50
  const [sampleText, setSampleText] = useState('Accessible design elevates readability and digital inclusion for everyone across modern web applications.');
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>('normal');
  const [selectedPreset, setSelectedPreset] = useState<string>('body');

  // Simulated colors
  const simulatedFg = simulateColorBlindness(fgHex, colorBlindMode);
  const simulatedBg = simulateColorBlindness(bgHex, colorBlindMode);

  const contrast = getContrastRatio(simulatedFg, simulatedBg);
  const fgData = getColorData(fgHex);
  const bgData = getColorData(bgHex);
  const suggestions = suggestAccessibleColors(fgHex, 'text');

  const swapColors = () => {
    const temp = fgHex;
    setFgHex(bgHex);
    setBgHex(temp);
  };

  const autoFixContrast = (targetLevel: 'AA' | 'AAA') => {
    const minRatio = targetLevel === 'AAA' ? 7.0 : 4.5;
    const fixed = findCompliantColor(fgHex, bgHex, minRatio);
    setFgHex(fixed);
    showToast(`Optimized for WCAG ${targetLevel}: ${fixed.toUpperCase()}`, 'success');
  };

  const handleSmartTextColorFinder = () => {
    const smartColor = findAccessibleTextColor(bgHex, 4.5);
    setFgHex(smartColor);
    showToast(`Found Accessible Text Color: ${smartColor.toUpperCase()}`, 'success');
  };

  const handlePresetSelect = (item: SamplePreset) => {
    setSelectedPreset(item.id);
    setSampleText(item.sample);
  };

  const contrastFaqs = [
    {
      question: 'What are the WCAG 2.1 contrast ratio requirements?',
      answer:
        'Level AA requires a contrast ratio of at least 4.5:1 for normal body text and 3.0:1 for large text (18pt / 24px regular, or 14pt / 18.6px bold) and user interface components. Level AAA requires at least 7.0:1 for normal body text and 4.5:1 for large text.',
    },
    {
      question: 'How do color blindness simulations help designers?',
      answer:
        'Approximately 1 in 12 men and 1 in 200 women experience color vision deficiency. Simulating Protanopia (red-blind), Deuteranopia (green-blind), Tritanopia (blue-blind), and Grayscale ensures your interfaces do not rely solely on hue to communicate state.',
    },
    {
      question: 'Why is adequate optical contrast important for digital interfaces?',
      answer:
        'Adequate contrast prevents eye strain, reduces cognitive fatigue, and ensures digital content remains legible under varying lighting conditions, low screen brightness, and across different display panels.',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'WCAG Color Contrast Checker & Accessible Palette Generator — Chromora',
          description:
            'Free WCAG 2.1 AAA/AA color contrast checker. Audit contrast ratios in real time, simulate 8 color blindness vision deficiencies, auto-fix failing contrast, and test UI components.',
          keywords: [
            'wcag color contrast checker',
            'wcag aaa accessible color palette generator',
            'check contrast ratio between two colors',
            'accessible text color finder',
            'color contrast checker for web design',
            'color blindness contrast simulator',
            'ada compliance color contrast tool',
          ],
          canonicalUrl: 'https://chromora.app/contrast-checker',
          faqs: contrastFaqs,
          softwareApp: {
            name: 'Chromora WCAG Contrast Checker',
            description: 'Real-time WCAG 2.1 AAA/AA color contrast ratio auditing tool with auto-fixer and color blindness simulation.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Contrast Checker', url: '/contrast-checker', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Page Header */}
        <div className="my-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WCAG 2.1 Accessibility & Color-Blind Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Color Contrast Checker & Optimizer
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Audit foreground and background pairings for WCAG AA and AAA compliance with live UI components, color-blind simulation, and multilingual scripts.
            </p>
          </div>

          {/* Quick One-Click Accessible Finder CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSmartTextColorFinder}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Wand2 className="w-4 h-4" />
              <span>Find Accessible Text Color</span>
            </button>
          </div>
        </div>

        {/* Top Split Color Input & Ratio Scorecard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Left Inputs (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Color Inputs
              </h2>
              <button
                onClick={swapColors}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Swap Colors</span>
              </button>
            </div>

            {/* Foreground Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Text / Foreground Color</span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200">{fgData.name}</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-12 rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 shrink-0 shadow-inner">
                  <div className="w-full h-full" style={{ backgroundColor: fgHex }} />
                  <input
                    type="color"
                    value={fgHex}
                    onChange={(e) => setFgHex(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    aria-label="Pick foreground color"
                  />
                </div>
                <input
                  type="text"
                  value={fgHex.toUpperCase()}
                  onChange={(e) => setFgHex(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 font-mono text-sm uppercase text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Foreground HEX value"
                />
              </div>
            </div>

            {/* Background Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Canvas / Background Color</span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200">{bgData.name}</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-12 rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 shrink-0 shadow-inner">
                  <div className="w-full h-full" style={{ backgroundColor: bgHex }} />
                  <input
                    type="color"
                    value={bgHex}
                    onChange={(e) => setBgHex(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    aria-label="Pick background color"
                  />
                </div>
                <input
                  type="text"
                  value={bgHex.toUpperCase()}
                  onChange={(e) => setBgHex(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 font-mono text-sm uppercase text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Background HEX value"
                />
              </div>
            </div>

            {/* Auto-Fix Buttons */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400">One-Click Auto Fix:</span>
              <button
                onClick={() => autoFixContrast('AA')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Fix for AA (4.5:1)</span>
              </button>
              <button
                onClick={() => autoFixContrast('AAA')}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-300 dark:border-indigo-800 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fix for AAA (7.0:1)</span>
              </button>
            </div>
          </div>

          {/* Right Ratio Scorecard (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Calculated Contrast Ratio
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                    {contrast.ratio}
                  </span>
                  <span className="text-xl text-zinc-400 font-mono">: 1</span>
                </div>
              </div>

              <div
                className={`px-4 py-2 rounded-xl text-sm font-black tracking-wide uppercase ${
                  contrast.normalAAA
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : contrast.normalAA
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}
              >
                {contrast.normalAAA ? 'Passes AAA' : contrast.normalAA ? 'Passes AA' : 'Fails AA'}
              </div>
            </div>

            {/* Compliance Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              {/* Normal Text AA */}
              <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Normal Text</p>
                  <p className="text-[10px] text-zinc-400">WCAG AA (4.5:1)</p>
                </div>
                {contrast.normalAA ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </div>

              {/* Normal Text AAA */}
              <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Normal Text</p>
                  <p className="text-[10px] text-zinc-400">WCAG AAA (7.0:1)</p>
                </div>
                {contrast.normalAAA ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </div>

              {/* Large Text AA */}
              <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Large Text</p>
                  <p className="text-[10px] text-zinc-400">WCAG AA (3.0:1)</p>
                </div>
                {contrast.largeAA ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </div>

              {/* Large Text AAA */}
              <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Large Text</p>
                  <p className="text-[10px] text-zinc-400">WCAG AAA (4.5:1)</p>
                </div>
                {contrast.largeAAA ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </div>

              {/* UI Components */}
              <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between col-span-2 sm:col-span-2">
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">UI Controls & Icons</p>
                  <p className="text-[10px] text-zinc-400">WCAG 2.1 Non-Text (3.0:1)</p>
                </div>
                {contrast.uiAA ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Complies with W3C Web Content Accessibility Guidelines 2.1 Section 1.4.3 & 1.4.6
            </p>
          </div>
        </div>

        {/* Color Blind Simulation Bar */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                <span>Color Vision Deficiency (CVD) Simulation</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Check how users with various types of color blindness perceive this contrast ratio
              </p>
            </div>
            {colorBlindMode !== 'normal' && (
              <button
                onClick={() => setColorBlindMode('normal')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Normal Vision</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { mode: 'normal', label: 'Normal Vision', desc: 'Full trichromat' },
              { mode: 'protanopia', label: 'Protanopia', desc: 'Red-blind (L-cone)' },
              { mode: 'deuteranopia', label: 'Deuteranopia', desc: 'Green-blind (M-cone)' },
              { mode: 'tritanopia', label: 'Tritanopia', desc: 'Blue-blind (S-cone)' },
              { mode: 'grayscale', label: 'Grayscale', desc: 'Achromatopsia' },
            ].map((item) => (
              <button
                key={item.mode}
                onClick={() => setColorBlindMode(item.mode as ColorBlindMode)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  colorBlindMode === item.mode
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-500'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full border border-black/10"
                    style={{
                      backgroundColor: simulateColorBlindness(fgHex, item.mode as ColorBlindMode),
                    }}
                  />
                  <span className="text-xs font-bold">{item.label}</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Typography Preset Selector */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
          <Type className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="text-xs font-bold text-zinc-500 shrink-0">Sample Preset:</span>
          {SAMPLE_TEXTS.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePresetSelect(item)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedPreset === item.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Live Interactive UI Components Simulator */}
        <div
          className="p-8 sm:p-12 rounded-3xl border shadow-xl mb-12 transition-colors duration-200"
          style={{
            backgroundColor: simulatedBg,
            color: simulatedFg,
            borderColor: fgData.isDark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
          }}
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <div className="flex items-center justify-between opacity-75 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Live Interactive UI Simulation ({colorBlindMode.toUpperCase()})
                </span>
                <span className="text-xs font-mono font-bold">{contrast.ratio}:1</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 leading-snug">
                {sampleText}
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed opacity-90">
                Good typography and calculated contrast allow readers of all abilities to absorb information seamlessly, reducing eye strain and cognitive fatigue across mobile and desktop interfaces.
              </p>
            </div>

            {/* Form Controls & Buttons */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t"
              style={{ borderColor: simulatedFg, opacity: 0.9 }}
            >
              <div className="space-y-2">
                <label className="text-xs font-bold block">Editable Sample String</label>
                <input
                  type="text"
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                  style={{
                    backgroundColor: simulatedBg,
                    color: simulatedFg,
                    borderColor: simulatedFg,
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold block">Button & Interactive Element</label>
                <div className="flex items-center gap-3">
                  <button
                    className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                    style={{
                      backgroundColor: simulatedFg,
                      color: simulatedBg,
                    }}
                  >
                    Primary Action
                  </button>
                  <button
                    className="px-4 py-2.5 rounded-xl font-semibold text-xs border"
                    style={{
                      borderColor: simulatedFg,
                      color: simulatedFg,
                    }}
                  >
                    Outline Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessible Alternative Suggestions */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-12">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Compliant Shade Suggestions
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Click any suggestion to apply it to your current foreground text
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {suggestions.slice(0, 3).map((hex, idx) => {
              const itemData = getColorData(hex);
              const itemRatio = getContrastRatio(hex, bgHex).ratio;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setFgHex(hex);
                    showToast(`Applied ${itemData.name}: ${hex.toUpperCase()} (${itemRatio}:1)`, 'success');
                  }}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-zinc-50 dark:bg-zinc-950 text-left transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg border border-black/10 shrink-0 shadow-xs"
                      style={{ backgroundColor: hex }}
                    />
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {itemData.name}
                      </p>
                      <p className="text-[11px] font-mono text-zinc-500">{hex.toUpperCase()}</p>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {itemRatio}:1
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <FAQSection
          faqs={contrastFaqs}
          title="Color Accessibility & WCAG Standard FAQ"
          subtitle="Learn how to architect WCAG 2.1 AA/AAA compliant digital experiences."
        />
      </div>
    </div>
  );
};
