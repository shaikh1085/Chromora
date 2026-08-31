import React, { useState, useEffect, useMemo } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { namedColorsDatabase } from '../../data/colorNames';
import { hexToSlug } from '../../utils/colorUtils';
import {
  Search,
  X,
  Compass,
  Palette,
  Image as ImageIcon,
  CheckCircle,
  Sliders,
  Repeat,
  Bookmark,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  navigate,
}) => {
  const { setActiveHex } = usePalette();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener ('/' or 'cmd+k')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        if (!isOpen) {
          // Open triggered by parent if wired
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const tools = [
    { title: 'Smart Color Explorer & Picker', route: '/color-picker', icon: Compass, category: 'Tool' },
    { title: 'Interactive Color Wheel & Harmonies', route: '/color-wheel', icon: Compass, category: 'Tool' },
    { title: 'Color Palette Generator (12 Harmonies)', route: '/color-palette-generator', icon: Palette, category: 'Tool' },
    { title: 'Image to Color Palette Extractor', route: '/image-color-palette', icon: ImageIcon, category: 'Tool' },
    { title: 'WCAG 2.1 Contrast Checker', route: '/contrast-checker', icon: CheckCircle, category: 'Tool' },
    { title: 'CSS Gradient Studio', route: '/gradient-generator', icon: Sliders, category: 'Tool' },
    { title: 'Multi-Space Color Converter', route: '/color-converter', icon: Repeat, category: 'Tool' },
    { title: 'HEX to RGB Converter', route: '/hex-to-rgb', icon: Repeat, category: 'Tool' },
    { title: 'RGB to HEX Converter', route: '/rgb-to-hex', icon: Repeat, category: 'Tool' },
    { title: 'Saved Palettes Vault', route: '/saved-palettes', icon: Bookmark, category: 'Tool' },
    { title: 'Named Colors Encyclopedia', route: '/colors', icon: Layers, category: 'Tool' },
  ];

  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools.slice(0, 5);
    const q = query.toLowerCase();
    return tools.filter((t) => t.title.toLowerCase().includes(q));
  }, [query, tools]);

  const filteredColors = useMemo(() => {
    if (!query.trim()) return namedColorsDatabase.slice(0, 6);
    const q = query.toLowerCase();
    return namedColorsDatabase
      .filter((c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectTool = (route: string) => {
    navigate(route);
    onClose();
    setQuery('');
  };

  const handleSelectColor = (color: typeof namedColorsDatabase[0]) => {
    setActiveHex(color.hex);
    navigate(`/colors/${hexToSlug(color.name, color.hex)}`);
    onClose();
    setQuery('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl glass-modal rounded-3xl shadow-2xl border border-[var(--border-glass)] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-glass-subtle)] gap-3 bg-[var(--surface-glass)]">
          <Search className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, pigments, or enter hex (#0b4f6c)..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-glass-hover)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-glass-card)] rounded-md border border-[var(--border-glass)]">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 bg-[var(--surface-glass-card)]">
          {/* Tools List */}
          {filteredTools.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block px-2 mb-1.5">
                Tools & Workspaces
              </span>
              <div className="space-y-1">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <a
                      key={tool.route}
                      href={tool.route}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectTool(tool.route);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] border border-transparent hover:border-[var(--border-glass)] transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[var(--accent)]" />
                        <span>{tool.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Named Colors List */}
          {filteredColors.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block px-2 mb-1.5">
                Named Pigments & Colors
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredColors.map((color) => {
                  const colorUrl = `/colors/${hexToSlug(color.name, color.hex)}`;
                  return (
                    <a
                      key={color.hex + color.name}
                      href={colorUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectColor(color);
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-[var(--surface-glass-hover)] border border-transparent hover:border-[var(--border-glass)] transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-lg shadow-xs border border-white/10 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">{color.name}</p>
                        <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase">{color.hex}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
