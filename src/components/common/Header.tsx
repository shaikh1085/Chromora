import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import { getColorData } from '../../utils/colorUtils';
import {
  Palette,
  Sparkles,
  Image as ImageIcon,
  CheckCircle,
  Sliders,
  Repeat,
  Compass,
  Bookmark,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Search,
  Layers,
  Layout,
  Check,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  ChevronDown,
  Droplets,
  Eye,
  Shuffle,
  Printer,
  Globe,
  Grid,
  History,
  Copy,
  Trash2,
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenSearch?: () => void;
}

const PRESET_ACCENTS = [
  { hex: '#6366f1', name: 'Chromora Violet' },
  { hex: '#3b82f6', name: 'Sky Blue' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#f43f5e', name: 'Rose Red' },
  { hex: '#f59e0b', name: 'Warm Amber' },
  { hex: '#d946ef', name: 'Neon Fuchsia' },
  { hex: '#06b6d4', name: 'Cyan Glow' },
  { hex: '#8b5cf6', name: 'Royal Purple' },
];

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate, onOpenSearch }) => {
  const {
    themeMode,
    resolvedTheme,
    setThemeMode,
    activeAccentColor,
    setActiveAccentColor,
    colorReactiveEnabled,
    setColorReactiveEnabled,
    resetAccentColor,
    isAccentAdjusted,
    accentContrastRatio,
    accentTooltip,
    setIsVisualSettingsModalOpen,
  } = useTheme();

  const {
    savedPalettes,
    setIsExportModalOpen,
    recentColors,
    activeHex,
    setActiveHex,
    removeRecentColor,
    clearRecentColors,
    copyToClipboard,
  } = usePalette();
  const { t } = useI18n();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accentPopoverOpen, setAccentPopoverOpen] = useState(false);
  const [recentColorsPopoverOpen, setRecentColorsPopoverOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [customHexInput, setCustomHexInput] = useState(activeAccentColor);
  const [copiedRecentHex, setCopiedRecentHex] = useState<string | null>(null);

  const accentPopoverRef = useRef<HTMLDivElement>(null);
  const recentColorsPopoverRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Sync custom input whenever active accent changes
  useEffect(() => {
    setCustomHexInput(activeAccentColor);
  }, [activeAccentColor]);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (accentPopoverRef.current && !accentPopoverRef.current.contains(target)) {
        setAccentPopoverOpen(false);
      }
      if (recentColorsPopoverRef.current && !recentColorsPopoverRef.current.contains(target)) {
        setRecentColorsPopoverOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(target)) {
        setThemeDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(target)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems: { label: string; route: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { label: t.navExplorer, route: '/color-picker', icon: Compass },
    { label: t.navPalette, route: '/color-palette-generator', icon: Palette },
    { label: t.navGradients, route: '/gradient-generator', icon: Sliders },
    { label: t.navConverter, route: '/color-converter', icon: Repeat },
  ];

  const moreToolsCategories = [
    {
      title: 'Palette & Creation Studio',
      tools: [
        { label: 'Interactive Color Wheel', route: '/color-wheel', icon: Compass, desc: '360° HSL wheel & 12 harmonies' },
        { label: 'AI Palette Generator', route: '/ai-palette-generator', icon: Sparkles, badge: 'AI', desc: 'Natural prompt to palette' },
        { label: 'Design Preview Studio', route: '/design-preview', icon: Layout, desc: 'Live UI components in your palette' },
        { label: 'Image Color Extractor', route: '/image-color-palette', icon: ImageIcon, desc: 'Extract palettes from photos' },
        { label: 'Color Shades Generator', route: '/color-shades-generator', icon: Layers, desc: 'Tailwind 50-900 tonal scales' },
        { label: 'Color Mixer Online', route: '/color-mixer', icon: Droplets, desc: 'OKLCH & physical blend simulator' },
        { label: 'Random Color Generator', route: '/random-color-generator', icon: Shuffle, desc: 'Spacebar rolling & mood filters' },
      ],
    },
    {
      title: 'Design, Standards & Assets',
      tools: [
        { label: 'WCAG Contrast Checker', route: '/contrast-checker', icon: CheckCircle, desc: 'WCAG 2.1 AA/AAA compliance audit' },
        { label: 'Color Blindness Simulator', route: '/color-blindness-simulator', icon: Eye, desc: 'Test Protanopia & Deuteranopia' },
        { label: 'Pantone & RAL Converter', route: '/pantone-color-converter', icon: Printer, desc: 'Digital to PMS & RAL match' },
        { label: 'Favicon & App Icon Maker', route: '/favicon-generator', icon: Globe, desc: 'ICO, PNG & webmanifest package' },
        { label: '1,265+ Named Colors', route: '/colors', icon: Grid, desc: 'Curated pigment & name dictionary' },
      ],
    },
  ];

  const allDropdownRoutes = moreToolsCategories.flatMap((c) => c.tools.map((t) => t.route));
  const isMoreToolsActive = allDropdownRoutes.some(
    (r) => currentRoute === r || (r === '/colors' && currentRoute.startsWith('/colors'))
  );

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  const accentColorData = getColorData(activeAccentColor);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHexInput(val);
    if (/^#?[0-9a-fA-F]{6}$/i.test(val)) {
      const formatted = val.startsWith('#') ? val : `#${val}`;
      setActiveAccentColor(formatted);
    }
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System (Auto)', icon: Monitor },
  ];

  const CurrentThemeIcon =
    themeMode === 'light' ? Sun : themeMode === 'dark' ? Moon : Monitor;

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full border-b border-[var(--border-glass)] glass-nav transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4 xl:gap-6 w-full">
          {/* Left Group: Logo + Desktop Navigation */}
          <div className="flex items-center gap-4 xl:gap-6 2xl:gap-8 shrink-0 min-w-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <a
                id="header-logo-btn"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('/');
                }}
                className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg p-1 shrink-0"
                aria-label="Chromora Home"
              >
                <div
                  className="w-8 h-8 rounded-xl p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, var(--accent), #f0abfc, #38bdf8)`,
                    boxShadow: `0 0 16px var(--accent-glow)`,
                  }}
                >
                  <div className="w-full h-full bg-[var(--bg-page)] rounded-[8px] flex items-center justify-center">
                    <div
                      className="w-3.5 h-3.5 rounded-full transition-colors duration-300 shadow-xs"
                      style={{ backgroundColor: 'var(--accent)' }}
                    />
                  </div>
                </div>
                <div className="flex flex-col text-left shrink-0">
                  <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] font-sans whitespace-nowrap">
                    {t.appName}
                  </span>
                </div>
              </a>

              {/* Tagline badge (ultra-wide only) */}
              <span
                className="hidden 2xl:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  borderColor: 'var(--accent-border)',
                  borderWidth: '1px',
                }}
              >
                Intelligence
              </span>
            </div>

            {/* Desktop Navigation (xl+ only) */}
            <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2 text-xs font-semibold text-[var(--text-secondary)] shrink-0 flex-nowrap">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentRoute === item.route ||
                  (item.route === '/color-picker' && currentRoute === '/color-explorer');

                return (
                  <a
                    key={item.route}
                    id={`nav-link-${item.route.replace('/', '')}`}
                    href={item.route}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(item.route);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'font-bold shadow-xs'
                        : 'hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)]'
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: 'var(--accent-soft)',
                            color: 'var(--accent)',
                            borderColor: 'var(--accent-border)',
                            borderWidth: '1px',
                          }
                        : {}
                    }
                  >
                    <Icon className="w-3.5 h-3.5 opacity-90 shrink-0" />
                    <span>{item.label}</span>
                  </a>
                );
              })}

              {/* More Tools Dropdown */}
              <div className="relative shrink-0" ref={toolsDropdownRef}>
                <button
                  id="header-more-tools-btn"
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                    isMoreToolsActive
                      ? 'font-bold shadow-xs'
                      : 'hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)]'
                  }`}
                  style={
                    isMoreToolsActive
                      ? {
                          backgroundColor: 'var(--accent-soft)',
                          color: 'var(--accent)',
                          borderColor: 'var(--accent-border)',
                          borderWidth: '1px',
                        }
                      : {}
                  }
                  aria-expanded={toolsDropdownOpen}
                  aria-label="More Design Tools Menu"
                >
                  <Grid className="w-3.5 h-3.5 opacity-90 shrink-0" />
                  <span>More Tools</span>
                  <ChevronDown
                    className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                      toolsDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {toolsDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-[540px] max-w-[calc(100vw-32px)] rounded-2xl p-3.5 glass-dropdown z-50 animate-fade-in shadow-2xl border border-[var(--border-glass)]"
                    style={{ borderColor: 'var(--accent-border)' }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {moreToolsCategories.map((category) => (
                        <div key={category.title} className="space-y-1">
                          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-glass-subtle)] mb-1">
                            {category.title}
                          </div>
                          {category.tools.map((tool) => {
                            const ToolIcon = tool.icon;
                            const isToolActive =
                              currentRoute === tool.route ||
                              (tool.route === '/colors' && currentRoute.startsWith('/colors'));

                            return (
                              <a
                                key={tool.route}
                                href={tool.route}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setToolsDropdownOpen(false);
                                  handleNav(tool.route);
                                }}
                                className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                                  isToolActive
                                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-bold'
                                    : 'hover:bg-[var(--surface-glass-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                              >
                                <ToolIcon className="w-4 h-4 mt-0.5 shrink-0 text-[var(--accent)]" />
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold flex items-center gap-1.5 truncate">
                                    <span className="truncate">{tool.label}</span>
                                    {tool.badge && (
                                      <span
                                        className="px-1.5 py-0.2 rounded-full text-[8px] font-black text-white leading-none shadow-xs shrink-0"
                                        style={{ backgroundColor: 'var(--accent)' }}
                                      >
                                        {tool.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-[var(--text-muted)] leading-tight line-clamp-1">
                                    {tool.desc}
                                  </div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Visual Glass Settings Quick Trigger */}
            <button
              id="header-visual-settings-btn"
              onClick={() => setIsVisualSettingsModalOpen(true)}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] border border-transparent hover:border-[var(--border-glass)] transition-all"
              aria-label="Visual & Glass Settings"
              title="Visual & Glass Settings (Intensity, Glow, Accents)"
            >
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            </button>

            {/* 1.5. Recent Colors Quick Trigger & Popover */}
            <div className="relative" ref={recentColorsPopoverRef}>
              <button
                id="header-recent-colors-btn"
                onClick={() => setRecentColorsPopoverOpen(!recentColorsPopoverOpen)}
                className={`relative p-2 rounded-xl border transition-all ${
                  recentColorsPopoverOpen
                    ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-xs'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] hover:border-[var(--border-glass)]'
                }`}
                aria-label="Recent Colors History"
                title={`Recent Colors (${recentColors.length} saved)`}
              >
                <History className="w-4 h-4" />
                {recentColors.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {recentColors.length}
                  </span>
                )}
              </button>

              {recentColorsPopoverOpen && (
                <div
                  id="recent-colors-popover"
                  className="absolute right-0 mt-2 w-80 rounded-2xl p-3.5 glass-dropdown z-50 animate-fade-in shadow-2xl border border-[var(--border-glass)]"
                  style={{ borderColor: 'var(--accent-border)' }}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-glass-subtle)]">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        <History className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[var(--text-primary)] block leading-none">
                          Recent Colors
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Last 10 colors used in localStorage
                        </span>
                      </div>
                    </div>
                    {recentColors.length > 0 && (
                      <button
                        onClick={() => clearRecentColors()}
                        className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Clear recent colors"
                        aria-label="Clear recent colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Swatch List */}
                  {recentColors.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                      No recent colors yet. Colors will automatically appear as you use tools.
                    </div>
                  ) : (
                    <div className="mt-3 space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {recentColors.map((hex) => {
                        const data = getColorData(hex);
                        const isCurrentActive = activeHex.toLowerCase() === hex.toLowerCase();
                        const isCopied = copiedRecentHex === hex;

                        return (
                          <div
                            key={hex}
                            onClick={() => {
                              setActiveHex(hex);
                              setRecentColorsPopoverOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer group ${
                              isCurrentActive
                                ? 'bg-[var(--accent-soft)] border-[var(--accent-border)] font-bold'
                                : 'bg-[var(--surface-glass-card)] border-[var(--border-glass)] hover:bg-[var(--surface-glass-hover)] hover:border-[var(--accent)]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-6 h-6 rounded-lg shrink-0 border border-black/10 shadow-xs ring-1 ring-white/20"
                                style={{ backgroundColor: hex }}
                              />
                              <div className="min-w-0 truncate">
                                <div className="text-xs font-medium text-[var(--text-primary)] truncate">
                                  {data.name}
                                </div>
                                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                                  {hex}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {isCurrentActive && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--accent)] text-white mr-1">
                                  Active
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(hex.toUpperCase(), `Copied ${hex}`);
                                  setCopiedRecentHex(hex);
                                  setTimeout(() => setCopiedRecentHex(null), 1500);
                                }}
                                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] transition-colors"
                                title="Copy HEX"
                              >
                                {isCopied ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRecentColor(hex);
                                }}
                                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Remove color"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Switcher Footer */}
                  <div className="mt-3 pt-2.5 border-t border-[var(--border-glass-subtle)] text-center">
                    <div className="text-[10px] text-[var(--text-muted)] mb-1.5">
                      Switch active tool with current color:
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <button
                        onClick={() => {
                          setRecentColorsPopoverOpen(false);
                          handleNav('/color-shades-generator');
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition-all"
                      >
                        Shades
                      </button>
                      <button
                        onClick={() => {
                          setRecentColorsPopoverOpen(false);
                          handleNav('/color-mixer');
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition-all"
                      >
                        Mixer
                      </button>
                      <button
                        onClick={() => {
                          setRecentColorsPopoverOpen(false);
                          handleNav('/color-blindness-simulator');
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition-all"
                      >
                        Blindness
                      </button>
                      <button
                        onClick={() => {
                          setRecentColorsPopoverOpen(false);
                          handleNav('/pantone-color-converter');
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition-all"
                      >
                        Pantone
                      </button>
                      <button
                        onClick={() => {
                          setRecentColorsPopoverOpen(false);
                          handleNav('/favicon-generator');
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition-all"
                      >
                        Favicon
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Current UI Accent Swatch & Popover */}
            <div className="relative shrink-0" ref={accentPopoverRef}>
              <button
                id="header-accent-swatch-btn"
                onClick={() => setAccentPopoverOpen(!accentPopoverOpen)}
                className="flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl text-xs font-medium border border-[var(--border-glass)] bg-[var(--surface-glass-card)] hover:border-[var(--accent)] transition-all shadow-xs shrink-0"
                title={`UI Accent Color: ${activeAccentColor.toUpperCase()} (${accentColorData.name})`}
                aria-label="Customize UI Accent Color"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shadow-xs ring-1 ring-white/20 shrink-0"
                  style={{ backgroundColor: activeAccentColor }}
                />
                <span className="hidden xl:inline-block font-mono text-[11px] text-[var(--text-secondary)]">
                  {activeAccentColor.toUpperCase()}
                </span>
                <SlidersHorizontal className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
              </button>

              {accentPopoverOpen && (
                <div
                  id="accent-color-popover"
                  className="absolute right-0 mt-2 w-72 rounded-2xl p-4 glass-dropdown z-50 animate-fade-in"
                  style={{
                    borderColor: 'var(--accent-border)',
                  }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-glass-subtle)]">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-xs"
                        style={{ backgroundColor: activeAccentColor }}
                      />
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        UI Accent Color
                      </span>
                    </div>
                    <button
                      onClick={() => setAccentPopoverOpen(false)}
                      className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)]"
                      aria-label="Close accent color popover"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Active Preview Banner */}
                  <div className="my-3 p-3 rounded-xl flex items-center justify-between border border-[var(--border-glass)] bg-[var(--surface-glass-card)]">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {accentColorData.name}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {activeAccentColor.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={activeAccentColor}
                        onChange={(e) => setActiveAccentColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                        title="Choose Color"
                        aria-label="Choose Accent Color"
                      />
                    </div>
                  </div>

                  {/* Hex input & presets */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                        Enter Custom HEX
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customHexInput}
                          onChange={handleHexInputChange}
                          maxLength={7}
                          placeholder="#6366f1"
                          className="w-full px-3 py-1.5 rounded-lg text-xs font-mono glass-input"
                          aria-label="Custom HEX code for UI accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                        Popular Presets
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {PRESET_ACCENTS.map((preset) => (
                          <button
                            key={preset.hex}
                            onClick={() => setActiveAccentColor(preset.hex)}
                            className="group flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-[var(--surface-glass-hover)] border border-transparent hover:border-[var(--border-glass)] transition-all"
                            title={preset.name}
                            aria-label={`Select ${preset.name} accent`}
                          >
                            <div
                              className="w-5 h-5 rounded-full shadow-xs group-hover:scale-110 transition-transform flex items-center justify-center ring-1 ring-white/10"
                              style={{ backgroundColor: preset.hex }}
                            >
                              {activeAccentColor.toLowerCase() === preset.hex.toLowerCase() && (
                                <Check className="w-3 h-3 text-white drop-shadow-xs" />
                              )}
                            </div>
                            <span className="text-[9px] text-[var(--text-muted)] truncate max-w-[50px]">
                              {preset.name.split(' ')[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accessibility info */}
                    <div className="p-2.5 rounded-xl bg-[var(--surface-glass)] border border-[var(--border-glass-subtle)] text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Contrast Ratio:</span>
                        </div>
                        <span className="font-bold font-mono text-[var(--text-primary)]">
                          {accentContrastRatio.toFixed(1)}:1
                        </span>
                      </div>
                      {isAccentAdjusted && (
                        <div className="text-[10px] text-amber-500 font-medium pt-0.5">
                          {accentTooltip || 'Adjusted for optimal text readability'}
                        </div>
                      )}
                    </div>

                    {/* Color Reactive Toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          Color Reactive UI
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          React to selected palette
                        </span>
                      </div>
                      <button
                        onClick={() => setColorReactiveEnabled(!colorReactiveEnabled)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          colorReactiveEnabled ? 'bg-[var(--accent)]' : 'bg-zinc-700'
                        }`}
                        role="switch"
                        aria-checked={colorReactiveEnabled}
                        aria-label="Toggle color reactive UI"
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            colorReactiveEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* More Visual Settings trigger */}
                    <button
                      onClick={() => {
                        setAccentPopoverOpen(false);
                        setIsVisualSettingsModalOpen(true);
                      }}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>More Glass & Visual Settings</span>
                    </button>

                    {/* Reset Accent button */}
                    <button
                      onClick={() => {
                        resetAccentColor();
                        setCustomHexInput('#6366f1');
                      }}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border-glass)] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset UI Accent to Default</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. 3-Mode Theme Selector Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                id="header-theme-toggle-btn"
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-card)] border border-transparent hover:border-[var(--border-glass)] transition-all"
                aria-label="Select Theme Mode"
                title={`Current theme: ${themeMode} (${resolvedTheme})`}
              >
                <CurrentThemeIcon className="w-4 h-4" />
              </button>

              {themeDropdownOpen && (
                <div
                  id="theme-mode-dropdown"
                  className="absolute right-0 mt-2 w-40 rounded-2xl p-1.5 glass-dropdown z-50 animate-fade-in"
                >
                  <div className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-glass-subtle)]">
                    Theme Mode
                  </div>
                  {themeOptions.map((opt) => {
                    const OptIcon = opt.icon;
                    const isSelected = themeMode === opt.mode;
                    return (
                      <button
                        key={opt.mode}
                        onClick={() => {
                          setThemeMode(opt.mode);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors text-left ${
                          isSelected
                            ? 'font-bold'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)]'
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: 'var(--accent-soft)',
                                color: 'var(--accent)',
                              }
                            : {}
                        }
                      >
                        <div className="flex items-center gap-2">
                          <OptIcon className="w-3.5 h-3.5" />
                          <span>{opt.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Quick Search */}
            {onOpenSearch && (
              <>
                {/* Compact icon button on small/medium screens */}
                <button
                  onClick={onOpenSearch}
                  className="hidden sm:flex xl:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-card)] border border-transparent hover:border-[var(--border-glass)] transition-all shrink-0"
                  aria-label="Search colors and tools"
                  title="Search colors and tools (/)"
                >
                  <Search className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
                {/* Full search pill on xl+ screens */}
                <button
                  onClick={onOpenSearch}
                  className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface-glass-card)] border border-[var(--border-glass)] hover:border-[var(--accent-border)] transition-colors shrink-0"
                  aria-label="Search colors and tools"
                >
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Search</span>
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-[var(--surface-glass-hover)] rounded border border-[var(--border-glass)] text-[var(--text-secondary)]">
                    /
                  </kbd>
                </button>
              </>
            )}

            {/* 5. Saved Palettes Counter */}
            <a
              id="header-saved-palettes-btn"
              href="/saved-palettes"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/saved-palettes');
              }}
              className={`relative p-2 rounded-xl transition-colors border border-transparent flex items-center justify-center shrink-0 ${
                currentRoute === '/saved-palettes'
                  ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-card)]'
              }`}
              aria-label="Saved Palettes"
              title="Saved Palettes"
            >
              <Bookmark className="w-4 h-4" />
              {savedPalettes.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {savedPalettes.length}
                </span>
              )}
            </a>

            {/* 6. Export Tokens Quick Button */}
            <button
              id="header-export-tokens-btn"
              onClick={() => setIsExportModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 btn-accent text-xs font-bold rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0"
            >
              <span>{t.exportTokens}</span>
            </button>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 xl:hidden rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-glass-card)] shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[var(--border-glass)] glass-dropdown px-4 pt-2 pb-6 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Core Tools
          </div>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentRoute === item.route ||
              (item.route === '/color-picker' && currentRoute === '/color-explorer');
            return (
              <a
                key={item.route}
                href={item.route}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.route);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)]'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--accent)',
                        borderColor: 'var(--accent-border)',
                        borderWidth: '1px',
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}

          <div className="pt-2 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            More Design Tools
          </div>
          {moreToolsCategories
            .flatMap((c) => c.tools)
            .filter((tool) => !primaryNavItems.some((p) => p.route === tool.route))
            .map((tool) => {
              const ToolIcon = tool.icon;
              const isToolActive =
                currentRoute === tool.route ||
                (tool.route === '/colors' && currentRoute.startsWith('/colors'));
              return (
                <a
                  key={tool.route}
                  href={tool.route}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(tool.route);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isToolActive
                      ? 'font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)]'
                  }`}
                  style={
                    isToolActive
                      ? {
                          backgroundColor: 'var(--accent-soft)',
                          color: 'var(--accent)',
                          borderColor: 'var(--accent-border)',
                          borderWidth: '1px',
                        }
                      : {}
                  }
                >
                  <ToolIcon className="w-4 h-4 text-[var(--accent)]" />
                  <span>{tool.label}</span>
                </a>
              );
            })}
          {recentColors.length > 0 && (
            <div className="pt-2 pb-2 px-3 border-t border-[var(--border-glass-subtle)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <History className="w-3 h-3 text-[var(--accent)]" />
                  <span>Recent Colors ({recentColors.length})</span>
                </div>
                <button
                  onClick={() => clearRecentColors()}
                  className="text-[10px] text-[var(--text-muted)] hover:text-red-400"
                >
                  Clear
                </button>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {recentColors.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => {
                      setActiveHex(hex);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-7 h-7 rounded-lg shrink-0 border transition-all shadow-xs ${
                      activeHex.toLowerCase() === hex.toLowerCase()
                        ? 'ring-2 ring-[var(--accent)] border-transparent scale-105'
                        : 'border-[var(--border-glass)]'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 mt-2 border-t border-[var(--border-glass-subtle)] flex items-center justify-between">
            <a
              href="/saved-palettes"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/saved-palettes');
              }}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2 px-3"
            >
              <Bookmark className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span>
                {t.navSavedPalettes} ({savedPalettes.length})
              </span>
            </a>
            <button
              onClick={() => {
                setIsExportModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs px-4 py-2 rounded-xl btn-accent font-bold"
            >
              {t.exportTokens}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


