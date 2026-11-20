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
 * STATIC CONTENT (GEO / LLM READABILITY)
 * The same files ALSO get a route-specific static content block injected
 * inside <div id="root">: the page's own <h1>, its meta description as a
 * paragraph, and its hero subtitle (or data intro/summary) — the exact text
 * the React app renders for that route, taken from the same data modules.
 * Crawlers and LLMs that read the initial HTML see the core content without
 * running JS. React's createRoot() replaces the #root children on mount, so
 * the static block never shows to users and never changes the design. The
 * homepage (dist/index.html itself) gets the same treatment, plus the tool
 * directory list reused from the shell's own <noscript> block. The noscript
 * heading in index.html is an <h2> on purpose, so the raw HTML of every
 * route contains exactly ONE <h1> (the static block's).
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
import { HUB_CATEGORIES } from '../src/data/seoKeywordMap';
import { getColorData, parseSlugToHex } from '../src/utils/colorUtils';

const ROOT = path.resolve(process.cwd());
const DIST_DIR = path.join(ROOT, 'dist');
const SHELL_PATH = path.join(DIST_DIR, 'index.html');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml');
const EXPECTED_SITEMAP_URLS = 1327;
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
      'Paste any website URL and create ready share links for WhatsApp, X, Facebook, LinkedIn, Telegram, and Email. Free, instant, and fully private.',
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
    description: 'Terms of service for the Chromora color tools suite. Read the rules for using our free browser-based color pickers, palette generators, and converters.',
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
      'Free color guides for designers and developers. Learn HEX vs RGB vs HSL, OKLCH, WCAG contrast, color harmonies, and modern design systems.',
  },
};

/** The SEO component's exact title rule (src/components/common/SEO.tsx). */
function fullTitle(title: string): string {
  return title.includes('Chromora') ? title : `${title} | Chromora`;
}

/**
 * Rendered <h1> text per route, copied verbatim from the component that
 * renders it. Used for the static block inside #root — it MUST match what
 * React renders, so prefer the component literal over seoConfig's h1 field
 * (which is display-only metadata and differs on several tool pages).
 * Dynamic h1s (color pages, converters, collections, guides, hubs, color
 * picker/converter defaults) are resolved from data in resolveStatic().
 */
const LITERAL_H1: Record<string, string> = {
  '/': 'Free Color Tools for Designers & Developers',
  '/color-picker': 'Very Light Blue #6366F1', // default activeHex #6366f1
  '/color-palette-generator': 'Color Palette Generator',
  '/ai-palette-generator': 'AI Prompt to Color Palette',
  '/image-color-extractor': 'Image Color Palette Extractor',
  '/wcag-contrast-checker': 'Color Contrast Checker & Optimizer',
  '/gradient-generator': 'CSS Gradient Studio & Generator',
  '/color-converter': 'Multi-Space Color Converter (HEX, RGB, HSL, CMYK, OKLCH)',
  '/color-shades-generator': 'Color Shades & Tints Generator',
  '/color-mixer': 'Color Mixer Online',
  '/color-name-finder': 'Color Name Finder',
  '/share-link-generator': 'Share Link Generator',
  '/color-blindness-simulator': 'Color Blindness Simulator',
  '/random-color-generator': 'Random Color & Palette Generator',
  '/pantone-color-converter': 'Pantone & RAL Color Converter',
  '/favicon-generator': 'Favicon Generator & App Icon Maker',
  '/color-wheel': 'Color Wheel & Harmony Generator',
  '/design-preview': 'Real-Time Design System Preview',
  '/colors': 'Named Colors Directory',
  '/about': 'About Chromora',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/palettes': 'Color Palette Collections',
  '/guides': 'Color Guides & Engineering Tutorials',
};

/**
 * Hero subtitle paragraph rendered directly under the <h1>, copied verbatim
 * from the component. Routes without an entry use the data intro/summary
 * (converters, collections, guides, hubs) or no subtitle at all.
 */
const LITERAL_SUBTITLE: Record<string, string> = {
  '/': 'Powerful color tools for palettes, conversions, accessibility, gradients, and image color extraction — free and easy to use.',
  '/color-palette-generator':
    'Explore 12 mathematical harmonies, lock favorite swatches, and inspect 50–950 shade curves. Press Space to regenerate.',
  '/ai-palette-generator':
    'Describe any aesthetic, brand concept, cultural celebration, industry, or mood to synthesize a calibrated 5-color palette with psychological justification.',
  '/image-color-extractor':
    'Extract dominant color harmonies directly from photography, UI screenshots, and artwork.',
  '/wcag-contrast-checker':
    'Audit foreground and background pairings for WCAG AA and AAA compliance with live UI components, color-blind simulation, and multilingual scripts.',
  '/gradient-generator':
    'Fine-tune linear angles, color stop positions, and copy instant CSS rules.',
  '/color-converter':
    'Live interactive transformation between web, digital display, CSS color levels, and print representations.',
  '/color-shades-generator':
    'Input any base color to automatically calculate a perceptually uniform 10-step tint and shade palette. Complete with WCAG contrast ratings, CSS variables, and one-click Tailwind config export.',
  '/color-mixer':
    'Blend two colors in real-time with customizable mixing ratios and color spaces. View intermediate step gradients and export palette swatches instantly.',
  '/color-name-finder':
    'Have a hex code but no name for it? Type any hex color and instantly find the closest named colors from our database, with a full shade scale for the best match.',
  '/share-link-generator':
    'Paste your website URL and get ready share links for WhatsApp, X, Facebook, LinkedIn, Telegram and Email — copy one link or all of them and post anywhere.',
  '/color-blindness-simulator':
    'Simulate how your colors, UI palettes, and interface screenshots appear to users with Protanopia, Deuteranopia, Tritanopia, and Achromatopsia vision deficiencies.',
  '/random-color-generator':
    'Instantly discover aesthetic random colors and color palettes. Apply mood filters for pastels, neons, warm, or cool tones, lock your favorites, and copy CSS codes.',
  '/pantone-color-converter':
    'Bridge digital UI design and physical print/manufacturing production. Match any digital HEX or RGB color to the closest standard Pantone PMS spot ink and RAL industrial coating.',
  '/favicon-generator':
    'Create complete production favicon suites for desktop browsers, iOS Apple Touch Icons, and Android PWA manifests from text, emojis, or uploaded logos.',
  '/color-wheel':
    'Rotate through the full 360° HSL color wheel to discover perfect complementary, analogous, triadic, split-complementary, and tetradic color combinations.',
  '/design-preview':
    'Map your color palette to semantic UI roles and see how it looks across production SaaS, mobile, ecommerce, and landing page layouts.',
  '/colors':
    'Search 400+ curated shades, historical pigments, and UI design standards. Click any swatch for full coordinate breakdowns.',
  '/color-picker':
    'Input any HEX, RGB, HSL, HSV, OKLCH, or CSS name to inspect color space coordinates, Tailwind shade scales, and exportable design tokens.',
  '/about':
    'Chromora was founded on a simple conviction: digital color should be mathematically precise, universally accessible, and effortless to integrate into modern software codebases.',
  '/guides':
    'In-depth, practical guides on color theory, digital spaces, modern CSS formats, WCAG accessibility compliance, and UI design systems.',
  '/palettes':
    'Hand-curated, WCAG-tested color schemes tailored for modern digital applications, creative portfolios, cultural festivities, and brand design systems.',
};

interface ResolvedStatic {
  h1: string;
  description: string;
  subtitle: string | null;
}

/** Resolve a route to its static-block content (rendered h1 + description + subtitle), or null. */
function resolveStatic(route: string): ResolvedStatic | null {
  const seo = resolveSeo(route);
  if (!seo) return null;

  let h1: string | null = LITERAL_H1[route] ?? null;
  let subtitle: string | null = LITERAL_SUBTITLE[route] ?? null;
  const slug = route.slice(1);

  if (!h1 || !subtitle) {
    if (route.startsWith('/colors/family/')) {
      h1 ??= 'Named Colors Directory';
    } else if (route.startsWith('/colors/')) {
      try {
        const hex = parseSlugToHex(route.slice('/colors/'.length));
        const colorData = getColorData(hex);
        if (colorData?.name) h1 ??= colorData.name;
      } catch {
        /* fall through */
      }
    } else if (route.startsWith('/guides/')) {
      const guide = (GUIDES_DATABASE as Record<string, { h1: string; summary: string }>)[route.slice('/guides/'.length)];
      if (guide) {
        h1 ??= guide.h1;
        subtitle ??= guide.summary;
      }
    } else {
      const converter = (CONVERTER_PAGES as Record<string, { h1: string; intro: string }>)[slug];
      if (converter) {
        h1 ??= converter.h1;
        subtitle ??= converter.intro;
      } else {
        const collection = (COLLECTION_PAGES as Record<string, { h1: string; intro: string }>)[slug];
        if (collection) {
          h1 ??= collection.h1;
          subtitle ??= collection.intro;
        } else {
          const hub = (HUB_CATEGORIES as Record<string, { h1: string; leadParagraph: string }>)[slug];
          if (hub) {
            h1 ??= hub.h1;
            subtitle ??= hub.leadParagraph;
          }
        }
      }
    }
  }
  if (!h1) h1 = CORE_ROUTES_SEO[route]?.h1 ?? seo.title;
  return { h1, description: seo.description, subtitle };
}

/**
 * Build the static content block for #root: the page's own h1, its meta
 * description, and its hero subtitle. Plain semantic HTML, no classes — it
 * is replaced by React on mount, so it only ever shows to no-JS readers
 * and crawlers. For the homepage, append the tool-directory link list
 * reused from the shell's own <noscript> block.
 */
function buildStaticBlock(staticData: ResolvedStatic, shell: string, route: string): string {
  const parts: string[] = [
    `<h1>${escapeText(staticData.h1)}</h1>`,
    `<p>${escapeText(staticData.description)}</p>`,
  ];
  if (staticData.subtitle) parts.push(`<p>${escapeText(staticData.subtitle)}</p>`);
  if (route === '/') {
    const noscriptUl = shell.match(/<noscript>[\s\S]*?(<ul>[\s\S]*?<\/ul>)/)?.[1];
    if (noscriptUl) parts.push(noscriptUl);
  }
  return parts.join('\n');
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
  const staticOnly: string[] = [];
  let written = 0;

  for (const route of uniqueRoutes) {
    const canonical = route === '/' ? HOME_CANONICAL : `${SITE_URL}${route}`;
    const seo = route === '/' ? null : resolveSeo(route);
    if (route !== '/' && !seo) canonicalOnly.push(route);

    // Homepage: head tags are already correct in the shell (index.html);
    // only the static block goes into #root.
    if (route === '/') {
      const staticData = resolveStatic(route);
      if (!staticData) {
        staticOnly.push(route);
        continue;
      }
      const staticBlock = buildStaticBlock(staticData, shell, route);
      const rootPattern = /<div id="root"><\/div>/;
      if (!rootPattern.test(shell)) {
        failures.push(`${route}: shell is missing the empty <div id="root"></div> — cannot inject static block`);
        continue;
      }
      const html = shell.replace(rootPattern, () => `<div id="root">${staticBlock}</div>`);
      fs.writeFileSync(SHELL_PATH, html, 'utf-8');
      const writtenHtml = fs.readFileSync(SHELL_PATH, 'utf-8');
      const checks: string[] = [];
      if (!writtenHtml.includes(`<h1>${escapeText(staticData.h1)}</h1>`)) checks.push('static h1 missing/wrong');
      if (!writtenHtml.includes(`<p>${escapeText(staticData.description)}</p>`)) {
        checks.push('static description paragraph missing/wrong');
      }
      if (writtenHtml.replace(`<div id="root">${staticBlock}</div>`, '<div id="root"></div>') !== shell) {
        checks.push('homepage differs from shell outside the static block');
      }
      if (checks.length > 0) {
        failures.push(`${route}: verification failed — ${checks.join('; ')}`);
        continue;
      }
      written++;
      continue;
    }

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

    // Static content block inside #root (same h1/description/subtitle the
    // React app renders for this route).
    const staticData = resolveStatic(route);
    let rootReplacement: TagReplacement | null = null;
    if (staticData) {
      const staticBlock = buildStaticBlock(staticData, shell, route);
      const rootPattern = /<div id="root"><\/div>/;
      const rootMatch = html.match(rootPattern);
      if (!rootMatch) {
        failures.push(`${route}: built HTML is missing the empty <div id="root"></div> — cannot inject static block`);
        continue;
      }
      rootReplacement = {
        pattern: rootPattern,
        original: rootMatch[0],
        replacement: `<div id="root">${staticBlock}</div>`,
      };
      html = html.replace(rootPattern, () => rootReplacement!.replacement);
    } else {
      staticOnly.push(route);
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
    if (staticData) {
      if (!writtenHtml.includes(`<h1>${escapeText(staticData.h1)}</h1>`)) {
        checks.push('static h1 missing/wrong');
      }
      if (!writtenHtml.includes(`<p>${escapeText(staticData.description)}</p>`)) {
        checks.push('static description paragraph missing/wrong');
      }
      if (staticData.subtitle && !writtenHtml.includes(`<p>${escapeText(staticData.subtitle)}</p>`)) {
        checks.push('static subtitle missing/wrong');
      }
    }
    if (writtenHtml.includes(`<link rel="canonical" href="${HOME_CANONICAL}" />`)) {
      checks.push('still contains the homepage canonical');
    }
    // Round-trip: swapping the replacements back must reproduce the shell exactly.
    let roundTripped = writtenHtml;
    const allReplacements = rootReplacement ? [...replacements, rootReplacement] : replacements;
    for (const r of allReplacements) {
      roundTripped = roundTripped.replace(r.replacement, () => r.original);
    }
    if (roundTripped !== shell) {
      checks.push('file differs from shell outside the replaced head tags / static block');
    }
    if (checks.length > 0) {
      failures.push(`${route}: verification failed — ${checks.join('; ')}`);
      continue;
    }
    written++;
  }

  console.log(`inject-seo-head: wrote ${written} per-route files (sitemap routes, homepage included).`);
  if (canonicalOnly.length > 0) {
    console.log(
      `inject-seo-head: ${canonicalOnly.length} route(s) got canonical-only injection (no title/description resolved): ${canonicalOnly.join(', ')}`,
    );
  } else {
    console.log('inject-seo-head: every route got full title/description/canonical injection.');
  }
  if (staticOnly.length > 0) {
    console.log(
      `inject-seo-head: ${staticOnly.length} route(s) got no static block (no h1/description resolved): ${staticOnly.join(', ')}`,
    );
  } else {
    console.log('inject-seo-head: every route got a static content block in #root.');
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
