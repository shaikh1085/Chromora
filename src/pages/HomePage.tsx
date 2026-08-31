import React, { useState } from 'react';
import { usePalette } from '../context/PaletteContext';
import { trendingPalettes } from '../data/presetPalettes';
import {
  getColorData,
  parseColorInput,
  generateTailwindShades,
  generatePalette,
  getContrastRatio,
  hexToSlug,
} from '../utils/colorUtils';
import {
  Compass,
  Palette,
  Image as ImageIcon,
  CheckCircle,
  Sliders,
  Repeat,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Search,
  ExternalLink,
  Layers,
  Code2,
  Shield,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { FAQSection } from '../components/common/FAQSection';

export const HomePage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  const {
    activeHex,
    setActiveHex,
    setPaletteFromHexList,
    copyToClipboard,
    setIsExportModalOpen,
  } = usePalette();
  const [quickInput, setQuickInput] = useState(activeHex);
  const [copiedToken, setCopiedToken] = useState(false);

  const activeColorData = getColorData(activeHex);
  const activeShades = generateTailwindShades(activeHex);
  const contrastWithDark = getContrastRatio('#ffffff', activeHex);
  const contrastPass = contrastWithDark.ratio >= 4.5;

  const samplePalette = [
    activeShades.find((s) => s.step === '100')?.hex || '#EEF2FF',
    activeShades.find((s) => s.step === '300')?.hex || '#C7D2FE',
    activeShades.find((s) => s.step === '400')?.hex || '#818CF8',
    activeHex,
    activeShades.find((s) => s.step === '600')?.hex || '#4F46E5',
    activeShades.find((s) => s.step === '900')?.hex || '#312E81',
  ];

  const quickColorPresets = [
    { name: 'Indigo Drift', hex: '#6366F1' },
    { name: 'Sunset Orange', hex: '#F97316' },
    { name: 'Ocean Teal', hex: '#0D9488' },
    { name: 'Slate Mist', hex: '#64748B' },
    { name: 'Fuchsia Neon', hex: '#D946EF' },
    { name: 'Emerald Gem', hex: '#10B981' },
  ];

  const handleQuickExplore = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseColorInput(quickInput);
    if (parsed) {
      setActiveHex(parsed);
      navigate(`/color-picker`);
    } else {
      navigate(`/colors?search=${encodeURIComponent(quickInput)}`);
    }
  };

  const featureTools = [
    {
      title: 'Interactive Color Wheel',
      description: 'Rotate the 360° HSL wheel to calculate complementary, analogous, triadic, and square harmonies.',
      route: '/color-wheel',
      icon: Compass,
      badge: 'Color Theory',
      accent: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'AI Prompt to Palette',
      description: 'Smart natural language generator for moods, industries, cultural events, and design styles.',
      route: '/ai-palette-generator',
      icon: Sparkles,
      badge: 'Smart Engine',
      accent: 'from-amber-500 to-rose-600',
    },
    {
      title: 'Live Design Preview',
      description: 'Test your palette against realistic SaaS dashboards, mobile apps, store cards, and social posts.',
      route: '/design-preview',
      icon: Layers,
      badge: 'Interactive Stage',
      accent: 'from-indigo-500 to-cyan-500',
    },
    {
      title: 'Smart Color Explorer',
      description: 'Analyze HEX, RGB, HSL, HSV, CMYK, OKLCH, and generate Tailwind 50–950 shade curves.',
      route: '/color-picker',
      icon: Compass,
      badge: 'Core Engine',
      accent: 'from-violet-500 to-indigo-600',
    },
    {
      title: 'Palette Generator',
      description: 'Orchestrate 12 harmonic geometries, lock favorite colors, and shuffle swatches.',
      route: '/color-palette-generator',
      icon: Palette,
      badge: '12 Harmonies',
      accent: 'from-fuchsia-500 to-violet-600',
    },
    {
      title: 'Image to Palette',
      description: 'Extract dominant color palettes from any photo with 100% private, client-side processing.',
      route: '/image-color-palette',
      icon: ImageIcon,
      badge: 'Zero Server',
      accent: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'WCAG Contrast Checker',
      description: 'Audit AA & AAA legibility with live interactive component simulators and auto-fixing.',
      route: '/contrast-checker',
      icon: CheckCircle,
      badge: 'WCAG 2.1',
      accent: 'from-amber-500 to-orange-600',
    },
    {
      title: 'CSS Gradient Studio',
      description: 'Design linear and radial multi-stop CSS gradients with precision angle controls.',
      route: '/gradient-generator',
      icon: Sliders,
      badge: 'CSS3 Output',
      accent: 'from-pink-500 to-rose-600',
    },
    {
      title: 'Multi-Space Converter',
      description: 'Seamless mathematical conversion between digital screen and physical print coordinates.',
      route: '/color-converter',
      icon: Repeat,
      badge: 'Instant Math',
      accent: 'from-cyan-500 to-blue-600',
    },
  ];

  const homeFaqs = [
    {
      question: 'How do I generate an accessible color palette for UI design with WCAG compliance?',
      answer:
        'With Chromora, enter any HEX, RGB, or OKLCH seed color into the studio. The platform automatically calculates complementary and analogous harmonies while checking WCAG 2.1 AAA and AA contrast ratios against light (#FFFFFF) and dark (#0F172A) backgrounds in real time, ensuring digital readability.',
    },
    {
      question: 'How do I convert HEX to OKLCH, RGB, CMYK, and Pantone colors?',
      answer:
        'Chromora includes a multi-way color converter that performs instant mathematical transformations between digital screen coordinates (HEX, RGB, HSL, HSV), perceptual wide-gamut spaces (OKLCH, LAB), and physical print standards (CMYK, Pantone, RAL).',
    },
    {
      question: 'Can I extract a color palette from an image with exact HEX codes?',
      answer:
        'Yes! Simply upload or drag-and-drop any PNG, JPG, or SVG image into the Image Color Extractor. Chromora uses client-side color quantization algorithms to generate dominant color swatches, complete with one-click HEX copying and full privacy.',
    },
    {
      question: 'How do I export color systems to Tailwind CSS and Figma design tokens?',
      answer:
        'Chromora provides a dedicated Export Center that generates Tailwind CSS 50–950 color shade configs, W3C standard JSON design tokens, CSS custom properties (:root variables), SCSS stylesheets, and SVG swatch assets.',
    },
    {
      question: 'How does the Color Blindness Simulator test accessibility?',
      answer:
        'The Color Blindness Simulator models 8 distinct visual conditions including Protanopia, Deuteranopia, Tritanopia, and Achromatopsia, allowing UI/UX designers to guarantee visual hierarchy for all users.',
    },
    {
      question: 'Is Chromora free to use with zero server data tracking?',
      answer:
        'Yes. Chromora is 100% free with no account or credit card required. All color math, image extraction, and token generation execute directly inside your browser with zero data sent to external servers.',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)]">
      <SEO
        config={{
          title: 'Chromora — Accessible Color Palette Generator & Design System Studio',
          description:
            'Free accessible color palette generator for UI design. Test WCAG contrast, extract colors from images with HEX codes, convert HEX to OKLCH, and export Tailwind CSS design tokens.',
          keywords: [
            'accessible color palette generator for UI design',
            'color palette generator with contrast checker',
            'hex to oklch converter online',
            'oklch to hex converter',
            'extract color palette from image with hex codes',
            'CSS design tokens generator',
            'tailwind color shades generator',
            'color blindness simulator for UI design',
            'ramadan color palette hex codes',
            'cyberpunk neon color palette for UI',
            'free online color converter',
          ],
          canonicalUrl: 'https://chromora.app',
          faqs: homeFaqs,
          softwareApp: {
            name: 'Chromora Color Platform',
            description: 'Accessible color palette generator, WCAG contrast checker, and design token studio.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      {/* Elegant Main Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--border-glass)] py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Hero Header */}
          <div className="text-center max-w-4xl mx-auto mb-10 lg:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accessible Color Intelligence &amp; Design System Studio</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[var(--text-primary)] tracking-tight text-center">
              Turn Any Color Into a{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--accent), #d946ef, #38bdf8)`,
                }}
              >
                Complete Design System.
              </span>
            </h1>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-center">
              Generate WCAG AAA accessible palettes, convert HEX to OKLCH &amp; CMYK, extract colors from images, and export production-ready Tailwind CSS &amp; Figma design tokens.
            </p>
          </div>

          {/* 2 Equal Color Sections (50 / 50 Grid with Balanced Padding & Heights) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Left Card: Input Studio & Fast Generator */}
            <div className="w-full glass-panel rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl relative p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  background: `radial-gradient(circle at top left, var(--accent) 0%, transparent 60%)`,
                }}
              />

              <div className="relative z-10 flex flex-col gap-6">
                {/* Top Header Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] flex items-center gap-2.5">
                      <span>Color Input & Generator</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-1 font-semibold">
                      QUICK EXPLORATION STUDIO
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider font-mono border"
                    style={{
                      backgroundColor: 'var(--accent-soft)',
                      color: 'var(--accent)',
                      borderColor: 'var(--accent-border)',
                    }}
                  >
                    Active Input
                  </span>
                </div>

                {/* Input Color Box */}
                <form onSubmit={handleQuickExplore} className="flex flex-col gap-3.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Input Color (HEX, RGB, OKLCH)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 flex items-center">
                      <label htmlFor="hero-color-picker" className="sr-only">Choose Color</label>
                      <input
                        id="hero-color-picker"
                        type="color"
                        value={activeHex.startsWith('#') && activeHex.length === 7 ? activeHex : '#6366f1'}
                        onChange={(e) => {
                          setActiveHex(e.target.value);
                          setQuickInput(e.target.value);
                        }}
                        className="absolute left-2.5 w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent p-0 overflow-hidden"
                        title="Pick a color visually"
                      />
                      <input
                        type="text"
                        value={quickInput}
                        onChange={(e) => {
                          setQuickInput(e.target.value);
                          const parsed = parseColorInput(e.target.value);
                          if (parsed) setActiveHex(parsed);
                        }}
                        placeholder="#6366F1, rgb(99, 102, 241), oklch(...)"
                        className="w-full bg-[var(--surface-glass-card)] border border-[var(--border-glass)] rounded-xl py-3 pl-11 pr-4 text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 btn-accent rounded-xl font-semibold text-sm transition-all shadow-md shrink-0"
                    >
                      Explore
                    </button>
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-0.5">
                    <a
                      href="/color-picker"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/color-picker');
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-2 border border-[var(--border-glass)] transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                      <span>Explore Specs</span>
                    </a>
                    <a
                      href="/ai-palette-generator"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/ai-palette-generator');
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-2 border border-[var(--border-glass)] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-fuchsia-500" />
                      <span>AI Palette</span>
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--text-muted)]">
                    <span className="font-semibold">Quick Presets:</span>
                    {quickColorPresets.slice(0, 4).map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => {
                          setActiveHex(preset.hex);
                          setQuickInput(preset.hex);
                        }}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors underline-offset-2 hover:underline text-xs"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </form>

                {/* 2 Bottom Feature Cards matching Right column's 2 cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                  <a
                    href="/contrast-checker"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/contrast-checker');
                    }}
                    className="p-4 sm:p-5 glass-card rounded-2xl hover:border-[var(--accent)] transition-colors text-left group flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-[var(--text-primary)] mb-1 text-sm">WCAG Contrast</h3>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        Automated WCAG AAA & AA accessibility test suite.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[var(--accent)] mt-3 flex items-center gap-1">
                      <span>Test Colors</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </a>

                  <a
                    href="/design-preview"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/design-preview');
                    }}
                    className="p-4 sm:p-5 glass-card rounded-2xl hover:border-[var(--accent)] transition-colors text-left group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 text-indigo-500 group-hover:scale-105 transition-transform">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-[var(--text-primary)] mb-1 text-sm">Design Preview</h3>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        Simulate palettes on real UI buttons & dashboards.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-indigo-400 mt-3 flex items-center gap-1">
                      <span>Open Preview</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Card: Interactive Showcase Stage */}
            <div className="w-full glass-panel rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl relative p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: `radial-gradient(circle at top right, var(--accent) 0%, transparent 60%)`,
                }}
              />

              <div className="relative z-10 flex flex-col gap-6">
                {/* Top Bar of Stage */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] flex items-center gap-2.5">
                      <span>{activeColorData.name}</span>
                      <span className="text-[var(--text-muted)] font-semibold text-xs uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-[var(--surface-glass-card)] border border-[var(--border-glass)]">
                        System-{activeColorData.family.slice(0, 3)}
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-1 font-semibold">{activeHex.toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full border-2 border-white/20 transition-all shadow-md"
                      style={{
                        backgroundColor: activeHex,
                        boxShadow: `0 0 16px var(--accent-glow)`,
                      }}
                    />
                    <a
                      href="/color-picker"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/color-picker');
                      }}
                      className="text-xs sm:text-sm font-bold flex items-center gap-1.5 ml-1 transition-colors hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      <span>Full Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 6 Shade Tiles with Active Ring */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {samplePalette.map((hex, idx) => {
                    const isSelected = hex.toLowerCase() === activeHex.toLowerCase();
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveHex(hex);
                          setQuickInput(hex);
                          copyToClipboard(hex, `Copied ${hex}`);
                        }}
                        className={`h-20 sm:h-24 rounded-xl transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'ring-2 ring-[var(--text-primary)] ring-offset-2 ring-offset-[var(--bg-page)] scale-105 z-10 shadow-lg'
                            : 'hover:scale-102 hover:opacity-90'
                        }`}
                        style={{ backgroundColor: hex }}
                        title={`Click to select ${hex}`}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs transition-opacity whitespace-nowrap shadow-sm">
                          {hex}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 2 Bottom Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                  {/* Contrast Check */}
                  <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                        Contrast Check
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                          contrastPass
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}
                      >
                        {contrastPass ? 'AAA Pass' : 'AA Large'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="h-2 w-3/4 bg-[var(--surface-glass-active)] rounded-full" />
                      <div className="h-2 w-1/2 bg-[var(--surface-glass-active)] rounded-full" />
                      <a
                        href="/contrast-checker"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/contrast-checker');
                        }}
                        className="mt-3 w-full p-2.5 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm transition-transform hover:scale-[1.02]"
                        style={{
                          backgroundColor: activeHex,
                          color: activeColorData.isDark ? '#FFFFFF' : '#000000',
                        }}
                      >
                        Action Button Preview
                      </a>
                    </div>
                  </div>

                  {/* Tokens Export */}
                  <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                          Tokens Export
                        </span>
                        <button
                          onClick={() => setIsExportModalOpen(true)}
                          className="text-xs font-bold transition-colors hover:underline"
                          style={{ color: 'var(--accent)' }}
                        >
                          All Formats
                        </button>
                      </div>
                      <div className="space-y-1 font-mono text-[11px] bg-[var(--surface-glass-card)] p-2.5 rounded-lg border border-[var(--border-glass-subtle)] leading-relaxed" style={{ color: 'var(--accent)' }}>
                        <div>--primary-500: {activeHex.toUpperCase()};</div>
                        <div>--primary-600: {activeShades.find((s) => s.step === '600')?.hex.toUpperCase() || '#4F46E5'};</div>
                        <div>--bg-surface: var(--bg-page);</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const cssTokens = `:root {\n  --primary-500: ${activeHex};\n  --primary-600: ${activeShades.find((s) => s.step === '600')?.hex || '#4F46E5'};\n  --bg-surface: var(--bg-page);\n}`;
                        copyToClipboard(cssTokens, 'Copied CSS Tokens');
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      className="mt-3 h-9 w-full border border-[var(--border-glass)] border-dashed rounded-xl flex items-center justify-center text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors gap-1.5"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy CSS Tokens</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Tools Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span
            className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full inline-block mb-3"
            style={{
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            Design System Tools
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Production-Ready Color Engineering Suite for UI Designers &amp; Developers
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Precision mathematical tools crafted for high-performance web development, mobile design, and brand style guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.route}
                href={tool.route}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(tool.route);
                }}
                className="p-6 rounded-2xl glass-card text-left transition-all hover:shadow-2xl hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.accent} p-2 text-white flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] bg-[var(--surface-glass-card)] px-2.5 py-1 rounded-full border border-[var(--border-glass)]">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:opacity-80 transition-opacity">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div
                  className="pt-6 mt-6 border-t border-[var(--border-glass-subtle)] flex items-center justify-between text-xs font-bold transition-all"
                  style={{ color: 'var(--accent)' }}
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Trending Curated Palettes Showcase */}
      <section className="py-16 border-y border-[var(--border-glass)] bg-[var(--surface-glass)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Curated Harmonies
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1">
                Trending Production Palettes
              </h2>
            </div>
            <a
              href="/color-palette-generator"
              onClick={(e) => {
                e.preventDefault();
                navigate('/color-palette-generator');
              }}
              className="text-xs font-bold flex items-center gap-1 self-start sm:self-auto hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              <span>Explore All Palettes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPalettes.slice(0, 6).map((pal) => (
              <div
                key={pal.id}
                className="glass-card rounded-2xl p-5 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">{pal.name}</h3>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--surface-glass-card)] px-2 py-0.5 rounded-full border border-[var(--border-glass)] capitalize">
                    {pal.tags[0]}
                  </span>
                </div>

                {/* Swatches Strip */}
                <div className="flex h-16 rounded-xl overflow-hidden shadow-inner border border-[var(--border-glass)]">
                  {pal.colors.map((hex, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveHex(hex);
                        copyToClipboard(hex, `Copied ${hex}`);
                      }}
                      className="flex-1 h-full cursor-pointer hover:opacity-85 transition-opacity"
                      style={{ backgroundColor: hex }}
                      title={`Click to copy ${hex}`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)]">
                    <span>{pal.colors.length} shades</span>
                  </div>

                  <a
                    href="/color-palette-generator"
                    onClick={(e) => {
                      e.preventDefault();
                      setPaletteFromHexList(pal.colors, pal.name);
                      navigate('/color-palette-generator');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] border border-[var(--border-glass)] text-xs font-semibold text-[var(--text-primary)] transition-colors flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Colors Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              Curated Swatches
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1">
              Popular Colors
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Iconic shades frequently explored by designers and developers worldwide.
            </p>
          </div>
          <a
            href="/colors"
            onClick={(e) => {
              e.preventDefault();
              navigate('/colors');
            }}
            className="text-xs font-bold flex items-center gap-1 self-start sm:self-auto hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            <span>Browse All Colors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Royal Indigo', hex: '#6366F1' },
            { name: 'Sunset Coral', hex: '#FF6B6B' },
            { name: 'Emerald Glade', hex: '#10B981' },
            { name: 'Deep Sapphire', hex: '#0B4F6C' },
            { name: 'Golden Amber', hex: '#F59E0B' },
            { name: 'Neon Fuchsia', hex: '#D946EF' },
            { name: 'Midnight Slate', hex: '#1E293B' },
            { name: 'Rose Velvet', hex: '#E11D48' },
            { name: 'Teal Lagoon', hex: '#0D9488' },
            { name: 'Electric Cyan', hex: '#06B6D4' },
            { name: 'Warm Terracotta', hex: '#C2410C' },
            { name: 'Soft Lavender', hex: '#8B5CF6' },
          ].map((col) => (
            <div
              key={col.hex}
              className="glass-card rounded-2xl p-3 hover:border-[var(--accent)] transition-all group flex flex-col justify-between"
            >
              <a
                href={`/colors/${hexToSlug(col.name, col.hex)}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveHex(col.hex);
                  navigate(`/colors/${hexToSlug(col.name, col.hex)}`);
                }}
                className="w-full text-left block"
              >
                <div
                  className="w-full h-20 rounded-xl mb-3 shadow-inner border border-black/10 dark:border-white/10 group-hover:scale-[1.02] transition-transform"
                  style={{ backgroundColor: col.hex }}
                />
                <div className="font-semibold text-xs text-[var(--text-primary)] truncate group-hover:opacity-80 transition-colors">
                  {col.name}
                </div>
              </a>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-glass-subtle)]">
                <span className="font-mono text-[10px] text-[var(--text-muted)]">{col.hex}</span>
                <button
                  onClick={() => copyToClipboard(col.hex, `Copied ${col.hex}`)}
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: 'var(--accent)' }}
                  title="Copy Hex"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Value Proposition & Keyword Pillars */}
      <section className="py-16 border-t border-[var(--border-glass)] bg-[var(--surface-glass)] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              Built for Modern Product Teams
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1.5">
              Why UI/UX Designers &amp; Developers Choose Chromora
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
              Accelerate your workflow with WCAG AAA accessible palettes, wide-gamut OKLCH precision, and zero-server privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                WCAG AAA &amp; AA Contrast Auditing
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Test legibility in real time across buttons, text, and cards. Automated contrast fixes guarantee ADA and WCAG 2.1 compliance.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Instant CSS &amp; Tailwind Design Tokens
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Export 50–950 shade steps directly to Tailwind CSS configs, CSS custom properties, SCSS variables, and W3C JSON tokens.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Wide-Gamut OKLCH &amp; Print Conversions
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Seamlessly convert between HEX, OKLCH, RGB, HSL, CMYK, and Pantone standards with sub-pixel mathematical accuracy.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                100% Client-Side Private Processing
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Your images, palette formulas, and design assets never leave your browser. Zero backend telemetry, 100% private and offline-capable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO FAQ Section */}
      <FAQSection
        faqs={homeFaqs}
        title="Frequently Asked Questions About Color Systems &amp; Accessibility"
        subtitle="Common questions about accessible color palette generation, WCAG contrast testing, OKLCH conversions, and design tokens."
      />
    </div>
  );
};
