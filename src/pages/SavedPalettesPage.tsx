import React, { useState, useRef } from 'react';
import { usePalette } from '../context/PaletteContext';
import {
  Bookmark,
  Trash2,
  Edit2,
  Star,
  Download,
  Upload,
  Palette,
  Layout,
  Copy,
  Plus,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const SavedPalettesPage: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const {
    savedPalettes,
    deleteSavedPalette,
    renameSavedPalette,
    toggleFavoritePalette,
    exportAllPalettesJson,
    importPalettesJson,
    setPaletteFromHexList,
    copyToClipboard,
    setIsPreviewModalOpen,
    savePalette,
  } = usePalette();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      renameSavedPalette(id, editingName);
    }
    setEditingId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        importPalettesJson(event.target.result);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: `Saved Palettes Collection (${savedPalettes.length}) — Chromora`,
          description:
            'Manage, export, and organize your saved color palettes and design system tokens.',
          canonicalUrl: 'https://chromoraflow.vercel.app/saved-palettes',
          robots: 'noindex, follow',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Saved Palettes', url: '/saved-palettes', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Workspace Palette Vault</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Saved Color Collections
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Locally stored palettes with seamless JSON backup, export, and preview options.
            </p>
          </div>

          {/* Top Backup Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-hover)] text-xs font-bold text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            <button
              onClick={exportAllPalettesJson}
              className="px-3.5 py-2 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-card)] hover:bg-[var(--surface-glass-hover)] text-xs font-bold text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <a
              href="/color-palette-generator"
              onClick={(e) => {
                e.preventDefault();
                navigate('/color-palette-generator');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New</span>
            </a>
          </div>
        </div>

        {/* Palettes List */}
        {savedPalettes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {savedPalettes.map((palette) => (
              <div
                key={palette.id}
                className="bg-[var(--surface-glass-card)] rounded-2xl border border-[var(--border-glass)] p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  {/* Top Bar with Name & Actions */}
                  <div className="flex items-center justify-between mb-3">
                    {editingId === palette.id ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(palette.id)}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-[var(--border-glass)] bg-[var(--surface-glass-input)] text-[var(--text-primary)]"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(palette.id)}
                          className="text-xs px-2 py-1 bg-indigo-600 text-white rounded-md font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1 truncate">
                        <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                          {palette.name}
                        </h3>
                        <button
                          onClick={() => handleStartRename(palette.id, palette.name)}
                          className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                          title="Rename palette"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleFavoritePalette(palette.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          palette.isFavorite
                            ? 'text-amber-500 bg-amber-500/10'
                            : 'text-[var(--text-muted)] hover:text-amber-500'
                        }`}
                        title="Favorite"
                      >
                        <Star className={`w-3.5 h-3.5 ${palette.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => deleteSavedPalette(palette.id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete palette"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Swatches strip */}
                  <div className="flex h-16 rounded-xl overflow-hidden shadow-inner border border-[var(--border-glass-subtle)]">
                    {palette.colors.map((hex, idx) => (
                      <div
                        key={idx}
                        onClick={() => copyToClipboard(hex, `Copied ${hex}`)}
                        className="flex-1 h-full cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: hex }}
                        title={`Click to copy ${hex}`}
                      />
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-3">
                    {palette.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--surface-glass-hover)] border border-[var(--border-glass-subtle)] px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-[var(--border-glass-subtle)] flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      copyToClipboard(palette.colors.join(', '), 'Copied all HEX codes');
                    }}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Copy all HEX codes"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy HEX</span>
                  </button>

                  <a
                    href="/color-palette-generator"
                    onClick={(e) => {
                      e.preventDefault();
                      setPaletteFromHexList(palette.colors, palette.name);
                      navigate('/color-palette-generator');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1"
                  >
                    <span>Open in Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center rounded-3xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] mb-16 space-y-4 backdrop-blur-md">
            <Bookmark className="w-10 h-10 mx-auto text-[var(--text-muted)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              No saved palettes yet
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              Save color harmonies from the Palette Generator, AI Prompt engine, or Image Extractor to build your custom library.
            </p>
            <a
              href="/color-palette-generator"
              onClick={(e) => {
                e.preventDefault();
                navigate('/color-palette-generator');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 inline-block text-center"
            >
              Start Generating Colors
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
