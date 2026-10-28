import fs from 'fs';
import path from 'path';
import { COLOR_NAMES_DB, hexToSlug } from '../src/data/colorNames';
import { CONVERTER_PAGES } from '../src/data/converterPagesData';
import { GUIDES_DATABASE } from '../src/data/guidesData';
import { COLLECTION_PAGES } from '../src/data/collectionPagesData';
import { isColorIndexable } from '../src/data/colorQualityAudit';

interface SitemapEntry {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  lastmod?: string;
}

const BASE_URL = 'https://chromoraflow.vercel.app';
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
    '/ai-palette-generator',
    '/image-color-extractor',
    '/wcag-contrast-checker',
    '/gradient-generator',
    '/color-converter',
    '/color-shades-generator',
    '/color-mixer',
    '/color-name-finder',
    '/color-blindness-simulator',
    '/random-color-generator',
    '/pantone-color-converter',
    '/favicon-generator',
    '/design-preview',
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

  // 5. Named Color Pages (only indexable Tier A & Tier B named colors)
  const seenColorSlugs = new Set<string>();
  COLOR_NAMES_DB.forEach((color) => {
    if (!isColorIndexable(color.name)) return;

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

  // 7. Palette collections directory + Guides hub & guide detail pages
  // (these were in the hand-corrected sitemap but missing from this script,
  // so every build silently dropped them again)
  addRoute('/palettes', '0.8', 'weekly');
  addRoute('/guides', '0.8', 'weekly');
  Object.keys(GUIDES_DATABASE).forEach((slug) => {
    addRoute(`/guides/${slug}`, '0.8', 'monthly');
  });

  // 8. Tool hub pages (also in the corrected sitemap, also missing from this script)
  const hubPages = [
    '/color-tools',
    '/palette-tools',
    '/accessibility-tools',
    '/developer-color-tools',
    '/image-color-tools',
  ];
  hubPages.forEach((hub) => addRoute(hub, '0.8', 'monthly'));

  // Build Compact & Standard XML String
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const entry of entries) {
    xmlContent += `<url><loc>${entry.loc}</loc><lastmod>${entry.lastmod}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>\n`;
  }
  xmlContent += '</urlset>';
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
