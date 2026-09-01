import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import { getColorData, hexToRgb, getContrastRatio } from '../../utils/colorUtils';
import {
  VisionDeficiency,
  DEFICIENCY_INFO_LIST,
  simulateDeficiency,
  applyCanvasDeficiencyFilter,
} from '../../utils/colorBlindnessUtils';
import {
  Eye,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Download,
  Info,
  RefreshCw,
  Palette,
  Sliders,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { FAQItem, SEOConfig } from '../../types';
import { RecentColorsBar } from '../common/RecentColorsBar';

const SAMPLE_PALETTES = [
  { name: 'Classic Traffic Light', colors: ['#ef4444', '#eab308', '#22c55e'] },
  { name: 'Accessible UI Palette', colors: ['#0284c7', '#d97706', '#059669', '#dc2626'] },
  { name: 'Autumn Sunset', colors: ['#f97316', '#db2777', '#7c3aed', '#2563eb'] },
  { name: 'Corporate Brand Suite', colors: ['#1e40af', '#0284c7', '#3b82f6', '#93c5fd'] },
];

export const ColorBlindnessSimulatorTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { copyToClipboard, showToast, activeHex: globalActiveHex, setActiveHex, addRecentColor } = usePalette();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'color' | 'image'>('color');
  const [singleHex, setSingleHex] = useState(globalActiveHex || '#e11d48'); // Rose red
  const [activePalette, setActivePalette] = useState<string[]>(['#ef4444', '#eab308', '#22c55e', '#3b82f6']);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate hex
  const cleanHex = useMemo(() => {
    let clean = singleHex.trim();
    if (!clean.startsWith('#')) clean = `#${clean}`;
    return /^#[0-9a-fA-F]{6}$/i.test(clean) ? clean : '#e11d48';
  }, [singleHex]);

  const colorData = useMemo(() => getColorData(cleanHex), [cleanHex]);

  // Handle image upload
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please upload a PNG, JPG, or WebP image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setUploadedImageSrc(e.target.result);
        setActiveTab('image');
        showToast('Image Loaded Successfully', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (hex: string, key: string) => {
    copyToClipboard(hex);
    setCopiedKey(key);
    showToast(`Copied: ${hex.toUpperCase()}`, 'success');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const simulatorFaqs: FAQItem[] = [
    {
      question: 'What causes color blindness and how common is it?',
      answer:
        'Color vision deficiency (CVD) is typically an inherited genetic trait affecting the cone photoreceptors in the retina. Deuteranomaly (green-weak) and Protanomaly (red-weak) are the most common, affecting approximately 8% of men and 0.5% of women worldwide (~300 million people).',
    },
    {
      question: 'What is the difference between Protanopia, Deuteranopia, and Tritanopia?',
      answer:
        'Protanopia is red-blindness (missing L-cones), making reds look dark brown or black and confusing red with green. Deuteranopia is green-blindness (missing M-cones), confusing greens, reds, and yellows. Tritanopia is rare blue-blindness (missing S-cones), confusing blues with greens and yellows with violet or light pink.',
    },
    {
      question: 'Why should digital designers never rely solely on color for UI status?',
      answer:
        'WCAG 2.1 Guideline 1.4.1 (Use of Color) states that color cannot be used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Always pair status colors with icons, clear text labels, or distinct patterns.',
    },
    {
      question: 'How does the image color blindness filter algorithm work?',
      answer:
        'Our simulator uses verified 3x3 linear transformation matrices (based on Brettel, Viénot, and Mollon LMS color space research) to transform individual RGB pixels on an HTML5 canvas in real-time, accurately replicating cone response deficits.',
    },
    {
      question: 'How can I fix red/green UI components for colorblind users?',
      answer:
        'Instead of generic pure red (#ff0000) and pure green (#00ff00), pair a high-luminance blue/cyan or orange with distinct iconography (e.g., a checkmark for success and an exclamation triangle for error) and ensure sufficient luminance contrast against the background.',
    },
  ];

  const seoConfig: SEOConfig = {
    title: 'Color Blindness Simulator: Test Protanopia, Deuteranopia & Tritanopia',
    description:
      'Free online color blindness simulator for UI designs and images. Accurately test Protanopia, Deuteranopia, Tritanopia, and Achromatopsia vision in real-time.',
    canonicalUrl: 'https://chromoraflow.vercel.app/color-blindness-simulator',
    keywords: [
      'color blindness simulator',
      'color blindness test',
      'colorblind simulator online',
      'deuteranopia simulator',
      'protanopia simulator',
      'tritanopia simulator',
      'accessible color vision tool',
      'wcag color vision',
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://chromoraflow.vercel.app/' },
      { name: 'Color Blindness Simulator', url: 'https://chromoraflow.vercel.app/color-blindness-simulator' },
    ],
    faqs: simulatorFaqs,
    softwareApp: {
      name: 'Chromora Color Blindness Simulator',
      description: 'Side-by-side color deficiency simulator for hex colors, palettes, and uploaded images.',
      applicationCategory: 'DesignApplication',
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO config={seoConfig} />

      <Breadcrumbs
        items={[{ name: 'Tools', url: '/color-picker' }, { name: 'Color Blindness Simulator', url: '/color-blindness-simulator', isCurrent: true }]}
        onNavigate={navigate}
      />

      {/* Hero Header */}
      <div className="my-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
          <Eye className="w-3.5 h-3.5" />
          <span>WCAG 1.4.1 Accessibility & Visual Simulation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Color Blindness Simulator
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          Simulate how your colors, UI palettes, and interface screenshots appear to users with Protanopia, Deuteranopia, Tritanopia, and Achromatopsia vision deficiencies.
        </p>
      </div>

      {/* Recent Colors Cross-Tool Bar */}
      <RecentColorsBar
        navigate={navigate}
        onSelectColor={(hex) => {
          setSingleHex(hex);
          setActiveHex(hex);
        }}
        className="mb-8"
      />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-3 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <button
          onClick={() => setActiveTab('color')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'color'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Color & Palette Mode</span>
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'image'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image & Screenshot Mode</span>
        </button>
      </div>

      {/* COLOR & PALETTE SIMULATION MODE */}
      {activeTab === 'color' && (
        <div className="space-y-10">
          {/* Input Control Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Single Hex Input */}
              <div className="lg:col-span-5 space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                  Inspect Single Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={cleanHex}
                    onChange={(e) => setSingleHex(e.target.value)}
                    className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-white dark:border-zinc-800 shadow-md p-1 bg-zinc-100 dark:bg-zinc-800"
                    aria-label="Pick color for simulation"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={singleHex}
                      onChange={(e) => setSingleHex(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl font-mono text-base font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 uppercase"
                    />
                    <p className="text-xs text-zinc-500 mt-1">{colorData.name}</p>
                  </div>
                </div>
              </div>

              {/* Sample Preset Palettes */}
              <div className="lg:col-span-7 space-y-3 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 pt-6 lg:pt-0 lg:pl-8">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                  Or Test Multi-Color Palette Sets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SAMPLE_PALETTES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePalette(preset.colors)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        JSON.stringify(activePalette) === JSON.stringify(preset.colors)
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100'
                      }`}
                    >
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                        {preset.name}
                      </span>
                      <div className="flex -space-x-1 shrink-0 ml-2">
                        {preset.colors.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-5 h-5 rounded-full border-2 border-white dark:border-zinc-900 shadow-xs"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Deficiency Vision Grid for Single Color */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>Vision Deficiencies Simulation Grid</span>
                <span className="text-xs font-normal text-zinc-500">
                  (Single Color: {cleanHex.toUpperCase()})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DEFICIENCY_INFO_LIST.map((def) => {
                const simHex = simulateDeficiency(cleanHex, def.id);
                const simData = getColorData(simHex);
                const isCopied = copiedKey === `single-${def.id}`;

                return (
                  <div
                    key={def.id}
                    className={`rounded-2xl overflow-hidden border transition-all duration-200 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md ${
                      def.id === 'normal'
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {/* Simulated Color Swatch */}
                    <div
                      className="h-32 p-3 flex flex-col justify-between transition-colors relative"
                      style={{ backgroundColor: simHex }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            simData.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black'
                          }`}
                        >
                          {def.severity}
                        </span>
                        {def.id === 'normal' && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-white text-indigo-700 uppercase tracking-wider">
                            Original
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleCopy(simHex, `single-${def.id}`)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            simData.isDark
                              ? 'bg-white/20 hover:bg-white/30 text-white'
                              : 'bg-black/20 hover:bg-black/30 text-black'
                          }`}
                        >
                          {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span className="font-mono text-[11px]">{simHex.toUpperCase()}</span>
                        </button>
                      </div>
                    </div>

                    {/* Metadata Card Info */}
                    <div className="p-4 space-y-2 bg-white dark:bg-zinc-900 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-[var(--text-primary)]">
                          {def.name}
                        </h3>
                        <span className="text-[10px] font-medium text-zinc-400">
                          {def.populationRate}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        {def.description}
                      </p>
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400">
                        <span>Cone: {def.affectedCone}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multi-Color Palette Comparative Simulation */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl">
            <h3 className="text-lg font-bold mb-1">
              Multi-Color Palette Comparison Strip
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Compare how all colors in your current palette set appear across primary deficiency types.
            </p>

            <div className="space-y-4">
              {(['normal', 'deuteranopia', 'protanopia', 'tritanopia', 'achromatopsia'] as const).map(
                (mode) => {
                  const modeInfo = DEFICIENCY_INFO_LIST.find((d) => d.id === mode);
                  return (
                    <div
                      key={mode}
                      className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="sm:w-48 shrink-0">
                        <div className="font-bold text-xs text-zinc-100">
                          {modeInfo?.name}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {modeInfo?.type} ({modeInfo?.populationRate})
                        </div>
                      </div>

                      {/* Swatches strip */}
                      <div className="flex-1 flex gap-2 h-12">
                        {activePalette.map((col, idx) => {
                          const sim = simulateDeficiency(col, mode);
                          return (
                            <div
                              key={idx}
                              onClick={() => handleCopy(sim, `pal-${mode}-${idx}`)}
                              className="flex-1 rounded-xl cursor-pointer relative group transition-transform hover:scale-105 flex items-center justify-center"
                              style={{ backgroundColor: sim }}
                              title={`Simulated: ${sim}`}
                            >
                              <span className="opacity-0 group-hover:opacity-100 bg-black/40 text-white font-mono text-[9px] px-1 py-0.5 rounded">
                                {sim.toUpperCase()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* IMAGE & SCREENSHOT SIMULATION MODE */}
      {activeTab === 'image' && (
        <div className="space-y-10">
          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 cursor-pointer transition-colors text-center shadow-sm"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageUpload(e.target.files[0]);
                }
              }}
            />
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Click to upload image or drag & drop screenshot
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                PNG, JPG, SVG, or WebP. Processing is 100% private and computed locally in your browser.
              </p>
            </div>
          </div>

          {/* Image Simulation Previews */}
          {uploadedImageSrc && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Simulated Image Vision Gallery
                </h2>
                <button
                  onClick={() => setUploadedImageSrc(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 transition-colors"
                >
                  Clear Image
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(['normal', 'deuteranopia', 'protanopia', 'tritanopia'] as const).map((mode) => (
                  <ImageSimulationCard
                    key={mode}
                    imageSrc={uploadedImageSrc}
                    deficiency={mode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related Tools Navigation Links */}
      <div className="my-12 p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
          Explore Related Accessibility Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              Test AA/AAA ratios and auto-optimize text colors against any background.
            </p>
          </a>

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
              Create harmonic accessible palettes with lock controls.
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
              Generate 10-step accessible tonal scales for Tailwind CSS and design systems.
            </p>
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection
        faqs={simulatorFaqs}
        title="Color Vision Deficiency & Accessibility FAQ"
        subtitle="Learn how to architect inclusive visual interfaces compliant with WCAG 2.1 Level AA/AAA standards."
      />
    </div>
  );
};

// Canvas-based real-time image filtering card
const ImageSimulationCard: React.FC<{
  imageSrc: string;
  deficiency: VisionDeficiency;
}> = ({ imageSrc, deficiency }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const info = DEFICIENCY_INFO_LIST.find((d) => d.id === deficiency);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Scale down image if needed for rapid canvas matrix rendering
      const maxW = 600;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);
      applyCanvasDeficiencyFilter(ctx, w, h, deficiency);
    };
    img.src = imageSrc;
  }, [imageSrc, deficiency]);

  const handleDownloadSimulatedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `simulation-${deficiency}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg flex flex-col justify-between">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-[var(--text-primary)]">
            {info?.name}
          </h3>
          <span className="text-[11px] text-zinc-400">{info?.populationRate}</span>
        </div>
        <button
          onClick={handleDownloadSimulatedImage}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 transition-colors"
          title="Download Simulated Image"
          aria-label={`Download simulated image for ${info?.name}`}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center min-h-[220px]">
        <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl shadow-md" />
      </div>

      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 text-[11px] text-zinc-500">
        {info?.description}
      </div>
    </div>
  );
};
