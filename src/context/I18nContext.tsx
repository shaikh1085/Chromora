import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';

export type LanguageCode = 'en';

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeName: string;
  dir: 'ltr';
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', label: 'English', nativeName: 'English', dir: 'ltr', flag: '🇺🇸' },
];

export interface Translations {
  appName: string;
  tagline: string;
  navExplorer: string;
  navPalette: string;
  navAiPalette: string;
  navImageToColors: string;
  navContrastCheck: string;
  navDesignPreview: string;
  navGradients: string;
  navConverter: string;
  navNamedColors: string;
  navSavedPalettes: string;
  exportTokens: string;
  searchPlaceholder: string;
  exploreColor: string;
  generatePalette: string;
  copyHex: string;
  copied: string;
  saveToSaved: string;
  useInDesignPreview: string;
  findAccessibleColor: string;
  wcagPassed: string;
  wcagFailed: string;
  colorBlindSimulation: string;
  designPreviewTitle: string;
  sharePalette: string;
  downloadPng: string;
  contrastScore: string;
  spaceShortcut: string;
}

const ENGLISH_TRANSLATIONS: Translations = {
  appName: 'Chromora',
  tagline: 'Create colors that work beautifully.',
  navExplorer: 'Explorer',
  navPalette: 'Palette Studio',
  navAiPalette: 'AI Palette',
  navImageToColors: 'Image to Colors',
  navContrastCheck: 'Contrast Check',
  navDesignPreview: 'Design Preview',
  navGradients: 'Gradients',
  navConverter: 'Converter',
  navNamedColors: 'Named Colors',
  navSavedPalettes: 'Saved Palettes',
  exportTokens: 'Export Tokens',
  searchPlaceholder: 'Search colors, hex, or names...',
  exploreColor: 'Explore a Color',
  generatePalette: 'Generate a Palette',
  copyHex: 'Copy HEX',
  copied: 'Copied to clipboard',
  saveToSaved: 'Save to Collection',
  useInDesignPreview: 'Use in Design Preview',
  findAccessibleColor: 'Find Accessible Text Color',
  wcagPassed: 'WCAG Accessible',
  wcagFailed: 'Contrast Needs Adjustment',
  colorBlindSimulation: 'Color Vision Deficiency Simulation',
  designPreviewTitle: 'Real-Time Design System Preview',
  sharePalette: 'Share Palette',
  downloadPng: 'Download PNG Card',
  contrastScore: 'Contrast Ratio',
  spaceShortcut: 'Press Space to regenerate',
};

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: string) => void;
  isRtl: boolean;
  t: Translations;
  languages: LanguageInfo[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    try {
      localStorage.removeItem('chromora_language');
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = useCallback((_newLang: string) => {
    // English only
  }, []);

  const contextValue = useMemo<I18nContextType>(
    () => ({
      language: 'en',
      setLanguage,
      isRtl: false,
      t: ENGLISH_TRANSLATIONS,
      languages: SUPPORTED_LANGUAGES,
    }),
    [setLanguage]
  );

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

