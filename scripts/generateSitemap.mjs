import fs from 'fs';
import path from 'path';

// Parse color database
const colorNamesContent = fs.readFileSync('./src/data/colorNames.ts', 'utf8');
let namedColors = [];
try {
  // Regex parser for { name: "...", hex: "..." } or single quotes
  const regex = /{\s*name:\s*["']([^"']+)["'],\s*hex:\s*["']([^"']+)["']/g;
  let m;
  while ((m = regex.exec(colorNamesContent)) !== null) {
    namedColors.push({ name: m[1], hex: m[2] });
  }
} catch (err) {
  console.error('Failed to parse color names', err);
}

// Helper slug converter matching utils
function hexToSlug(hex, name) {
  const cleanHex = hex.replace('#', '').toLowerCase();
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${cleanName}-${cleanHex}`;
}

// Parse converter pages
const convertersContent = fs.readFileSync('./src/data/converterPagesData.ts', 'utf8');
const converterSlugMatches = [...convertersContent.matchAll(/'([a-z0-9-]+)':\s*{\s*slug:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);

// Parse collection pages
const collectionsContent = fs.readFileSync('./src/data/collectionPagesData.ts', 'utf8');
const collectionSlugMatches = [...collectionsContent.matchAll(/'([a-z0-9-]+)':\s*{\s*slug:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);

// Parse guides
const guidesContent = fs.readFileSync('./src/data/guidesData.ts', 'utf8');
const guideSlugMatches = [...guidesContent.matchAll(/'([a-z0-9-]+)':\s*{\s*slug:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);

const BASE_URL = 'https://chromoraflow.vercel.app';
const LAST_MOD = new Date().toISOString().split('T')[0];

const urls = [];

// 1. Core Homepage
urls.push({ loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' });

// 2. Main Tool Landing Pages (Canonical URLs)
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
  '/color-blindness-simulator',
  '/random-color-generator',
  '/pantone-color-converter',
  '/favicon-generator',
  '/design-preview',
];

coreTools.forEach(t => urls.push({ loc: `${BASE_URL}${t}`, priority: '0.9', changefreq: 'weekly' }));

// 3. Category & Hub Pages
const hubs = [
  '/colors',
  '/palettes',
  '/guides',
  '/color-tools',
  '/palette-tools',
  '/accessibility-tools',
  '/developer-color-tools',
  '/image-color-tools',
];
hubs.forEach(h => urls.push({ loc: `${BASE_URL}${h}`, priority: '0.9', changefreq: 'weekly' }));

// 4. Guide Detail Pages
guideSlugMatches.forEach(slug => {
  urls.push({ loc: `${BASE_URL}/guides/${slug}`, priority: '0.8', changefreq: 'monthly' });
});

// 5. Converter Sub-pages
[...new Set(converterSlugMatches)].forEach(slug => {
  urls.push({ loc: `${BASE_URL}/${slug}`, priority: '0.8', changefreq: 'monthly' });
});

// 6. Curated Collection Pages
[...new Set(collectionSlugMatches)].forEach(slug => {
  urls.push({ loc: `${BASE_URL}/${slug}`, priority: '0.8', changefreq: 'monthly' });
});

// Parse Class C unindexed list
const auditContent = fs.readFileSync('./src/data/colorQualityAudit.ts', 'utf8');
const classCMatch = auditContent.match(/CLASS_C_NAMES\s*=\s*new Set\(\[\s*([\s\S]*?)\]\);/);
const classCSet = new Set();
if (classCMatch) {
  const items = [...classCMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1].toLowerCase().trim());
  items.forEach(item => classCSet.add(item));
}

// 7. Named Color Pages (Only indexable Tier A & Tier B colors)
const seenColors = new Set();
let indexedColorCount = 0;
namedColors.forEach(c => {
  const normName = c.name.toLowerCase().trim();
  if (classCSet.has(normName)) {
    // Exclude Tier C from sitemap
    return;
  }

  const slug = hexToSlug(c.hex, c.name);
  if (!seenColors.has(slug)) {
    seenColors.add(slug);
    indexedColorCount++;
    urls.push({ loc: `${BASE_URL}/colors/${slug}`, priority: '0.6', changefreq: 'monthly' });
  }
});

console.log(`Included ${indexedColorCount} indexable named color pages in sitemap (excluded ${classCSet.size} Tier C unindexed micro-variants).`);

// 8. Trust & Legal Pages
urls.push({ loc: `${BASE_URL}/about`, priority: '0.5', changefreq: 'monthly' });
urls.push({ loc: `${BASE_URL}/privacy`, priority: '0.3', changefreq: 'yearly' });
urls.push({ loc: `${BASE_URL}/terms`, priority: '0.3', changefreq: 'yearly' });

// Build XML
const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
];

urls.forEach(u => {
  xmlLines.push(`  <url>`);
  xmlLines.push(`    <loc>${u.loc}</loc>`);
  xmlLines.push(`    <lastmod>${LAST_MOD}</lastmod>`);
  xmlLines.push(`    <changefreq>${u.changefreq}</changefreq>`);
  xmlLines.push(`    <priority>${u.priority}</priority>`);
  xmlLines.push(`  </url>`);
});

xmlLines.push('</urlset>\n');

fs.writeFileSync('./public/sitemap.xml', xmlLines.join('\n'), 'utf8');
console.log(`Generated sitemap with ${urls.length} URLs successfully.`);
