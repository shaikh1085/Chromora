import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getThemeColorVariables } from '../utils/colorUtils';

export type ThemeMode = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';
export type GlassIntensity = 'subtle' | 'balanced' | 'strong';

export const DEFAULT_BRAND_ACCENT = '#6366f1'; // Chromora Indigo/Purple

export interface VisualSettings {
  glassIntensity: GlassIntensity;
  bgGlowEnabled: boolean;
  colorReactiveEnabled: boolean;
}

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  theme: ResolvedTheme; // Backwards compatibility for existing components
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setTheme: (theme: ResolvedTheme) => void;

  // Color Reactive UI
  activeAccentColor: string;
  setActiveAccentColor: (hex: string) => void;
  colorReactiveEnabled: boolean;
  setColorReactiveEnabled: (enabled: boolean) => void;
  resetAccentColor: () => void;

  // Visual Glass Settings
  glassIntensity: GlassIntensity;
  setGlassIntensity: (intensity: GlassIntensity) => void;
  bgGlowEnabled: boolean;
  setBgGlowEnabled: (enabled: boolean) => void;
  resetVisualPreferences: () => void;
  isVisualSettingsModalOpen: boolean;
  setIsVisualSettingsModalOpen: (open: boolean) => void;

  // Accent Accessibility Specs
  isAccentAdjusted: boolean;
  accentContrastRatio: number;
  accentTooltip?: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme Mode ('dark' | 'light' | 'system')
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('chromora_theme_preference');
      if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
      const legacySaved = localStorage.getItem('chromora_theme');
      if (legacySaved === 'dark' || legacySaved === 'light') return legacySaved;
      return 'dark'; // Default brand theme
    } catch {
      return 'dark';
    }
  });

  // 2. Active Accent Color
  const [activeAccentColor, setActiveAccentColorState] = useState<string>(() => {
    try {
      const savedAccent = localStorage.getItem('chromora_accent_color');
      if (savedAccent && /^#[0-9a-fA-F]{6}$/i.test(savedAccent)) {
        return savedAccent.toLowerCase();
      }
      return DEFAULT_BRAND_ACCENT;
    } catch {
      return DEFAULT_BRAND_ACCENT;
    }
  });

  // 3. Visual Preferences (Glass Intensity, Background Glow, Color Reactive UI)
  const [glassIntensity, setGlassIntensityState] = useState<GlassIntensity>(() => {
    try {
      const saved = localStorage.getItem('chromora_glass_intensity');
      if (saved === 'subtle' || saved === 'balanced' || saved === 'strong') return saved;
      return 'balanced';
    } catch {
      return 'balanced';
    }
  });

  const [bgGlowEnabled, setBgGlowEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('chromora_bg_glow');
      if (saved !== null) return saved === 'true';
      return true; // Enabled by default
    } catch {
      return true;
    }
  });

  const [colorReactiveEnabled, setColorReactiveEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('chromora_color_reactive');
      if (saved !== null) return saved === 'true';
      return true; // Enabled by default
    } catch {
      return true;
    }
  });

  const [isVisualSettingsModalOpen, setIsVisualSettingsModalOpen] = useState(false);

  // 4. Resolved Theme calculation based on mode & OS media query
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Listen to OS system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    try {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const resolvedTheme: ResolvedTheme = themeMode === 'system' ? (systemIsDark ? 'dark' : 'light') : themeMode;

  // Track accent contrast metrics
  const effectiveAccent = colorReactiveEnabled ? activeAccentColor : DEFAULT_BRAND_ACCENT;
  const themeVars = useMemo(
    () => getThemeColorVariables(effectiveAccent, resolvedTheme === 'dark'),
    [effectiveAccent, resolvedTheme]
  );

  // Apply Theme & CSS variables to document root
  useEffect(() => {
    try {
      localStorage.setItem('chromora_theme_preference', themeMode);
      localStorage.setItem('chromora_theme', resolvedTheme);
      localStorage.setItem('chromora_accent_color', activeAccentColor);
      localStorage.setItem('chromora_color_reactive', String(colorReactiveEnabled));
      localStorage.setItem('chromora_glass_intensity', glassIntensity);
      localStorage.setItem('chromora_bg_glow', String(bgGlowEnabled));

      const root = document.documentElement;

      // Dark / Light classes & attributes
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }

      // Dynamic CSS Custom Properties for Color Reactive UI
      root.style.setProperty('--accent', themeVars.accent);
      root.style.setProperty('--accent-rgb', themeVars.accentRgb);
      root.style.setProperty('--accent-light', themeVars.accentLight);
      root.style.setProperty('--accent-dark', themeVars.accentDark);
      root.style.setProperty('--accent-soft', themeVars.accentSoft);
      root.style.setProperty('--accent-soft-bg', `rgba(${themeVars.accentRgb}, 0.12)`);
      root.style.setProperty('--accent-border', `rgba(${themeVars.accentRgb}, 0.35)`);
      root.style.setProperty('--accent-glow', `rgba(${themeVars.accentRgb}, 0.30)`);
      root.style.setProperty('--accent-glow-weak', `rgba(${themeVars.accentRgb}, 0.15)`);
      root.style.setProperty('--accent-glow-medium', `rgba(${themeVars.accentRgb}, 0.30)`);
      root.style.setProperty('--accent-foreground', themeVars.accentForeground);
      root.style.setProperty('--accent-btn-bg', themeVars.accentButtonBg);
      root.style.setProperty('--accent-btn-text', themeVars.accentButtonText);
      root.style.setProperty('--accent-contrast-text', themeVars.accentButtonText);

      // Glass intensity variable mapping
      let blurVal = '20px';
      let darkSurfaceAlpha = 0.58;
      let darkCardAlpha = 0.68;
      let darkHoverAlpha = 0.80;
      let lightSurfaceAlpha = 0.58;
      let lightCardAlpha = 0.78;
      let lightHoverAlpha = 0.92;

      if (glassIntensity === 'subtle') {
        blurVal = '14px';
        darkSurfaceAlpha = 0.76;
        darkCardAlpha = 0.84;
        darkHoverAlpha = 0.92;
        lightSurfaceAlpha = 0.78;
        lightCardAlpha = 0.88;
        lightHoverAlpha = 0.96;
      } else if (glassIntensity === 'strong') {
        blurVal = '26px';
        darkSurfaceAlpha = 0.44;
        darkCardAlpha = 0.54;
        darkHoverAlpha = 0.68;
        lightSurfaceAlpha = 0.46;
        lightCardAlpha = 0.66;
        lightHoverAlpha = 0.84;
      }

      root.style.setProperty('--glass-blur', blurVal);

      // Semantic theme surfaces & text
      if (resolvedTheme === 'dark') {
        root.style.setProperty('--bg-page', '#0c0e14'); // Deep near-black base
        root.style.setProperty('--surface-glass', `rgba(15, 18, 25, ${darkSurfaceAlpha})`);
        root.style.setProperty('--surface-glass-card', `rgba(18, 22, 32, ${darkCardAlpha})`);
        root.style.setProperty('--surface-glass-hover', `rgba(26, 32, 46, ${darkHoverAlpha})`);
        root.style.setProperty('--surface-glass-input', 'rgba(12, 15, 23, 0.88)');
        root.style.setProperty('--surface-glass-dropdown', 'rgba(15, 18, 28, 0.94)');
        root.style.setProperty('--surface-glass-modal', 'rgba(14, 17, 26, 0.92)');
        root.style.setProperty('--border-glass', 'rgba(255, 255, 255, 0.10)');
        root.style.setProperty('--border-glass-subtle', 'rgba(255, 255, 255, 0.06)');
        root.style.setProperty('--border-glass-strong', 'rgba(255, 255, 255, 0.18)');
        root.style.setProperty('--text-primary', '#F8FAFC');
        root.style.setProperty('--text-secondary', '#CBD5E1');
        root.style.setProperty('--text-muted', '#94A3B8');
        root.style.setProperty('--glass-shadow', '0 10px 40px rgba(0, 0, 0, 0.25)');
        root.style.setProperty('--glass-highlight', 'inset 0 1px 0 0 rgba(255, 255, 255, 0.10)');
      } else {
        root.style.setProperty('--bg-page', '#f8fafc'); // Soft off-white cool-gray
        root.style.setProperty('--surface-glass', `rgba(255, 255, 255, ${lightSurfaceAlpha})`);
        root.style.setProperty('--surface-glass-card', `rgba(255, 255, 255, ${lightCardAlpha})`);
        root.style.setProperty('--surface-glass-hover', `rgba(255, 255, 255, ${lightHoverAlpha})`);
        root.style.setProperty('--surface-glass-input', 'rgba(255, 255, 255, 0.94)');
        root.style.setProperty('--surface-glass-dropdown', 'rgba(255, 255, 255, 0.96)');
        root.style.setProperty('--surface-glass-modal', 'rgba(255, 255, 255, 0.94)');
        root.style.setProperty('--border-glass', 'rgba(255, 255, 255, 0.72)');
        root.style.setProperty('--border-glass-subtle', 'rgba(15, 23, 42, 0.08)');
        root.style.setProperty('--border-glass-strong', 'rgba(15, 23, 42, 0.16)');
        root.style.setProperty('--text-primary', '#0F172A');
        root.style.setProperty('--text-secondary', '#334155');
        root.style.setProperty('--text-muted', '#64748B');
        root.style.setProperty('--glass-shadow', '0 10px 35px rgba(15, 23, 42, 0.10)');
        root.style.setProperty('--glass-highlight', 'inset 0 1px 0 0 rgba(255, 255, 255, 0.85)');
      }
    } catch {
      // ignore
    }
  }, [themeMode, resolvedTheme, activeAccentColor, colorReactiveEnabled, glassIntensity, bgGlowEnabled, themeVars]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState((prev) => (prev === mode ? prev : mode));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  }, []);

  const setTheme = useCallback((t: ResolvedTheme) => {
    setThemeModeState((prev) => (prev === t ? prev : t));
  }, []);

  const setActiveAccentColor = useCallback((hex: string) => {
    if (!hex) return;
    const clean = hex.startsWith('#') ? hex.toLowerCase() : `#${hex.toLowerCase()}`;
    if (/^#[0-9a-f]{3,8}$/i.test(clean)) {
      setActiveAccentColorState((prev) => (prev === clean ? prev : clean));
    }
  }, []);

  const setGlassIntensity = useCallback((intensity: GlassIntensity) => {
    setGlassIntensityState(intensity);
  }, []);

  const setBgGlowEnabled = useCallback((enabled: boolean) => {
    setBgGlowEnabledState(enabled);
  }, []);

  const setColorReactiveEnabled = useCallback((enabled: boolean) => {
    setColorReactiveEnabledState((prev) => (prev === enabled ? prev : enabled));
  }, []);

  const resetAccentColor = useCallback(() => {
    setActiveAccentColorState(DEFAULT_BRAND_ACCENT);
  }, []);

  const resetVisualPreferences = useCallback(() => {
    setGlassIntensityState('balanced');
    setBgGlowEnabledState(true);
    setColorReactiveEnabledState(true);
    setActiveAccentColorState(DEFAULT_BRAND_ACCENT);
  }, []);

  const contextValue = useMemo<ThemeContextType>(
    () => ({
      themeMode,
      resolvedTheme,
      theme: resolvedTheme, // Compatibility with existing useTheme().theme
      setThemeMode,
      toggleTheme,
      setTheme,
      activeAccentColor,
      setActiveAccentColor,
      colorReactiveEnabled,
      setColorReactiveEnabled,
      resetAccentColor,
      glassIntensity,
      setGlassIntensity,
      bgGlowEnabled,
      setBgGlowEnabled,
      resetVisualPreferences,
      isVisualSettingsModalOpen,
      setIsVisualSettingsModalOpen,
      isAccentAdjusted: themeVars.isAdjusted,
      accentContrastRatio: themeVars.contrastRatio,
      accentTooltip: themeVars.tooltip,
    }),
    [
      themeMode,
      resolvedTheme,
      setThemeMode,
      toggleTheme,
      setTheme,
      activeAccentColor,
      setActiveAccentColor,
      colorReactiveEnabled,
      setColorReactiveEnabled,
      resetAccentColor,
      glassIntensity,
      setGlassIntensity,
      bgGlowEnabled,
      setBgGlowEnabled,
      resetVisualPreferences,
      isVisualSettingsModalOpen,
      setIsVisualSettingsModalOpen,
      themeVars.isAdjusted,
      themeVars.contrastRatio,
      themeVars.tooltip,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
