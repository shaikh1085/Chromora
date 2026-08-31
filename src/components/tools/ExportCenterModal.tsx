import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
  X,
  Copy,
  Check,
  Download,
  Code2,
  FileJson,
  Palette,
  Sparkles,
  Smartphone,
  Layers,
} from 'lucide-react';
import { getColorData } from '../../utils/colorUtils';

type ExportFormat = 'css' | 'tailwind' | 'json' | 'scss' | 'flutter' | 'react-native' | 'svg';

export const ExportCenterModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, paletteColors, copyToClipboard, showToast } =
    usePalette();
  const [activeTab, setActiveTab] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);

  if (!isExportModalOpen) return null;

  const toCamelCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  };

  const colorItems = paletteColors.map((c, i) => {
    const data = getColorData(c.hex);
    const safeName = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const camelName = toCamelCase(c.name) || `color${i + 1}`;
    const cleanHex = c.hex.replace('#', '').toUpperCase();
    return {
      index: i + 1,
      hex: c.hex,
      cleanHex,
      name: c.name,
      slug: safeName,
      camelName,
      rgb: `${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b}`,
      hsl: `${data.hsl.h}, ${data.hsl.s}%, ${data.hsl.l}%`,
    };
  });

  // 1. CSS Custom Properties
  const cssCode = `:root {
${colorItems.map((c) => `  --color-${c.slug}: ${c.hex}; /* ${c.name} */`).join('\n')}
${colorItems.map((c) => `  --color-${c.slug}-rgb: ${c.rgb};`).join('\n')}
}`;

  // 2. Tailwind Config
  const tailwindCode = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        chromora: {
${colorItems.map((c) => `          '${c.slug}': '${c.hex}', // ${c.name}`).join('\n')}
        }
      }
    }
  }
};`;

  // 3. JSON Design Tokens (W3C format)
  const jsonTokens = JSON.stringify(
    {
      name: 'Chromora Palette Tokens',
      version: '1.0.0',
      color: colorItems.reduce((acc, c) => {
        acc[c.slug] = {
          value: c.hex,
          type: 'color',
          description: c.name,
          extensions: {
            rgb: `rgb(${c.rgb})`,
            hsl: `hsl(${c.hsl})`,
          },
        };
        return acc;
      }, {} as Record<string, unknown>),
    },
    null,
    2
  );

  // 4. SCSS Variables
  const scssCode = `// SCSS Color Palette
${colorItems.map((c) => `$color-${c.slug}: ${c.hex}; // ${c.name}`).join('\n')}
${colorItems.map((c) => `$color-${c.slug}-rgb: rgb(${c.rgb});`).join('\n')}`;

  // 5. Flutter Color Constants
  const flutterCode = `// Flutter Material Color Constants
import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

${colorItems
  .map(
    (c) =>
      `  /// ${c.name} (${c.hex})\n  static const Color ${c.camelName} = Color(0xFF${c.cleanHex});`
  )
  .join('\n\n')}
}`;

  // 6. React Native Color Object
  const reactNativeCode = `// React Native / TypeScript Color Theme
export const AppColors = {
${colorItems.map((c) => `  ${c.camelName}: '${c.hex}', // ${c.name}`).join('\n')}
} as const;

export type AppColorKey = keyof typeof AppColors;`;

  // 7. SVG Palette Swatch
  const generateSvg = () => {
    const width = 600;
    const height = 140;
    const swatchWidth = width / colorItems.length;
    const rects = colorItems
      .map(
        (c, i) =>
          `<rect x="${i * swatchWidth}" y="0" width="${swatchWidth}" height="${height}" fill="${
            c.hex
          }" />
           <text x="${i * swatchWidth + 12}" y="${height - 35}" fill="${
            getColorData(c.hex).isDark ? '#ffffff' : '#09090b'
          }" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">${c.hex.toUpperCase()}</text>
           <text x="${i * swatchWidth + 12}" y="${height - 18}" fill="${
            getColorData(c.hex).isDark ? '#ffffff' : '#09090b'
          }" opacity="0.8" font-family="system-ui, sans-serif" font-size="10">${c.name}</text>`
      )
      .join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${rects}
</svg>`;
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case 'css':
        return cssCode;
      case 'tailwind':
        return tailwindCode;
      case 'json':
        return jsonTokens;
      case 'scss':
        return scssCode;
      case 'flutter':
        return flutterCode;
      case 'react-native':
        return reactNativeCode;
      case 'svg':
        return generateSvg();
    }
  };

  const handleCopy = () => {
    copyToClipboard(getActiveCode(), `Copied ${activeTab.toUpperCase()} to clipboard`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getActiveCode();
    let ext = 'css';
    let mime = 'text/css';

    if (activeTab === 'tailwind') {
      ext = 'js';
      mime = 'application/javascript';
    } else if (activeTab === 'json') {
      ext = 'json';
      mime = 'application/json';
    } else if (activeTab === 'scss') {
      ext = 'scss';
      mime = 'text/x-scss';
    } else if (activeTab === 'flutter') {
      ext = 'dart';
      mime = 'text/x-dart';
    } else if (activeTab === 'react-native') {
      ext = 'ts';
      mime = 'application/typescript';
    } else if (activeTab === 'svg') {
      ext = 'svg';
      mime = 'image/svg+xml';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chromora-palette.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded chromora-palette.${ext}`, 'success');
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonTokens], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chromora-tokens.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded chromora-tokens.json`, 'success');
  };

  const tabs: { id: ExportFormat; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'css', label: 'CSS Variables', icon: Code2 },
    { id: 'tailwind', label: 'Tailwind CSS', icon: Palette },
    { id: 'json', label: 'JSON Tokens', icon: FileJson },
    { id: 'flutter', label: 'Flutter Dart', icon: Smartphone },
    { id: 'react-native', label: 'React Native', icon: Layers },
    { id: 'scss', label: 'SCSS / SASS', icon: Code2 },
    { id: 'svg', label: 'SVG Swatch', icon: Download },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-3xl glass-modal rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border border-[var(--border-glass)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-glass-subtle)]">
          <div>
            <h3 id="modal-title" className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[var(--accent)]" />
              <span>Developer Export Studio</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Export production color design tokens, Flutter classes, and Tailwind configurations
            </p>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] transition-colors"
            aria-label="Close export dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-[var(--surface-glass)] border-b border-[var(--border-glass-subtle)] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isTabActive
                    ? 'shadow-xs border border-[var(--accent-border)]'
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

        {/* Code Body */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-[var(--text-primary)] bg-[var(--surface-glass-card)]">
          <pre className="p-4 rounded-2xl bg-[var(--surface-glass-input)] border border-[var(--border-glass)] overflow-x-auto leading-relaxed select-all">
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-t border-[var(--border-glass-subtle)] bg-[var(--surface-glass)] gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
            <span>{paletteColors.length} colors prepared for export</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="px-3.5 py-2 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-card)] hover:border-[var(--accent-border)] text-xs font-semibold text-[var(--text-primary)] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <FileJson className="w-3.5 h-3.5 text-amber-500" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-card)] hover:border-[var(--accent-border)] text-xs font-semibold text-[var(--text-primary)] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl btn-accent font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied All!' : 'Copy All Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
