/**
 * inject-seo-head.ts — build-time SEO head injection (per-route "prerendering"
 * of the <head> only, no browser, no snapshot files).
 *
 * WHY THIS EXISTS
 * Chromora is a React SPA. src/components/common/SEO.tsx sets <title>,
 * <meta name="description"> and <link rel="canonical"> ONLY inside useEffect,
 * so the raw HTML served for every URL is the shell whose canonical points to
 * the homepage. Google Search Console reported the site's pages as
 * "Alternate page with proper canonical tag" (validation failed 2026-11-06):
 * Google saw the shell canonical (homepage) instead of each page's own URL.
 *
 * WHAT IT DOES
 * Runs AFTER `vite build` (see the `build` script in package.json). It reads
 * the freshly built dist/index.html shell and dist/sitemap.xml (regenerated
 * by scripts/generate-sitemap.ts on every build), then writes one
 * dist/<route>/index.html per sitemap route (except '/'), each a copy of the
 * shell with the head tags replaced by that route's own SEO: <title>,
 * <meta name="description">, <link rel="canonical">, og:title, og:description,
 * og:url, twitter:title, twitter:description. og:type, og:image and
 * twitter:card are kept exactly as in the shell.
 *
 * NO STALE ASSETS BY CONSTRUCTION
 * The injected files are built from the FRESH dist/index.html on EVERY build,
 * so they always reference the current hashed JS/CSS bundles. Nothing is
 * snapshotted from a previous build. `vite build` empties dist/ first, so no
 * stale per-route files survive either. Regeneration is automatic on every
 * build — never copy a dist/<route>/index.html by hand.
 *
 * SEO DATA SOURCE
 * Titles/descriptions are computed from the SAME modules the app uses at
 * runtime: getRouteSEO()/CORE_ROUTES_SEO (src/data/seoConfig.ts), CONVERTER_PAGES
 * (converterPagesData.ts), COLLECTION_PAGES (collectionPagesData.ts),
 * GUIDES_DATABASE (guidesData.ts) and getColorData(parseSlugToHex()) from
 * src/utils/colorUtils.ts — replicating the exact title/description
 * construction in ConverterSubPage, PaletteCollectionPage, GuideDetailPage
 * and ColorDetailPage. The SEO component's title rule is applied exactly:
 * fullTitle = title includes 'Chromora' ? title : `${title} | Chromora`.
 * Seven routes have their title/description only as literals inside the
 * components that render <SEO> for them; those are copied verbatim into
 * LITERAL_SEO below with their source file noted — keep them in sync if those
 * components change. Canonical is always the route's own absolute URL.
 *
 * SELF-VERIFICATION
 * After writing, every generated file is re-read and asserted to contain its
 * own canonical href, its own <title> and (when full SEO was resolved) its
 * own description, and to be byte-identical to the shell except for the eight
 * replaced head tags (so asset references can never go stale). Any failure
 * exits non-zero listing the first failures. Routes that resolve to
 * canonical-only injection (no title/description found) are listed in the
 * summary — they still get their own canonical, which is the critical fix.
 */

import fs from 'fs';
import path from 'path';
import { getRouteSEO, CORE_ROUTES_SEO, SITE_URL } from '../src/data/seoConfig';
import { CONVERTER_PAGES } from '../src/data/converterPagesData';
import { COLLECTION_PAGES } from '../src/data/collectionPagesData';
import { GUIDES_DATABASE } from '../src/data/guidesData';
import { getColorData, parseSlugToHex } from '../src/utils/colorUtils';

const ROOT = path.resolve(process.cwd());
const DIST_DIR = path.join(ROOT, 'dist');
const SHELL_PATH = path.join(DIST_DIR, 'index.html');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml');
const EXPECTED_SITEMAP_URLS = 1320;
const HOME_CANONICAL = `${SITE_URL}/`;

/** Routes whose title/description exist only as literals in their components. */
const LITERAL_SEO: Record<string, { title: string; description: string }> = {
  // src/components/tools/ColorNameFinderTool.tsx
  '/color-name-finder': {
    title: 'Color Name Finder — Find the Name of Any Hex Color',
    description:
      'Enter any hex color code and instantly find its closest named color from 1,265 named colors, plus matching shades. Free hex to color name lookup, no sign-up.',
  },
  // src/components/tools/ShareLinkGeneratorTool.tsx
  '/share-link-generator': {
    title: 'Share Link Generator — Create WhatsApp, X, Facebook & LinkedIn Share Links',
    description:
      'Paste any website URL and instantly generate ready share links for WhatsApp, X, Facebook, LinkedIn, Telegram and Email. Free, no sign-up, everything runs in your browser.',
  },
  // src/pages/AboutPage.tsx
  '/about': {
    title: 'About Chromora — Create Colors That Work Beautifully',
    description:
      'Discover the mission behind Chromora: zero-server private color science, WCAG 2.1 accessibility auditing, and unified design tokens.',
  },
  // src/pages/PrivacyPage.tsx
  '/privacy': {
    title: 'Privacy Policy — Chromora',
    description:
      'Chromora values your privacy: 100% client-side local calculations, zero server storage of uploaded images, and zero third-party telemetry.',
  },
  // src/pages/TermsPage.tsx
  '/terms': {
    title: 'Terms of Service — Chromora',
    description: 'Terms of service and usage conditions for the Chromora color intelligence suite.',
  },
  // src/pages/PaletteCollectionsDirectoryPage.tsx
  '/palettes': {
    title: 'Color Palette Collections & Schemes Directory — Chromora',
    description:
      'Explore curated color palette collections for UI/UX design, brand identity, SaaS dashboards, weddings, culture, and aesthetic web design.',
  },
  // src/pages/GuidesHubPage.tsx
  '/guides': {
    title: 'Color Guides & Tutorials for Designers and Developers — Chromora',
    description:
      'Free in-depth color guides for frontend developers and UI/UX designers. Learn HEX vs RGB vs HSL, OKLCH, WCAG accessibility, color harmonies, and modern design systems.',
  },
};

/** The SEO component's exact title rule (src/components/common/SEO.tsx). */
function fullTitle(title: string): string {
  return title.includes('Chromora') ? title : `${title} | Chromora`;
}

interface ResolvedSeo {
  title: string;
  description: string;
}

/** Resolve a sitemap route to its runtime title/description, or null. */
function resolveSeo(route: string): ResolvedSeo | null {
  // 1. Core routes (incl. hubs, /colors directory).
  if (CORE_ROUTES_SEO[route]) {
    const seo = getRouteSEO(route);
    return { title: seo.title, description: seo.description };
  }

  // 2. Routes whose SEO lives only as component literals.
  if (LITERAL_SEO[route]) {
    return LITERAL_SEO[route];
  }

  const slug = route.slice(1);

  // 3. Converter subpages: /rgb-to-hex, /hsl-to-cmyk, ...
  const converter = (CONVERTER_PAGES as Record<string, { title: string; metaDescription: string }>)[slug];
  if (converter) {
    return { title: converter.title, description: converter.metaDescription };
  }

  // 4. Palette collections: /ramadan-color-palette, ...
  const collection = (COLLECTION_PAGES as Record<string, { title: string; metaDescription: string }>)[slug];
  if (collection) {
    return { title: collection.title, description: collection.metaDescription };
  }

  // 5. Guide detail pages: /guides/<slug>
  if (route.startsWith('/guides/')) {
    const guide = (GUIDES_DATABASE as Record<string, { title: string; metaDescription: string }>)[route.slice('/guides/'.length)];
    if (guide) {
      return { title: guide.title, description: guide.metaDescription };
    }
    return null;
  }

  // 6. Named color pages: /colors/<slug>
  if (route.startsWith('/colors/')) {
    try {
      const hex = parseSlugToHex(route.slice('/colors/'.length));
      const colorData = getColorData(hex);
      if (!colorData || !colorData.name || !colorData.hex) return null;
      return {
        title: `${colorData.name} (${colorData.hex.toUpperCase()}) Color Codes & Shades`,
        description: `Explore ${colorData.name} (${colorData.hex}) shades, tints, and hex to color name info. Get RGB, HSL, CMYK, OKLCH codes, palettes, and WCAG contrast ratios.`,
      };
    } catch {
      return null;
    }
  }

  return null;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** The eight head tags we replace, with the shell's original text for round-trip checks. */
interface TagReplacement {
  pattern: RegExp;
  original: string;
  replacement: string;
}

function buildReplacements(
  shell: string,
  seo: ResolvedSeo | null,
  canonical: string,
): { replacements: TagReplacement[]; failures: string[] } {
  const title = seo ? fullTitle(seo.title) : null;
  const description = seo ? seo.description : null;
  const wanted: Array<{ name: string; pattern: RegExp; replacement: string }> = [
    {
      name: 'canonical',
      pattern: /<link rel="canonical" href="[^"]*" \/>/,
      replacement: `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    },
  ];
  if (title !== null && description !== null) {
    wanted.push(
      { name: 'title', pattern: /<title>[^<]*<\/title>/, replacement: `<title>${escapeText(title)}</title>` },
      {
        name: 'description',
        pattern: /<meta name="description" content="[^"]*" \/>/,
        replacement: `<meta name="description" content="${escapeAttr(description)}" />`,
      },
      {
        name: 'og:title',
        pattern: /<meta property="og:title" content="[^"]*" \/>/,
        replacement: `<meta property="og:title" content="${escapeAttr(title)}" />`,
      },
      {
        name: 'og:description',
        pattern: /<meta property="og:description" content="[^"]*" \/>/,
        replacement: `<meta property="og:description" content="${escapeAttr(description)}" />`,
      },
      {
        name: 'og:url',
        pattern: /<meta property="og:url" content="[^"]*" \/>/,
        replacement: `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
      },
      {
        name: 'twitter:title',
        pattern: /<meta name="twitter:title" content="[^"]*" \/>/,
        replacement: `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
      },
      {
        name: 'twitter:description',
        pattern: /<meta name="twitter:description" content="[^"]*" \/>/,
        replacement: `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
      },
    );
  }
  const replacements: TagReplacement[] = [];
  const failures: string[] = [];
  for (const w of wanted) {
    const match = shell.match(w.pattern);
    if (!match) {
      failures.push(`shell is missing the ${w.name} tag pattern — cannot inject`);
      continue;
    }
    replacements.push({ pattern: w.pattern, original: match[0], replacement: w.replacement });
  }
  return { replacements, failures };
}

function main(): void {
  if (!fs.existsSync(SHELL_PATH)) {
    console.error(`inject-seo-head: dist/index.html not found at ${SHELL_PATH} — run vite build first.`);
    process.exit(1);
  }
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`inject-seo-head: dist/sitemap.xml not found at ${SITEMAP_PATH} — run the sitemap step first.`);
    process.exit(1);
  }

  const shell = fs.readFileSync(SHELL_PATH, 'utf-8');
  const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const routes = locs.map((loc) => new URL(loc).pathname);
  const uniqueRoutes = [...new Set(routes)];

  console.log(`inject-seo-head: sitemap has ${uniqueRoutes.length} unique URLs (expected ${EXPECTED_SITEMAP_URLS}).`);
  if (uniqueRoutes.length !== EXPECTED_SITEMAP_URLS) {
    console.warn(
      `inject-seo-head: WARNING — sitemap URL count (${uniqueRoutes.length}) differs from the expected ${EXPECTED_SITEMAP_URLS}. ` +
        'If routes were added/removed on purpose, update EXPECTED_SITEMAP_URLS; otherwise check scripts/generate-sitemap.ts.',
    );
  }

  const failures: string[] = [];
  const canonicalOnly: string[] = [];
  let written = 0;

  for (const route of uniqueRoutes) {
    if (route === '/') continue; // Homepage keeps the built dist/index.html untouched.
    const canonical = route === '/' ? HOME_CANONICAL : `${SITE_URL}${route}`;
    const seo = resolveSeo(route);
    if (!seo) canonicalOnly.push(route);

    const { replacements, failures: tagFailures } = buildReplacements(shell, seo, canonical);
    if (tagFailures.length > 0) {
      failures.push(`${route}: ${tagFailures.join('; ')}`);
      continue;
    }

    let html = shell;
    for (const r of replacements) {
      // Replacer function: replacement text is literal (a '$' in a title or
      // description must not be treated as a $-pattern by String.replace).
      html = html.replace(r.pattern, () => r.replacement);
    }

    const outPath = path.join(DIST_DIR, route, 'index.html');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, 'utf-8');

    // Self-verification: re-read and assert the injected values + byte-identity
    // with the shell apart from the replaced tags.
    const writtenHtml = fs.readFileSync(outPath, 'utf-8');
    const checks: string[] = [];
    if (!writtenHtml.includes(`<link rel="canonical" href="${escapeAttr(canonical)}" />`)) {
      checks.push('canonical href missing/wrong');
    }
    if (seo) {
      const expectedTitle = fullTitle(seo.title);
      if (!writtenHtml.includes(`<title>${escapeText(expectedTitle)}</title>`)) {
        checks.push('title missing/wrong');
      }
      if (!writtenHtml.includes(`<meta name="description" content="${escapeAttr(seo.description)}" />`)) {
        checks.push('description missing/wrong');
      }
      if (!writtenHtml.includes(`<meta property="og:url" content="${escapeAttr(canonical)}" />`)) {
        checks.push('og:url missing/wrong');
      }
    }
    if (writtenHtml.includes(`<link rel="canonical" href="${HOME_CANONICAL}" />`)) {
      checks.push('still contains the homepage canonical');
    }
    // Round-trip: swapping the replacements back must reproduce the shell exactly.
    let roundTripped = writtenHtml;
    for (const r of replacements) {
      roundTripped = roundTripped.replace(r.replacement, () => r.original);
    }
    if (roundTripped !== shell) {
      checks.push('file differs from shell outside the replaced head tags');
    }
    if (checks.length > 0) {
      failures.push(`${route}: verification failed — ${checks.join('; ')}`);
      continue;
    }
    written++;
  }

  console.log(`inject-seo-head: wrote ${written} per-route files (sitemap routes minus homepage).`);
  if (canonicalOnly.length > 0) {
    console.log(
      `inject-seo-head: ${canonicalOnly.length} route(s) got canonical-only injection (no title/description resolved): ${canonicalOnly.join(', ')}`,
    );
  } else {
    console.log('inject-seo-head: every route got full title/description/canonical injection.');
  }
  if (failures.length > 0) {
    console.error(`inject-seo-head: FAILED with ${failures.length} error(s):`);
    for (const f of failures.slice(0, 20)) console.error(`  - ${f}`);
    if (failures.length > 20) console.error(`  ... and ${failures.length - 20} more`);
    process.exit(1);
  }
  console.log('inject-seo-head: all generated files verified OK.');
}

main();
