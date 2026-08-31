import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { PaletteColor, PaletteType, SavedPalette, ToastMessage, ToastType } from '../types';
import { generatePalette, getColorData, getRandomColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';
import confetti from 'canvas-confetti';

interface PaletteContextType {
  activeHex: string;
  setActiveHex: (hex: string) => void;
  paletteColors: PaletteColor[];
  setPaletteColors: React.Dispatch<React.SetStateAction<PaletteColor[]>>;
  paletteType: PaletteType;
  setPaletteType: (type: PaletteType) => void;
  paletteCount: number;
  setPaletteCount: (count: number) => void;
  toggleLockColor: (id: string) => void;
  updateColorInPalette: (id: string, newHex: string) => void;
  regeneratePalette: (newType?: PaletteType) => void;
  shufflePalette: () => void;
  setPaletteFromHexList: (hexes: string[], name?: string) => void;

  // Recent Colors (Persists last 10 colors across tools in localStorage)
  recentColors: string[];
  addRecentColor: (hex: string) => void;
  removeRecentColor: (hex: string) => void;
  clearRecentColors: () => void;
  
  // Saved Palettes
  savedPalettes: SavedPalette[];
  savePalette: (name: string, hexList?: string[], tags?: string[], type?: PaletteType) => string;
  deleteSavedPalette: (id: string) => void;
  renameSavedPalette: (id: string, newName: string) => void;
  toggleFavoritePalette: (id: string) => void;
  exportAllPalettesJson: () => void;
  importPalettesJson: (jsonString: string) => boolean;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
  copyToClipboard: (text: string, label?: string) => void;

  // Modals
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isPreviewModalOpen: boolean;
  setIsPreviewModalOpen: (open: boolean) => void;
}

const DEFAULT_HEX = '#0b4f6c'; // Deep Ocean Blue
const RECENT_COLORS_STORAGE_KEY = 'chromora_recent_colors';
const DEFAULT_RECENT_COLORS = [
  '#0b4f6c',
  '#6366f1',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#0284c7',
  '#14b8a6',
  '#f43f5e',
  '#3b82f6',
];

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export const PaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setActiveAccentColor } = useTheme();
  const [activeHex, setActiveHexState] = useState<string>(DEFAULT_HEX);
  const [paletteType, setPaletteType] = useState<PaletteType>('analogous');
  const [paletteCount, setPaletteCount] = useState<number>(5);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Recent Colors (Persists last 10 colors used across tools in localStorage)
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_COLORS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter((c: string) => typeof c === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c.trim()))
            .slice(0, 10);
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_RECENT_COLORS;
  });

  // Save recent colors to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_COLORS_STORAGE_KEY, JSON.stringify(recentColors));
    } catch {
      // ignore
    }
  }, [recentColors]);

  // Initialize initial palette colors
  const [paletteColors, setPaletteColors] = useState<PaletteColor[]>(() => {
    const rawHexes = generatePalette(DEFAULT_HEX, 'analogous', 5);
    return rawHexes.map((hex, idx) => {
      const data = getColorData(hex);
      return {
        id: `color-${idx}-${Date.now()}`,
        hex,
        name: data.name,
        isLocked: false,
      };
    });
  });

  // Saved Palettes in localStorage
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() => {
    try {
      const saved = localStorage.getItem('chromora_saved_palettes');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default starter palettes
    return [
      {
        id: 'default-nordic',
        name: 'Nordic Twilight',
        colors: ['#0f172a', '#0284c7', '#38bdf8', '#34d399', '#f8fafc'],
        tags: ['Starter', 'Cool', 'Minimal'],
        createdAt: Date.now() - 1000000,
        updatedAt: Date.now() - 1000000,
        isFavorite: true,
      },
      {
        id: 'default-matcha',
        name: 'Matcha Atelier',
        colors: ['#1c2826', '#3b5a45', '#709775', '#a1cca5', '#edf5e1'],
        tags: ['Starter', 'Nature', 'Earthy'],
        createdAt: Date.now() - 500000,
        updatedAt: Date.now() - 500000,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('chromora_saved_palettes', JSON.stringify(savedPalettes));
    } catch {
      // ignore
    }
  }, [savedPalettes]);

  // Toast system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string, type: ToastType = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        dismissToast(id);
      }, 3500);
    },
    [dismissToast]
  );

  const copyToClipboard = useCallback(
    (text: string, label = 'Copied to clipboard') => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(label, text, 'success');
        }).catch(() => {
          // Fallback
          fallbackCopyText(text);
          showToast(label, text, 'success');
        });
      } else {
        fallbackCopyText(text);
        showToast(label, text, 'success');
      }
    },
    [showToast]
  );

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      console.error('Fallback copy failed', e);
    }
    document.body.removeChild(textArea);
  };

  const addRecentColor = useCallback((hex: string) => {
    if (!hex || typeof hex !== 'string') return;
    let clean = hex.trim();
    if (!clean.startsWith('#')) clean = `#${clean}`;
    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) return;

    if (clean.length === 4) {
      clean = `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
    }
    const finalHex = clean.toLowerCase();

    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== finalHex);
      const next = [finalHex, ...filtered].slice(0, 10);
      return next;
    });
  }, []);

  const removeRecentColor = useCallback((hex: string) => {
    const clean = hex.toLowerCase();
    setRecentColors((prev) => prev.filter((c) => c.toLowerCase() !== clean));
  }, []);

  const clearRecentColors = useCallback(() => {
    setRecentColors([]);
    try {
      localStorage.removeItem(RECENT_COLORS_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Recent Colors Cleared', 'Your color history has been reset', 'info');
  }, [showToast]);

  const setActiveHex = useCallback((hex: string) => {
    let clean = hex.trim();
    if (!clean.startsWith('#')) clean = `#${clean}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) {
      if (clean.length === 4) {
        clean = `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
      }
      const finalHex = clean.toLowerCase();
      setActiveHexState((prev) => (prev === finalHex ? prev : finalHex));
      setActiveAccentColor(finalHex);
      addRecentColor(finalHex);
    } else {
      const lower = hex.toLowerCase();
      setActiveHexState((prev) => (prev === lower ? prev : lower));
      setActiveAccentColor(lower);
    }
  }, [setActiveAccentColor, addRecentColor]);

  const toggleLockColor = useCallback((id: string) => {
    setPaletteColors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLocked: !c.isLocked } : c))
    );
  }, []);

  const updateColorInPalette = useCallback((id: string, newHex: string) => {
    const clean = newHex.toLowerCase();
    const data = getColorData(clean);
    setPaletteColors((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, hex: clean, name: data.name } : c
      )
    );
    setActiveAccentColor(clean);
  }, [setActiveAccentColor]);

  const regeneratePalette = useCallback(
    (newType?: PaletteType) => {
      const typeToUse = newType || paletteType;
      // Get base color from either first unlocked or activeHex
      const baseCandidate = paletteColors.find((c) => c.isLocked)?.hex || getRandomColor();
      const generatedHexes = generatePalette(baseCandidate, typeToUse, paletteCount);

      const next: PaletteColor[] = [];
      for (let i = 0; i < paletteCount; i++) {
        if (paletteColors[i] && paletteColors[i].isLocked) {
          next.push(paletteColors[i]);
        } else {
          const hex = generatedHexes[i] || getRandomColor();
          const data = getColorData(hex);
          next.push({
            id: paletteColors[i]?.id || `color-${i}-${Date.now()}`,
            hex,
            name: data.name,
            isLocked: false,
          });
        }
      }
      setPaletteColors(next);
      if (next[0]) {
        setActiveAccentColor(next[0].hex);
      }
    },
    [paletteType, paletteCount, paletteColors, setActiveAccentColor]
  );

  const shufflePalette = useCallback(() => {
    setPaletteColors((prev) => {
      const unlocked = prev.filter((c) => !c.isLocked);
      // Randomize unlocked order
      const shuffledUnlocked = [...unlocked].sort(() => Math.random() - 0.5);
      let uIdx = 0;
      return prev.map((c) => {
        if (c.isLocked) return c;
        const nextColor = shuffledUnlocked[uIdx++];
        return nextColor || c;
      });
    });
    showToast('Palette Shuffled', 'Unlocked colors rearranged', 'info');
  }, [showToast]);

  const setPaletteFromHexList = useCallback(
    (hexes: string[], name?: string) => {
      const newItems: PaletteColor[] = hexes.map((hex, idx) => {
        const data = getColorData(hex);
        return {
          id: `color-${idx}-${Date.now()}`,
          hex: hex.toLowerCase(),
          name: data.name,
          isLocked: false,
        };
      });
      setPaletteColors(newItems);
      setPaletteCount(newItems.length);
      if (hexes[0]) {
        const firstHex = hexes[0].toLowerCase();
        setActiveHexState(firstHex);
        setActiveAccentColor(firstHex);
      }
      if (name) {
        showToast(`Loaded "${name}"`, `${hexes.length} colors loaded into generator`, 'success');
      }
    },
    [showToast, setActiveAccentColor]
  );

  const savePalette = useCallback(
    (name: string, hexList?: string[], tags: string[] = ['Custom'], type?: PaletteType): string => {
      const colorsToSave = hexList || paletteColors.map((c) => c.hex);
      const newPalette: SavedPalette = {
        id: `palette-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: name.trim() || `Palette ${new Date().toLocaleDateString()}`,
        colors: colorsToSave,
        tags,
        type: type || paletteType,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
      };

      setSavedPalettes((prev) => [newPalette, ...prev]);
      
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.85 },
        });
      } catch {
        // ignore
      }

      showToast('Palette Saved', `"${newPalette.name}" added to your collection`, 'success');
      return newPalette.id;
    },
    [paletteColors, paletteType, showToast]
  );

  const deleteSavedPalette = useCallback(
    (id: string) => {
      setSavedPalettes((prev) => prev.filter((p) => p.id !== id));
      showToast('Palette Removed', 'Palette was removed from collection', 'info');
    },
    [showToast]
  );

  const renameSavedPalette = useCallback((id: string, newName: string) => {
    setSavedPalettes((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name: newName.trim() || p.name, updatedAt: Date.now() } : p
      )
    );
  }, []);

  const toggleFavoritePalette = useCallback((id: string) => {
    setSavedPalettes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  }, []);

  const exportAllPalettesJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedPalettes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `chromora-palettes-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported Palettes', 'JSON backup file downloaded', 'success');
  }, [savedPalettes, showToast]);

  const importPalettesJson = useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
          const validated: SavedPalette[] = parsed
            .filter((p) => p && Array.isArray(p.colors) && p.colors.length > 0)
            .map((p) => ({
              id: p.id || `imported-${Date.now()}-${Math.random()}`,
              name: p.name || 'Imported Palette',
              colors: p.colors.map((c: string) => (c.startsWith('#') ? c : `#${c}`)),
              tags: Array.isArray(p.tags) ? p.tags : ['Imported'],
              createdAt: p.createdAt || Date.now(),
              updatedAt: Date.now(),
              isFavorite: Boolean(p.isFavorite),
            }));

          if (validated.length > 0) {
            setSavedPalettes((prev) => [...validated, ...prev]);
            showToast('Import Complete', `Successfully imported ${validated.length} palettes`, 'success');
            return true;
          }
        }
        showToast('Import Failed', 'Invalid JSON format for palettes', 'error');
        return false;
      } catch (err) {
        showToast('Import Failed', 'Could not parse JSON file', 'error');
        return false;
      }
    },
    [showToast]
  );

  const contextValue = useMemo<PaletteContextType>(
    () => ({
      activeHex,
      setActiveHex,
      paletteColors,
      setPaletteColors,
      paletteType,
      setPaletteType,
      paletteCount,
      setPaletteCount,
      toggleLockColor,
      updateColorInPalette,
      regeneratePalette,
      shufflePalette,
      setPaletteFromHexList,
      recentColors,
      addRecentColor,
      removeRecentColor,
      clearRecentColors,
      savedPalettes,
      savePalette,
      deleteSavedPalette,
      renameSavedPalette,
      toggleFavoritePalette,
      exportAllPalettesJson,
      importPalettesJson,
      toasts,
      showToast,
      dismissToast,
      copyToClipboard,
      isExportModalOpen,
      setIsExportModalOpen,
      isPreviewModalOpen,
      setIsPreviewModalOpen,
    }),
    [
      activeHex,
      setActiveHex,
      paletteColors,
      paletteType,
      paletteCount,
      toggleLockColor,
      updateColorInPalette,
      regeneratePalette,
      shufflePalette,
      setPaletteFromHexList,
      recentColors,
      addRecentColor,
      removeRecentColor,
      clearRecentColors,
      savedPalettes,
      savePalette,
      deleteSavedPalette,
      renameSavedPalette,
      toggleFavoritePalette,
      exportAllPalettesJson,
      importPalettesJson,
      toasts,
      showToast,
      dismissToast,
      copyToClipboard,
      isExportModalOpen,
      isPreviewModalOpen,
    ]
  );

  return (
    <PaletteContext.Provider value={contextValue}>
      {children}
    </PaletteContext.Provider>
  );
};

export const usePalette = (): PaletteContextType => {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }
  return context;
};
