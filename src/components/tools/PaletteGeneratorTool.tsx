import React, { useState, useEffect, useRef } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { PaletteType } from '../../types';
import {
  Lock,
  Unlock,
  Shuffle,
  RefreshCw,
  Bookmark,
  Code2,
  Layout,
  Copy,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  ChevronDown,
  Layers,
  Share2,
  Download,
  Image,
  MessageCircle,
  Instagram,
  Check,
  Globe,
  ArrowRight,
  Keyboard,
} from 'lucide-react';
import {
  getColorData,
  generateTailwindShades,
  rgbToHex,
  hslToRgb,
  hexToRgb,
  rgbToHsl,
  clamp,
} from '../../utils/colorUtils';
import { ASIAN_GLOBAL_INSPIRATIONS } from '../../data/presetPalettes';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';

export const PaletteGeneratorTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const {
    paletteColors,
    paletteType,
    setPaletteType,
    paletteCount,
    setPaletteCount,
    toggleLockColor,
    updateColorInPalette,
    regeneratePalette,
    shufflePalette,
    savePalette,
    copyToClipboard,
    setIsExportModalOpen,
    setPaletteFromHexList,
    showToast,
  } = usePalette();

  const [expandedShadesId, setExpandedShadesId] = useState<string | null>(null);
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareType, setShareType] = useState<'link' | 'png' | 'instagram' | 'whatsapp'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check URL params on mount for shared palette
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const colorsParam = searchParams.get('colors') || searchParams.get('c');
      if (colorsParam) {
        const hexList = colorsParam
          .split(/[,-]/)
          .map((h) => (h.startsWith('#') ? h : `#${h}`));
        if (hexList.length >= 2) {
          setPaletteFromHexList(hexList, 'Shared Palette');
          showToast('Loaded shared palette from URL', 'success');
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Keyboard shortcuts: Space (regenerate), C (copy all), S (save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        regeneratePalette();
      } else if (e.key === 'c' || e.key === 'C') {
        const text = paletteColors.map((c) => c.hex).join(', ');
        copyToClipboard(text, 'Copied all HEX codes');
      } else if (e.key === 's' || e.key === 'S') {
        setShowSaveInput(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paletteColors, regeneratePalette, copyToClipboard]);

  const paletteTypeOptions: { id: PaletteType; label: string }[] = [
    { id: 'analogous', label: 'Analogous' },
    { id: 'monochromatic', label: 'Monochromatic' },
    { id: 'complementary', label: 'Complementary' },
    { id: 'split-complementary', label: 'Split Comp.' },
    { id: 'triadic', label: 'Triadic' },
    { id: 'tetradic', label: 'Tetradic' },
    { id: 'warm', label: 'Warm' },
    { id: 'cool', label: 'Cool' },
    { id: 'pastel', label: 'Pastel' },
    { id: 'neon', label: 'Neon' },
    { id: 'earthy', label: 'Earthy' },
    { id: 'luxury', label: 'Luxury' },
  ];

  // Adjust global hue/saturation/lightness of all unlocked colors
  const handleGlobalHslShift = (channel: 'h' | 's' | 'l', delta: number) => {
    paletteColors.forEach((color) => {
      if (color.isLocked) return;
      const hsl = rgbToHsl(hexToRgb(color.hex));
      let newH = hsl.h;
      let newS = hsl.s;
      let newL = hsl.l;

      if (channel === 'h') newH = (hsl.h + delta + 360) % 360;
      if (channel === 's') newS = clamp(hsl.s + delta, 5, 100);
      if (channel === 'l') newL = clamp(hsl.l + delta, 5, 95);

      const newHex = rgbToHex(hslToRgb({ h: newH, s: newS, l: newL }));
      updateColorInPalette(color.id, newHex);
    });
  };

  const handleSave = () => {
    savePalette(saveName || `${paletteType.toUpperCase()} Palette`, paletteColors.map((c) => c.hex), [
      paletteType,
      'Generated',
    ]);
    setShowSaveInput(false);
    setSaveName('');
  };

  const handleCopyAll = () => {
    const text = paletteColors.map((c) => c.hex).join(', ');
    copyToClipboard(text, 'Copied all HEX codes');
  };

  // Generate shareable URL
  const getShareUrl = () => {
    const hexQuery = paletteColors.map((c) => c.hex.replace('#', '')).join('-');
    const baseUrl = window.location.origin;
    return `${baseUrl}/color-palette-generator?colors=${hexQuery}`;
  };

  // Export Canvas PNG (Standard Card or Instagram 1:1)
  const generatePngCard = (format: 'standard' | 'instagram') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = format === 'instagram' ? 1080 : 1200;
    const height = format === 'instagram' ? 1080 : 675;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Header / Brand Watermark
    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText('CHROMORA', 60, 70);

    ctx.fillStyle = '#71717a';
    ctx.font = '18px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${paletteType.toUpperCase()} HARMONY • ${paletteColors.length} COLORS`, 60, 100);

    // Color Swatches
    const swatchCount = paletteColors.length;
    const paddingX = 60;
    const paddingY = 140;
    const contentWidth = width - paddingX * 2;
    const swatchHeight = height - paddingY - 100;
    const swatchWidth = contentWidth / swatchCount;

    paletteColors.forEach((c, idx) => {
      const x = paddingX + idx * swatchWidth;
      const y = paddingY;

      // Draw swatch rectangle
      ctx.fillStyle = c.hex;
      ctx.fillRect(x, y, swatchWidth, swatchHeight);

      // Color info card at bottom of swatch
      const data = getColorData(c.hex);
      ctx.fillStyle = data.isDark ? '#ffffff' : '#09090b';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(c.hex.toUpperCase(), x + 20, y + swatchHeight - 50);

      ctx.fillStyle = data.isDark ? '#e4e4e7' : '#27272a';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText(c.name, x + 20, y + swatchHeight - 25);
    });

    // Footer
    ctx.fillStyle = '#52525b';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Created with Chromora • chromora.app', 60, height - 35);

    // Trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `chromora-palette-${format}.png`;
    a.click();
    showToast(`Downloaded ${format.toUpperCase()} PNG card`, 'success');
  };

  const getWhatsAppShareUrl = () => {
    const hexList = paletteColors.map((c) => `${c.name}: ${c.hex.toUpperCase()}`).join('\n');
    const text = encodeURIComponent(
      `Check out this color palette created on Chromora:\n\n${hexList}\n\nLive Preview: ${getShareUrl()}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const paletteFaqs = [
    {
      question: 'How do the 12 color harmony rules work in Chromora?',
      answer:
        'Chromora applies classical geometric color wheel mathematical angles (e.g. Analogous 30° shifts, Complementary 180°, Triadic 120°, Tetradic 90°) as well as perceptual mood algorithms (Warm, Cool, Pastel lightness dampening, Neon maximum chroma, and Earthy/Luxury calibrated organic palettes).',
    },
    {
      question: 'Can I lock specific colors while generating others?',
      answer:
        'Yes! Click the Lock icon on any color swatch to freeze it. Pressing Generate Palette (or hitting Spacebar) will preserve your locked shades while algorithmically discovering matching harmonious colors for the remaining slots.',
    },
    {
      question: 'How do I export this palette to Flutter, React Native, or Figma?',
      answer:
        'Click the "Export Tokens" button in the toolbar to instantly generate Flutter Color classes, React Native theme objects, Tailwind config color objects, W3C JSON design tokens, CSS custom properties, or download an SVG swatch image.',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'Free Color Palette Generator From One Color — Chromora',
          description:
            'Create balanced color palettes from a single hex code or color. Lock shades, explore monochromatic and 12 harmony types, and export custom design tokens.',
          canonicalUrl: 'https://chromora.app/color-palette-generator',
          faqs: paletteFaqs,
          softwareApp: {
            name: 'Chromora Palette Generator',
            description: 'Free color palette generator from one color or hex with shade spectrums and token exports.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Palette Generator', url: '/color-palette-generator', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Harmonic Generator & Token Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Color Palette Generator
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Explore 12 mathematical harmonies, lock favorite swatches, and inspect 50–950 shade curves. Press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border text-[11px] font-mono">
                Space
              </kbd>{' '}
              to regenerate.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Design Preview Page Direct Link */}
            <a
              href="/design-preview"
              onClick={(e) => {
                e.preventDefault();
                navigate('/design-preview');
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Design Preview</span>
            </a>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Share & Export Card</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Export Tokens</span>
            </button>

            <button
              onClick={() => setShowSaveInput(!showSaveInput)}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Save Dialog Popup strip if open */}
        {showSaveInput && (
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-indigo-500/40 shadow-lg mb-6 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Name this palette (e.g. Nordic Dusk)..."
              className="flex-1 px-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
              >
                Confirm Save
              </button>
              <button
                onClick={() => setShowSaveInput(false)}
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Controls Toolbar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Harmony Type Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {paletteTypeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setPaletteType(opt.id);
                  regeneratePalette(opt.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  paletteType === opt.id
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Generator Controls */}
          <div className="flex items-center gap-3 self-end lg:self-auto shrink-0">
            {/* Swatch Count Selector */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              {[3, 4, 5, 6, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setPaletteCount(num);
                    regeneratePalette();
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    paletteCount === num
                      ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Shuffle */}
            <button
              onClick={shufflePalette}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
              title="Shuffle Unlocked Swatches"
              aria-label="Shuffle unlocked swatches"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Regenerate */}
            <button
              onClick={() => regeneratePalette()}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate (Space)</span>
            </button>
          </div>
        </div>

        {/* Global HSL Fine-Tuning Sliders Strip */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 font-semibold text-zinc-500 dark:text-zinc-400">
            <Sliders className="w-3.5 h-3.5" />
            <span>Fine-Tune Unlocked:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 font-medium">Hue:</span>
              <button
                onClick={() => handleGlobalHslShift('h', -15)}
                className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono"
              >
                -15°
              </button>
              <button
                onClick={() => handleGlobalHslShift('h', 15)}
                className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono"
              >
                +15°
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 font-medium">Saturation:</span>
              <button
                onClick={() => handleGlobalHslShift('s', -10)}
                className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono"
              >
                -10%
              </button>
              <button
                onClick={() => handleGlobalHslShift('s', 10)}
                className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono"
              >
                +10%
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 font-medium">Lightness:</span>
              <button
                onClick={() => handleGlobalHslShift('l', -8)}
                className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono"
              >
                -8%
              </button>
              <button
                onClick={() => handleGlobalHslShift('l', 8)}
                className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono"
              >
                +8%
              </button>
            </div>
          </div>

          <button
            onClick={handleCopyAll}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span>Copy All HEX (C)</span>
          </button>
        </div>

        {/* Main Interactive Swatch Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex gap-3 mb-10 min-h-[380px]">
          {paletteColors.map((color) => {
            const data = getColorData(color.hex);
            const isDark = data.isDark;
            const fgColor = isDark ? '#ffffff' : '#09090b';

            return (
              <div
                key={color.id}
                className="relative flex-1 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-md group"
                style={{ backgroundColor: color.hex, color: fgColor }}
              >
                {/* Top Swatch Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleLockColor(color.id)}
                    className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                      color.isLocked
                        ? 'bg-black/40 text-white ring-2 ring-white/50'
                        : 'bg-black/20 text-white/80 hover:bg-black/30'
                    }`}
                    aria-label={color.isLocked ? 'Unlock color' : 'Lock color'}
                    title={color.isLocked ? 'Unlock color' : 'Lock color'}
                  >
                    {color.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() =>
                      setExpandedShadesId(expandedShadesId === color.id ? null : color.id)
                    }
                    className="px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/40 text-[11px] font-bold backdrop-blur-md transition-colors flex items-center gap-1 text-white"
                    title="View 50-950 Shades"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Shades</span>
                  </button>
                </div>

                {/* Bottom Color Details & Direct HEX Input */}
                <div className="space-y-2 pt-16">
                  {/* Human-Readable Color Name */}
                  <p className="text-xs font-medium opacity-90 truncate drop-shadow-xs">
                    {color.name}
                  </p>

                  {/* Direct editable HEX */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={color.hex.toUpperCase()}
                      onChange={(e) => updateColorInPalette(color.id, e.target.value)}
                      className="w-full bg-black/20 focus:bg-black/40 px-2.5 py-1.5 rounded-lg text-sm font-mono font-bold tracking-wider text-inherit border border-white/20 focus:outline-none focus:ring-1 focus:ring-white transition-colors"
                      aria-label="Direct HEX code"
                    />
                    <button
                      onClick={() => copyToClipboard(color.hex, `Copied ${color.hex}`)}
                      className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-inherit transition-colors"
                      title="Copy HEX"
                      aria-label={`Copy HEX code ${color.hex}`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Native Picker Trigger */}
                  <div className="relative pt-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-75 flex items-center gap-1 cursor-pointer">
                      <span>Pick Color</span>
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateColorInPalette(color.id, e.target.value)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Shades Drawer if active */}
        {expandedShadesId && (
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl mb-12 animate-fade-in">
            {(() => {
              const activeColor = paletteColors.find((c) => c.id === expandedShadesId);
              if (!activeColor) return null;
              const shades = generateTailwindShades(activeColor.hex);

              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {activeColor.name} ({activeColor.hex.toUpperCase()}) — Tailwind Shades 50–950
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Click any shade step to replace the selected palette color
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedShadesId(null)}
                      className="text-xs text-zinc-400 hover:text-zinc-100 px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
                    {shades.map((s) => (
                      <button
                        key={s.step}
                        onClick={() => {
                          updateColorInPalette(activeColor.id, s.hex);
                        }}
                        className="group flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 text-left transition-transform hover:scale-105"
                      >
                        <div
                          className="h-14 w-full flex items-end p-2"
                          style={{ backgroundColor: s.hex }}
                        >
                          <span
                            className="text-[10px] font-bold opacity-0 group-hover:opacity-100"
                            style={{ color: s.isDark ? '#ffffff' : '#000000' }}
                          >
                            Apply
                          </span>
                        </div>
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-950 flex flex-col">
                          <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                            {s.step}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">
                            {s.hex}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Asian & Global Inspirations Section */}
        <div className="my-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" />
                <span>Asian & Cultural Presets</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Load authentic regional color palettes into the editor with one click
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASIAN_GLOBAL_INSPIRATIONS.slice(0, 6).map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  setPaletteFromHexList(preset.palette, preset.name);
                  showToast(`Loaded ${preset.name}`, 'success');
                }}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 text-left transition-all hover:shadow-md cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-zinc-400">{preset.category}</span>
                </div>
                <div className="flex h-8 rounded-lg overflow-hidden mb-2">
                  {preset.palette.map((hex, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 truncate">{preset.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <FAQSection
          faqs={paletteFaqs}
          title="Palette Generation Science & FAQ"
          subtitle="Learn how to orchestrate harmonious palettes and scale them into design tokens."
        />
      </div>

      {/* Share & Social Cards Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>Share & Export Palette Cards</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Share link box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Shareable URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono focus:outline-none"
                />
                <button
                  onClick={() => {
                    copyToClipboard(getShareUrl(), 'Copied shareable link');
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Social Share Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => generatePngCard('standard')}
                className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-left transition-colors flex items-center gap-3"
              >
                <Download className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-zinc-200">Download PNG Card</p>
                  <p className="text-[10px] text-zinc-400">1200×675 High-Res Image</p>
                </div>
              </button>

              <button
                onClick={() => generatePngCard('instagram')}
                className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-left transition-colors flex items-center gap-3"
              >
                <Instagram className="w-5 h-5 text-pink-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-zinc-200">Instagram 1:1 Card</p>
                  <p className="text-[10px] text-zinc-400">1080×1080 Square Post</p>
                </div>
              </button>

              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-left transition-colors flex items-center gap-3 col-span-1 sm:col-span-2"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-zinc-200">Share via WhatsApp</p>
                  <p className="text-[10px] text-zinc-400">Formatted palette text + preview URL</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
