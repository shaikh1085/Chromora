import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
  X,
  Layout,
  Smartphone,
  ShoppingBag,
  Share2,
  TrendingUp,
  CreditCard,
  Star,
  Heart,
  MessageCircle,
  Sliders,
  Check,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { getColorData, getContrastRatio } from '../../utils/colorUtils';

type PreviewMode = 'saas' | 'landing' | 'mobile' | 'ecommerce' | 'social';

export const DesignPreviewModal: React.FC = () => {
  const { isPreviewModalOpen, setIsPreviewModalOpen, paletteColors } = usePalette();
  const [mode, setMode] = useState<PreviewMode>('saas');

  // Role mappings (assign index from paletteColors)
  const [rolePrimary, setRolePrimary] = useState(0);
  const [roleSecondary, setRoleSecondary] = useState(1);
  const [roleAccent, setRoleAccent] = useState(2);
  const [roleBg, setRoleBg] = useState(paletteColors.length > 4 ? 4 : 0);

  if (!isPreviewModalOpen) return null;

  const hexList = paletteColors.map((c) => c.hex);
  const primary = hexList[rolePrimary % hexList.length] || '#6366f1';
  const secondary = hexList[roleSecondary % hexList.length] || '#1e293b';
  const accent = hexList[roleAccent % hexList.length] || '#ec4899';
  const bg = hexList[roleBg % hexList.length] || '#0f172a';

  const primaryDark = getColorData(primary).isDark;
  const bgDark = getColorData(bg).isDark;
  const accentDark = getColorData(accent).isDark;

  const textColor = bgDark ? '#f8fafc' : '#0f172a';
  const textMuted = bgDark ? '#94a3b8' : '#64748b';
  const cardBg = bgDark ? '#1e293b' : '#ffffff';
  const cardBorder = bgDark ? '#334155' : '#e2e8f0';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div className="w-full max-w-5xl glass-modal rounded-3xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl border border-[var(--border-glass)]">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-[var(--border-glass-subtle)] gap-3 bg-[var(--surface-glass)]">
          <div>
            <h3 id="preview-modal-title" className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Layout className="w-4 h-4 text-[var(--accent)]" />
              <span>Real-Time Design System Preview</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Verify how your palette scales into production interfaces
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-[var(--surface-glass-card)] rounded-xl border border-[var(--border-glass)] overflow-x-auto">
            {[
              { id: 'saas', label: 'SaaS Dashboard', icon: Layout },
              { id: 'landing', label: 'Landing Page', icon: Zap },
              { id: 'mobile', label: 'Mobile Card', icon: Smartphone },
              { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag },
              { id: 'social', label: 'Social Post', icon: Share2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isTabActive = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMode(tab.id as PreviewMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    isTabActive
                      ? 'border border-[var(--accent-border)] font-bold shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)]'
                  }`}
                  style={
                    isTabActive
                      ? {
                          backgroundColor: 'var(--accent-soft)',
                          color: 'var(--accent)',
                        }
                      : {}
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsPreviewModalOpen(false)}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] transition-colors self-end sm:self-auto"
            aria-label="Close design preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Customizer Bar */}
        <div className="px-6 py-3 bg-[var(--surface-glass)] border-b border-[var(--border-glass-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-[var(--text-muted)] flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" /> Roles:
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)] font-medium">Primary:</span>
              <div className="flex items-center gap-1">
                {hexList.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRolePrimary(idx)}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      rolePrimary === idx ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-black scale-110 border-white' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`Set ${hex} as Primary`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)] font-medium">Accent:</span>
              <div className="flex items-center gap-1">
                {hexList.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRoleAccent(idx)}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      roleAccent === idx ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-black scale-110 border-white' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`Set ${hex} as Accent`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Canvas:</span>
              <div className="flex items-center gap-1">
                {hexList.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRoleBg(idx)}
                    className={`w-5 h-5 rounded-full border ${
                      roleBg === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`Set ${hex} as Canvas`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span>Ratio on Canvas:</span>
            <span
              className={`font-mono px-2 py-0.5 rounded font-bold ${
                getContrastRatio(primary, bg).normalAA ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
              }`}
            >
              {getContrastRatio(primary, bg).ratio}:1
            </span>
          </div>
        </div>

        {/* Live Simulation Preview Canvas */}
        <div
          className="p-6 sm:p-10 flex-1 overflow-y-auto transition-colors duration-300 flex items-center justify-center min-h-[420px]"
          style={{ backgroundColor: bg }}
        >
          {/* SaaS Dashboard Mode */}
          {mode === 'saas' && (
            <div
              className="w-full max-w-3xl rounded-2xl p-6 shadow-2xl border transition-all"
              style={{ backgroundColor: cardBg, borderColor: cardBorder, color: textColor }}
            >
              <div className="flex items-center justify-between pb-5 border-b" style={{ borderColor: cardBorder }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm" style={{ backgroundColor: primary, color: primaryDark ? '#ffffff' : '#000000' }}>
                    C
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none">Chromora Cloud</h4>
                    <p className="text-xs mt-1" style={{ color: textMuted }}>Production Workspace</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: primary, color: primaryDark ? '#ffffff' : '#000000' }}>
                    Deploy Model
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-xl border" style={{ borderColor: cardBorder, backgroundColor: bgDark ? '#111827' : '#f8fafc' }}>
                  <span className="text-xs" style={{ color: textMuted }}>Monthly MRR</span>
                  <p className="text-xl font-bold mt-1">$48,250</p>
                  <span className="text-xs font-semibold inline-flex items-center gap-1 mt-2 text-emerald-500">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4%
                  </span>
                </div>

                <div className="p-4 rounded-xl border" style={{ borderColor: cardBorder, backgroundColor: bgDark ? '#111827' : '#f8fafc' }}>
                  <span className="text-xs" style={{ color: textMuted }}>Active Nodes</span>
                  <p className="text-xl font-bold mt-1">1,429</p>
                  <span className="text-xs font-semibold inline-flex items-center gap-1 mt-2" style={{ color: accent }}>
                    <Zap className="w-3.5 h-3.5" /> High throughput
                  </span>
                </div>

                <div className="p-4 rounded-xl border" style={{ borderColor: cardBorder, backgroundColor: bgDark ? '#111827' : '#f8fafc' }}>
                  <span className="text-xs" style={{ color: textMuted }}>Average Latency</span>
                  <p className="text-xl font-bold mt-1">18ms</p>
                  <span className="text-xs font-semibold inline-flex items-center gap-1 mt-2 text-sky-400">
                    Global edge
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border flex items-center justify-between" style={{ borderColor: cardBorder }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="text-xs font-medium">Automatic system synchronization complete.</span>
                </div>
                <button className="text-xs font-semibold underline" style={{ color: primary }}>
                  View Telemetry
                </button>
              </div>
            </div>
          )}

          {/* Landing Page Mode */}
          {mode === 'landing' && (
            <div className="w-full max-w-2xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border" style={{ borderColor: accent, color: accent, backgroundColor: bgDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' }}>
                <span>✦ Next-Gen Design Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight" style={{ color: textColor }}>
                Scale Your Brand With <span style={{ color: primary }}>Harmonious</span> Precision
              </h2>
              <p className="text-sm sm:text-base max-w-lg mx-auto" style={{ color: textMuted }}>
                Generate mathematically compliant color palettes, contrast tokens, and design variables in milliseconds.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button className="px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-transform hover:scale-105" style={{ backgroundColor: primary, color: primaryDark ? '#ffffff' : '#000000' }}>
                  Start Free Trial
                </button>
                <button className="px-5 py-3 rounded-xl font-bold text-sm border" style={{ borderColor: cardBorder, color: textColor, backgroundColor: cardBg }}>
                  Explore Docs
                </button>
              </div>
            </div>
          )}

          {/* Mobile Card Mode */}
          {mode === 'mobile' && (
            <div
              className="w-80 rounded-3xl p-6 shadow-2xl border space-y-5"
              style={{ backgroundColor: cardBg, borderColor: cardBorder, color: textColor }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: textMuted }}>Digital Card</span>
                <CreditCard className="w-5 h-5" style={{ color: primary }} />
              </div>
              <div className="p-5 rounded-2xl shadow-lg relative overflow-hidden" style={{ backgroundColor: primary, color: primaryDark ? '#ffffff' : '#000000' }}>
                <div className="flex justify-between items-center text-xs font-medium opacity-80">
                  <span>Chromora Platinum</span>
                  <span>•• 8824</span>
                </div>
                <div className="mt-8">
                  <span className="text-xs opacity-75">Available Balance</span>
                  <p className="text-2xl font-bold tracking-tight">$14,850.00</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span style={{ color: textMuted }}>Daily Limit</span>
                  <span className="font-semibold" style={{ color: textColor }}>$5,000</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: bgDark ? '#334155' : '#e2e8f0' }}>
                  <div className="h-full rounded-full" style={{ width: '65%', backgroundColor: accent }} />
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl font-semibold text-xs text-center" style={{ backgroundColor: bgDark ? '#334155' : '#f1f5f9', color: textColor }}>
                Transfer Funds
              </button>
            </div>
          )}

          {/* E-Commerce Product Card */}
          {mode === 'ecommerce' && (
            <div
              className="w-80 rounded-2xl overflow-hidden shadow-2xl border"
              style={{ backgroundColor: cardBg, borderColor: cardBorder, color: textColor }}
            >
              <div className="h-44 flex items-center justify-center relative" style={{ backgroundColor: bgDark ? '#18181b' : '#f4f4f5' }}>
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-lg" style={{ backgroundColor: primary, color: primaryDark ? '#ffffff' : '#000000' }}>
                  ★
                </div>
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: accent, color: accentDark ? '#ffffff' : '#000000' }}>
                  New Release
                </span>
                <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-black/50 text-rose-500">
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold ml-1">4.9</span>
                  <span style={{ color: textMuted }}>(128 reviews)</span>
                </div>
                <h4 className="font-bold text-base">Aura Studio Headphones</h4>
                <p className="text-xs line-clamp-2" style={{ color: textMuted }}>
                  Acoustic precision with adaptive noise cancellation and aerospace titanium finish.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold">$349.00</span>
                  <button className="px-4 py-2 rounded-xl text-xs font-bold" style={{ backgroundColor: primary, color: primaryDark ? '#ffffff' : '#000000' }}>
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Social Post Mode */}
          {mode === 'social' && (
            <div
              className="w-80 sm:w-96 rounded-2xl p-5 shadow-2xl border space-y-4"
              style={{ backgroundColor: cardBg, borderColor: cardBorder, color: textColor }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: accent, color: accentDark ? '#ffffff' : '#000000' }}>
                    A
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">Aesthetic Lab</h5>
                    <span className="text-[11px]" style={{ color: textMuted }}>@aesthetic_lab • 2h</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: primary, color: primaryDark ? '#ffffff' : '#000000' }}>
                  Featured
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                Color psychology is the secret differentiator in luxury interfaces. Discover our latest visual harmony system built on Chromora.
              </p>
              <div className="h-28 rounded-xl flex items-center justify-center font-bold text-sm tracking-wide shadow-inner" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`, color: '#ffffff' }}>
                Chromora Studio 2026
              </div>
              <div className="flex items-center justify-between text-xs pt-1" style={{ color: textMuted }}>
                <div className="flex items-center gap-1 hover:text-rose-400">
                  <Heart className="w-4 h-4" /> <span>842</span>
                </div>
                <div className="flex items-center gap-1 hover:text-sky-400">
                  <MessageCircle className="w-4 h-4" /> <span>56</span>
                </div>
                <div className="flex items-center gap-1 hover:text-emerald-400">
                  <Share2 className="w-4 h-4" /> <span>Share</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Component preview is rendered dynamically using your active palette</span>
          <button
            onClick={() => setIsPreviewModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 font-semibold hover:bg-zinc-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
