import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 implementation for standard PNG chunks
function createCRC32Table(): Uint32Array {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c >>> 0;
  }
  return table;
}

const CRC_TABLE = createCRC32Table();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(typeStr: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(typeStr, 'ascii');
  const len = data.length;
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(len, 0);

  const typeAndData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(typeAndData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

function generatePng(
  width: number,
  height: number,
  pixelShader: (x: number, y: number) => [number, number, number, number]
): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA (color type 6)
  ihdrData.writeUInt8(0, 10); // Deflate
  ihdrData.writeUInt8(0, 11); // Filter method 0
  ihdrData.writeUInt8(0, 12); // No interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image scanlines with 0 filter byte per line
  const rawScanlines = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawScanlines.writeUInt8(0, offset++); // Filter byte: 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelShader(x, y);
      rawScanlines.writeUInt8(Math.max(0, Math.min(255, Math.round(r))), offset++);
      rawScanlines.writeUInt8(Math.max(0, Math.min(255, Math.round(g))), offset++);
      rawScanlines.writeUInt8(Math.max(0, Math.min(255, Math.round(b))), offset++);
      rawScanlines.writeUInt8(Math.max(0, Math.min(255, Math.round(a))), offset++);
    }
  }

  const compressedData = zlib.deflateSync(rawScanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate public/logo.svg and public/favicon.svg
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="chromoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="128" fill="#09090b" />
  <rect x="64" y="64" width="384" height="384" rx="96" fill="url(#chromoraGrad)" filter="url(#glow)" />
  <rect x="96" y="96" width="320" height="320" rx="72" fill="#09090b" />
  <circle cx="256" cy="256" r="88" fill="url(#chromoraGrad)" />
  <circle cx="256" cy="256" r="48" fill="#ffffff" />
</svg>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#09090b" />
  <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#favGrad)" />
  <circle cx="32" cy="32" r="14" fill="#09090b" />
  <circle cx="32" cy="32" r="7" fill="#ffffff" />
</svg>`;

// Helper for linear color interpolation
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// 1. Generate public/logo.png (512x512 with transparent background / dark rounded icon)
const logoPng = generatePng(512, 512, (x, y) => {
  const cx = 256;
  const cy = 256;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Outer rounded box (radius 110)
  const nx = Math.abs(x - 256);
  const ny = Math.abs(y - 256);
  const inOuter = nx < 230 && ny < 230;

  if (!inOuter) return [0, 0, 0, 0];

  const t = (x + y) / 1024;
  // Gradient from Indigo (#4f46e5) to Pink (#ec4899) to Cyan (#06b6d4)
  let r = lerp(79, 236, t * 1.5);
  let g = lerp(70, 72, t * 1.5);
  let b = lerp(229, 153, t * 1.5);
  if (t > 0.5) {
    const t2 = (t - 0.5) * 2;
    r = lerp(236, 6, t2);
    g = lerp(72, 182, t2);
    b = lerp(153, 212, t2);
  }

  // Inner cutout
  if (dist < 180 && dist > 110) {
    return [15, 23, 42, 255]; // Dark slate ring
  }
  if (dist <= 110 && dist > 55) {
    return [r, g, b, 255]; // Vivid gradient circle
  }
  if (dist <= 55) {
    return [255, 255, 255, 255]; // Center white pupil
  }

  return [r, g, b, 255];
});

// 2. Generate public/favicon.png (64x64)
const faviconPng = generatePng(64, 64, (x, y) => {
  const cx = 32;
  const cy = 32;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (Math.abs(x - 32) > 28 || Math.abs(y - 32) > 28) {
    return [0, 0, 0, 0];
  }

  const t = (x + y) / 128;
  const r = lerp(79, 236, t);
  const g = lerp(70, 72, t);
  const b = lerp(229, 212, t);

  if (dist < 22 && dist > 13) {
    return [15, 23, 42, 255];
  }
  if (dist <= 13 && dist > 6) {
    return [r, g, b, 255];
  }
  if (dist <= 6) {
    return [255, 255, 255, 255];
  }

  return [r, g, b, 255];
});

// 3. Generate public/og-image.png (1200x630 on-brand social preview)
const ogImagePng = generatePng(1200, 630, (x, y) => {
  // Deep elegant dark canvas with vibrant ambient glows
  const tX = x / 1200;
  const tY = y / 630;

  // Background base #09090b
  let r = 9;
  let g = 9;
  let b = 11;

  // Top-left purple/indigo glow
  const d1 = Math.sqrt((x - 200) ** 2 + (y - 150) ** 2);
  if (d1 < 450) {
    const intensity = (1 - d1 / 450) * 0.45;
    r += 79 * intensity;
    g += 70 * intensity;
    b += 229 * intensity;
  }

  // Bottom-right pink/cyan glow
  const d2 = Math.sqrt((x - 1000) ** 2 + (y - 480) ** 2);
  if (d2 < 500) {
    const intensity = (1 - d2 / 500) * 0.4;
    r += 236 * intensity;
    g += 72 * intensity;
    b += 153 * intensity;
  }

  // Center-right color swatch strip visual (x between 750 and 1100, y between 200 and 430)
  if (x >= 750 && x <= 1080 && y >= 200 && y <= 430) {
    const swatchIndex = Math.floor((x - 750) / 66);
    const swatches = [
      [79, 70, 229],   // #4f46e5 Indigo
      [14, 165, 233],  // #0ea5e9 Sky
      [16, 185, 129],  // #10b981 Emerald
      [245, 158, 11],  // #f59e0b Amber
      [236, 72, 153],  // #ec4899 Pink
    ];
    const col = swatches[Math.min(swatchIndex, swatches.length - 1)];
    return [col[0], col[1], col[2], 255];
  }

  // Accent bar at the top
  if (y < 6) {
    const barT = x / 1200;
    return [lerp(79, 236, barT), lerp(70, 72, barT), lerp(229, 212, barT), 255];
  }

  return [r, g, b, 255];
});

// Write files to /public
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoSvg);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
fs.writeFileSync(path.join(publicDir, 'logo.png'), logoPng);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), faviconPng);
fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogImagePng);

console.log('✅ Generated brand assets in /public:');
console.log('  - logo.svg, favicon.svg');
console.log('  - logo.png (512x512)');
console.log('  - favicon.png (64x64)');
console.log('  - og-image.png (1200x630)');
