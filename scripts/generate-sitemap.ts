import fs from 'fs';
import path from 'path';
import { COLOR_NAMES_DB, hexToSlug } from '../src/data/colorNames';
import { CONVERTER_PAGES } from '../src/data/converterPagesData';
import { COLLECTION_PAGES } from '../src/data/collectionPagesData';

interface SitemapEntry {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  lastmod?: string;
}

const BASE_URL = 'https://chromora.app';
const TODAY = new Date().toISOString().split('T')[0];

function generateSitemapXml() {
  const entries: SitemapEntry[] = [];
  const addedUrls = new Set<string>();

  const addRoute = (route: string, priority: string, changefreq: SitemapEntry['changefreq']) => {
    const cleanRoute = route.startsWith('/') ? route : `/${route}`;
    const fullUrl = cleanRoute === '/' ? `${BASE_URL}/` : `${BASE_URL}${cleanRoute}`;
    if (addedUrls.has(fullUrl)) return;
    addedUrls.add(fullUrl);
    entries.push({
      loc: fullUrl,
      priority,
      changefreq,
      lastmod: TODAY,
    });
  };

  // 1. Homepage
  addRoute('/', '1.0', 'weekly');

  // 2. Core Tool Canonical Routes (high priority)
  const coreTools = [
    '/color-picker',
    '/color-wheel',
    '/color-palette-generator',
    '/ai-color-palette-generator',
    '/image-color-palette-generator',
    '/color-contrast-checker',
    '/gradient-generator',
    '/color-converter',
    '/color-shades-generator',
    '/color-mixer',
    '/color-blindness-simulator',
    '/random-color-generator',
    '/pantone-color-converter',
    '/favicon-generator',
    '/design-color-preview',
    '/colors',
  ];
  coreTools.forEach((tool) => addRoute(tool, '0.9', 'weekly'));

  // 3. Converter Landing Pages (8 pages)
  Object.keys(CONVERTER_PAGES).forEach((slug) => {
    addRoute(`/${slug}`, '0.8', 'monthly');
  });

  // 4. Curated Color Collection Pages (22 pages)
  Object.keys(COLLECTION_PAGES).forEach((slug) => {
    addRoute(`/${slug}`, '0.8', 'monthly');
  });

  // 5. Named Color Pages (all indexed named colors)
  const seenColorSlugs = new Set<string>();
  COLOR_NAMES_DB.forEach((color) => {
    const slug = hexToSlug(color.name, color.hex);
    if (!seenColorSlugs.has(slug)) {
      seenColorSlugs.add(slug);
      addRoute(`/colors/${slug}`, '0.6', 'monthly');
    }
  });

  // 6. Content & Informational Pages
  addRoute('/about', '0.5', 'monthly');
  addRoute('/privacy', '0.3', 'yearly');
  addRoute('/terms', '0.3', 'yearly');

  // Explicitly note: /saved-palettes and /saved-color-palettes are excluded (noindex)

  // Build XML String
  const xmlLines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const entry of entries) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${entry.loc}</loc>`);
    if (entry.lastmod) {
      xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    }
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority}</priority>`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');

  const xmlContent = xmlLines.join('\n');
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xmlContent, 'utf-8');

  console.log(`\n🎉 Sitemap generated successfully with ${entries.length} total URLs!`);
  console.log(`📁 Saved to: ${sitemapPath}`);
  console.log(`  - Core Tools: ${coreTools.length}`);
  console.log(`  - Converter Pages: ${Object.keys(CONVERTER_PAGES).length}`);
  console.log(`  - Collection Pages: ${Object.keys(COLLECTION_PAGES).length}`);
  console.log(`  - Named Color Pages: ${seenColorSlugs.size}`);
  console.log(`  - Info Pages: 3\n`);
}

generateSitemapXml();
