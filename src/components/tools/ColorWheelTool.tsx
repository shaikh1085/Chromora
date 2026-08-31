import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import {
  getColorData,
  hexToRgb,
  rgbToHsl,
  hslToHex,
  rgbToHex,
  hslToRgb,
  getColorWheelHarmonies,
  clamp,
} from '../../utils/colorUtils';
import { WheelHarmonyMode, WheelHarmonyColor, FAQItem } from '../../types';
import {
  Compass,
  Copy,
  Check,
  Sparkles,
  Shuffle,
  Palette,
  ArrowRight,
  Sliders,
  RotateCcw,
  Layers,
  Layout,
  Info,
  Droplets,
  Share2,
  Bookmark,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { RecentColorsBar } from '../common/RecentColorsBar';

const HARMONY_MODES: {
  id: WheelHarmonyMode;
  name: string;
  shortDesc: string;
  description: string;
  iconName: string;
}[] = [
  {
    id: 'complementary',
    name: 'Complementary',
    shortDesc: '2 colors (180° opposite)',
    description:
      'Two colors directly opposite each other on the color wheel. Delivers maximum optical contrast and visual impact, making it ideal for call-to-action buttons and vibrant focal points.',
    iconName: 'opposite',
  },
  {
    id: 'analogous',
    name: 'Analogous',
    shortDesc: '3 colors (adjacent ±30°)',
    description:
      'Colors sitting adjacent to each other on the wheel. Creates a serene, unified, and naturally comfortable aesthetic often found in nature and calm editorial layouts.',
    iconName: 'adjacent',
  },
  {
    id: 'triadic',
    name: 'Triadic',
    shortDesc: '3 colors (120° equilateral)',
    description:
      'Three colors evenly spaced at 120° intervals forming an equilateral triangle. Offers high vibrancy while maintaining visual balance and distinct separation.',
    iconName: 'triangle',
  },
  {
    id: 'split-complementary',
    name: 'Split-Complementary',
    shortDesc: '3 colors (150° & 210°)',
    description:
      'Combines a base color with the two colors adjacent to its direct complement. Provides the energetic contrast of complementary colors with less visual tension and greater nuance.',
    iconName: 'split',
  },
  {
    id: 'tetradic',
    name: 'Tetradic / Square',
    shortDesc: '4 colors (90° square)',
    description:
      'Four colors spaced at 90° intervals forming a square. Offers a rich, multifaceted palette with two complementary pairs—best used with one dominant color and three accents.',
    iconName: 'square',
  },
  {
    id: 'monochromatic',
    name: 'Monochromatic',
    shortDesc: 'Tints, shades & tones',
    description:
      'Variations in saturation and lightness derived from a single pure hue. Clean, sophisticated, and guaranteed to never clash in modern digital interfaces.',
    iconName: 'layers',
  },
];

const PRESET_HUES = [
  { name: 'Ultramarine Blue', hex: '#2563eb' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Coral Flame', hex: '#f97316' },
  { name: 'Royal Violet', hex: '#8b5cf6' },
  { name: 'Crimson Rose', hex: '#f43f5e' },
  { name: 'Golden Amber', hex: '#f59e0b' },
  { name: 'Teal Cyan', hex: '#06b6d4' },
  { name: 'Electric Fuchsia', hex: '#d946ef' },
];

const TWELVE_SPOKES = [
  { angle: 0, label: 'Red' },
  { angle: 30, label: 'Red-Orange' },
  { angle: 60, label: 'Orange' },
  { angle: 90, label: 'Yellow-Orange' },
  { angle: 120, label: 'Yellow' },
  { angle: 150, label: 'Yellow-Green' },
  { angle: 180, label: 'Green' },
  { angle: 210, label: 'Blue-Green' },
  { angle: 240, label: 'Blue' },
  { angle: 270, label: 'Blue-Violet' },
  { angle: 300, label: 'Violet' },
  { angle: 330, label: 'Red-Violet' },
];

export const ColorWheelTool: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  const {
    copyToClipboard,
    showToast,
    setPaletteFromHexList,
    activeHex,
    setActiveHex,
    addRecentColor,
    savePalette,
  } = usePalette();
  const { t } = useI18n();

  const [baseHex, setBaseHex] = useState<string>(activeHex || '#3b82f6');
  const [harmonyMode, setHarmonyMode] = useState<WheelHarmonyMode>('complementary');
  const [wheelStyle, setWheelStyle] = useState<'smooth' | 'spokes'>('smooth');
  const [analogousSpread, setAnalogousSpread] = useState<number>(30);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const wheelSvgRef = useRef<SVGSVGElement>(null);

  // Parse clean HSL from current baseHex
  const baseHsl = useMemo(() => {
    let val = baseHex.trim();
    if (!val.startsWith('#')) val = `#${val}`;
    const clean = /^#[0-9a-fA-F]{6}$/i.test(val) ? val : '#3b82f6';
    return rgbToHsl(hexToRgb(clean));
  }, [baseHex]);

  // Harmonies generated from base color
  const harmonies: WheelHarmonyColor[] = useMemo(() => {
    return getColorWheelHarmonies(baseHex, harmonyMode, { analogousSpread });
  }, [baseHex, harmonyMode, analogousSpread]);

  const baseColorData = useMemo(() => getColorData(baseHex), [baseHex]);

  // Handle wheel drag/click angle computation
  const updateAngleFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (!wheelSvgRef.current) return;
      const rect = wheelSvgRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // Calculate angle in degrees from 0 to 360 (0 is Top / 12 o'clock if offset by 90)
      // Standard cartesian angle:
      let theta = Math.atan2(dy, dx) * (180 / Math.PI); // -180 to 180
      theta = (theta + 90 + 360) % 360; // 0 at top, clockwise

      const newHue = Math.round(theta);
      const newHex = hslToHex({
        h: newHue,
        s: clamp(baseHsl.s, 20, 100),
        l: clamp(baseHsl.l, 15, 85),
      });

      setBaseHex(newHex);
      setActiveHex(newHex);
    },
    [baseHsl, setActiveHex]
  );

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.preventDefault();
    setIsDragging(true);
    updateAngleFromEvent(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    updateAngleFromEvent(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      addRecentColor(baseHex);
    }
  };

  useEffect(() => {
    const onGlobalPointerUp = () => setIsDragging(false);
    window.addEventListener('pointerup', onGlobalPointerUp);
    return () => window.removeEventListener('pointerup', onGlobalPointerUp);
  }, []);

  const handleCopy = (hex: string, label = 'Hex') => {
    copyToClipboard(hex);
    setCopiedHex(hex);
    showToast(`Copied ${label}: ${hex.toUpperCase()}`, 'success');
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleRandomize = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomSat = Math.floor(Math.random() * 30) + 65; // 65-95%
    const randomLit = Math.floor(Math.random() * 25) + 40; // 40-65%
    const newHex = hslToHex({ h: randomHue, s: randomSat, l: randomLit });
    setBaseHex(newHex);
    setActiveHex(newHex);
    addRecentColor(newHex);
    showToast(`Generated random base hue: ${randomHue}°`, 'info');
  };

  const handleInvert = () => {
    const compHue = (baseHsl.h + 180) % 360;
    const newHex = hslToHex({ ...baseHsl, h: compHue });
    setBaseHex(newHex);
    setActiveHex(newHex);
    addRecentColor(newHex);
    showToast(`Rotated color wheel 180° to: ${compHue}°`, 'info');
  };

  const handleExportToPalette = () => {
    const list = harmonies.map((h) => h.hex);
    setPaletteFromHexList(list);
    showToast(`Exported ${list.length} harmony colors to Palette Generator`, 'success');
    navigate('/color-palette-generator');
  };

  const handleSavePalette = () => {
    const list = harmonies.map((h) => h.hex);
    const palName = `${baseColorData.name} ${HARMONY_MODES.find((m) => m.id === harmonyMode)?.name} Harmony`;
    savePalette(
      palName,
      list,
      ['color-wheel', harmonyMode],
      harmonyMode === 'monochromatic' ? 'monochromatic' : 'analogous'
    );
    showToast('Saved harmony palette to favorites!', 'success');
  };

  const handleCopyCssVars = () => {
    const cssText = `:root {\n` + harmonies.map((h, i) => `  --harmony-color-${i + 1}: ${h.hex}; /* ${h.role} */`).join('\n') + `\n}`;
    copyToClipboard(cssText);
    showToast('Copied CSS custom properties to clipboard', 'success');
  };

  // Wheel Geometry Dimensions
  const wheelRadius = 140;
  const wheelCenter = 160;
  const nodeRadius = 120; // Radius where harmony points sit

  // Convert hue angle (0 at top, clockwise) to SVG coordinates (x, y)
  const getCoordinates = (angleDeg: number, r = nodeRadius) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: wheelCenter + r * Math.cos(rad),
      y: wheelCenter + r * Math.sin(rad),
    };
  };

  // FAQs for SEO
  const colorWheelFaqs: FAQItem[] = [
    {
      question: 'What is a color wheel and how does it work?',
      answer:
        'A color wheel is a circular visual diagram that maps visible color hues around a 360-degree radial spectrum. By placing colors in geometric relation to one another, the wheel enables designers and artists to identify mathematically proven color harmonies—such as complementary, analogous, triadic, and split-complementary schemes—that produce aesthetically pleasing contrast and balance.',
    },
    {
      question: 'What are complementary colors and when should I use them?',
      answer:
        'Complementary colors sit directly opposite each other (180° apart) on the color wheel—such as blue and orange, or red and cyan. Because they stimulate opposite optical receptors in the human eye, complementary pairings create the highest possible visual contrast. They are ideal for buttons, highlights, badges, and focal elements that must command immediate attention.',
    },
    {
      question: 'How do I find analogous colors for my project?',
      answer:
        'Analogous colors sit immediately next to one another on the color wheel (typically separated by 30° to 45°), sharing a common dominant hue. For example, blue, blue-green, and teal form an analogous scheme. They create calm, serene, and harmonious layouts that feel organic, cohesive, and easy on the viewer’s eyes.',
    },
    {
      question: "What's the difference between triadic and tetradic color schemes?",
      answer:
        'A triadic scheme uses three colors spaced equidistant at 120° angles (forming an equilateral triangle), creating vibrant yet balanced contrast. A tetradic (or square) scheme uses four colors spaced at 90° intervals (forming a square or two complementary pairs). Tetradic schemes provide immense variety but require choosing one dominant color to avoid visual clutter.',
    },
    {
      question: 'What is a split-complementary color scheme?',
      answer:
        'A split-complementary scheme takes a base color and pairs it with the two colors adjacent to its direct opposite (at 150° and 210°). This delivers the lively optical contrast of a complementary palette while reducing harsh visual tension, making it easier to balance across complex user interfaces.',
    },
    {
      question: 'How is a color wheel different from a color palette generator?',
      answer:
        'A color wheel is an analytical, rule-based instrument grounded in classical color theory and geometric angle relationships. While a general palette generator can produce random or aesthetic mood swatches, an interactive color wheel explicitly calculates the precise optical harmonies (angles and distances) relative to a specific seed hue.',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'Color Wheel: Find Color Harmonies & Palettes — Chromora',
          description:
            'Explore the interactive color wheel tool to discover complementary, analogous, triadic, and split-complementary color combinations for UI and graphic design.',
          canonicalUrl: 'https://chromora.app/color-wheel',
          faqs: colorWheelFaqs,
          softwareApp: {
            name: 'Chromora Color Wheel Tool',
            description: 'Interactive HSL color wheel and harmony combination generator.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Color Wheel', url: '/color-wheel', isCurrent: true }]}
          onNavigate={navigate}
        />

        <div className="my-4">
          <RecentColorsBar onSelectColor={(hex) => setBaseHex(hex)} />
        </div>

        {/* Page Header */}
        <div className="my-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive 360° Color Theory Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Color Wheel & Harmony Generator
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Rotate through the full 360° HSL color wheel to discover perfect complementary, analogous, triadic, split-complementary, and tetradic color combinations.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="color-wheel-randomize-btn"
              onClick={handleRandomize}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 transition-all shadow-xs active:scale-95"
              title="Generate random base hue"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Hue</span>
            </button>

            <button
              id="color-wheel-invert-btn"
              onClick={handleInvert}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 transition-all shadow-xs active:scale-95"
              title="Rotate 180 degrees"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Invert (180°)</span>
            </button>

            <button
              id="color-wheel-export-palette-btn"
              onClick={handleExportToPalette}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Open in Palette Generator</span>
            </button>
          </div>
        </div>

        {/* Harmony Mode Selector Tabs */}
        <div className="mb-8 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
            {HARMONY_MODES.map((mode) => {
              const isActive = harmonyMode === mode.id;
              return (
                <button
                  key={mode.id}
                  id={`harmony-tab-${mode.id}`}
                  onClick={() => setHarmonyMode(mode.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <span>{mode.name}</span>
                  <span className="text-[10px] opacity-70 font-mono hidden sm:inline">
                    ({mode.shortDesc.split(' ')[0]})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Workspace: Wheel on Left, Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
          {/* LEFT: Interactive Color Wheel SVG */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            {/* Wheel Mode Switch (Smooth vs 12-Spoke) */}
            <div className="w-full flex items-center justify-between mb-4 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Wheel Display
                </span>
                <div className="inline-flex p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <button
                    onClick={() => setWheelStyle('smooth')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      wheelStyle === 'smooth'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Smooth 360°
                  </button>
                  <button
                    onClick={() => setWheelStyle('spokes')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      wheelStyle === 'spokes'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    12 Spokes
                  </button>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-500">
                Hue Angle: <strong className="text-zinc-900 dark:text-zinc-100">{baseHsl.h}°</strong>
              </div>
            </div>

            {/* SVG Interactive Wheel */}
            <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] my-2 select-none touch-none">
              <svg
                ref={wheelSvgRef}
                viewBox="0 0 320 320"
                className="w-full h-full cursor-crosshair overflow-visible"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                <defs>
                  {/* Conical gradient for 360 degree smooth wheel */}
                  <radialGradient id="wheel-sat-overlay" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={baseHsl.l > 50 ? 0.8 : 0.2} />
                    <stop offset="85%" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                  </radialGradient>
                  <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.35" />
                  </filter>
                </defs>

                {/* Background Spoke Segments or Smooth Wheel */}
                {wheelStyle === 'smooth' ? (
                  <g id="smooth-wheel-circle">
                    {/* Render 72 smooth hue slices */}
                    {Array.from({ length: 72 }).map((_, i) => {
                      const startAngle = i * 5;
                      const endAngle = (i + 1) * 5;
                      const midHue = (startAngle + endAngle) / 2;
                      const color = hslToHex({
                        h: midHue,
                        s: clamp(baseHsl.s, 40, 100),
                        l: clamp(baseHsl.l, 30, 70),
                      });

                      const p1 = getCoordinates(startAngle, wheelRadius);
                      const p2 = getCoordinates(endAngle, wheelRadius);
                      const innerR = 45;
                      const ip1 = getCoordinates(startAngle, innerR);
                      const ip2 = getCoordinates(endAngle, innerR);

                      return (
                        <path
                          key={i}
                          d={`M ${ip1.x} ${ip1.y} L ${p1.x} ${p1.y} A ${wheelRadius} ${wheelRadius} 0 0 1 ${p2.x} ${p2.y} L ${ip2.x} ${ip2.y} A ${innerR} ${innerR} 0 0 0 ${ip1.x} ${ip1.y} Z`}
                          fill={color}
                          stroke={color}
                          strokeWidth="0.5"
                        />
                      );
                    })}
                  </g>
                ) : (
                  <g id="spokes-wheel-circle">
                    {/* Render 12 discrete artist spokes */}
                    {TWELVE_SPOKES.map((spoke, idx) => {
                      const startAngle = spoke.angle - 15;
                      const endAngle = spoke.angle + 15;
                      const color = hslToHex({
                        h: spoke.angle,
                        s: clamp(baseHsl.s, 60, 100),
                        l: clamp(baseHsl.l, 35, 65),
                      });

                      const p1 = getCoordinates(startAngle, wheelRadius);
                      const p2 = getCoordinates(endAngle, wheelRadius);
                      const innerR = 45;
                      const ip1 = getCoordinates(startAngle, innerR);
                      const ip2 = getCoordinates(endAngle, innerR);

                      return (
                        <path
                          key={idx}
                          d={`M ${ip1.x} ${ip1.y} L ${p1.x} ${p1.y} A ${wheelRadius} ${wheelRadius} 0 0 1 ${p2.x} ${p2.y} L ${ip2.x} ${ip2.y} A ${innerR} ${innerR} 0 0 0 ${ip1.x} ${ip1.y} Z`}
                          fill={color}
                          stroke="#18181b"
                          strokeWidth="2"
                          className="hover:opacity-90 transition-opacity cursor-pointer"
                          onClick={() => {
                            const newHex = hslToHex({ ...baseHsl, h: spoke.angle });
                            setBaseHex(newHex);
                            setActiveHex(newHex);
                          }}
                        />
                      );
                    })}
                  </g>
                )}

                {/* Subtle radial overlay */}
                <circle
                  cx={wheelCenter}
                  cy={wheelCenter}
                  r={wheelRadius}
                  fill="url(#wheel-sat-overlay)"
                  pointerEvents="none"
                />

                {/* Inner White/Dark Well */}
                <circle
                  cx={wheelCenter}
                  cy={wheelCenter}
                  r="44"
                  className="fill-white dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700"
                  strokeWidth="2"
                />

                {/* Harmony Connection Geometry Lines */}
                {harmonies.length > 1 && (
                  <g id="harmony-geometry" className="transition-all duration-300" pointerEvents="none">
                    {/* Polygon connecting all harmony points */}
                    <polygon
                      points={harmonies.map((h) => {
                        const pt = getCoordinates(h.angle, nodeRadius);
                        return `${pt.x},${pt.y}`;
                      }).join(' ')}
                      fill="none"
                      stroke={baseHex}
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      className="opacity-80"
                    />

                    {/* Center radial rays to each harmony node */}
                    {harmonies.map((h, i) => {
                      const pt = getCoordinates(h.angle, nodeRadius);
                      return (
                        <line
                          key={i}
                          x1={wheelCenter}
                          y1={wheelCenter}
                          x2={pt.x}
                          y2={pt.y}
                          stroke={h.hex}
                          strokeWidth="2"
                          strokeOpacity="0.7"
                        />
                      );
                    })}
                  </g>
                )}

                {/* Harmony Target Markers (Nodes) on Wheel */}
                {harmonies.map((item, idx) => {
                  const pt = getCoordinates(item.angle, nodeRadius);
                  const isBase = idx === (harmonyMode === 'analogous' ? 1 : 0);

                  return (
                    <g
                      key={idx}
                      transform={`translate(${pt.x}, ${pt.y})`}
                      className="cursor-pointer transition-transform hover:scale-110"
                      filter="url(#node-glow)"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBaseHex(item.hex);
                        setActiveHex(item.hex);
                      }}
                    >
                      {/* Outer pulse ring for base color */}
                      {isBase && (
                        <circle
                          r="18"
                          fill="none"
                          stroke={item.hex}
                          strokeWidth="3"
                          className="animate-ping opacity-60"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        r={isBase ? 14 : 11}
                        fill={item.hex}
                        stroke="#ffffff"
                        strokeWidth={isBase ? 3.5 : 2.5}
                      />

                      {/* Center dot */}
                      <circle
                        r={isBase ? 4 : 3}
                        fill={item.data.isDark ? '#ffffff' : '#000000'}
                      />
                    </g>
                  );
                })}

                {/* Central Seed Color Core */}
                <g transform={`translate(${wheelCenter}, ${wheelCenter})`}>
                  <circle
                    r="32"
                    fill={baseHex}
                    stroke="#ffffff"
                    strokeWidth="3"
                    filter="url(#node-glow)"
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleCopy(baseHex, 'Base Color')}
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    className="font-mono text-[10px] font-bold fill-white pointer-events-none"
                    style={{
                      fill: baseColorData.isDark ? '#ffffff' : '#000000',
                    }}
                  >
                    {baseHsl.h}°
                  </text>
                </g>
              </svg>
            </div>

            {/* Instruction Tip */}
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 text-center flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Click or drag anywhere on the wheel to rotate base hue angle</span>
            </p>
          </div>

          {/* RIGHT: Base Color Tuning & Harmony Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Base Color Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                    Active Seed Color
                  </span>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {baseColorData.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={baseColorData.hex}
                    onChange={(e) => {
                      setBaseHex(e.target.value);
                      setActiveHex(e.target.value);
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-zinc-300 dark:border-zinc-700 bg-transparent p-0.5"
                    title="Open native color picker"
                  />
                </div>
              </div>

              {/* Hex Input & Copy */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-400 font-bold">
                    HEX
                  </span>
                  <input
                    type="text"
                    value={baseHex.toUpperCase()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBaseHex(val);
                      if (/^#?[0-9a-fA-F]{6}$/.test(val)) {
                        const clean = val.startsWith('#') ? val : `#${val}`;
                        setActiveHex(clean);
                      }
                    }}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl font-mono text-sm font-bold bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => handleCopy(baseHex, 'Base Color')}
                  className="px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
                  title="Copy Base Hex"
                >
                  {copiedHex === baseHex ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Sliders: Hue, Saturation, Lightness */}
              <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {/* Hue Slider (0-360) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-zinc-600 dark:text-zinc-400">Hue Angle (H)</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                      {baseHsl.h}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="359"
                    value={baseHsl.h}
                    onChange={(e) => {
                      const h = Number(e.target.value);
                      const newHex = hslToHex({ ...baseHsl, h });
                      setBaseHex(newHex);
                      setActiveHex(newHex);
                    }}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background:
                        'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                    }}
                  />
                </div>

                {/* Saturation Slider (0-100) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-zinc-600 dark:text-zinc-400">Saturation (S)</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                      {baseHsl.s}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={baseHsl.s}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      const newHex = hslToHex({ ...baseHsl, s });
                      setBaseHex(newHex);
                      setActiveHex(newHex);
                    }}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${hslToHex({
                        h: baseHsl.h,
                        s: 0,
                        l: baseHsl.l,
                      })}, ${hslToHex({ h: baseHsl.h, s: 100, l: baseHsl.l })})`,
                    }}
                  />
                </div>

                {/* Lightness Slider (0-100) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-zinc-600 dark:text-zinc-400">Lightness (L)</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                      {baseHsl.l}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={baseHsl.l}
                    onChange={(e) => {
                      const l = Number(e.target.value);
                      const newHex = hslToHex({ ...baseHsl, l });
                      setBaseHex(newHex);
                      setActiveHex(newHex);
                    }}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #000000, ${hslToHex({
                        h: baseHsl.h,
                        s: baseHsl.s,
                        l: 50,
                      })}, #ffffff)`,
                    }}
                  />
                </div>

                {/* Analogous Spread option if analogous mode */}
                {harmonyMode === 'analogous' && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-zinc-600 dark:text-zinc-400">Analogous Spread Angle</span>
                      <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                        ±{analogousSpread}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      step="5"
                      value={analogousSpread}
                      onChange={(e) => setAnalogousSpread(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                )}
              </div>

              {/* Preset Signature Hues */}
              <div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                  Popular Starting Hues
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PRESET_HUES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setBaseHex(preset.hex);
                        setActiveHex(preset.hex);
                        addRecentColor(preset.hex);
                      }}
                      className="h-8 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-transform hover:scale-110 active:scale-95 shadow-xs relative"
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Harmony Explanation Box */}
            <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-sm">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>
                  About {HARMONY_MODES.find((m) => m.id === harmonyMode)?.name} Harmony
                </span>
              </div>
              <p className="text-xs text-indigo-950/80 dark:text-indigo-200/80 leading-relaxed">
                {HARMONY_MODES.find((m) => m.id === harmonyMode)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Harmony Swatches Display */}
        <div className="my-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                Calculated Harmony Combination
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {HARMONY_MODES.find((m) => m.id === harmonyMode)?.name} Palette ({harmonies.length} Colors)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyCssVars}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy CSS Variables</span>
              </button>

              <button
                onClick={handleSavePalette}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Palette</span>
              </button>
            </div>
          </div>

          {/* Full-width continuous ribbon */}
          <div className="h-16 w-full rounded-2xl overflow-hidden flex shadow-md border border-zinc-200 dark:border-zinc-800">
            {harmonies.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleCopy(item.hex, item.role)}
                className="flex-1 h-full cursor-pointer relative group transition-transform hover:scale-105"
                style={{ backgroundColor: item.hex }}
                title={`${item.role}: ${item.hex}`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 text-white font-mono text-xs font-bold transition-opacity">
                  {item.hex.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Cards for each Harmony Color */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`,
            }}
          >
            {harmonies.map((item, idx) => {
              const isCopied = copiedHex === item.hex;
              const isBase = item.role.includes('Base');

              return (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:shadow-lg transition-all flex flex-col"
                >
                  {/* Swatch Header */}
                  <div
                    className="h-28 p-3 flex flex-col justify-between relative cursor-pointer group"
                    style={{ backgroundColor: item.hex }}
                    onClick={() => handleCopy(item.hex, item.role)}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          item.data.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black'
                        }`}
                      >
                        {item.angle}°
                      </span>

                      {isBase && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            item.data.isDark ? 'bg-white text-zinc-900' : 'bg-black text-white'
                          }`}
                        >
                          Base
                        </span>
                      )}
                    </div>

                    <div
                      className={`self-end p-1.5 rounded-lg transition-opacity ${
                        isCopied
                          ? 'opacity-100 bg-emerald-500 text-white'
                          : 'opacity-0 group-hover:opacity-100 ' +
                            (item.data.isDark ? 'bg-white/20 text-white' : 'bg-black/20 text-black')
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider">
                        {item.role}
                      </span>
                      <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 truncate">
                        {item.data.name}
                      </h4>
                    </div>

                    {/* Color Formats */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <div
                        onClick={() => handleCopy(item.hex, 'HEX')}
                        className="flex justify-between items-center px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 cursor-pointer hover:border-indigo-400 transition-colors"
                      >
                        <span className="text-zinc-500 text-[10px]">HEX</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          {item.hex.toUpperCase()}
                        </span>
                      </div>

                      <div
                        onClick={() => handleCopy(`rgb(${item.data.rgb.r}, ${item.data.rgb.g}, ${item.data.rgb.b})`, 'RGB')}
                        className="flex justify-between items-center px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 cursor-pointer hover:border-indigo-400 transition-colors"
                      >
                        <span className="text-zinc-500 text-[10px]">RGB</span>
                        <span className="text-zinc-700 dark:text-zinc-300 text-[11px]">
                          {item.data.rgb.r}, {item.data.rgb.g}, {item.data.rgb.b}
                        </span>
                      </div>

                      <div
                        onClick={() => handleCopy(`hsl(${item.data.hsl.h}, ${item.data.hsl.s}%, ${item.data.hsl.l}%)`, 'HSL')}
                        className="flex justify-between items-center px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 cursor-pointer hover:border-indigo-400 transition-colors"
                      >
                        <span className="text-zinc-500 text-[10px]">HSL</span>
                        <span className="text-zinc-700 dark:text-zinc-300 text-[11px]">
                          {item.data.hsl.h}°, {item.data.hsl.s}%, {item.data.hsl.l}%
                        </span>
                      </div>
                    </div>

                    {/* Pivot Button to make this color the new base */}
                    {!isBase && (
                      <button
                        onClick={() => {
                          setBaseHex(item.hex);
                          setActiveHex(item.hex);
                          addRecentColor(item.hex);
                          showToast(`Selected ${item.data.name} as new wheel base`, 'info');
                        }}
                        className="w-full py-1.5 rounded-lg text-xs font-semibold bg-zinc-200/70 dark:bg-zinc-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-zinc-700 dark:text-zinc-300"
                      >
                        Set as New Base Color
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live UI Mockup Preview */}
        <div className="my-10 p-6 sm:p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
          <div className="mb-6">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Real-World Application
            </span>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Live Harmony Preview in Digital UI
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              See how your calculated {HARMONY_MODES.find((m) => m.id === harmonyMode)?.name.toLowerCase()} harmony colors naturally balance in a modern dashboard component.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Mockup Card 1: Light Theme UI Container */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: harmonies[0]?.hex || baseHex }}
                  />
                  <span className="font-bold text-sm text-zinc-900">
                    Chromora Design Studio
                  </span>
                </div>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${harmonies[1]?.hex || baseHex}20`,
                    color: harmonies[1]?.hex || baseHex,
                  }}
                >
                  {HARMONY_MODES.find((m) => m.id === harmonyMode)?.name}
                </span>
              </div>

              <h4
                className="text-lg font-black tracking-tight"
                style={{ color: harmonies[0]?.hex || baseHex }}
              >
                Harmonious Visual Architecture
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Optical contrast and complementary balance ensure effortless readability and hierarchical clarity across all interfaces.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
                  style={{
                    backgroundColor: harmonies[1]?.hex || harmonies[0]?.hex || baseHex,
                  }}
                >
                  Primary Action
                </button>
                <button
                  className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors"
                  style={{
                    borderColor: `${harmonies[harmonies.length > 2 ? 2 : 0]?.hex}60`,
                    color: harmonies[harmonies.length > 2 ? 2 : 0]?.hex,
                  }}
                >
                  Secondary Action
                </button>
              </div>
            </div>

            {/* Mockup Card 2: Dark Theme UI Container */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-lg space-y-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-xs"
                    style={{ backgroundColor: harmonies[0]?.hex || baseHex }}
                  />
                  <span className="font-bold text-sm text-zinc-100">
                    Pro Dark Interface
                  </span>
                </div>
                <div className="flex -space-x-1.5">
                  {harmonies.map((h, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-zinc-950"
                      style={{ backgroundColor: h.hex }}
                    />
                  ))}
                </div>
              </div>

              <h4
                className="text-lg font-black tracking-tight"
                style={{ color: harmonies[harmonies.length - 1]?.hex || baseHex }}
              >
                Vibrant & Luminescent Elements
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Color wheel harmonies maintain balanced chroma and luminance in dark mode environments without causing visual glare.
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: harmonies[0]?.hex || baseHex }}
                >
                  {baseColorData.name} ({baseHsl.h}°)
                </span>
                <span
                  className="px-3 py-1 rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: `${harmonies[1]?.hex || baseHex}30`,
                    color: harmonies[1]?.hex || baseHex,
                  }}
                >
                  Active State
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tools Links */}
        <div className="my-12 p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Explore Related Color Tools
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
                Generate 5-color aesthetic palettes with spacebar locking and export.
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
                Blend colors with OKLCH, optical, and physical pigment mixing modes.
              </p>
            </a>

            <a
              href="/color-picker"
              onClick={(e) => {
                e.preventDefault();
                navigate('/color-picker');
              }}
              className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
            >
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
                <span>Color Explorer & Picker</span>
                <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Explore shades, tints, triadic harmonies, and multi-format conversions.
              </p>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection
          faqs={colorWheelFaqs}
          title="Color Wheel & Harmony FAQ"
          subtitle="Everything you need to know about color wheel geometry, harmonies, and practical color theory."
        />
      </div>
    </div>
  );
};
