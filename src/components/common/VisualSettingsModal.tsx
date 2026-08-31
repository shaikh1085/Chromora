import React from 'react';
import { useTheme, GlassIntensity } from '../../context/ThemeContext';
import {
  Sparkles,
  Layers,
  SunMedium,
  Check,
  RotateCcw,
  X,
  Sliders,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export const VisualSettingsModal: React.FC = () => {
  const {
    isVisualSettingsModalOpen,
    setIsVisualSettingsModalOpen,
    glassIntensity,
    setGlassIntensity,
    bgGlowEnabled,
    setBgGlowEnabled,
    colorReactiveEnabled,
    setColorReactiveEnabled,
    resetVisualPreferences,
    activeAccentColor,
    resolvedTheme,
  } = useTheme();

  if (!isVisualSettingsModalOpen) return null;

  const intensityOptions: { id: GlassIntensity; label: string; desc: string }[] = [
    { id: 'subtle', label: 'Subtle', desc: 'Higher opacity, gentle blur & max contrast' },
    { id: 'balanced', label: 'Balanced', desc: 'Signature Chromora glass depth & clarity' },
    { id: 'strong', label: 'Strong', desc: 'Vibrant blur, rich saturation & deep sheen' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visual-settings-title"
    >
      <div
        className="w-full max-w-md glass-modal rounded-3xl p-6 relative animate-scale-up"
        style={{
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), var(--glass-highlight)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-glass-subtle)]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-border)',
              }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="visual-settings-title" className="text-base font-bold text-[var(--text-primary)]">
                Visual & Glass Settings
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Customize glass intensity and ambient effects
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisualSettingsModalOpen(false)}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-5">
          {/* 1. Glass Intensity Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-2.5">
              <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Glass Intensity</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {intensityOptions.map((opt) => {
                const isSelected = glassIntensity === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setGlassIntensity(opt.id)}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-[var(--accent)] shadow-md'
                        : 'border-[var(--border-glass)] hover:border-[var(--accent-border)] hover:bg-[var(--surface-glass-hover)]'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: 'var(--accent-soft)',
                            boxShadow: '0 0 16px var(--accent-glow-weak)',
                          }
                        : {
                            backgroundColor: 'var(--surface-glass-card)',
                          }
                    }
                  >
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                        {opt.label}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-[var(--accent)]" />}
                    </div>
                    <span className="text-[9px] text-[var(--text-muted)] mt-1 line-clamp-2 leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Background Glow Mesh Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl glass-card">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}
              >
                <SunMedium className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Background Ambient Glow
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Multi-blob reactive color mesh in background
                </span>
              </div>
            </div>

            <button
              onClick={() => setBgGlowEnabled(!bgGlowEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                bgGlowEnabled ? 'bg-[var(--accent)]' : resolvedTheme === 'dark' ? 'bg-zinc-700' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={bgGlowEnabled}
              aria-label="Toggle background glow"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  bgGlowEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. Color Reactive UI Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl glass-card">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}
              >
                <Sliders className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Color Reactive UI
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Adapt interface accents to selected palettes
                </span>
              </div>
            </div>

            <button
              onClick={() => setColorReactiveEnabled(!colorReactiveEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                colorReactiveEnabled ? 'bg-[var(--accent)]' : resolvedTheme === 'dark' ? 'bg-zinc-700' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={colorReactiveEnabled}
              aria-label="Toggle color reactive UI"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  colorReactiveEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Accessibility Notice */}
          <div className="p-3 rounded-2xl bg-[var(--surface-glass)] border border-[var(--border-glass-subtle)] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Chromora applies high-contrast WCAG 2.1 AA text surfaces and opaque input backgrounds across all glass modes for optimal readability.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-[var(--border-glass-subtle)] flex items-center justify-between gap-3">
          <button
            onClick={resetVisualPreferences}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Visual Preferences</span>
          </button>

          <button
            onClick={() => setIsVisualSettingsModalOpen(false)}
            className="px-4 py-2 rounded-xl btn-accent text-xs font-bold shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
