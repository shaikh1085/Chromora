import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import { getColorData, getContrastRatio } from '../../utils/colorUtils';
import { ASIAN_GLOBAL_INSPIRATIONS, TRENDING_PALETTES } from '../../data/presetPalettes';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
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
  Sparkles,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Bookmark,
  Share,
} from 'lucide-react';

type PreviewMode = 'saas' | 'landing' | 'mobile' | 'ecommerce' | 'social';

export const DesignPreviewPage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  const { paletteColors, setPaletteFromHexList, savePalette, showToast } = usePalette();
  const { t } = useI18n();
  const [mode, setMode] = useState<PreviewMode>('saas');

  // Role indexes mapped to paletteColors
  const [rolePrimary, setRolePrimary] = useState(0);
  const [roleSecondary, setRoleSecondary] = useState(1);
  const [roleAccent, setRoleAccent] = useState(2);
  const [roleBg, setRoleBg] = useState(paletteColors.length > 4 ? 4 : 0);
  const [roleSurface, setRoleSurface] = useState(paletteColors.length > 1 ? 1 : 0);
  const [roleText, setRoleText] = useState(paletteColors.length > 3 ? 3 : 0);

  const hexList = paletteColors.map((c) => c.hex);
  const primary = hexList[rolePrimary % hexList.length] || '#6366f1';
  const secondary = hexList[roleSecondary % hexList.length] || '#1e293b';
  const accent = hexList[roleAccent % hexList.length] || '#ec4899';
  const bg = hexList[roleBg % hexList.length] || '#0f172a';
  const surface = hexList[roleSurface % hexList.length] || '#1e293b';
  const textCustom = hexList[roleText % hexList.length] || '#f8fafc';

  const primaryDark = getColorData(primary).isDark;
  const bgDark = getColorData(bg).isDark;
  const accentDark = getColorData(accent).isDark;
  const surfaceDark = getColorData(surface).isDark;

  const textColor = textCustom || (bgDark ? '#f8fafc' : '#0f172a');
  const textMuted = bgDark ? '#94a3b8' : '#64748b';
  const cardBg = surface || (bgDark ? '#1e293b' : '#ffffff');
  const cardBorder = bgDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const textContrast = getContrastRatio(textColor, bg).ratio;
  const primaryContrast = getContrastRatio(primary, bg).ratio;

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'Real-Time Design System & UI Preview — Chromora',
          description:
            'Test your color palette in real-time across realistic SaaS dashboards, landing pages, mobile apps, and e-commerce UI components with live role mapping.',
          canonicalUrl: 'https://chromora.app/design-preview',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Design Preview', url: '/design-preview', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Hero */}
        <div className="my-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2"
              style={{
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-border)',
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive UI Simulator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Real-Time Design System Preview
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
              Map your color palette to semantic UI roles and see how it looks across production SaaS, mobile, ecommerce, and landing page layouts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                savePalette('Design System Preset', hexList, ['Preview', mode]);
                showToast('Palette saved with current preview roles', 'success');
              }}
              className="px-4 py-2.5 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] text-xs font-bold text-[var(--text-primary)] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Bookmark className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span>Save Palette</span>
            </button>
          </div>
        </div>

        {/* Role Assignment Bar */}
        <div className="p-6 rounded-2xl glass-card shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span>Assign Semantic Roles from Active Palette</span>
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              Text Contrast: <strong className={textContrast >= 4.5 ? 'text-emerald-500' : 'text-amber-500'}>{textContrast}:1</strong> | Primary Contrast: <strong className={primaryContrast >= 3.0 ? 'text-emerald-500' : 'text-amber-500'}>{primaryContrast}:1</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Primary Action', value: rolePrimary, setter: setRolePrimary, current: primary },
              { label: 'Secondary / Sub', value: roleSecondary, setter: setRoleSecondary, current: secondary },
              { label: 'Accent / Highlight', value: roleAccent, setter: setRoleAccent, current: accent },
              { label: 'Background Canvas', value: roleBg, setter: setRoleBg, current: bg },
              { label: 'Surface / Card', value: roleSurface, setter: setRoleSurface, current: surface },
              { label: 'Text / Heading', value: roleText, setter: setRoleText, current: textCustom },
            ].map((role, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[var(--surface-glass-card)] border border-[var(--border-glass-subtle)]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[var(--text-secondary)]">{role.label}</span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: role.current }}
                  />
                </div>
                <select
                  value={role.value}
                  onChange={(e) => role.setter(Number(e.target.value))}
                  className="w-full text-xs font-mono py-1.5 px-2 rounded-lg bg-[var(--bg-page)] border border-[var(--border-glass)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  {paletteColors.map((c, cIdx) => (
                    <option key={cIdx} value={cIdx}>
                      Color 0{cIdx + 1}: {c.hex.toUpperCase()} ({c.name})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Quick Preset Swapping */}
          <div className="mt-4 pt-4 border-t border-[var(--border-glass-subtle)] flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Load sample palette:</span>
            {ASIAN_GLOBAL_INSPIRATIONS.slice(0, 5).map((preset) => (
              <button
                key={preset.id}
                onClick={() => setPaletteFromHexList(preset.palette, preset.name)}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] text-[11px] font-medium text-[var(--text-secondary)] border border-[var(--border-glass-subtle)] transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 glass-panel rounded-2xl w-fit mb-6 overflow-x-auto">
          {[
            { id: 'saas', label: 'SaaS Dashboard', icon: Layout },
            { id: 'landing', label: 'Landing Page', icon: Zap },
            { id: 'mobile', label: 'Mobile App', icon: Smartphone },
            { id: 'ecommerce', label: 'E-Commerce Card', icon: ShoppingBag },
            { id: 'social', label: 'Social Post', icon: Share2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = mode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id as PreviewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'btn-accent shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-active)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Preview Container */}
        <div
          className="rounded-3xl p-6 sm:p-10 border transition-all duration-300 shadow-xl overflow-hidden min-h-[560px] flex items-center justify-center"
          style={{
            backgroundColor: bg,
            borderColor: cardBorder,
            color: textColor,
          }}
        >
          {/* 1. SaaS Dashboard View */}
          {mode === 'saas' && (
            <div className="w-full max-w-4xl space-y-6">
              {/* Top Navigation */}
              <div
                className="flex items-center justify-between px-6 py-4 rounded-2xl backdrop-blur-md shadow-sm border"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm"
                    style={{
                      backgroundColor: primary,
                      color: primaryDark ? '#ffffff' : '#09090b',
                    }}
                  >
                    C
                  </div>
                  <span className="font-bold text-sm tracking-tight">Chromora Cloud</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="text-xs opacity-75">Production System: Stable</span>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-transform hover:scale-105"
                    style={{
                      backgroundColor: primary,
                      color: primaryDark ? '#ffffff' : '#09090b',
                    }}
                  >
                    Deploy
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Monthly Recurring Revenue', val: '$148,290', delta: '+14.2%', icon: TrendingUp },
                  { label: 'Active User Workspaces', val: '24,810', delta: '+8.6%', icon: CreditCard },
                  { label: 'Design Tokens Synced', val: '1.2M', delta: '+28.4%', icon: Zap },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="p-5 rounded-2xl border shadow-sm flex flex-col justify-between h-32 transition-transform hover:translate-y-[-2px]"
                      style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium opacity-70">{stat.label}</span>
                        <div
                          className="p-1.5 rounded-lg"
                          style={{ backgroundColor: `${primary}20`, color: primary }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black">{stat.val}</span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${accent}25`,
                            color: accent,
                          }}
                        >
                          {stat.delta}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Data Table Mock */}
              <div
                className="p-6 rounded-2xl border shadow-sm space-y-4"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              >
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
                  <h4 className="font-bold text-sm">Recent Deployment Pipelines</h4>
                  <span className="text-xs opacity-60">Showing latest 3 of 48</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { env: 'Production API Gateway', ver: 'v4.18.0', status: 'Deployed', time: '2m ago' },
                    { env: 'Global Edge Cache', ver: 'v2.1.4', status: 'Verifying', time: '14m ago' },
                    { env: 'PostgreSQL Replica Alpha', ver: 'v1.9.8', status: 'Deployed', time: '1h ago' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 rounded-xl border text-xs"
                      style={{ borderColor: cardBorder, backgroundColor: `${bg}40` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                        <span className="font-semibold">{row.env}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono opacity-60">{row.ver}</span>
                        <span
                          className="px-2 py-0.5 rounded-md font-bold text-[11px]"
                          style={{ backgroundColor: `${accent}20`, color: accent }}
                        >
                          {row.status}
                        </span>
                        <span className="opacity-50">{row.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Landing Page View */}
          {mode === 'landing' && (
            <div className="w-full max-w-3xl text-center space-y-8 py-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm"
                style={{
                  backgroundColor: `${primary}15`,
                  borderColor: `${primary}40`,
                  color: primary,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Color Infrastructure</span>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                  Design beautiful systems that scale with ease.
                </h2>
                <p className="text-sm sm:text-base leading-relaxed opacity-80" style={{ color: textMuted }}>
                  Empower engineering and design teams with mathematically verified harmonies, automated WCAG 2.1 compliance, and instant design token exports.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm shadow-lg transition-transform hover:scale-105"
                  style={{
                    backgroundColor: primary,
                    color: primaryDark ? '#ffffff' : '#09090b',
                  }}
                >
                  Start Building Free
                </button>
                <button
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm border transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                    color: textColor,
                  }}
                >
                  Explore Documentation
                </button>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
                {[
                  { title: 'Harmonic Engine', desc: '12 optical color algorithms calibrated for precision.' },
                  { title: 'WCAG AAA Proof', desc: 'Real-time contrast validation against any canvas.' },
                  { title: 'Zero Dependency', desc: 'Runs 100% locally in browser memory.' },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border shadow-sm space-y-2"
                    style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${accent}25`, color: accent }}
                    >
                      0{i + 1}
                    </div>
                    <h5 className="font-bold text-sm">{feat.title}</h5>
                    <p className="text-xs opacity-75 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Mobile Card View */}
          {mode === 'mobile' && (
            <div
              className="w-full max-w-xs rounded-3xl p-6 border shadow-2xl space-y-5"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono opacity-50">09:41 AM</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: primary }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs opacity-60">Daily Wellness Summary</span>
                <h4 className="text-xl font-extrabold">Nordic Serenity</h4>
              </div>

              <div
                className="p-4 rounded-2xl border flex items-center justify-between"
                style={{ backgroundColor: `${bg}50`, borderColor: cardBorder }}
              >
                <div>
                  <span className="text-xs opacity-60">Target Focus</span>
                  <p className="text-lg font-bold">4.8 hrs</p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                  style={{
                    backgroundColor: primary,
                    color: primaryDark ? '#ffffff' : '#09090b',
                  }}
                >
                  92%
                </div>
              </div>

              <div className="space-y-2">
                <button
                  className="w-full py-3 rounded-xl font-bold text-xs shadow-md transition-transform hover:scale-102"
                  style={{
                    backgroundColor: primary,
                    color: primaryDark ? '#ffffff' : '#09090b',
                  }}
                >
                  Resume Active Session
                </button>
                <button
                  className="w-full py-2.5 rounded-xl font-semibold text-xs border"
                  style={{ borderColor: cardBorder }}
                >
                  View Session Analytics
                </button>
              </div>
            </div>
          )}

          {/* 4. E-Commerce Card View */}
          {mode === 'ecommerce' && (
            <div
              className="w-full max-w-sm rounded-3xl border shadow-xl overflow-hidden"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              {/* Product Visual Box */}
              <div
                className="h-52 p-6 flex flex-col justify-between relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
                }}
              >
                <div className="flex items-center justify-between z-10">
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      color: '#ffffff',
                    }}
                  >
                    Limited Edition
                  </span>
                  <div className="p-2 rounded-full bg-black/20 text-white backdrop-blur-md">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                </div>
                <div className="z-10 text-white">
                  <span className="text-xs font-semibold opacity-90">Chromora Studio</span>
                  <h3 className="text-2xl font-black">Monolith Acoustic Headset</h3>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.9 (1,240 reviews)</span>
                  </div>
                  <span className="text-xl font-black">$349.00</span>
                </div>

                <p className="text-xs opacity-75 leading-relaxed" style={{ color: textMuted }}>
                  Ultra-low latency studio monitor with custom magnetic planars and handcrafted memory foam isolation cups.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    className="flex-1 py-3 rounded-xl font-bold text-xs shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: primary,
                      color: primaryDark ? '#ffffff' : '#09090b',
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    className="p-3 rounded-xl border transition-colors"
                    style={{ borderColor: cardBorder }}
                  >
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Social Media Post View */}
          {mode === 'social' && (
            <div
              className="w-full max-w-md rounded-3xl border shadow-xl p-6 space-y-4"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
                    style={{
                      backgroundColor: primary,
                      color: primaryDark ? '#ffffff' : '#09090b',
                    }}
                  >
                    CH
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">chromora.design</h5>
                    <span className="text-xs opacity-60">Verified Creative Suite</span>
                  </div>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: `${accent}20`, color: accent }}
                >
                  Follow
                </span>
              </div>

              {/* Media Card */}
              <div
                className="h-60 rounded-2xl p-6 flex flex-col justify-end text-white shadow-inner relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 50%, ${accent} 100%)`,
                }}
              >
                <div className="z-10 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">Design Inspiration</span>
                  <h4 className="text-2xl font-black">Color is Communication</h4>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 cursor-pointer" />
                  <MessageCircle className="w-5 h-5 opacity-70 cursor-pointer" />
                  <Share2 className="w-5 h-5 opacity-70 cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 opacity-70 cursor-pointer" />
              </div>

              <div className="text-xs space-y-1">
                <p>
                  <strong>4,892 likes</strong>
                </p>
                <p className="opacity-80 leading-relaxed">
                  <strong>chromora.design</strong> Harmonic palette generated with Chromora Studio. Accessible WCAG AAA certified colors for digital and print.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
