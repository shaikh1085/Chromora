import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PaletteProvider } from './context/PaletteContext';
import { I18nProvider } from './context/I18nContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { ExportCenterModal } from './components/tools/ExportCenterModal';
import { DesignPreviewModal } from './components/tools/DesignPreviewModal';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { VisualSettingsModal } from './components/common/VisualSettingsModal';
import { CONVERTER_PAGES } from './data/converterPagesData';
import { COLLECTION_PAGES } from './data/collectionPagesData';

// Lazy Loaded Pages & Tools for Code Splitting & Performance
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ColorExplorerTool = lazy(() =>
  import('./components/tools/ColorExplorerTool').then((m) => ({ default: m.ColorExplorerTool }))
);
const PaletteGeneratorTool = lazy(() =>
  import('./components/tools/PaletteGeneratorTool').then((m) => ({ default: m.PaletteGeneratorTool }))
);
const AIPromptGeneratorTool = lazy(() =>
  import('./components/tools/AIPromptGeneratorTool').then((m) => ({ default: m.AIPromptGeneratorTool }))
);
const ImageExtractorTool = lazy(() =>
  import('./components/tools/ImageExtractorTool').then((m) => ({ default: m.ImageExtractorTool }))
);
const ContrastCheckerTool = lazy(() =>
  import('./components/tools/ContrastCheckerTool').then((m) => ({ default: m.ContrastCheckerTool }))
);
const GradientGeneratorTool = lazy(() =>
  import('./components/tools/GradientGeneratorTool').then((m) => ({ default: m.GradientGeneratorTool }))
);
const ColorConverterTool = lazy(() =>
  import('./components/tools/ColorConverterTool').then((m) => ({ default: m.ColorConverterTool }))
);
const ShadesTintsGeneratorTool = lazy(() =>
  import('./components/tools/ShadesTintsGeneratorTool').then((m) => ({ default: m.ShadesTintsGeneratorTool }))
);
const ColorMixerTool = lazy(() =>
  import('./components/tools/ColorMixerTool').then((m) => ({ default: m.ColorMixerTool }))
);
const ColorBlindnessSimulatorTool = lazy(() =>
  import('./components/tools/ColorBlindnessSimulatorTool').then((m) => ({ default: m.ColorBlindnessSimulatorTool }))
);
const RandomColorGeneratorTool = lazy(() =>
  import('./components/tools/RandomColorGeneratorTool').then((m) => ({ default: m.RandomColorGeneratorTool }))
);
const PantoneRalConverterTool = lazy(() =>
  import('./components/tools/PantoneRalConverterTool').then((m) => ({ default: m.PantoneRalConverterTool }))
);
const FaviconGeneratorTool = lazy(() =>
  import('./components/tools/FaviconGeneratorTool').then((m) => ({ default: m.FaviconGeneratorTool }))
);
const ColorWheelTool = lazy(() =>
  import('./components/tools/ColorWheelTool').then((m) => ({ default: m.ColorWheelTool }))
);
const DesignPreviewPage = lazy(() =>
  import('./components/tools/DesignPreviewPage').then((m) => ({ default: m.DesignPreviewPage }))
);
const ColorSearchPage = lazy(() =>
  import('./pages/ColorSearchPage').then((m) => ({ default: m.ColorSearchPage }))
);
const ColorDetailPage = lazy(() =>
  import('./pages/ColorDetailPage').then((m) => ({ default: m.ColorDetailPage }))
);
const SavedPalettesPage = lazy(() =>
  import('./pages/SavedPalettesPage').then((m) => ({ default: m.SavedPalettesPage }))
);
const ConverterSubPage = lazy(() =>
  import('./pages/ConverterSubPage').then((m) => ({ default: m.ConverterSubPage }))
);
const PaletteCollectionPage = lazy(() =>
  import('./pages/PaletteCollectionPage').then((m) => ({ default: m.PaletteCollectionPage }))
);
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3" role="status" aria-live="polite">
    <div
      className="w-9 h-9 rounded-full border-2 border-[var(--border-glass)] border-t-[var(--accent)] animate-spin"
      aria-hidden="true"
    />
    <span className="text-xs font-medium text-[var(--text-muted)] animate-pulse">
      Loading...
    </span>
  </div>
);

export function AppContent() {
  const { bgGlowEnabled } = useTheme();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);

  // Sync route with browser history
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut '/' to open quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsQuickSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Router matching
  const renderView = () => {
    const rawPath = currentPath.split('?')[0];
    const path = rawPath.replace(/\/$/, '') || '/';
    const slug = path.replace(/^\//, '');

    if (path === '/' || path === '/home') {
      return <HomePage navigate={navigate} />;
    }

    // Core Tool Routes & Aliases
    if (path === '/color-picker' || path === '/color-explorer') {
      return <ColorExplorerTool navigate={navigate} />;
    }

    if (path === '/color-palette-generator' || path === '/palette-generator') {
      return <PaletteGeneratorTool navigate={navigate} />;
    }

    if (path === '/ai-color-palette-generator' || path === '/ai-palette-generator' || path === '/prompt-palette') {
      return <AIPromptGeneratorTool navigate={navigate} />;
    }

    if (
      path === '/image-color-palette-generator' ||
      path === '/image-color-palette' ||
      path === '/image-palette' ||
      path === '/image-extractor'
    ) {
      return <ImageExtractorTool navigate={navigate} />;
    }

    if (path === '/color-contrast-checker' || path === '/contrast-checker' || path === '/color-contrast') {
      return <ContrastCheckerTool navigate={navigate} />;
    }

    if (path === '/gradient-generator' || path === '/gradient-studio') {
      return <GradientGeneratorTool navigate={navigate} />;
    }

    if (path === '/color-converter') {
      return <ColorConverterTool navigate={navigate} defaultMode="all" />;
    }

    if (
      path === '/color-shades-generator' ||
      path === '/shades-generator' ||
      path === '/color-shades' ||
      path === '/tint-generator'
    ) {
      return <ShadesTintsGeneratorTool navigate={navigate} />;
    }

    if (path === '/color-mixer' || path === '/color-blend' || path === '/color-blender') {
      return <ColorMixerTool navigate={navigate} />;
    }

    if (
      path === '/color-blindness-simulator' ||
      path === '/colorblind-simulator' ||
      path === '/color-blindness'
    ) {
      return <ColorBlindnessSimulatorTool navigate={navigate} />;
    }

    if (
      path === '/random-color-generator' ||
      path === '/random-color' ||
      path === '/random-palette-generator' ||
      path === '/random-palette'
    ) {
      return <RandomColorGeneratorTool navigate={navigate} />;
    }

    if (
      path === '/pantone-color-converter' ||
      path === '/pantone-converter' ||
      path === '/ral-color-converter' ||
      path === '/hex-to-pantone'
    ) {
      return <PantoneRalConverterTool navigate={navigate} />;
    }

    if (
      path === '/favicon-generator' ||
      path === '/favicon-maker' ||
      path === '/ico-generator'
    ) {
      return <FaviconGeneratorTool navigate={navigate} />;
    }

    if (
      path === '/color-wheel' ||
      path === '/wheel' ||
      path === '/color-harmonies' ||
      path === '/color-harmony'
    ) {
      return <ColorWheelTool navigate={navigate} />;
    }

    if (path === '/design-color-preview' || path === '/design-preview' || path === '/preview') {
      return <DesignPreviewPage navigate={navigate} />;
    }

    if (path === '/saved-color-palettes' || path === '/saved-palettes') {
      return <SavedPalettesPage navigate={navigate} />;
    }

    if (path === '/design-token-generator' || path === '/tokens' || path === '/export-tokens') {
      return <PaletteGeneratorTool navigate={navigate} />;
    }

    // Check if route is one of the Converter Sub-Pages
    if (CONVERTER_PAGES[slug]) {
      return <ConverterSubPage key={slug} slug={slug} navigate={navigate} />;
    }

    // Check if route is one of the Curated Collection Pages
    if (COLLECTION_PAGES[slug]) {
      return <PaletteCollectionPage key={slug} slug={slug} navigate={navigate} />;
    }

    if (path === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (path === '/privacy') {
      return <PrivacyPage navigate={navigate} />;
    }

    if (path === '/terms') {
      return <TermsPage navigate={navigate} />;
    }

    if (path === '/colors' || path === '/named-colors' || path === '/color-search') {
      const urlParams = new URLSearchParams(window.location.search);
      const family = urlParams.get('family') || undefined;
      const search = urlParams.get('search') || undefined;
      return (
        <ColorSearchPage
          initialFamily={family}
          initialQuery={search}
          navigate={navigate}
        />
      );
    }

    if (path.startsWith('/colors/')) {
      const colorSlug = path.replace('/colors/', '');
      return <ColorDetailPage key={colorSlug} slug={colorSlug} navigate={navigate} />;
    }

    return <NotFoundPage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] relative transition-colors duration-200 overflow-x-hidden">
      {/* 1. Subtle Background Noise Grain Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grain-noise opacity-50 dark:opacity-35 mix-blend-overlay" aria-hidden="true" />

      {/* 2. Layered Ambient Color Reactive Glow Mesh */}
      {bgGlowEnabled && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {/* Ambient Blob 1 - Top Left Accent */}
          <div
            className="absolute -top-32 -left-32 w-[550px] h-[550px] md:w-[680px] md:h-[680px] rounded-full blur-[100px] md:blur-[140px] opacity-20 dark:opacity-22 transition-all duration-700"
            style={{
              background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            }}
          />

          {/* Ambient Blob 2 - Top Right Accent Light */}
          <div
            className="absolute top-1/6 -right-32 w-[450px] h-[450px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] md:blur-[130px] opacity-16 dark:opacity-18 transition-all duration-700"
            style={{
              background: 'radial-gradient(circle, var(--accent-light, var(--accent)) 0%, transparent 70%)',
            }}
          />

          {/* Ambient Blob 3 - Mid/Bottom Left Accent */}
          <div
            className="hidden sm:block absolute top-2/3 -left-20 w-[420px] h-[420px] md:w-[520px] md:h-[520px] rounded-full blur-[110px] md:blur-[130px] opacity-12 dark:opacity-16 transition-all duration-700"
            style={{
              background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            }}
          />

          {/* Ambient Blob 4 - Center Soft Radial Gradient Overlay */}
          <div
            className="absolute top-0 inset-x-0 h-[600px] pointer-events-none opacity-25 dark:opacity-20 transition-opacity duration-700"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-glow-weak) 0%, transparent 75%)',
            }}
          />
        </div>
      )}

      {/* Navigation Header */}
      <Header
        currentRoute={currentPath}
        navigate={navigate}
        onOpenSearch={() => setIsQuickSearchOpen(true)}
      />

      {/* Main Page Content */}
      <main id="main-content" className="flex-1 relative z-10">
        <Suspense fallback={<PageLoadingFallback />}>
          {renderView()}
        </Suspense>
      </main>

      {/* Global Footer */}
      <div className="relative z-10">
        <Footer navigate={navigate} />
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <ExportCenterModal />
      <DesignPreviewModal />
      <VisualSettingsModal />
      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        navigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <PaletteProvider>
          <AppContent />
        </PaletteProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
