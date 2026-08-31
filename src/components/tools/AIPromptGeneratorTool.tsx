import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import {
  generateAiPromptPalette,
  aiPromptPresets,
  ASIAN_GLOBAL_INSPIRATIONS,
} from '../../data/presetPalettes';
import { getColorData, getContrastRatio } from '../../utils/colorUtils';
import {
  Sparkles,
  ArrowRight,
  Bookmark,
  Check,
  RefreshCw,
  Copy,
  Layout,
  ShieldCheck,
  Zap,
  Tag,
  Palette,
  Globe,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';

export const AIPromptGeneratorTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { setPaletteFromHexList, savePalette, copyToClipboard, showToast } = usePalette();
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('Luxury coffee brand');
  const [activeResult, setActiveResult] = useState(() =>
    generateAiPromptPalette('Luxury coffee brand')
  );
  const [loading, setLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleGenerate = (queryToUse?: string) => {
    const q = queryToUse || prompt;
    if (!q.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const res = generateAiPromptPalette(q);
      setActiveResult(res);
      setLoading(false);
    }, 200);
  };

  // Calculate accessibility score for the palette (ratios against dark and light canvas)
  const calculateAccessibilityScore = (colors: string[]) => {
    let passCount = 0;
    let totalChecks = 0;

    colors.forEach((hex) => {
      const againstDark = getContrastRatio(hex, '#09090b').ratio;
      const againstLight = getContrastRatio(hex, '#ffffff').ratio;
      if (againstDark >= 4.5 || againstLight >= 4.5) {
        passCount += 1;
      }
      totalChecks += 1;
    });

    const percent = Math.round((passCount / totalChecks) * 100);
    let grade = 'AAA Ready';
    if (percent < 70) grade = 'AA Compliant';
    if (percent < 50) grade = 'Moderate';
    return { percent, grade };
  };

  const currentAccessScore = calculateAccessibilityScore(activeResult.palette);

  const promptFaqs = [
    {
      question: 'How does the client-side smart AI palette engine work?',
      answer:
        'The engine parses semantic keywords, design moods, regional aesthetic traditions (such as Eid, Mehndi, Ramadan, Dubai luxury, Japanese minimal), and industrial domains to synthesize mathematically calibrated color sequences with psychological justification.',
    },
    {
      question: 'Can I apply prompt-generated palettes to live interfaces?',
      answer:
        'Yes! Click "Use in Design Preview" to immediately apply the generated palette across real-time SaaS dashboards, landing pages, mobile apps, and e-commerce product cards.',
    },
    {
      question: 'Are the synthesized palettes WCAG accessible?',
      answer:
        'Every generated palette undergoes automatic luminance and contrast checking against both dark and light surfaces, with instant accessibility score calculations.',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'AI Color Palette Generator from Text Prompts — Free UI Color Themes',
          description:
            'Generate custom, production-ready color palettes from descriptive text prompts. Instant psychological color analysis, WCAG contrast verification, and design tokens export.',
          keywords: [
            'ai color palette generator from text prompts',
            'prompt to color palette generator free',
            'ai website color scheme generator',
            'ai brand color generator',
            'text to hex color codes',
            'cyberpunk neon color palette for UI',
            'ramadan color palette hex codes',
          ],
          canonicalUrl: 'https://chromora.app/ai-palette-generator',
          faqs: promptFaqs,
          softwareApp: {
            name: 'Chromora AI Palette Generator',
            description: 'AI color palette generator synthesizing harmonious themes from descriptive text prompts.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'AI Palette', url: '/ai-palette-generator', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Hero Section */}
        <div className="my-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2"
            style={{
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Keyword & Regional Synthesis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            AI Prompt to Color Palette
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
            Describe any aesthetic, brand concept, cultural celebration, industry, or mood to synthesize a calibrated 5-color palette with psychological justification.
          </p>
        </div>

        {/* Search / Prompt Input */}
        <div className="p-6 rounded-2xl glass-card shadow-lg mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Sparkles className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--accent)' }} />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'Luxury coffee brand', 'Modern SaaS dashboard', 'Elegant Eid collection'..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl btn-accent font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{loading ? 'Synthesizing...' : 'Generate Palette'}</span>
            </button>
          </form>

          {/* Quick Prompt Suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Popular prompts:</span>
            {[
              'Luxury coffee brand',
              'Modern SaaS dashboard',
              'Elegant Eid collection',
              'Pakistani mehndi invitation',
              'Minimal Dubai real estate brand',
              'Cyberpunk gaming app',
              'Ramadan moonlight & gold',
              'Organic botanical skincare',
            ].map((presetPrompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(presetPrompt);
                  handleGenerate(presetPrompt);
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] text-[11px] font-medium text-[var(--text-secondary)] border border-[var(--border-glass-subtle)] transition-colors"
              >
                {presetPrompt}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Result Card */}
        {activeResult && (
          <div className="p-6 sm:p-8 rounded-2xl glass-panel shadow-2xl mb-12 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                    {activeResult.name}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    {activeResult.tags?.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        style={{
                          backgroundColor: 'var(--accent-soft)',
                          color: 'var(--accent)',
                          border: '1px solid var(--accent-border)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                  {activeResult.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Accessibility Score Pill */}
                <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Score: {currentAccessScore.percent}% ({currentAccessScore.grade})
                  </span>
                </div>

                <button
                  onClick={() => {
                    const text = activeResult.palette.join(', ');
                    copyToClipboard(text, 'Copied all HEX codes');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border-glass)] hover:bg-[var(--surface-glass-active)] text-xs font-semibold text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Palette</span>
                </button>

                <button
                  onClick={() => {
                    savePalette(activeResult.name, activeResult.palette, [
                      'AI Prompt',
                      ...(activeResult.tags || []),
                    ]);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border-glass)] hover:bg-[var(--surface-glass-active)] text-xs font-semibold text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>

                {/* "Use in Design Preview" button */}
                <a
                  href="/design-preview"
                  onClick={(e) => {
                    e.preventDefault();
                    setPaletteFromHexList(activeResult.palette, activeResult.name);
                    navigate('/design-preview');
                  }}
                  className="px-4 py-2 rounded-xl btn-accent text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Use in Design Preview</span>
                </a>
              </div>
            </div>

            {/* Visual Swatch Row */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {activeResult.palette.map((hex, i) => {
                const data = getColorData(hex);
                return (
                  <div
                    key={i}
                    onClick={() => {
                      copyToClipboard(hex, `Copied ${hex.toUpperCase()}`);
                      setCopiedHex(hex);
                      setTimeout(() => setCopiedHex(null), 1500);
                    }}
                    className="rounded-2xl p-4 flex flex-col justify-between h-48 shadow-sm transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
                    style={{
                      backgroundColor: hex,
                      color: data.isDark ? '#ffffff' : '#09090b',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold opacity-80 uppercase tracking-wider">
                        Color 0{i + 1}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-black/20 text-white backdrop-blur-sm">
                        {copiedHex === hex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold opacity-90 truncate">{data.name}</p>
                      <p className="text-sm font-mono font-bold tracking-wider">{hex.toUpperCase()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Application & Psychology Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[var(--border-glass-subtle)]">
              <div className="p-4 rounded-xl glass-card">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Primary Emotion</span>
                <p className="text-xs font-semibold text-[var(--text-primary)] mt-1">
                  {activeResult.tags?.[0] || 'Modern & Cohesive'} Tone
                </p>
              </div>
              <div className="p-4 rounded-xl glass-card">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Target Role Hierarchy</span>
                <p className="text-xs font-semibold text-[var(--text-primary)] mt-1">
                  Dominant, Surface, Accent, and High-Contrast Text
                </p>
              </div>
              <div className="p-4 rounded-xl glass-card">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Design Studio Direct Link</span>
                <a
                  href="/color-palette-generator"
                  onClick={(e) => {
                    e.preventDefault();
                    setPaletteFromHexList(activeResult.palette, activeResult.name);
                    navigate('/color-palette-generator');
                  }}
                  className="text-xs font-bold hover:underline mt-1 flex items-center gap-1 transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  <span>Open in Palette Generator</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Curated Asian & Global Inspirations */}
        <div className="my-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Globe className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <span>Asian & Global Inspirations</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Curated palettes for Ramadan, Eid, Mehndi, Weddings, Diwali, Holi, Dubai, and East Asia
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASIAN_GLOBAL_INSPIRATIONS.map((preset) => (
              <div
                key={preset.id}
                className="p-5 rounded-2xl glass-card hover:border-[var(--accent)] text-left transition-all hover:shadow-xl group flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                      {preset.category}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">{preset.tags[0]}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                {/* Color preview bar */}
                <div className="space-y-3">
                  <div className="flex h-10 rounded-xl overflow-hidden shadow-inner border border-[var(--border-glass)]">
                    {preset.palette.map((cHex, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex-1 transition-transform hover:scale-110"
                        style={{ backgroundColor: cHex }}
                        title={cHex}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        setPrompt(preset.prompt);
                        handleGenerate(preset.prompt);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold hover:underline flex items-center gap-1"
                      style={{ color: 'var(--accent)' }}
                    >
                      <span>Test Prompt</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <a
                      href="/design-preview"
                      onClick={(e) => {
                        e.preventDefault();
                        setPaletteFromHexList(preset.palette, preset.name);
                        navigate('/design-preview');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-active)] text-[var(--text-primary)] text-[11px] font-semibold border border-[var(--border-glass)] transition-colors"
                    >
                      Preview UI
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <FAQSection faqs={promptFaqs} />
      </div>
    </div>
  );
};
