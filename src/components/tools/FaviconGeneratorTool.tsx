import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { useI18n } from '../../context/I18nContext';
import { getColorData } from '../../utils/colorUtils';
import {
  FaviconConfig,
  renderFaviconToCanvas,
  createFaviconZipArchive,
  generateHtmlSnippet,
  generateWebManifest,
} from '../../utils/faviconUtils';
import {
  Download,
  Upload,
  Image as ImageIcon,
  Type,
  Copy,
  Check,
  Sparkles,
  Layers,
  Code,
  Globe,
  Smartphone,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Palette,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { FAQItem, SEOConfig } from '../../types';
import { RecentColorsBar } from '../common/RecentColorsBar';

export const FaviconGeneratorTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { copyToClipboard, showToast, activeHex, setActiveHex, addRecentColor } = usePalette();
  const { t } = useI18n();

  const [config, setConfig] = useState<FaviconConfig>({
    sourceType: 'text',
    text: 'C',
    fontFamily: 'Inter',
    textColor: '#ffffff',
    bgColor: '#6366f1',
    bgSecondaryColor: '#a855f7',
    gradientType: 'linear',
    shape: 'rounded',
    fontSize: 55,
    borderRadius: 22,
    padding: 10,
  });

  const [appName, setAppName] = useState('My Brand');
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-render preview canvas whenever config changes
  useEffect(() => {
    let isMounted = true;
    renderFaviconToCanvas(config, 180).then((canvas) => {
      if (isMounted) {
        setPreviewDataUrl(canvas.toDataURL('image/png'));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [config]);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please upload a PNG, JPG, or SVG image', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setConfig((prev) => ({
          ...prev,
          sourceType: 'image',
          imageSrc: e.target?.result as string,
        }));
        showToast('Image Loaded into Favicon Maker', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadZip = async () => {
    try {
      setIsGeneratingZip(true);
      showToast('Generating Favicon Package...', 'info');
      const zipBlob = await createFaviconZipArchive(config, appName);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `favicon-package-${appName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'app'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Favicon Package Downloaded', 'success');
    } catch (err) {
      showToast('Download Failed', 'Could not generate archive', 'error');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleCopyHtml = () => {
    const snippet = generateHtmlSnippet(config.bgColor);
    copyToClipboard(snippet);
    setCopiedSnippet(true);
    showToast('Copied HTML Head Snippet', 'success');
    setTimeout(() => setCopiedSnippet(false), 1500);
  };

  const faviconFaqs: FAQItem[] = [
    {
      question: 'What sizes and formats are required for modern website favicons in 2025?',
      answer:
        'A complete modern favicon suite requires: a legacy multi-size favicon.ico (containing 16x16 and 32x32), high-DPI PNGs (16x16 and 32x32), an Apple Touch Icon (180x180 for iOS Home Screen bookmarking), Android Chrome Web App icons (192x192 and 512x512), and a site.webmanifest JSON file.',
    },
    {
      question: 'Why should I use both PNG and .ICO favicon files?',
      answer:
        'While modern browsers support PNG favicons, legacy desktop browsers, RSS readers, bookmarking tools, and Windows taskbars specifically query /favicon.ico at the root domain. Providing both ensures universal zero-404 compatibility across all desktop, tablet, and mobile platforms.',
    },
    {
      question: 'Where should I upload the downloaded favicon ZIP files in my web project?',
      answer:
        'Extract the downloaded ZIP package and place all image files (favicon.ico, apple-touch-icon.png, android-chrome-*.png, site.webmanifest) directly in the public root directory of your web application (such as /public in Vite, Next.js, or React).',
    },
    {
      question: 'How do search engines like Google use website favicons?',
      answer:
        'Google Search displays website favicons alongside organic search result snippets on mobile and desktop devices. Google recommends a multiple of 48px square (e.g. 48x48, 96x96, 144x144, 192x192) with high contrast so your brand icon remains crisp in tiny 16px search snippets.',
    },
    {
      question: 'Can I generate an emoji or letter favicon?',
      answer:
        'Yes! Switch to "Text / Emoji" mode and type any letter, initial, symbol, or emoji (e.g., 🚀, ⚡, 💎, or your brand initial). Customize the background gradient, typography, padding, and corner rounding with live real-time preview.',
    },
  ];

  const seoConfig: SEOConfig = {
    title: 'Favicon Generator: Create ICO, PNG & Apple Touch Icons Free',
    description:
      'Free online favicon generator. Convert text, emojis, or logos into favicon.ico, 180x180 Apple Touch Icons, and site.webmanifest with instant ZIP download.',
    canonicalUrl: 'https://chromora.app/favicon-generator',
    keywords: [
      'favicon generator',
      'favicon maker',
      'ico generator',
      'create favicon online',
      'apple touch icon generator',
      'webmanifest generator',
      'favicon zip download',
      'convert png to ico',
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://chromora.app/' },
      { name: 'Favicon Generator', url: 'https://chromora.app/favicon-generator' },
    ],
    faqs: faviconFaqs,
    softwareApp: {
      name: 'Chromora Favicon & App Icon Generator',
      description: 'Production-ready web favicon package generator supporting multi-size ICO, Apple Touch Icons, and Web App Manifests.',
      applicationCategory: 'DesignApplication',
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO config={seoConfig} />

      <Breadcrumbs
        items={[{ name: 'Tools', url: '/color-picker' }, { name: 'Favicon Generator', url: '/favicon-generator', isCurrent: true }]}
        onNavigate={navigate}
      />

      {/* Hero Header */}
      <div className="my-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>Production-Ready Favicon & Web Manifest Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Favicon Generator & App Icon Maker
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Create complete production favicon suites for desktop browsers, iOS Apple Touch Icons, and Android PWA manifests from text, emojis, or uploaded logos.
        </p>
      </div>

      {/* Recent Colors Cross-Tool Bar */}
      <RecentColorsBar
        navigate={navigate}
        onSelectColor={(hex) => {
          setConfig((prev) => ({ ...prev, bgColor: hex }));
          setActiveHex(hex);
        }}
        className="mb-8"
      />

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
        {/* Left Column: Generator Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl space-y-6">
            {/* Source Type Selector */}
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                Favicon Source Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, sourceType: 'text' }))}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all border ${
                    config.sourceType === 'text'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>Text / Initial / Emoji</span>
                </button>

                <button
                  onClick={() => {
                    setConfig((prev) => ({ ...prev, sourceType: 'image' }));
                    if (!config.imageSrc) fileInputRef.current?.click();
                  }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all border ${
                    config.sourceType === 'image'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Custom Image</span>
                </button>
              </div>
            </div>

            {/* If Text Mode: Text Input & Font */}
            {config.sourceType === 'text' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Text / Initial / Emoji
                  </label>
                  <input
                    type="text"
                    value={config.text}
                    maxLength={4}
                    onChange={(e) => setConfig((prev) => ({ ...prev, text: e.target.value }))}
                    placeholder="e.g. C or ⚡"
                    className="w-full px-4 py-2.5 rounded-xl font-bold text-center text-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, textColor: e.target.value }))}
                      className="w-11 h-11 rounded-xl cursor-pointer border p-0.5 bg-zinc-100 dark:bg-zinc-800"
                    />
                    <input
                      type="text"
                      value={config.textColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, textColor: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl font-mono text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* If Image Mode: Upload Button */}
            {config.sourceType === 'image' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center justify-center gap-3 transition-colors text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  <Upload className="w-4 h-4 text-indigo-500" />
                  <span>
                    {config.imageSrc ? 'Replace Uploaded Image' : 'Select Image File (PNG, SVG, JPG)'}
                  </span>
                </button>
              </div>
            )}

            {/* Background Colors & Gradient Settings */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Background Style
                </label>
                <div className="flex gap-1.5">
                  {(['solid', 'linear', 'radial'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setConfig((prev) => ({ ...prev, gradientType: type }))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                        config.gradientType === type
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Primary Background Color
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, bgColor: e.target.value }))}
                      className="w-10 h-10 rounded-xl cursor-pointer border p-0.5"
                    />
                    <input
                      type="text"
                      value={config.bgColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, bgColor: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl font-mono text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 uppercase"
                    />
                  </div>
                </div>

                {config.gradientType !== 'solid' && (
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Secondary Gradient Color
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.bgSecondaryColor || '#a855f7'}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, bgSecondaryColor: e.target.value }))
                        }
                        className="w-10 h-10 rounded-xl cursor-pointer border p-0.5"
                      />
                      <input
                        type="text"
                        value={config.bgSecondaryColor || '#a855f7'}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, bgSecondaryColor: e.target.value }))
                        }
                        className="flex-1 px-3 py-2 rounded-xl font-mono text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shape & Corner Geometry */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                Shape & Clipping Boundary
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { id: 'rounded', label: 'Rounded' },
                    { id: 'squircle', label: 'Squircle (iOS)' },
                    { id: 'circle', label: 'Circle' },
                    { id: 'square', label: 'Square' },
                  ] as const
                ).map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => setConfig((prev) => ({ ...prev, shape: shape.id }))}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                      config.shape === shape.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>

            {/* App Branding Name for Web Manifest */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                App / Website Name (For site.webmanifest)
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="My Brand"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="w-full py-4 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>{isGeneratingZip ? 'Packaging ZIP Archive...' : 'Download Complete Favicon ZIP Package'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Contextual Previews */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Large Render Preview Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl text-center">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
              Master 180x180 Icon Output
            </h3>
            <div className="w-36 h-36 mx-auto rounded-3xl p-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-inner mb-4">
              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="Favicon master preview"
                  className="w-full h-full object-contain rounded-2xl shadow-md"
                />
              ) : (
                <div className="w-full h-full animate-pulse bg-zinc-300 dark:bg-zinc-800 rounded-2xl" />
              )}
            </div>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{appName}</p>
          </div>

          {/* Context 1: Desktop Browser Tab Preview */}
          <div className="p-4 rounded-2xl bg-zinc-900 text-white border border-zinc-800 shadow-lg space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Desktop Chrome / Safari Browser Tab
            </span>
            <div className="bg-zinc-800/90 rounded-xl p-2.5 flex items-center gap-2 border border-zinc-700/60">
              <div className="flex gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 bg-zinc-900 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-zinc-700">
                {previewDataUrl && (
                  <img src={previewDataUrl} alt="tab icon" className="w-4 h-4 rounded-xs shrink-0" />
                )}
                <span className="text-xs font-medium text-zinc-200 truncate">
                  {appName} — Official Website
                </span>
              </div>
            </div>
          </div>

          {/* Context 2: Google Search Snippet Preview */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-2 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Google Search Result Snippet
            </span>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700 shrink-0 flex items-center justify-center">
                {previewDataUrl && <img src={previewDataUrl} alt="SERP icon" className="w-5 h-5 rounded-full" />}
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  {appName}
                </span>
                <span className="text-[11px] text-zinc-400">
                  https://www.yourdomain.com
                </span>
              </div>
            </div>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              {appName}: High-Performance Modern Web Platform
            </p>
          </div>

          {/* Context 3: iOS Home Screen Bookmark Preview */}
          <div className="p-4 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-lg flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 p-1 border border-zinc-800 shrink-0 shadow-md">
              {previewDataUrl && (
                <img src={previewDataUrl} alt="iOS bookmark" className="w-full h-full object-cover rounded-xl" />
              )}
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                Apple iOS Home Screen
              </span>
              <span className="text-xs font-bold text-zinc-100 block">{appName}</span>
              <p className="text-[11px] text-zinc-400">180x180 Apple Touch Icon Standard</p>
            </div>
          </div>
        </div>
      </div>

      {/* HTML Code Snippet Embed Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 text-zinc-200 border border-zinc-800 shadow-2xl mb-14">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-zinc-100">
              HTML &lt;head&gt; Embed Code
            </h3>
          </div>
          <button
            onClick={handleCopyHtml}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5 shadow-md"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSnippet ? 'Copied to Clipboard' : 'Copy Snippet'}</span>
          </button>
        </div>

        <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300">
          {generateHtmlSnippet(config.bgColor)}
        </pre>
      </div>

      {/* Related Tools Links */}
      <div className="my-12 p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Explore Related Design Asset Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/gradient-generator"
            onClick={(e) => {
              e.preventDefault();
              navigate('/gradient-generator');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>CSS Gradient Generator</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Create smooth linear and radial background gradients for icons.
            </p>
          </a>

          <a
            href="/color-shades-generator"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-shades-generator');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>Shades & Tints Generator</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Generate 10-step tonal scales for brand icon tokens.
            </p>
          </a>

          <a
            href="/contrast-checker"
            onClick={(e) => {
              e.preventDefault();
              navigate('/contrast-checker');
            }}
            className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors block group"
          >
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
              <span>WCAG Contrast Checker</span>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Ensure high icon legibility against dark and light browser backgrounds.
            </p>
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection
        faqs={faviconFaqs}
        title="Favicon & Web App Icon Standards FAQ"
        subtitle="Learn how to configure multi-resolution browser favicons, Apple Touch Icons, and PWA manifest assets."
      />
    </div>
  );
};
