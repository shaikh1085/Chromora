import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { GradientStop } from '../../types';
import { gradientPresets, generateCssGradient } from '../../data/gradientPresets';
import { getRandomColor, getColorData } from '../../utils/colorUtils';
import {
  Sliders,
  Sparkles,
  Copy,
  Plus,
  Trash2,
  Shuffle,
  Check,
  Compass,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';

export const GradientGeneratorTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { copyToClipboard, showToast } = usePalette();
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<GradientStop[]>([
    { id: '1', color: '#6366f1', position: 0 },
    { id: '2', color: '#a855f7', position: 50 },
    { id: '3', color: '#ec4899', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const cssGradient = generateCssGradient({
    type: gradientType,
    angle,
    stops,
  });

  const handleAddStop = () => {
    if (stops.length >= 6) {
      showToast('Limit Reached', 'Maximum 6 gradient color stops', 'info');
      return;
    }
    const newPos = Math.round((stops[stops.length - 2]?.position || 0) + 15);
    const newStops = [
      ...stops,
      { id: String(Date.now()), color: getRandomColor(), position: Math.min(newPos, 100) },
    ];
    setStops(newStops.sort((a, b) => a.position - b.position));
  };

  const handleRemoveStop = (idx: number) => {
    if (stops.length <= 2) {
      showToast('Minimum Stops', 'A gradient requires at least 2 color stops', 'info');
      return;
    }
    setStops(stops.filter((_, i) => i !== idx));
  };

  const handleUpdateStopColor = (idx: number, color: string) => {
    const next = [...stops];
    next[idx].color = color;
    setStops(next);
  };

  const handleUpdateStopPos = (idx: number, pos: number) => {
    const next = [...stops];
    next[idx].position = pos;
    setStops(next);
  };

  const handleRandomize = () => {
    const count = Math.floor(Math.random() * 2) + 2; // 2 or 3 stops
    const randomAngle = Math.floor(Math.random() * 24) * 15;
    const newStops: GradientStop[] = [];
    for (let i = 0; i < count; i++) {
      newStops.push({
        id: String(i + 1),
        color: getRandomColor(),
        position: Math.round((i / (count - 1)) * 100),
      });
    }
    setAngle(randomAngle);
    setAngle(randomAngle);
    setStops(newStops);
    showToast('Random Gradient Created', `${count} dynamic color stops`, 'info');
  };

  const handleCopyCss = () => {
    const code = `background: ${cssGradient};`;
    copyToClipboard(code, 'Copied CSS Gradient');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gradientFaqs = [
    {
      question: 'How do modern CSS linear and radial gradients render across browsers?',
      answer:
        'Chromora produces standard CSS3 gradients with W3C syntax supported by 100% of modern web browsers without requiring vendor prefixes like -webkit- or -moz-.',
    },
    {
      question: 'How do color stop percentages affect gradient easing?',
      answer:
        'Stops define color anchors along the gradient trajectory. Spacing stops evenly (e.g. 0%, 50%, 100%) produces smooth transitions, while clustering stops tightly creates sharp color bands and glassmorphism highlights.',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'CSS Gradient Generator Online — Linear, Radial & Mesh CSS Code',
          description:
            'Free online CSS gradient generator. Design custom linear, radial, and multi-stop CSS gradients with live preview, visual angle editor, and instant copy-paste CSS code.',
          keywords: [
            'css gradient generator online',
            'linear gradient css generator',
            'radial gradient generator online',
            'gradient background generator css',
            'smooth color gradient maker',
            'modern ui css gradient code',
          ],
          canonicalUrl: 'https://chromora.app/gradient-generator',
          faqs: gradientFaqs,
          softwareApp: {
            name: 'Chromora CSS Gradient Generator',
            description: 'Online CSS gradient designer and visual CSS code generator.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'CSS Gradient Studio', url: '/gradient-generator', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800/60 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CSS3 Visual Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              CSS Gradient Studio & Generator
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Fine-tune linear angles, color stop positions, and copy instant CSS rules.
            </p>
          </div>

          <button
            onClick={handleRandomize}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Shuffle className="w-3.5 h-3.5 text-pink-500" />
            <span>Random Gradient</span>
          </button>
        </div>

        {/* Main Workspace: Live Canvas & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-6">
            {/* Live Gradient Box */}
            <div
              className="w-full h-80 sm:h-96 rounded-2xl shadow-xl border border-black/10 transition-all duration-300 relative flex items-center justify-center p-6"
              style={{ background: cssGradient }}
            >
              <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-mono font-bold shadow-lg">
                {gradientType === 'linear' ? `${angle}° Linear` : 'Radial Center'}
              </div>
            </div>

            {/* Generated CSS Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-pink-500" />
                  <span>Production CSS Code</span>
                </span>
                <button
                  onClick={handleCopyCss}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy CSS'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 font-mono text-xs text-zinc-300 border border-zinc-800 break-all select-all">
                background: {cssGradient};
              </div>
            </div>
          </div>

          {/* Right: Controls & Stops (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            {/* Type & Angle */}
            <div className="space-y-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Gradient Style
                </label>
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => setGradientType('linear')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      gradientType === 'linear'
                        ? 'bg-white dark:bg-zinc-800 text-pink-600 dark:text-pink-400 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    Linear
                  </button>
                  <button
                    onClick={() => setGradientType('radial')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      gradientType === 'radial'
                        ? 'bg-white dark:bg-zinc-800 text-pink-600 dark:text-pink-400 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    Radial
                  </button>
                </div>
              </div>

              {gradientType === 'linear' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>Angle Direction</span>
                    <span className="font-mono text-pink-500">{angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 pt-1">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setAngle(deg)}
                        className={`hover:text-pink-500 ${angle === deg ? 'font-bold text-pink-500' : ''}`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color Stops Manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Color Stops ({stops.length}/6)
                </label>
                <button
                  onClick={handleAddStop}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stop</span>
                </button>
              </div>

              {/* Stop Items */}
              <div className="space-y-3">
                {stops.map((stop, idx) => {
                  const data = getColorData(stop.color);
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 shrink-0">
                            <div
                              className="w-full h-full"
                              style={{ backgroundColor: stop.color }}
                            />
                            <input
                              type="color"
                              value={stop.color}
                              onChange={(e) => handleUpdateStopColor(idx, e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              aria-label={`Color for stop ${idx + 1}`}
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {data.name}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-400 uppercase">
                              {stop.color}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                            {stop.position}%
                          </span>
                          <button
                            onClick={() => handleRemoveStop(idx)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-500 transition-colors"
                            title="Remove color stop"
                            aria-label={`Remove color stop ${idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) => handleUpdateStopPos(idx, Number(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer h-1.5"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Curated Preset Gradient Gallery */}
        <div className="my-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Curated Gradient Presets
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Click any preset to load into the gradient editor
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {gradientPresets.map((preset, idx) => {
              const bg = generateCssGradient(preset.config);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setGradientType(preset.config.type);
                    setAngle(preset.config.angle);
                    setStops(preset.config.stops);
                    showToast('Loaded Preset', preset.name, 'success');
                  }}
                  className="flex flex-col rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 text-left transition-all hover:scale-105 group shadow-sm"
                >
                  <div className="h-28 w-full transition-transform" style={{ background: bg }} />
                  <div className="p-3 bg-white dark:bg-zinc-900 flex flex-col">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 capitalize">
                      {preset.category} • {preset.config.stops.length} stops
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <FAQSection
          faqs={gradientFaqs}
          title="CSS Gradient Best Practices"
          subtitle="Tips on color transitions, easing, performance, and accessibility."
        />
      </div>
    </div>
  );
};
