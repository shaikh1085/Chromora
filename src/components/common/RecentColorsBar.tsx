import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { getColorData } from '../../utils/colorUtils';
import {
  History,
  Copy,
  Check,
  Trash2,
  BookmarkPlus,
  ExternalLink,
  Layers,
  Sparkles,
  Droplets,
  Eye,
  Sliders,
  Repeat,
  Compass,
  X,
} from 'lucide-react';

interface RecentColorsBarProps {
  navigate?: (route: string) => void;
  onSelectColor?: (hex: string) => void;
  title?: string;
  className?: string;
  variant?: 'inline' | 'compact' | 'card';
  showToolSwitchers?: boolean;
}

const TOOL_LINKS = [
  { label: 'Shades & Tints', route: '/color-shades-generator', icon: Layers },
  { label: 'Color Mixer', route: '/color-mixer', icon: Droplets },
  { label: 'Blindness Sim', route: '/color-blindness-simulator', icon: Eye },
  { label: 'Pantone / RAL', route: '/pantone-color-converter', icon: Compass },
  { label: 'Favicon Maker', route: '/favicon-generator', icon: Sparkles },
  { label: 'Color Converter', route: '/color-converter', icon: Repeat },
  { label: 'Random Palette', route: '/random-color-generator', icon: Sliders },
];

export const RecentColorsBar: React.FC<RecentColorsBarProps> = ({
  navigate,
  onSelectColor,
  title = 'Recent Colors',
  className = '',
  variant = 'inline',
  showToolSwitchers = true,
}) => {
  const {
    recentColors,
    activeHex,
    setActiveHex,
    removeRecentColor,
    clearRecentColors,
    copyToClipboard,
    savePalette,
    showToast,
  } = usePalette();

  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeMenuHex, setActiveMenuHex] = useState<string | null>(null);

  const handleColorClick = (hex: string) => {
    setActiveHex(hex);
    if (onSelectColor) {
      onSelectColor(hex);
    }
  };

  const handleCopy = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(hex.toUpperCase(), `Copied ${hex}`);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleRemove = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentColor(hex);
    if (activeMenuHex === hex) {
      setActiveMenuHex(null);
    }
  };

  const handleSaveAsPalette = () => {
    if (!recentColors.length) return;
    const name = `Recent Colors (${new Date().toLocaleDateString()})`;
    savePalette(name, recentColors, ['Recents', 'History']);
  };

  const handleNavigate = (route: string, hex: string) => {
    setActiveHex(hex);
    if (onSelectColor) {
      onSelectColor(hex);
    }
    if (navigate) {
      navigate(route);
    } else {
      window.location.href = route;
    }
    setActiveMenuHex(null);
  };

  if (!recentColors || recentColors.length === 0) {
    return (
      <div
        className={`glass-card p-4 rounded-2xl border border-[var(--border-glass)] text-center text-xs text-[var(--text-muted)] flex items-center justify-between ${className}`}
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[var(--accent)]" />
          <span className="font-semibold text-[var(--text-secondary)]">Recent Colors</span>
        </div>
        <span>Colors you view or tweak across tools will automatically appear here.</span>
      </div>
    );
  }

  return (
    <div
      id="recent-colors-bar"
      className={`glass-card p-3 sm:p-4 rounded-2xl border border-[var(--border-glass)] transition-all ${
        variant === 'compact' ? 'py-2 px-3' : ''
      } ${className}`}
      style={{
        boxShadow: 'var(--shadow-glass)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[var(--border-glass-subtle)]">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <History className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-primary)]">{title}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[var(--surface-glass-hover)] text-[var(--text-muted)]">
                {recentColors.length} / 10
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] block sm:inline">
              Persisted in localStorage • Click any swatch to load into active tool
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto">
          {recentColors.length >= 2 && (
            <button
              id="recent-colors-save-palette-btn"
              onClick={handleSaveAsPalette}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border-glass)] transition-all"
              title="Save all recent colors as a new saved palette"
            >
              <BookmarkPlus className="w-3 h-3 text-[var(--accent)]" />
              <span>Save as Palette</span>
            </button>
          )}

          <button
            id="recent-colors-clear-btn"
            onClick={clearRecentColors}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Clear Recent Colors History"
            aria-label="Clear Recent Colors History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Swatches Grid / Row */}
      <div className="mt-3 grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5">
        {recentColors.map((hex, index) => {
          const colorData = getColorData(hex);
          const isActive = activeHex.toLowerCase() === hex.toLowerCase();
          const isMenuOpen = activeMenuHex === hex;

          return (
            <div key={`${hex}-${index}`} className="relative group">
              <button
                id={`recent-color-chip-${index}`}
                onClick={() => handleColorClick(hex)}
                className={`w-full aspect-square rounded-xl p-1 relative flex flex-col items-center justify-between transition-all cursor-pointer shadow-xs border ${
                  isActive
                    ? 'ring-2 ring-[var(--accent)] scale-105 border-transparent shadow-md'
                    : 'border-[var(--border-glass)] hover:scale-105 hover:border-[var(--accent)]'
                }`}
                style={{
                  backgroundColor: hex,
                }}
                title={`${colorData.name} (${hex.toUpperCase()}) - Click to select`}
              >
                {/* Active Indicator Pin */}
                {isActive && (
                  <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white shadow-xs ring-1 ring-black/20 animate-pulse" />
                )}

                {/* Quick copy overlay on hover */}
                <div
                  onClick={(e) => handleCopy(hex, e)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-xs rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all text-white p-1"
                >
                  {copiedHex === hex ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-90" />
                  )}
                  <span className="text-[9px] font-mono font-bold mt-0.5 tracking-tighter uppercase leading-none">
                    {hex}
                  </span>
                </div>

                {/* Remove button on hover */}
                <div
                  onClick={(e) => handleRemove(hex, e)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-zinc-900 text-zinc-300 hover:text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10 shadow-xs ring-1 ring-white/20"
                  title="Remove from recents"
                >
                  <X className="w-2.5 h-2.5" />
                </div>
              </button>

              {/* Bottom Label */}
              <div className="mt-1 text-center">
                <div
                  className="text-[9px] font-mono text-[var(--text-secondary)] truncate uppercase"
                  title={hex}
                >
                  {hex}
                </div>
                <div
                  className="text-[8px] text-[var(--text-muted)] truncate max-w-full leading-none"
                  title={colorData.name}
                >
                  {colorData.name}
                </div>
              </div>

              {/* Quick Jump Tool Menu Popover Trigger on Right Click / Click */}
              {showToolSwitchers && (
                <div className="mt-1 text-center sm:block">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuHex(isMenuOpen ? null : hex);
                    }}
                    className="text-[8px] text-[var(--accent)] hover:underline opacity-80 group-hover:opacity-100 flex items-center justify-center mx-auto gap-0.5"
                    title={`Open ${hex} in another tool`}
                  >
                    <span>Jump</span>
                    <ExternalLink className="w-2 h-2" />
                  </button>

                  {isMenuOpen && (
                    <div
                      className="absolute left-0 bottom-full mb-2 w-48 rounded-xl p-1.5 glass-dropdown shadow-2xl z-50 animate-fade-in border border-[var(--border-glass)]"
                      style={{ borderColor: 'var(--accent-border)' }}
                    >
                      <div className="flex items-center justify-between px-2 py-1 border-b border-[var(--border-glass-subtle)] mb-1">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="text-[10px] font-mono font-bold uppercase">{hex}</span>
                        </div>
                        <button
                          onClick={() => setActiveMenuHex(null)}
                          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-[9px] font-bold uppercase text-[var(--text-muted)] px-2 py-0.5">
                        Switch Tool with this Color:
                      </div>
                      <div className="space-y-0.5">
                        {TOOL_LINKS.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <button
                              key={tool.route}
                              onClick={() => handleNavigate(tool.route, hex)}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] transition-all text-left"
                            >
                              <Icon className="w-3 h-3 text-[var(--accent)] shrink-0" />
                              <span>{tool.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
