import JSZip from 'jszip';

export interface FaviconConfig {
  sourceType: 'text' | 'image' | 'color';
  text: string;
  fontFamily: string;
  textColor: string;
  bgColor: string;
  bgSecondaryColor?: string;
  gradientType: 'solid' | 'linear' | 'radial';
  shape: 'circle' | 'rounded' | 'square' | 'squircle';
  fontSize: number; // percentage 10 - 100
  imageSrc?: string;
  borderRadius: number; // percentage 0 - 50
  padding: number; // percentage 0 - 40
}

export interface GeneratedIconAsset {
  name: string;
  size: number;
  dataUrl: string;
  blob: Blob;
}

/**
 * Render favicon canvas to specified size
 */
export async function renderFaviconToCanvas(
  config: FaviconConfig,
  targetSize: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.clearRect(0, 0, targetSize, targetSize);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const w = targetSize;
  const h = targetSize;

  // 1. Draw shape clipping path
  ctx.save();
  ctx.beginPath();
  let radius = 0;
  if (config.shape === 'circle') {
    radius = w / 2;
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
  } else if (config.shape === 'rounded' || config.shape === 'squircle') {
    radius = (w * (config.shape === 'squircle' ? 0.28 : (config.borderRadius || 20))) / 100;
    if (ctx.roundRect) {
      ctx.roundRect(0, 0, w, h, radius);
    } else {
      ctx.rect(0, 0, w, h);
    }
  } else {
    ctx.rect(0, 0, w, h);
  }
  ctx.clip();

  // 2. Draw Background
  if (config.gradientType === 'linear' && config.bgSecondaryColor) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, config.bgColor);
    grad.addColorStop(1, config.bgSecondaryColor);
    ctx.fillStyle = grad;
  } else if (config.gradientType === 'radial' && config.bgSecondaryColor) {
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grad.addColorStop(0, config.bgColor);
    grad.addColorStop(1, config.bgSecondaryColor);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = config.bgColor;
  }
  ctx.fillRect(0, 0, w, h);

  // 3. Draw Content (Text, Image, or Color Swatch)
  if (config.sourceType === 'image' && config.imageSrc) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const pad = (w * (config.padding || 0)) / 100;
        const drawW = w - pad * 2;
        const drawH = h - pad * 2;
        ctx.drawImage(img, pad, pad, drawW, drawH);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = config.imageSrc!;
    });
  } else if (config.sourceType === 'text') {
    const fontPx = Math.round((w * (config.fontSize || 55)) / 100);
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${fontPx}px "${config.fontFamily || 'Inter'}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText(config.text || 'A', w / 2, h / 2 + fontPx * 0.04);
  }

  ctx.restore();
  return canvas;
}

/**
 * Convert HTMLCanvas to PNG Blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas blob generation failed'));
    }, 'image/png');
  });
}

/**
 * Generate standard multi-image ICO binary buffer from 16x16 and 32x32 PNG blobs
 */
export async function createIcoBlob(png16Blob: Blob, png32Blob: Blob): Promise<Blob> {
  const buf16 = await png16Blob.arrayBuffer();
  const buf32 = await png32Blob.arrayBuffer();

  const numImages = 2;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dataOffset = headerSize + dirEntrySize * numImages;

  const totalSize = dataOffset + buf16.byteLength + buf32.byteLength;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // ICO Header
  view.setUint16(0, 0, true); // Reserved (0)
  view.setUint16(2, 1, true); // Type: 1 = ICO
  view.setUint16(4, numImages, true); // Number of images

  let currentOffset = dataOffset;

  // Entry 1: 16x16
  view.setUint8(6, 16); // Width
  view.setUint8(7, 16); // Height
  view.setUint8(8, 0); // Palette count
  view.setUint8(9, 0); // Reserved
  view.setUint16(10, 1, true); // Color planes
  view.setUint16(12, 32, true); // Bits per pixel
  view.setUint32(14, buf16.byteLength, true); // Image size
  view.setUint32(18, currentOffset, true); // Data offset

  // Write 16x16 PNG data
  new Uint8Array(buffer, currentOffset, buf16.byteLength).set(new Uint8Array(buf16));
  currentOffset += buf16.byteLength;

  // Entry 2: 32x32
  view.setUint8(22, 32); // Width
  view.setUint8(23, 32); // Height
  view.setUint8(24, 0); // Palette count
  view.setUint8(25, 0); // Reserved
  view.setUint16(26, 1, true); // Color planes
  view.setUint16(28, 32, true); // Bits per pixel
  view.setUint32(30, buf32.byteLength, true); // Image size
  view.setUint32(34, currentOffset, true); // Data offset

  // Write 32x32 PNG data
  new Uint8Array(buffer, currentOffset, buf32.byteLength).set(new Uint8Array(buf32));

  return new Blob([buffer], { type: 'image/x-icon' });
}

/**
 * Generate site.webmanifest JSON content
 */
export function generateWebManifest(appName = 'My Web App', themeColor = '#ffffff'): string {
  return JSON.stringify(
    {
      name: appName,
      short_name: appName,
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      theme_color: themeColor,
      background_color: '#ffffff',
      display: 'standalone',
    },
    null,
    2
  );
}

/**
 * Generate HTML snippet for <head>
 */
export function generateHtmlSnippet(themeColor = '#ffffff'): string {
  return `<!-- Favicon Package by Chromora -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${themeColor}">`;
}

/**
 * Package all favicon files into a downloadable ZIP archive
 */
export async function createFaviconZipArchive(
  config: FaviconConfig,
  appName = 'My Web App'
): Promise<Blob> {
  const zip = new JSZip();

  // Generate all standard sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  let blob16: Blob | null = null;
  let blob32: Blob | null = null;

  for (const item of sizes) {
    const canvas = await renderFaviconToCanvas(config, item.size);
    const blob = await canvasToBlob(canvas);
    zip.file(item.name, blob);
    if (item.size === 16) blob16 = blob;
    if (item.size === 32) blob32 = blob;
  }

  // Generate ICO
  if (blob16 && blob32) {
    const icoBlob = await createIcoBlob(blob16, blob32);
    zip.file('favicon.ico', icoBlob);
  }

  // Add webmanifest
  zip.file('site.webmanifest', generateWebManifest(appName, config.bgColor));

  // Add README HTML snippet instructions
  const readme = `# Favicon Package
Generated via Chromora Favicon Generator

## Installation Instructions:
1. Place all icon files in your web project's public root directory (e.g. /public or /dist).
2. Copy and paste the following snippet into the <head> section of your index.html:

${generateHtmlSnippet(config.bgColor)}
`;
  zip.file('README.md', readme);

  return await zip.generateAsync({ type: 'blob' });
}
