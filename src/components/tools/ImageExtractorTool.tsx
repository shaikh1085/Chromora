import React, { useState, useRef, useEffect } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { extractDominantColors, getColorData } from '../../utils/colorUtils';
import {
  Image as ImageIcon,
  UploadCloud,
  Pipette,
  Palette,
  Bookmark,
  Copy,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';

const SAMPLE_IMAGES = [
  {
    name: 'Misty Alpine Lake',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Neon Cyberpunk Shibuya',
    url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Desert Sunset Dunes',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Minimalist Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageExtractorTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const { setPaletteFromHexList, savePalette, copyToClipboard, showToast, setActiveHex } =
    usePalette();

  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_IMAGES[0].url);
  const [isCustomUpload, setIsCustomUpload] = useState(false);
  const [extractedHexes, setExtractedHexes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredPixelColor, setHoveredPixelColor] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Process image on URL change
  useEffect(() => {
    if (!imageUrl) return;
    setLoading(true);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Draw to hidden/preview canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.naturalWidth || 600;
          canvas.height = img.naturalHeight || 400;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }

      // Extract colors asynchronously
      extractDominantColors(imageUrl, 6)
        .then((items) => {
          setExtractedHexes(items.map((i) => i.hex));
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    };

    img.onerror = () => {
      setLoading(false);
      showToast('Image Load Error', 'Could not load the specified image', 'error');
    };
  }, [imageUrl, showToast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please upload a valid JPEG, PNG, or WebP image', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
        setIsCustomUpload(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Eyedropper pixel sampler on canvas mouse move
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
        .toString(16)
        .slice(1)}`;
      setHoveredPixelColor(hex);
    } catch {
      // ignore
    }
  };

  const handleCanvasClick = () => {
    if (hoveredPixelColor) {
      setActiveHex(hoveredPixelColor);
      copyToClipboard(hoveredPixelColor, `Sampled pixel color ${hoveredPixelColor.toUpperCase()}`);
    }
  };

  const extractorFaqs = [
    {
      question: 'How does the client-side color extraction algorithm work?',
      answer:
        'Chromora draws the image to an offscreen HTML5 canvas, downsamples it into a discrete pixel grid, bins color coordinates into 3D RGB cubes, and identifies dominant clusters with high visual variance and harmonious distribution.',
    },
    {
      question: 'Are my uploaded images sent to any remote server?',
      answer:
        'Never. All pixel processing and color clustering runs 100% locally inside your web browser. No photos or pixel buffers ever leave your machine.',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'Image to Color Palette Extractor — Extract HEX & RGB Codes from Photos',
          description:
            'Extract dominant color palettes and color codes from any image or screenshot. Sample individual pixels with a live magnifying eyedropper. 100% private, client-side browser processing.',
          keywords: [
            'extract color palette from image with hex codes',
            'image color picker online eyedropper',
            'get hex codes from photo free',
            'extract colors from screenshot',
            'dominant colors from image generator',
            'picture to color palette converter',
          ],
          canonicalUrl: 'https://chromora.app/image-color-palette',
          faqs: extractorFaqs,
          softwareApp: {
            name: 'Chromora Image Color Extractor',
            description: 'Client-side dominant color extractor and eyedropper tool for images and screenshots.',
            applicationCategory: 'DesignApplication',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Image Color Extractor', url: '/image-color-palette', isCurrent: true }]}
          onNavigate={navigate}
        />

        {/* Page Header */}
        <div className="my-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Server Pixel Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Image Color Palette Extractor
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Extract dominant color harmonies directly from photography, UI screenshots, and artwork.
          </p>
        </div>

        {/* Upload Dropzone & Sample Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Left Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Pipette className="w-3.5 h-3.5 text-emerald-500" />
                <span>Hover image to sample pixels • Click to copy</span>
              </span>
              {hoveredPixelColor && (
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <div
                    className="w-4 h-4 rounded-full border border-white/40"
                    style={{ backgroundColor: hoveredPixelColor }}
                  />
                  <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 uppercase">
                    {hoveredPixelColor}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Canvas */}
            <div className="relative rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center min-h-[300px] max-h-[440px] border border-zinc-200 dark:border-zinc-800 cursor-crosshair">
              {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10 text-white gap-2 text-xs font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting Dominant Tones...</span>
                </div>
              )}
              <canvas
                ref={canvasRef}
                onMouseMove={handleCanvasMouseMove}
                onClick={handleCanvasClick}
                className="max-w-full max-h-[440px] object-contain"
              />
            </div>

            {/* Upload Button */}
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4 text-emerald-500" />
                <span>Upload Your Image</span>
              </button>

              <span className="text-[11px] text-zinc-400">JPG, PNG, WebP up to 25MB</span>
            </div>
          </div>

          {/* Right: Extracted Swatches & Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Extracted Swatches Box */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Extracted Palette
                </h3>
                <span className="text-xs text-zinc-400 font-mono">
                  {extractedHexes.length} colors
                </span>
              </div>

              {/* Swatch List */}
              <div className="space-y-2.5">
                {extractedHexes.map((hex, idx) => {
                  const data = getColorData(hex);
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl shadow-xs border border-black/10 shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                        <div>
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {data.name}
                          </p>
                          <p className="text-[11px] font-mono text-zinc-500 uppercase">{hex}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setActiveHex(hex);
                            copyToClipboard(hex, `Copied ${hex}`);
                          }}
                          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Copy HEX"
                          aria-label={`Copy HEX ${hex}`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary Actions */}
              <div className="pt-3 flex flex-col gap-2">
                <a
                  href="/color-palette-generator"
                  onClick={(e) => {
                    e.preventDefault();
                    setPaletteFromHexList(extractedHexes, 'Image Extraction');
                    navigate('/color-palette-generator');
                  }}
                  className="w-full py-3 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                >
                  <Palette className="w-4 h-4" />
                  <span>Open in Palette Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() =>
                    savePalette('Photo Palette Extraction', extractedHexes, [
                      'Image Extractor',
                      'Dominant',
                    ])
                  }
                  className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save to Collection</span>
                </button>
              </div>
            </div>

            {/* Sample Photography Presets */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                Or try preset photography:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setImageUrl(sample.url);
                      setIsCustomUpload(false);
                    }}
                    className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate transition-colors"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FAQSection
          faqs={extractorFaqs}
          title="Image Palette Extraction Science"
          subtitle="Everything about privacy, pixel sampling, and visual clustering algorithms."
        />
      </div>
    </div>
  );
};
