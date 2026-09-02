export interface ToolKeywordEntry {
  id: string;
  name: string;
  route: string;
  canonicalUrl: string;
  category: 'color' | 'palette' | 'accessibility' | 'developer' | 'image';
  hubRoute: string;
  primarySearchIntent: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  h1: string;
  seoTitle: string;
  metaDescription: string;
  usefulContentHighlights: string[];
  relatedTools: { name: string; route: string; context: string }[];
}

export interface HubCategorySEO {
  slug: string;
  route: string;
  canonicalUrl: string;
  name: string;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  leadParagraph: string;
  toolIds: string[];
  faqs: { question: string; answer: string }[];
  guides: { title: string; content: string }[];
}

export const SITE_URL = 'https://chromoraflow.vercel.app';

export const TOOLS_KEYWORD_MAP: ToolKeywordEntry[] = [
  {
    id: 'color-picker',
    name: 'Smart Color Picker & Inspector',
    route: '/color-picker',
    canonicalUrl: `${SITE_URL}/color-picker`,
    category: 'color',
    hubRoute: '/color-tools',
    primarySearchIntent: 'Find, inspect, and copy exact color codes across all digital and print spaces.',
    primaryKeyword: 'color picker online',
    secondaryKeywords: [
      'hex color code finder',
      'html color picker tool',
      'inspect rgb hsl cmyk oklch',
      'color values inspector',
      'color harmonies generator',
    ],
    h1: 'Online Color Picker & Color Explorer',
    seoTitle: 'Color Picker & Smart Color Explorer — Chromora',
    metaDescription:
      'Free online color picker and inspector. Explore HEX codes, RGB, HSL, HSV, CMYK, and OKLCH values, generate Tailwind 50-950 shade curves, and copy CSS design variables.',
    usefulContentHighlights: [
      'Interactive canvas color field and rainbow hue slider with hex eyedropper',
      'Simultaneous real-time conversion into 8 color spaces (HEX, RGB, HSL, CMYK, OKLCH, HSV, LAB, HWB)',
      'Harmonic color calculations (complementary, triadic, tetradic, analogous)',
      'One-click CSS root variables and Tailwind configuration generation',
    ],
    relatedTools: [
      { name: 'WCAG Contrast Checker', route: '/wcag-contrast-checker', context: 'Audit text contrast against background' },
      { name: 'Color Palette Generator', route: '/color-palette-generator', context: 'Build multi-color harmonic palettes' },
      { name: 'Multi-Space Color Converter', route: '/color-converter', context: 'Convert coordinates between 10 color spaces' },
      { name: 'Tailwind Shades Generator', route: '/color-shades-generator', context: 'Scale color into 50-950 design tokens' },
    ],
  },
  {
    id: 'color-palette-generator',
    name: 'Harmonic Color Palette Generator',
    route: '/color-palette-generator',
    canonicalUrl: `${SITE_URL}/color-palette-generator`,
    category: 'palette',
    hubRoute: '/palette-tools',
    primarySearchIntent: 'Create aesthetically cohesive, accessible 2-to-10 color palettes with customizable harmony rules.',
    primaryKeyword: 'color palette generator',
    secondaryKeywords: [
      'accessible color palette generator',
      'color scheme creator',
      'tailwind palette generator',
      'color harmony generator',
      'ui color palette maker',
    ],
    h1: 'Color Palette Generator',
    seoTitle: 'Color Palette Generator — Free Accessible UI Palettes & Design Tokens',
    metaDescription:
      'Generate harmonious, WCAG-accessible color palettes from any hex code. Explore 12 harmony models, lock colors, preview UI, and export Tailwind design tokens.',
    usefulContentHighlights: [
      '12 harmony algorithms (Analogous, Monochromatic, Triadic, Tetradic, Complementary, Pastel, Neon, Earthy)',
      'Individual swatch locking with Spacebar randomization engine',
      'Live luminance and contrast auditing for every swatch',
      'Direct export to Tailwind CSS, SCSS, CSS variables, Flutter, React Native, PNG card, and JSON tokens',
    ],
    relatedTools: [
      { name: 'Design Preview Studio', route: '/design-preview', context: 'Test palette on live SaaS dashboard components' },
      { name: 'WCAG Contrast Checker', route: '/wcag-contrast-checker', context: 'Verify accessibility compliance' },
      { name: 'Image Color Extractor', route: '/image-color-extractor', context: 'Extract palettes from photographs' },
      { name: 'AI Palette Generator', route: '/ai-palette-generator', context: 'Generate schemes from natural prompts' },
    ],
  },
  {
    id: 'ai-palette-generator',
    name: 'AI Palette Generator',
    route: '/ai-palette-generator',
    canonicalUrl: `${SITE_URL}/ai-palette-generator`,
    category: 'palette',
    hubRoute: '/palette-tools',
    primarySearchIntent: 'Generate thematic color palettes from text prompts and mood descriptions.',
    primaryKeyword: 'ai color palette generator',
    secondaryKeywords: [
      'prompt to color palette',
      'mood color palette generator',
      'natural language color palette',
      'brand theme color generator',
    ],
    h1: 'AI Color Palette Generator',
    seoTitle: 'AI Color Palette Generator — Natural Prompt to Hex Schemes',
    metaDescription:
      'Generate tailored color palettes from natural prompts, moods, themes, and brand aesthetics using intelligent color theory algorithms.',
    usefulContentHighlights: [
      'Prompt-driven palette synthesis mapping emotive keywords to calibrated color coordinates',
      'Preset mood prompts covering Cyberpunk, Nordic Interior, Vintage Cafe, Midnight Ocean, and Pastel Sunset',
      'Instant color adjustments, locking, and export to developer tokens',
    ],
    relatedTools: [
      { name: 'Color Palette Generator', route: '/color-palette-generator', context: 'Refine palettes with geometric harmony rules' },
      { name: 'Design Preview Studio', route: '/design-preview', context: 'Preview prompt-generated palettes on live UI' },
      { name: 'Color Shades Generator', route: '/color-shades-generator', context: 'Create 50-950 UI scales for each color' },
    ],
  },
  {
    id: 'image-color-extractor',
    name: 'Image Color Extractor',
    route: '/image-color-extractor',
    canonicalUrl: `${SITE_URL}/image-color-extractor`,
    category: 'image',
    hubRoute: '/image-color-tools',
    primarySearchIntent: 'Extract dominant color palettes and pick exact hex codes from uploaded images or photographs.',
    primaryKeyword: 'image color extractor',
    secondaryKeywords: [
      'color palette from image',
      'extract colors from photo',
      'picture to hex color palette',
      'image eyedropper tool online',
      'dominant color finder',
    ],
    h1: 'Image Color Palette Extractor',
    seoTitle: 'Image Color Extractor — Create a Palette From Any Image',
    metaDescription:
      'Extract beautiful color palettes and inspect individual pixels from any image or photo. 100% client-side privacy with instant HEX, RGB, and Tailwind export.',
    usefulContentHighlights: [
      'Drag-and-drop support for PNG, JPG, WEBP, and SVG with zero server uploads (100% private in-browser canvas)',
      'Client-side Euclidean distance RGB color clustering to isolate 3 to 10 dominant tones',
      'Precision loupe magnifying eyedropper for single-pixel color inspection',
      'One-click export to design tokens, palette editor, and CSS',
    ],
    relatedTools: [
      { name: 'Color Palette Generator', route: '/color-palette-generator', context: 'Expand photo colors into complete harmonies' },
      { name: 'Smart Color Explorer', route: '/color-picker', context: 'Inspect extracted hex codes in depth' },
      { name: 'WCAG Contrast Checker', route: '/wcag-contrast-checker', context: 'Check contrast of extracted photo colors' },
    ],
  },
  {
    id: 'wcag-contrast-checker',
    name: 'WCAG 2.1 Contrast Checker',
    route: '/wcag-contrast-checker',
    canonicalUrl: `${SITE_URL}/wcag-contrast-checker`,
    category: 'accessibility',
    hubRoute: '/accessibility-tools',
    primarySearchIntent: 'Audit color contrast ratios to meet WCAG 2.1 AA and AAA accessibility standards.',
    primaryKeyword: 'wcag contrast checker',
    secondaryKeywords: [
      'color contrast checker',
      'accessible color ratio test',
      'wcag aa aaa compliance checker',
      'text contrast calculator',
      'ada compliance color contrast',
    ],
    h1: 'WCAG 2.1 Color Contrast Checker',
    seoTitle: 'WCAG Contrast Checker — Check Color Accessibility & Ratios',
    metaDescription:
      'Audit color contrast ratios against WCAG 2.1 Level AA & AAA accessibility standards. Real-time compliance scoring, smart auto-fix suggestions, and daltonism previews.',
    usefulContentHighlights: [
      'Mathematical relative luminance computation according to W3C WCAG 2.1 specs',
      'Instant pass/fail rating for Normal Text (4.5:1 / 7:1), Large Text (3:1 / 4.5:1), and UI Components (3:1)',
      'Smart suggestion engine that automatically shifts lightness to reach minimum passing thresholds',
      'Color blindness matrix preview simulating contrast under 8 visual deficiencies',
    ],
    relatedTools: [
      { name: 'Color Blindness Simulator', route: '/color-blindness-simulator', context: 'Simulate full interfaces under deuteranopia and protanopia' },
      { name: 'Smart Color Explorer', route: '/color-picker', context: 'Find accessible alternative shades' },
      { name: 'Design Preview Studio', route: '/design-preview', context: 'Inspect accessible color schemes in real mockups' },
    ],
  },
  {
    id: 'gradient-generator',
    name: 'CSS Gradient Studio',
    route: '/gradient-generator',
    canonicalUrl: `${SITE_URL}/gradient-generator`,
    category: 'developer',
    hubRoute: '/developer-color-tools',
    primarySearchIntent: 'Build custom linear, radial, conic, and mesh CSS gradients with wide-gamut interpolation.',
    primaryKeyword: 'css gradient generator',
    secondaryKeywords: [
      'gradient generator',
      'linear gradient css generator',
      'radial conic mesh gradient tool',
      'tailwind gradient generator',
      'oklch gradient interpolation',
    ],
    h1: 'CSS Gradient Studio & Generator',
    seoTitle: 'CSS Gradient Generator — Linear, Radial & Mesh Gradients',
    metaDescription:
      'Create smooth linear, radial, conic, and mesh CSS gradients with wide-gamut OKLCH interpolation. Export clean CSS, Tailwind utility classes, and SVG graphics.',
    usefulContentHighlights: [
      'Multi-stop gradient builder with precise angle, radial shape, and position controls',
      'Perceptually uniform color interpolation using OKLCH and Linear RGB to prevent gray dead zones',
      'Preset gallery featuring glassmorphism, sunrise, iridescent, and dark luxury gradients',
      'Direct copy for CSS background rules, Tailwind classes, and SVG canvas downloads',
    ],
    relatedTools: [
      { name: 'Smart Color Explorer', route: '/color-picker', context: 'Pick starting and ending gradient stops' },
      { name: 'Color Palette Generator', route: '/color-palette-generator', context: 'Turn palettes into multi-color gradients' },
      { name: 'Color Mixer Online', route: '/color-mixer', context: 'Simulate color blending step by step' },
    ],
  },
  {
    id: 'color-converter',
    name: 'Multi-Space Color Converter',
    route: '/color-converter',
    canonicalUrl: `${SITE_URL}/color-converter`,
    category: 'developer',
    hubRoute: '/developer-color-tools',
    primarySearchIntent: 'Convert color values between HEX, RGB, HSL, CMYK, OKLCH, LAB, HSV, and HWB simultaneously.',
    primaryKeyword: 'color converter',
    secondaryKeywords: [
      'hex to rgb converter',
      'rgb to hex converter',
      'hex to oklch converter',
      'cmyk to rgb converter',
      'color format conversion tool',
    ],
    h1: 'Multi-Space Color Converter',
    seoTitle: 'Multi-Way Color Converter — HEX, RGB, HSL, CMYK & OKLCH',
    metaDescription:
      'Convert color values between HEX, RGB, HSL, CMYK, OKLCH, CIELAB, and HSV with high mathematical precision. Copy ready-to-use CSS syntax with one click.',
    usefulContentHighlights: [
      'Bi-directional synchronization across 10 digital and print color spaces',
      'Support for modern CSS Color Level 4 specifications (oklch, oklab, display-p3)',
      'Exact formulas and spectral conversions without loss of precision',
      'Interactive visual preview with one-click clipboard copying',
    ],
    relatedTools: [
      { name: 'HEX to RGB Converter', route: '/hex-to-rgb', context: 'Dedicated high-speed HEX to RGB conversion' },
      { name: 'HEX to OKLCH Converter', route: '/hex-to-oklch', context: 'Convert to modern perceptual CSS coordinates' },
      { name: 'Pantone & RAL Converter', route: '/pantone-color-converter', context: 'Find closest physical print swatches' },
    ],
  },
  {
    id: 'color-shades-generator',
    name: 'Color Shades & Tints Generator',
    route: '/color-shades-generator',
    canonicalUrl: `${SITE_URL}/color-shades-generator`,
    category: 'developer',
    hubRoute: '/developer-color-tools',
    primarySearchIntent: 'Generate Tailwind 50-950 color scale objects and tint/shade ramp ladders.',
    primaryKeyword: 'color shades generator',
    secondaryKeywords: [
      'tailwind color scale generator',
      'shades and tints generator',
      'tailwind 50 to 900 color ladder',
      'design system tonal palette',
      'monochromatic color scale maker',
    ],
    h1: 'Color Shades & Tints Generator',
    seoTitle: 'Color Shades Generator — Tailwind 50-950 Tonal Scales',
    metaDescription:
      'Generate complete 50-950 Tailwind color scales, tint ladders, and shade ramps from any base HEX color with automated WCAG contrast validation.',
    usefulContentHighlights: [
      'Calculates 11-step Tailwind tonal scales (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)',
      'Perceptually adjusted lightness curves to prevent muddy darks or washed-out lights',
      'Contrast preview on dark (#0F172A) and light (#FFFFFF) backgrounds for every step',
      'Direct copy as `tailwind.config.js` theme object or CSS custom properties',
    ],
    relatedTools: [
      { name: 'WCAG Contrast Checker', route: '/wcag-contrast-checker', context: 'Verify contrast of each generated step' },
      { name: 'Design Preview Studio', route: '/design-preview', context: 'Apply generated scales to UI mockups' },
      { name: 'Smart Color Explorer', route: '/color-picker', context: 'Select root brand color for scaling' },
    ],
  },
  {
    id: 'color-mixer',
    name: 'Color Mixer Online',
    route: '/color-mixer',
    canonicalUrl: `${SITE_URL}/color-mixer`,
    category: 'color',
    hubRoute: '/color-tools',
    primarySearchIntent: 'Mix and blend two or more colors with proportion sliders in sRGB and OKLCH spaces.',
    primaryKeyword: 'color mixer online',
    secondaryKeywords: [
      'color blend simulator',
      'mix colors online',
      'oklch color blender',
      'additive vs subtractive color mixing',
      'color gradient steps generator',
    ],
    h1: 'Online Color Mixer & Blender',
    seoTitle: 'Color Mixer Online — Blend Colors in OKLCH & RGB Spaces',
    metaDescription:
      'Blend two or more colors with variable ratio sliders in OKLCH, Linear RGB, and physical subtractive color simulation. Inspect intermediate palette swatches.',
    usefulContentHighlights: [
      'Compare standard sRGB interpolation against perceptually uniform OKLCH blending',
      'Adjustable mixing percentage slider (0% to 100%) with intermediate steps breakdown',
      'Subtractive pigment simulation replicating real-world acrylic paint mixing',
      'Export resulting mix to palette generator or design tokens',
    ],
    relatedTools: [
      { name: 'CSS Gradient Studio', route: '/gradient-generator', context: 'Turn blended stops into smooth CSS gradients' },
      { name: 'Interactive Color Wheel', route: '/color-wheel', context: 'Explore spectral angles before mixing' },
      { name: 'Color Palette Generator', route: '/color-palette-generator', context: 'Save blended swatches as complete palette' },
    ],
  },
  {
    id: 'color-blindness-simulator',
    name: 'Color Blindness Simulator',
    route: '/color-blindness-simulator',
    canonicalUrl: `${SITE_URL}/color-blindness-simulator`,
    category: 'accessibility',
    hubRoute: '/accessibility-tools',
    primarySearchIntent: 'Simulate color palettes and UI designs under 8 forms of color vision deficiency.',
    primaryKeyword: 'color blindness simulator',
    secondaryKeywords: [
      'daltonism test simulator',
      'protanopia deuteranopia color test',
      'accessible color blindness test',
      'color vision deficiency checker',
      'achromatopsia simulator',
    ],
    h1: 'Color Blindness Simulator',
    seoTitle: 'Color Blindness Simulator — Test Protanopia & Deuteranopia',
    metaDescription:
      'Simulate 8 color vision deficiencies including Protanopia, Deuteranopia, Tritanopia, and Achromatopsia using scientific Brettel-Vienot matrix algorithms.',
    usefulContentHighlights: [
      'Scientific Brettel, Vienot, and Mollon matrix transformation algorithms',
      'Simulates Red-Blindness (Protanopia), Green-Blindness (Deuteranopia), Blue-Blindness (Tritanopia), and Total Color Blindness (Achromatopsia)',
      'Side-by-side comparison of normal vision versus color-deficient perception',
      'Actionable recommendations for inclusive color choices (e.g. redundant iconography, texture cues)',
    ],
    relatedTools: [
      { name: 'WCAG Contrast Checker', route: '/wcag-contrast-checker', context: 'Ensure high contrast for vision-impaired users' },
      { name: 'Design Preview Studio', route: '/design-preview', context: 'Simulate UI mockups under daltonism' },
      { name: 'Color Palette Generator', route: '/color-palette-generator', context: 'Build accessible palettes from scratch' },
    ],
  },
  {
    id: 'pantone-color-converter',
    name: 'Pantone & RAL Converter',
    route: '/pantone-color-converter',
    canonicalUrl: `${SITE_URL}/pantone-color-converter`,
    category: 'developer',
    hubRoute: '/developer-color-tools',
    primarySearchIntent: 'Find the closest Pantone Solid Coated and RAL Classic paint matches for any hex or RGB code.',
    primaryKeyword: 'pantone color converter',
    secondaryKeywords: [
      'hex to pantone converter',
      'rgb to ral converter',
      'closest pantone match finder',
      'pms color converter online',
      'cmyk to pantone tool',
    ],
    h1: 'Pantone & RAL Color Match Converter',
    seoTitle: 'Pantone & RAL Converter — Digital to PMS & RAL Match',
    metaDescription:
      'Match digital HEX and RGB colors to the closest physical Pantone PMS Formula Guide Solid Coated and RAL Classic standards using CIE Delta E 2000 metrics.',
    usefulContentHighlights: [
      'Delta E (CIE2000) perceptual distance algorithm calculating closest commercial swatches',
      'Covers Pantone Solid Coated (PMS) and RAL Classic physical color systems',
      'Provides digital screen RGB approximations and CMYK offset print formulations',
      'Includes perceptual match accuracy indicator and substrate print guidelines',
    ],
    relatedTools: [
      { name: 'Multi-Space Color Converter', route: '/color-converter', context: 'Convert coordinates to CMYK for print' },
      { name: 'Smart Color Explorer', route: '/color-picker', context: 'Inspect digital source colors' },
      { name: 'Favicon Generator', route: '/favicon-generator', context: 'Generate brand assets from physical colors' },
    ],
  },
  {
    id: 'favicon-generator',
    name: 'Favicon & App Icon Maker',
    route: '/favicon-generator',
    canonicalUrl: `${SITE_URL}/favicon-generator`,
    category: 'developer',
    hubRoute: '/developer-color-tools',
    primarySearchIntent: 'Generate complete multi-resolution favicon ZIP packages, Apple touch icons, and webmanifest files.',
    primaryKeyword: 'favicon generator',
    secondaryKeywords: [
      'favicon maker online',
      'generate ico and apple touch icon',
      'pwa webmanifest icon generator',
      'emoji to favicon maker',
      'svg favicon package generator',
    ],
    h1: 'Favicon & App Icon Generator',
    seoTitle: 'Favicon Generator — Make ICO, PNG & Apple Touch Icons',
    metaDescription:
      'Generate standard ICO, PNG, Apple Touch, and Android PWA favicons from text, emoji, or custom colors with ready-to-paste HTML header snippets.',
    usefulContentHighlights: [
      'Generates 16x16, 32x32, 48x48 ICO files, 180x180 Apple Touch icons, and 192x192 / 512x512 PWA icons',
      'Custom text, emoji, or uploaded icon rendering on color-matched circular/squircle backgrounds',
      'Generates clean `site.webmanifest` and HTML `<head>` link tags for one-click deployment',
      'Client-side ZIP packaging and instant download',
    ],
    relatedTools: [
      { name: 'Smart Color Explorer', route: '/color-picker', context: 'Pick exact brand colors for icon background' },
      { name: 'WCAG Contrast Checker', route: '/wcag-contrast-checker', context: 'Test icon text readability at 16x16' },
      { name: 'Design Preview Studio', route: '/design-preview', context: 'Preview brand identity across web pages' },
    ],
  },
  {
    id: 'color-wheel',
    name: 'Interactive Color Wheel & Harmonies',
    route: '/color-wheel',
    canonicalUrl: `${SITE_URL}/color-wheel`,
    category: 'color',
    hubRoute: '/color-tools',
    primarySearchIntent: 'Explore interactive 360-degree color wheel geometries and classical harmony rules.',
    primaryKeyword: 'color wheel online',
    secondaryKeywords: [
      'interactive color wheel',
      'color harmonies wheel',
      'complementary triadic color wheel',
      'hsl color wheel explorer',
      'color theory visualizer',
    ],
    h1: 'Interactive Color Wheel & Harmonies',
    seoTitle: 'Interactive Color Wheel — 360° HSL Wheel & Harmonies',
    metaDescription:
      'Explore color theory with our interactive 360° color wheel. Discover complementary, analogous, triadic, tetradic, and split-complementary color schemes.',
    usefulContentHighlights: [
      'Interactive 360° geometric canvas visualizing angular color relationships',
      'Dynamic visual chords for Complementary (180°), Triadic (120°), Tetradic (90°), and Analogous (30°)',
      'Switch between RGB screen additive wheel, RYB artist subtractive wheel, and perceptual HSL wheels',
      'Direct color synchronization with Chromora palette and contrast tools',
    ],
    relatedTools: [
      { name: 'Color Palette Generator', route: '/color-palette-generator', context: 'Convert wheel harmonies into production palettes' },
      { name: 'Color Mixer Online', route: '/color-mixer', context: 'Simulate physical blending of wheel colors' },
      { name: 'Smart Color Explorer', route: '/color-picker', context: 'Inspect exact coordinates on the wheel' },
    ],
  },
  {
    id: 'random-color-generator',
    name: 'Random Color & Palette Generator',
    route: '/random-color-generator',
    canonicalUrl: `${SITE_URL}/random-color-generator`,
    category: 'palette',
    hubRoute: '/palette-tools',
    primarySearchIntent: 'Generate random curated color codes and inspiration palettes filtered by mood.',
    primaryKeyword: 'random color generator',
    secondaryKeywords: [
      'random hex color generator',
      'random palette generator',
      'random pastel neon color picker',
      'spacebar color generator',
      'generate random color codes',
    ],
    h1: 'Random Color & Palette Generator',
    seoTitle: 'Random Color Generator — Generate Random Hex & Palettes',
    metaDescription:
      'Generate random hex colors and full palettes with spacebar rolling. Filter by vibrant, pastel, neon, vintage, dark mode, or earthy aesthetics.',
    usefulContentHighlights: [
      'Single-key rapid generation (Spacebar) for quick creative discovery',
      'Aesthetic curation filters (Vibrant, Pastel, Neon, Vintage, Dark Mode, Earthy, Warm, Cool)',
      'Instant copy for HEX, RGB, HSL, and OKLCH color strings',
      'Direct one-click export to palette generator, shades tool, and design preview',
    ],
    relatedTools: [
      { name: 'Color Palette Generator', route: '/color-palette-generator', context: 'Fine-tune randomly generated palettes' },
      { name: 'Design Preview Studio', route: '/design-preview', context: 'Test random schemes on live UI mockups' },
      { name: 'Smart Color Explorer', route: '/color-picker', context: 'Inspect individual random color values' },
    ],
  },
  {
    id: 'design-preview',
    name: 'Design Preview Studio',
    route: '/design-preview',
    canonicalUrl: `${SITE_URL}/design-preview`,
    category: 'developer',
    hubRoute: '/developer-color-tools',
    primarySearchIntent: 'Preview and validate color palettes on realistic UI mockups before writing code.',
    primaryKeyword: 'ui color palette preview',
    secondaryKeywords: [
      'test color scheme on mockup',
      'saas dashboard theme preview',
      'mobile app color simulator',
      'live ui palette tester',
      'design system preview tool',
    ],
    h1: 'Live UI Design Color Palette Simulator',
    seoTitle: 'Live UI Design Preview & Palette Simulator — Chromora',
    metaDescription:
      'Test your color palette against realistic SaaS dashboard interfaces, mobile app mockups, store cards, and social media templates with real-time theme swapping.',
    usefulContentHighlights: [
      '4 realistic responsive application mockups: Analytics Dashboard, Mobile Health App, E-Commerce Product Card, and Marketing Hero',
      'Real-time semantic token mapping (Primary, Secondary, Background, Surface, Accent, Text, Border)',
      'Instant Light and Dark mode toggle for rapid theme validation',
      'WCAG legibility evaluation directly on interface elements',
    ],
    relatedTools: [
      { name: 'Color Palette Generator', route: '/color-palette-generator', context: 'Modify base palette colors in real time' },
      { name: 'WCAG Contrast Checker', route: '/wcag-contrast-checker', context: 'Audit UI elements for accessibility' },
      { name: 'Color Shades Generator', route: '/color-shades-generator', context: 'Generate full tonal scale for the interface' },
    ],
  },
];

export const HUB_CATEGORIES: Record<string, HubCategorySEO> = {
  'color-tools': {
    slug: 'color-tools',
    route: '/color-tools',
    canonicalUrl: `${SITE_URL}/color-tools`,
    name: 'Color Exploration & Science Tools',
    h1: 'Free Online Color Tools — Exploration, Science & Color Wheels',
    seoTitle: 'Free Online Color Tools — Color Picker, Wheel & Mixer Suite',
    metaDescription:
      'Explore our suite of free online color tools for designers and developers. Inspect hex codes, explore 360° color wheels, mix colors in OKLCH, and search 1,000+ named colors.',
    leadParagraph:
      'Whether you are choosing a brand accent color, exploring classical color harmonies, or mixing paint-accurate color shades, Chromora provides fast, client-side tools designed for modern digital and print workflows.',
    toolIds: ['color-picker', 'color-wheel', 'color-mixer', 'color-converter'],
    faqs: [
      {
        question: 'What makes Chromora color tools different from standard online pickers?',
        answer:
          'Chromora color tools are built around modern wide-gamut color science (including OKLCH and CIELAB) alongside classic RGB and HSL screen coordinates. Everything calculates client-side in your browser with zero latency and complete privacy.',
      },
      {
        question: 'How do I find complementary and triadic harmonies on the color wheel?',
        answer:
          'Our Interactive Color Wheel calculates geometric angles automatically. Select any base color to see exact mathematical chords for Complementary (180°), Triadic (120°), and Analogous (30°) relationships with one-click export to your palette.',
      },
      {
        question: 'What color formats can I copy from Chromora tools?',
        answer:
          'You can copy HEX, RGB, HSL, HSV, CMYK, OKLCH, OKLAB, CIELAB, CSS custom properties, and Tailwind utility configuration objects.',
      },
    ],
    guides: [
      {
        title: 'Mastering Digital Color Spaces (HEX, RGB, HSL vs OKLCH)',
        content:
          'Modern web design is transitioning from standard sRGB (HEX and standard RGB) to perceptually uniform color spaces like OKLCH. In sRGB, two colors with the same mathematical lightness value (like pure yellow and pure blue) appear drastically different in perceived brightness to the human eye. OKLCH solves this by decoupling lightness, chroma, and hue into a perceptually uniform cylindrical space, enabling smooth gradient transitions without muddy gray zones.',
      },
      {
        title: 'Using Geometric Harmony Rules in UI Design',
        content:
          'Applying color harmony rules ensures visual balance across your digital products. Analogous schemes (adjacent on the wheel) create peaceful, unified moods suitable for content reading. Complementary schemes (opposite on the wheel) create maximum optical contrast, perfect for call-to-action buttons and primary alerts. Triadic and Tetradic schemes introduce vibrant variety while maintaining systematic mathematical balance.',
      },
    ],
  },

  'palette-tools': {
    slug: 'palette-tools',
    route: '/palette-tools',
    canonicalUrl: `${SITE_URL}/palette-tools`,
    name: 'Color Palette Generators & Scheme Creators',
    h1: 'Color Palette Generators & Color Scheme Creators',
    seoTitle: 'Color Palette Generators — Free Accessible Schemes & Moods',
    metaDescription:
      'Generate harmonious, accessible color schemes with our free suite of palette generators. Create palettes using AI prompts, geometric harmony rules, random discovery, and image extraction.',
    leadParagraph:
      'Build cohesive, production-ready color palettes in seconds. From 12-rule geometric harmony engines and natural prompt AI generators to mood-filtered random rolling and curated aesthetic collections.',
    toolIds: ['color-palette-generator', 'ai-palette-generator', 'image-color-extractor', 'random-color-generator'],
    faqs: [
      {
        question: 'How do I generate a color palette that complies with WCAG accessibility?',
        answer:
          'Use the Harmonic Color Palette Generator or AI Palette Generator. Both tools calculate real-time luminance contrast ratios against light (#FFFFFF) and dark (#0F172A) surfaces for every swatch, flagging passing and failing elements before export.',
      },
      {
        question: 'Can I lock specific colors while randomizing others?',
        answer:
          'Yes! Click the lock icon on any swatch in the Palette Generator. Locked colors remain fixed while pressing Spacebar algorithmically discovers matching harmonious colors for all remaining unlocked slots.',
      },
      {
        question: 'How do I export my palette to design systems and frontend code?',
        answer:
          'Chromora provides one-click export to Tailwind CSS config objects, CSS `:root` variables, SCSS variables, Flutter Color classes, React Native theme files, and W3C JSON design tokens for Figma.',
      },
    ],
    guides: [
      {
        title: 'The 60-30-10 Rule for Interface Color Distribution',
        content:
          'When designing user interfaces, balance your palette using the classic 60-30-10 rule. Allocate 60% of the canvas to dominant neutral foundation colors (backgrounds, surfaces, cards), 30% to structural secondary elements (typography, sidebars, borders), and 10% to high-contrast accent colors (primary CTA buttons, active state indicators, focus rings). This prevents visual clutter and guides user focus intuitively.',
      },
      {
        title: 'Building Multi-Shade Semantic Palettes for Web Apps',
        content:
          'A modern design system requires more than 5 flat hex codes. For each primary brand color, generate a full 50-950 tonal ladder to cover hover states, active states, subdued backgrounds, and focus borders. Use Chromora’s Color Shades Generator alongside the Palette Generator to produce production-grade semantic token scales.',
      },
    ],
  },

  'accessibility-tools': {
    slug: 'accessibility-tools',
    route: '/accessibility-tools',
    canonicalUrl: `${SITE_URL}/accessibility-tools`,
    name: 'Color Accessibility & WCAG Compliance Suite',
    h1: 'Color Accessibility Tools — WCAG Contrast & Daltonism Auditing',
    seoTitle: 'Color Accessibility Tools — WCAG Contrast & Color Blindness',
    metaDescription:
      'Audit color accessibility for websites and digital products. Test WCAG 2.1 AA/AAA contrast ratios, simulate 8 forms of color vision deficiency, and get smart auto-fixes.',
    leadParagraph:
      'Ensure your web applications and digital designs are inclusive, accessible, and fully compliant with international WCAG 2.1 Level AA and AAA standards as well as ADA digital compliance requirements.',
    toolIds: ['wcag-contrast-checker', 'color-blindness-simulator', 'design-preview', 'color-shades-generator'],
    faqs: [
      {
        question: 'What are the minimum WCAG 2.1 contrast ratio requirements?',
        answer:
          'WCAG 2.1 Level AA requires a minimum contrast ratio of 4.5:1 for normal text (under 18pt or 14pt bold) and 3:1 for large text (18pt+ or 14pt+ bold) and user interface components. Level AAA requires 7:1 for normal text and 4.5:1 for large text.',
      },
      {
        question: 'How does the Color Blindness Simulator help designers?',
        answer:
          'Over 8% of men and 0.5% of women experience Color Vision Deficiency (CVD). Our simulator renders palettes through scientific Brettel-Vienot matrices for Protanopia, Deuteranopia, Tritanopia, and Achromatopsia, allowing you to catch illegible combinations early.',
      },
      {
        question: 'How does the smart contrast auto-fix work?',
        answer:
          'When a color pair fails WCAG AA, Chromora computes the exact shift in relative luminance needed to reach a 4.5:1 or 7:1 ratio while preserving your original hue and chroma as closely as mathematically possible.',
      },
    ],
    guides: [
      {
        title: 'Understanding WCAG Relative Luminance Mathematics',
        content:
          'The W3C calculates contrast ratio as (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter color and L2 is the relative luminance of the darker color (both normalized between 0 for darkest black and 1 for brightest white). Because human perception is non-linear, linear RGB values are gamma-corrected (sRGB compressed) before computing perceived luminance. Chromora performs exact floating-point calculations to ensure 100% precision.',
      },
      {
        title: 'Designing for Color Vision Deficiency (Daltonism)',
        content:
          'Never rely on color alone to convey critical state or information. Pair color cues with secondary visual affordances such as distinct typography, iconography (checkmarks, warning triangles), text underlines on hyperlinks, and clear tactile border styling. Always test error, warning, and success badge colors in our Color Blindness Simulator.',
      },
    ],
  },

  'developer-color-tools': {
    slug: 'developer-color-tools',
    route: '/developer-color-tools',
    canonicalUrl: `${SITE_URL}/developer-color-tools`,
    name: 'Developer Color Tools & Design System Utilities',
    h1: 'Developer Color Tools — Tailwind Scales, Formats & Design Tokens',
    seoTitle: 'Developer Color Tools — Tailwind Scales, Formats & Tokens',
    metaDescription:
      'Developer-first color utilities. Generate Tailwind 50-950 scales, convert across 10 color spaces (HEX, RGB, OKLCH, CMYK), build CSS gradients, and export design tokens.',
    leadParagraph:
      'Engineered specifically for frontend engineers and design system architects. Transform raw color values into clean Tailwind configuration objects, CSS custom properties, W3C design tokens, and production favicon bundles.',
    toolIds: ['color-shades-generator', 'color-converter', 'gradient-generator', 'favicon-generator', 'pantone-color-converter'],
    faqs: [
      {
        question: 'How do I export color scales to Tailwind CSS v3 and v4?',
        answer:
          'In our Color Shades Generator or Palette Generator, click Export Tokens and select "Tailwind CSS". You can copy the JavaScript theme object for `tailwind.config.js` or the modern `@theme` CSS custom properties for Tailwind v4.',
      },
      {
        question: 'Why should developers use OKLCH in modern CSS?',
        answer:
          'OKLCH is natively supported in all modern evergreen browsers via `color: oklch(L C H)`. It allows programmatic manipulation of lightness and chroma without accidental hue shifts, making dynamic dark mode theming far more predictable than HSL.',
      },
      {
        question: 'What format do the design tokens follow?',
        answer:
          'Tokens are exported in standard W3C Design Tokens Community Group (DTCG) JSON format, making them instantly compatible with Style Dictionary, Figma Tokens Studio, Supernova, and Tokens Studio for Figma.',
      },
    ],
    guides: [
      {
        title: 'Architecting Scalable Design System Color Tokens',
        content:
          'A resilient design system organizes colors into three distinct layers: 1) Global Primitive Tokens (e.g. `blue-500: #3B82F6`), 2) Semantic Purpose Tokens (e.g. `surface-action-primary: var(--blue-500)`), and 3) Component-Scoped Tokens (e.g. `btn-primary-bg: var(--surface-action-primary)`). Chromora’s export engine outputs formatted variables across all three abstraction tiers.',
      },
      {
        title: 'Automating Favicon and App Icon Packages for Modern Web Apps',
        content:
          'A complete web asset bundle requires legacy 16x16 and 32x32 `.ico` files for desktop browser tabs, 180x180 PNGs for iOS Apple Touch icons, and 192x192 / 512x512 PNGs alongside a `site.webmanifest` for Android and Progressive Web Apps (PWAs). Chromora generates this entire production archive client-side in a single `.zip` file.',
      },
    ],
  },

  'image-color-tools': {
    slug: 'image-color-tools',
    route: '/image-color-tools',
    canonicalUrl: `${SITE_URL}/image-color-tools`,
    name: 'Image Color Extraction & Eyedropper Tools',
    h1: 'Image Color Tools — Palette Extraction & Photo Eyedropper',
    seoTitle: 'Image Color Tools — Extract Palettes From Any Photo',
    metaDescription:
      'Extract beautiful color palettes and sample individual pixels from any image or photo. 100% private in-browser canvas processing with instant HEX, RGB, and Tailwind export.',
    leadParagraph:
      'Upload any photograph, logo, screenshot, or digital artwork to extract dominant color schemes and inspect exact pixel coordinates with our precision loupe magnifying eyedropper.',
    toolIds: ['image-color-extractor', 'color-palette-generator', 'color-picker', 'design-preview'],
    faqs: [
      {
        question: 'Is it safe to upload proprietary brand assets and images to Chromora?',
        answer:
          'Yes, 100% safe. Chromora processes all images entirely on your local machine using the HTML5 Canvas API in your browser. No image data, pixels, or filenames are ever uploaded to any external server.',
      },
      {
        question: 'How does client-side color quantization extract dominant tones?',
        answer:
          'Our extraction engine samples canvas pixel data and performs 3D Euclidean distance color clustering in RGB space. It merges near-identical shades and sorts clusters by frequency and visual prominence to surface 3 to 10 balanced dominant colors.',
      },
      {
        question: 'Can I extract colors from SVG files and screenshots?',
        answer:
          'Yes. Chromora accepts PNG, JPG, JPEG, WEBP, and SVG formats via drag-and-drop or manual file selection.',
      },
    ],
    guides: [
      {
        title: 'Creating Mood-Aligned Palettes from Environmental Photography',
        content:
          'Photographs of natural landscapes, architectural interiors, and cinematic stills contain organic color balance perfected by nature and cinematography. By extracting palettes directly from high-resolution imagery, designers can quickly capture authentic mood aesthetics (like Japanese Wabi-Sabi earth tones or Nordic minimalism) and transfer them directly into UI designs.',
      },
      {
        title: 'Auditing Brand Identity Consistency from Product Imagery',
        content:
          'Use the precision loupe eyedropper to inspect subtle lighting falloffs, shadows, and highlights in product photography. Verify that marketing imagery aligns with your official brand style guide HEX and Pantone coordinates across all digital touchpoints.',
      },
    ],
  },
};
