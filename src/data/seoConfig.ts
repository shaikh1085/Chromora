import { SEOConfig, FAQItem } from '../types';

export interface RouteSEOData {
  route: string;
  canonicalUrl: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogType?: 'website' | 'article';
  schemaType?: 'SoftwareApplication' | 'WebApplication' | 'WebPage';
  appName?: string;
  appCategory?: string;
  breadcrumbs: { name: string; url: string }[];
  faqs: FAQItem[];
}

export const SITE_URL = 'https://chromoraflow.vercel.app';
export const SITE_NAME = 'Chromora';

export const CORE_ROUTES_SEO: Record<string, RouteSEOData> = {
  '/': {
    route: '/',
    canonicalUrl: `${SITE_URL}/`,
    title: 'Free Color Tools for Designers & Developers — Chromora',
    h1: 'Free Color Tools for Designers & Developers',
    description:
      'Free color tools to create accessible palettes, check WCAG contrast, and convert HEX to OKLCH. Generate, test, and export design-ready colors online.',
    keywords: [
      'free color tools for designers and developers',
      'color palette generator',
      'color picker online',
      'wcag contrast checker',
      'image color extractor',
      'color converter hex to rgb',
      'hex to oklch converter',
      'css gradient generator',
      'tailwind color shades generator',
      'design system color tokens',
    ],
    ogTitle: 'Free Color Tools for Designers & Developers — Chromora',
    ogDescription:
      'Free color tools to create accessible palettes, check WCAG contrast, and convert HEX to OKLCH. Generate, test, and export design-ready colors online.',
    schemaType: 'WebApplication',
    appName: 'Chromora Color Platform',
    appCategory: 'DesignApplication',
    breadcrumbs: [{ name: 'Home', url: '/' }],
    faqs: [
      {
        question: 'What is Chromora and what color tools are included?',
        answer:
          'Chromora is an all-in-one free suite of professional color tools for web designers, UI/UX engineers, and developers. It includes an interactive Color Picker, Harmonic Palette Generator, WCAG 2.1 Contrast Checker, Image Palette Extractor, Multi-Space Color Converter (HEX, RGB, HSL, CMYK, OKLCH), CSS Gradient Studio, Tailwind Shades Generator, Color Blindness Simulator, Color Wheel, and Design Token Exporter.',
      },
      {
        question: 'How do I generate an accessible color palette with WCAG compliance?',
        answer:
          'With Chromora, you can enter any seed color in HEX, RGB, or OKLCH format. The tool automatically computes complementary, analogous, and triadic harmonies while calculating WCAG 2.1 AA and AAA contrast ratios against light (#FFFFFF) and dark (#0F172A) backgrounds in real time.',
      },
      {
        question: 'How do I convert HEX to RGB, OKLCH, CMYK, and Pantone colors?',
        answer:
          'Chromora features dedicated mathematical converters between standard digital screen coordinates (HEX, RGB, HSL), wide-gamut perceptual spaces (OKLCH, LAB), and physical print standards (CMYK, Pantone, RAL) with instant one-click copying.',
      },
      {
        question: 'Can I extract color palettes from images and photos?',
        answer:
          'Yes! Upload any PNG, JPG, or SVG image to the Image Color Extractor. Chromora performs client-side color quantization in your browser with 100% privacy to identify dominant tones and inspect individual pixels with a precision eyedropper.',
      },
      {
        question: 'How do I export color palettes to Tailwind CSS and Figma?',
        answer:
          'Chromora allows you to export entire color systems to Tailwind CSS 50–950 shade objects, CSS custom properties (:root variables), SCSS variables, and W3C standard JSON design tokens for Figma and design system libraries.',
      },
      {
        question: 'Is Chromora free to use without an account or tracking?',
        answer:
          'Yes. Chromora is 100% free and open to all creators. All color mathematics, image extraction, and token generation execute client-side directly in your browser with zero server telemetry or data tracking.',
      },
    ],
  },

  '/color-picker': {
    route: '/color-picker',
    canonicalUrl: `${SITE_URL}/color-picker`,
    title: 'Color Picker & Smart Color Explorer — Chromora',
    h1: 'Online Color Picker & Color Explorer',
    description:
      'Free online color picker and inspector. Explore HEX, RGB, HSL, HSV, CMYK, and OKLCH values, build Tailwind 50-950 shade curves, and copy CSS variables.',
    keywords: [
      'color picker online',
      'html color code finder',
      'hex color picker tool',
      'inspect hex rgb hsl cmyk oklch',
      'tailwind shades generator',
      'color values inspector',
    ],
    ogTitle: 'Color Picker & Smart Color Explorer — Chromora',
    ogDescription:
      'Inspect HEX, RGB, HSL, CMYK, OKLCH coordinates, view harmonic color combinations, and copy CSS tokens.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Color Picker & Explorer',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Color Picker', url: '/color-picker' },
    ],
    faqs: [
      {
        question: 'What color formats can I inspect with the Color Picker?',
        answer:
          'The Color Picker supports HEX (#RRGGBB), RGB (rgb(r, g, b)), HSL (hsl(h, s%, l%)), HSV/HSB, CMYK, OKLCH perceptual lightness, and standard CSS named color keywords.',
      },
      {
        question: 'How does the Color Picker generate Tailwind shade curves?',
        answer:
          'Chromora calculates mathematical luminance steps from 50 (lightest tint) to 950 (deepest shade), producing accessible, balanced 11-step palettes ready for tailwind.config.js.',
      },
      {
        question: 'What are perceptual color coordinates like OKLCH?',
        answer:
          'OKLCH aligns with human visual perception, ensuring that lightness remains consistent across all hue angles, avoiding the perceptual distortion common in traditional HSL color spaces.',
      },
    ],
  },

  '/color-palette-generator': {
    route: '/color-palette-generator',
    canonicalUrl: `${SITE_URL}/color-palette-generator`,
    title: 'Color Palette Generator — Create Harmonic Color Schemes | Chromora',
    h1: 'Color Palette Generator',
    description:
      'Generate harmonious, WCAG-accessible color palettes from any hex code. Explore 12 harmony models, lock colors, preview UI, and export Tailwind design tokens.',
    keywords: [
      'color palette generator',
      'accessible color schemes',
      'generate ui color palette',
      'complementary color palette maker',
      'tailwind palette generator',
      'hex color palette tool',
    ],
    ogTitle: 'Color Palette Generator — Create Harmonic Color Schemes | Chromora',
    ogDescription:
      'Generate 12 harmonic color schemes, lock colors, preview live UI dashboards, and export CSS & Figma tokens.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Color Palette Generator',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Palette Generator', url: '/color-palette-generator' },
    ],
    faqs: [
      {
        question: 'How do I generate a harmonious color palette?',
        answer:
          'Select your preferred harmony mode (analogous, complementary, triadic, split-complementary, or monochromatic), press Space to shuffle, and click the lock icon on colors you want to keep.',
      },
      {
        question: 'Can I test my palette on realistic UI components?',
        answer:
          'Yes! Click the "Design Preview" button to simulate your current palette on interactive SaaS dashboards, mobile app interfaces, and e-commerce cards.',
      },
      {
        question: 'How can I share or export my palette?',
        answer:
          'You can share palettes via direct URL links, download high-resolution PNG swatch cards for Instagram and design presentations, or export CSS, SCSS, JSON, and Tailwind tokens.',
      },
    ],
  },

  '/wcag-contrast-checker': {
    route: '/wcag-contrast-checker',
    canonicalUrl: `${SITE_URL}/wcag-contrast-checker`,
    title: 'WCAG Color Contrast Checker — ADA & WCAG 2.1 AA/AAA Tool | Chromora',
    h1: 'WCAG Color Contrast Checker',
    description:
      'Free WCAG 2.1 AAA/AA color contrast checker. Audit contrast ratios in real time, simulate color blindness, auto-fix failing contrast, and test UI components.',
    keywords: [
      'wcag contrast checker',
      'color contrast checker',
      'wcag 2.1 compliance tool',
      'check contrast ratio between two colors',
      'accessible text color generator',
      'color blindness simulator contrast',
      'ada color compliance checker',
    ],
    ogTitle: 'WCAG Color Contrast Checker — ADA & WCAG 2.1 AA/AAA Tool | Chromora',
    ogDescription:
      'Test contrast ratios for text and UI components against WCAG AA and AAA standards. Simulate color blindness and auto-fix failing pairs.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora WCAG Contrast Checker',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'WCAG Contrast Checker', url: '/wcag-contrast-checker' },
    ],
    faqs: [
      {
        question: 'What are the official WCAG 2.1 contrast ratio guidelines?',
        answer:
          'WCAG Level AA requires a minimum contrast ratio of 4.5:1 for normal body text and 3.0:1 for large text (18pt/24px or 14pt/18.6px bold) and user interface components. Level AAA requires at least 7.0:1 for normal text and 4.5:1 for large text.',
      },
      {
        question: 'How does the Smart Auto-Fix feature work?',
        answer:
          'When a color pair fails WCAG standards, clicking "Auto Fix" mathematically adjusts foreground lightness while preserving the underlying hue angle until the target 4.5:1 (AA) or 7.0:1 (AAA) threshold is met.',
      },
      {
        question: 'Why is checking color blindness critical for accessibility?',
        answer:
          'Approximately 8% of men and 0.5% of women experience color vision deficiency. Simulating conditions like Protanopia, Deuteranopia, and Tritanopia guarantees your interface conveys information effectively regardless of visual acuity.',
      },
    ],
  },

  '/image-color-extractor': {
    route: '/image-color-extractor',
    canonicalUrl: `${SITE_URL}/image-color-extractor`,
    title: 'Image Color Palette Extractor — Extract HEX & RGB from Photos | Chromora',
    h1: 'Image Color Palette Extractor',
    description:
      'Extract dominant color palettes and color codes from any image or screenshot. Sample pixels with a magnifying eyedropper. 100% private browser processing.',
    keywords: [
      'image color extractor',
      'extract color palette from image with hex codes',
      'photo color palette generator',
      'image eyedropper tool online',
      'get colors from picture free',
      'dominant colors from screenshot',
    ],
    ogTitle: 'Image Color Palette Extractor — Extract HEX & RGB from Photos | Chromora',
    ogDescription:
      'Extract dominant color palettes and sample pixels from any image with 100% private client-side browser processing.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Image Color Extractor',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Image Color Extractor', url: '/image-color-extractor' },
    ],
    faqs: [
      {
        question: 'How does the image color extraction algorithm work?',
        answer:
          'Chromora renders the image onto a client-side HTML5 canvas, samples pixel data across a discrete grid, clusters color coordinates using RGB Euclidean distance, and isolates dominant, harmonious tones.',
      },
      {
        question: 'Are my uploaded images stored or sent to an external server?',
        answer:
          'No. All image processing executes entirely within your browser memory. No images or pixel data are ever uploaded, transmitted, or stored on remote servers.',
      },
      {
        question: 'Can I sample individual pixels from the image?',
        answer:
          'Yes! Move your cursor across the image canvas to activate the precision magnifying eyedropper and click to copy any specific pixel HEX code.',
      },
    ],
  },

  '/color-converter': {
    route: '/color-converter',
    canonicalUrl: `${SITE_URL}/color-converter`,
    title: 'Multi-Space Color Converter — HEX, RGB, HSL, CMYK, OKLCH | Chromora',
    h1: 'Multi-Space Color Space Converter',
    description:
      'Convert colors across HEX, RGB, HSL, HSV, CMYK, and OKLCH spaces in real time. Precise color conversions for web developers, UI designers, and print media.',
    keywords: [
      'color converter online free',
      'hex to rgb converter',
      'rgb to hex converter',
      'hex to oklch converter',
      'cmyk to rgb converter',
      'hsl to rgb converter',
      'multi format color converter',
    ],
    ogTitle: 'Multi-Space Color Converter — HEX, RGB, HSL, CMYK, OKLCH | Chromora',
    ogDescription:
      'Instant mathematical color conversions between digital screens (HEX, RGB, HSL), perceptual spaces (OKLCH), and print (CMYK).',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Color Converter',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Color Converter', url: '/color-converter' },
    ],
    faqs: [
      {
        question: 'How do digital screen colors (RGB) differ from print colors (CMYK)?',
        answer:
          'RGB is an additive color model where Red, Green, and Blue light combine toward white. CMYK is a subtractive model using Cyan, Magenta, Yellow, and Key Black inks that absorb light against physical paper.',
      },
      {
        question: 'Why is OKLCH becoming the standard for modern CSS color conversion?',
        answer:
          'OKLCH provides uniform perceptual lightness across all hues and supports modern wide-gamut displays (Display P3), allowing colors to be tuned predictably without shifting perceived brightness.',
      },
    ],
  },

  '/gradient-generator': {
    route: '/gradient-generator',
    canonicalUrl: `${SITE_URL}/gradient-generator`,
    title: 'CSS Gradient Studio — Linear & Radial Gradient Generator | Chromora',
    h1: 'CSS Gradient Generator & Studio',
    description:
      'Free online CSS gradient generator. Design custom linear, radial, and multi-stop gradients with live preview, visual angle editor, and copy-paste CSS code.',
    keywords: [
      'css gradient generator',
      'linear gradient maker',
      'radial gradient generator',
      'tailwind gradient generator',
      'multi stop gradient tool',
      'css background gradient code',
    ],
    ogTitle: 'CSS Gradient Studio — Linear & Radial Gradient Generator | Chromora',
    ogDescription:
      'Create multi-stop linear and radial gradients, fine-tune angles and color stops, and export CSS & Tailwind classes.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora CSS Gradient Generator',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Gradient Generator', url: '/gradient-generator' },
    ],
    faqs: [
      {
        question: 'How do I create a multi-stop CSS gradient?',
        answer:
          'Click anywhere along the gradient slider track to add intermediate color stops, adjust their positions from 0% to 100%, and select individual stop colors to create rich color blends.',
      },
      {
        question: 'Can I export gradients directly to Tailwind CSS?',
        answer:
          'Yes! Chromora provides both raw CSS `background: linear-gradient(...)` output and Tailwind CSS utility class combinations (e.g., `bg-gradient-to-r from-... via-... to-...`).',
      },
    ],
  },

  '/color-wheel': {
    route: '/color-wheel',
    canonicalUrl: `${SITE_URL}/color-wheel`,
    title: 'Interactive Color Wheel — Color Theory & Harmonies | Chromora',
    h1: 'Interactive Color Wheel & Color Theory Harmony Studio',
    description:
      'Free interactive color wheel for designers. Explore 360-degree HSL harmonies - complementary, analogous, triadic, and tetradic - with live HEX and RGB codes.',
    keywords: [
      'color wheel online',
      'interactive color theory wheel',
      'complementary color wheel',
      'triadic color harmonies',
      'analogous color scheme calculator',
      'hsl color wheel studio',
    ],
    ogTitle: 'Interactive Color Wheel — Color Theory & Harmonies | Chromora',
    ogDescription:
      'Calculate complementary, analogous, triadic, and square harmonies with a 360° interactive HSL color wheel.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Color Wheel Tool',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Color Wheel', url: '/color-wheel' },
    ],
    faqs: [
      {
        question: 'What are the main color harmony models on the color wheel?',
        answer:
          'The core models include Complementary (opposite 180°), Analogous (adjacent 30° offsets), Triadic (three equidistant 120° angles), Split-Complementary (150° and 210° angles), and Tetradic/Square (90° intervals).',
      },
      {
        question: 'How does rotating the color wheel update harmony calculations?',
        answer:
          'Dragging the central handle recalculates the primary hue angle and immediately projects corresponding geometrical offsets onto secondary and tertiary harmony coordinates.',
      },
    ],
  },

  '/ai-palette-generator': {
    route: '/ai-palette-generator',
    canonicalUrl: `${SITE_URL}/ai-palette-generator`,
    title: 'AI Color Palette Generator — Natural Language Color Studio | Chromora',
    h1: 'AI Prompt to Color Palette Generator',
    description:
      'Generate custom, production-ready color palettes from text prompts. Get instant psychological color analysis, WCAG contrast checks, and design token export.',
    keywords: [
      'ai color palette generator',
      'prompt to color palette',
      'mood to color scheme generator',
      'theme color palette maker',
      'brand color palette generator',
    ],
    ogTitle: 'AI Color Palette Generator — Natural Language Color Studio | Chromora',
    ogDescription:
      'Transform natural language prompts and moods into cohesive, accessible UI color palettes.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora AI Palette Generator',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'AI Palette Generator', url: '/ai-palette-generator' },
    ],
    faqs: [
      {
        question: 'How does the prompt-to-palette algorithm work?',
        answer:
          'Chromora parses descriptive keywords, emotional moods, historical art movements, and industry themes using an intelligent semantic color engine to formulate harmonious, context-aware color palettes.',
      },
    ],
  },

  '/color-shades-generator': {
    route: '/color-shades-generator',
    canonicalUrl: `${SITE_URL}/color-shades-generator`,
    title: 'Color Shades & Tints Generator — 50-950 Tailwind Scale | Chromora',
    h1: 'Color Shades and Tints Generator',
    description:
      'Generate a complete 10-step shade and tint scale from any HEX color. Export instantly to Tailwind CSS, CSS variables, and JSON design tokens.',
    keywords: [
      'color shades generator',
      'color tints and shades maker',
      'tailwind 50-950 shades generator',
      'hex shade scale generator',
      'css color shade curves',
    ],
    ogTitle: 'Color Shades & Tints Generator — 50-950 Tailwind Scale | Chromora',
    ogDescription:
      'Generate 11-step mathematical shade and tint curves for Tailwind CSS and design system tokens.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Color Shades Generator',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Shades & Tints', url: '/color-shades-generator' },
    ],
    faqs: [
      {
        question: 'What is the difference between a tint, a shade, and a tone?',
        answer:
          'A tint is created by adding pure white to increase lightness; a shade is created by adding pure black to decrease lightness; a tone is created by adding gray to reduce saturation.',
      },
    ],
  },

  '/color-mixer': {
    route: '/color-mixer',
    canonicalUrl: `${SITE_URL}/color-mixer`,
    title: 'Color Mixer & Blender — Mix Colors in RGB, HSL & OKLCH | Chromora',
    h1: 'Color Mixer and Blend Studio',
    description:
      'Mix two colors online with precise ratios in RGB, HSL, and OKLCH. Preview smooth blend steps and copy ready-to-use CSS color-mix() code instantly.',
    keywords: [
      'color mixer online',
      'blend two colors online',
      'css color-mix generator',
      'oklch color blender',
      'mix hex colors calculator',
    ],
    ogTitle: 'Color Mixer & Blender — Mix Colors in RGB, HSL & OKLCH | Chromora',
    ogDescription:
      'Mix colors with precise percentage weighting across RGB, HSL, and OKLCH spaces.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Color Mixer',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Color Mixer', url: '/color-mixer' },
    ],
    faqs: [
      {
        question: 'Why does color blending look different in OKLCH versus RGB?',
        answer:
          'RGB blending often produces muddy grayish intermediate transitions because it linearly interpolates uncalibrated light intensities. OKLCH blending maintains perceptual chroma and uniform brightness throughout the transition.',
      },
    ],
  },

  '/color-blindness-simulator': {
    route: '/color-blindness-simulator',
    canonicalUrl: `${SITE_URL}/color-blindness-simulator`,
    title: 'Color Blindness Simulator — Test UI Accessibility | Chromora',
    h1: 'Color Blindness Simulator & Accessibility Auditor',
    description:
      'Free online color blindness simulator for UI designs and images. Accurately test Protanopia, Deuteranopia, Tritanopia, and Achromatopsia vision in real-time.',
    keywords: [
      'color blindness simulator',
      'protanopia deuteranopia simulator',
      'test website for color blindness',
      'accessible color vision tool',
      'colorblind ui simulator',
    ],
    ogTitle: 'Color Blindness Simulator — Test UI Accessibility | Chromora',
    ogDescription:
      'Simulate 8 color vision deficiencies to verify accessibility and legibility in digital interfaces.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Color Blindness Simulator',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Color Blindness Simulator', url: '/color-blindness-simulator' },
    ],
    faqs: [
      {
        question: 'What are the most common forms of color blindness?',
        answer:
          'Deuteranomaly (reduced sensitivity to green light) and Protanomaly (reduced sensitivity to red light) are the most common, affecting approximately 8% of men with Northern European ancestry.',
      },
    ],
  },

  '/pantone-color-converter': {
    route: '/pantone-color-converter',
    canonicalUrl: `${SITE_URL}/pantone-color-converter`,
    title: 'Pantone & RAL Color Converter — Find Closest PMS Shades | Chromora',
    h1: 'Pantone and RAL Color Converter',
    description:
      'Match any HEX or RGB color to the closest Pantone PMS and RAL Classic shades with Delta-E accuracy. Free converter for print and brand design.',
    keywords: [
      'hex to pantone converter',
      'pantone color finder online',
      'rgb to ral color converter',
      'match hex to closest pantone code',
      'industrial paint color matching',
    ],
    ogTitle: 'Pantone & RAL Color Converter — Find Closest PMS Shades | Chromora',
    ogDescription:
      'Match digital HEX and RGB codes to the closest physical Pantone PMS and RAL color standards.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Pantone & RAL Converter',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Pantone & RAL Converter', url: '/pantone-color-converter' },
    ],
    faqs: [
      {
        question: 'How are digital HEX colors matched to Pantone standards?',
        answer:
          'Chromora computes Euclidean and perceptual Delta-E distance metrics across our calibrated database of Pantone and RAL color standards to find the nearest optical match.',
      },
    ],
  },

  '/random-color-generator': {
    route: '/random-color-generator',
    canonicalUrl: `${SITE_URL}/random-color-generator`,
    title: 'Random Color & Palette Generator — Infinite Inspiration | Chromora',
    h1: 'Random Color and Palette Generator',
    description:
      'Generate random colors and harmonious 5-color palettes with mood filters (Pastel, Neon, Warm, Cool, Earthy). Spacebar to roll, one-click copy HEX & CSS.',
    keywords: [
      'random color generator',
      'random hex color generator',
      'random pastel color generator',
      'random palette generator',
      'instant color inspiration',
    ],
    ogTitle: 'Random Color & Palette Generator — Infinite Inspiration | Chromora',
    ogDescription:
      'Generate random hex colors, pastels, neon shades, and harmonious palettes instantly.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Random Color Generator',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Random Color Generator', url: '/random-color-generator' },
    ],
    faqs: [
      {
        question: 'Can I generate specific types of random colors like pastels or neons?',
        answer:
          'Yes! Chromora provides specialized filters for pastel, neon, warm, cool, earthy, and luxury color profiles.',
      },
    ],
  },

  '/favicon-generator': {
    route: '/favicon-generator',
    canonicalUrl: `${SITE_URL}/favicon-generator`,
    title: 'Color Favicon & App Icon Generator — Instant PNG & ICO | Chromora',
    h1: 'Color Favicon and App Icon Generator',
    description:
      'Free online favicon generator. Convert text, emojis, or logos into favicon.ico, 180x180 Apple Touch Icons, and site.webmanifest with instant ZIP download.',
    keywords: [
      'favicon generator from color',
      'app icon maker online',
      'apple touch icon generator',
      'create ico file from color',
      'favicon package generator',
    ],
    ogTitle: 'Color Favicon & App Icon Generator — Instant PNG & ICO | Chromora',
    ogDescription:
      'Generate browser favicons, Apple touch icons, and Android manifest icons from any color.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Favicon Generator',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Favicon Generator', url: '/favicon-generator' },
    ],
    faqs: [
      {
        question: 'What icon sizes are generated in the favicon package?',
        answer:
          'The package includes 16x16, 32x32, 48x48, 180x180 (Apple Touch Icon), 192x192, and 512x512 (Android/PWA) formats with standard HTML `<link>` snippets.',
      },
    ],
  },

  '/design-preview': {
    route: '/design-preview',
    canonicalUrl: `${SITE_URL}/design-preview`,
    title: 'Live UI Design Preview & Palette Simulator — Chromora',
    h1: 'Live UI Design Color Palette Simulator',
    description:
      'Test your color palette in real-time across realistic SaaS dashboards, landing pages, mobile apps, and e-commerce UI components with live role mapping.',
    keywords: [
      'ui design color preview',
      'palette simulator for website',
      'test color scheme on dashboard mockup',
      'saas theme simulator',
      'live palette tester',
    ],
    ogTitle: 'Live UI Design Preview & Palette Simulator — Chromora',
    ogDescription:
      'Simulate color palettes on realistic SaaS dashboards, mobile apps, and marketing cards in real time.',
    schemaType: 'SoftwareApplication',
    appName: 'Chromora Design Preview Studio',
    appCategory: 'DesignApplication',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Design Preview', url: '/design-preview' },
    ],
    faqs: [
      {
        question: 'How does the Live Design Preview help UI designers?',
        answer:
          'It lets you visualize how primary, secondary, surface, background, and accent colors interact in real interface components before writing code or building Figma components.',
      },
    ],
  },

  '/colors': {
    route: '/colors',
    canonicalUrl: `${SITE_URL}/colors`,
    title: 'Explore All Named Colors & Hex Codes Database — Chromora',
    h1: 'Browse All Named Colors & Color Codes Database',
    description:
      'Browse our curated color names directory with exact HEX codes and RGB values. Search historical pigments, modern CSS named colors, and brand color swatches.',
    keywords: [
      'all color names database',
      'html color names list',
      'browse colors by family',
      'hex color code search',
      'popular color codes',
    ],
    ogTitle: 'Explore All Named Colors & Hex Codes Database — Chromora',
    ogDescription:
      'Search over 1,000 curated named colors with exact spectral coordinates and harmony palettes.',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Colors', url: '/colors' },
    ],
    faqs: [
      {
        question: 'How is the named color database organized?',
        answer:
          'Colors are grouped by spectral families (Red, Orange, Yellow, Green, Blue, Purple, Pink, Brown, Gray, Black, White) and searchable by name or hex code.',
      },
    ],
  },

  '/colors/family/red': {
    route: '/colors/family/red',
    canonicalUrl: `${SITE_URL}/colors/family/red`,
    title: 'Red Colors — Shades, Palettes & HEX Codes | Chromora',
    h1: 'Red Colors',
    description:
      'Browse red color shades from crimson to burgundy with exact HEX and RGB codes. Find red palettes for branding, UI design, and celebrations.',
    keywords: [
      'red color palette',
      'red shades hex codes',
      'browse red colors',
    ],
    ogTitle: 'Red Colors — Shades, Palettes & HEX Codes | Chromora',
    ogDescription:
      'Browse red color shades from crimson to burgundy with exact HEX and RGB codes. Find red palettes for branding, UI design, and celebrations.',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Colors', url: '/colors' },
      { name: 'Red Colors', url: '/colors/family/red' },
    ],
    faqs: [],
  },
  '/colors/family/blue': {
    route: '/colors/family/blue',
    canonicalUrl: `${SITE_URL}/colors/family/blue`,
    title: 'Blue Colors — Shades, Palettes & HEX Codes | Chromora',
    h1: 'Blue Colors',
    description:
      'Browse blue color shades from sky to navy with exact HEX and RGB codes. Find calm, trusted blue palettes for websites, apps, and branding.',
    keywords: [
      'blue color palette',
      'blue shades hex codes',
      'browse blue colors',
    ],
    ogTitle: 'Blue Colors — Shades, Palettes & HEX Codes | Chromora',
    ogDescription:
      'Browse blue color shades from sky to navy with exact HEX and RGB codes. Find calm, trusted blue palettes for websites, apps, and branding.',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Colors', url: '/colors' },
      { name: 'Blue Colors', url: '/colors/family/blue' },
    ],
    faqs: [],
  },
  '/colors/family/green': {
    route: '/colors/family/green',
    canonicalUrl: `${SITE_URL}/colors/family/green`,
    title: 'Green Colors — Shades, Palettes & HEX Codes | Chromora',
    h1: 'Green Colors',
    description:
      'Browse green color shades from mint to forest with exact HEX and RGB codes. Find fresh, natural green palettes for eco brands and UI design.',
    keywords: [
      'green color palette',
      'green shades hex codes',
      'browse green colors',
    ],
    ogTitle: 'Green Colors — Shades, Palettes & HEX Codes | Chromora',
    ogDescription:
      'Browse green color shades from mint to forest with exact HEX and RGB codes. Find fresh, natural green palettes for eco brands and UI design.',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Colors', url: '/colors' },
      { name: 'Green Colors', url: '/colors/family/green' },
    ],
    faqs: [],
  },
  '/colors/family/yellow': {
    route: '/colors/family/yellow',
    canonicalUrl: `${SITE_URL}/colors/family/yellow`,
    title: 'Yellow Colors — Shades, Palettes & HEX Codes | Chromora',
    h1: 'Yellow Colors',
    description:
      'Browse yellow color shades from pastel to goldenrod with exact HEX and RGB codes. Find bright, cheerful yellow palettes for web and brand design.',
    keywords: [
      'yellow color palette',
      'yellow shades hex codes',
      'browse yellow colors',
    ],
    ogTitle: 'Yellow Colors — Shades, Palettes & HEX Codes | Chromora',
    ogDescription:
      'Browse yellow color shades from pastel to goldenrod with exact HEX and RGB codes. Find bright, cheerful yellow palettes for web and brand design.',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Colors', url: '/colors' },
      { name: 'Yellow Colors', url: '/colors/family/yellow' },
    ],
    faqs: [],
  },
  '/colors/family/purple': {
    route: '/colors/family/purple',
    canonicalUrl: `${SITE_URL}/colors/family/purple`,
    title: 'Purple Colors — Shades, Palettes & HEX Codes | Chromora',
    h1: 'Purple Colors',
    description:
      'Browse purple color shades from lavender to violet with exact HEX and RGB codes. Find rich, creative purple palettes for branding and UI design.',
    keywords: [
      'purple color palette',
      'purple shades hex codes',
      'browse purple colors',
    ],
    ogTitle: 'Purple Colors — Shades, Palettes & HEX Codes | Chromora',
    ogDescription:
      'Browse purple color shades from lavender to violet with exact HEX and RGB codes. Find rich, creative purple palettes for branding and UI design.',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Colors', url: '/colors' },
      { name: 'Purple Colors', url: '/colors/family/purple' },
    ],
    faqs: [],
  },
  '/colors/family/orange': {
    route: '/colors/family/orange',
    canonicalUrl: `${SITE_URL}/colors/family/orange`,
    title: 'Orange Colors — Shades, Palettes & HEX Codes | Chromora',
    h1: 'Orange Colors',
    description:
      'Browse orange color shades from peach to burnt orange with exact HEX and RGB codes. Find warm, energetic orange palettes for web and brand design.',
    keywords: [
      'orange color palette',
      'orange shades hex codes',
      'browse orange colors',
    ],
    ogTitle: 'Orange Colors — Shades, Palettes & HEX Codes | Chromora',
    ogDescription:
      'Browse orange color shades from peach to burnt orange with exact HEX and RGB codes. Find warm, energetic orange palettes for web and brand design.',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Colors', url: '/colors' },
      { name: 'Orange Colors', url: '/colors/family/orange' },
    ],
    faqs: [],
  },
  '/colors/family/pink': {
    route: '/colors/family/pink',
    canonicalUrl: `${SITE_URL}/colors/family/pink`,
    title: 'Pink Colors — Shades, Palettes & HEX Codes | Chromora',
    h1: 'Pink Colors',
    description:
      'Browse pink color shades from blush to hot pink with exact HEX and RGB codes. Find soft, playful pink palettes for beauty brands and UI design.',
    keywords: [
      'pink color palette',
      'pink shades hex codes',
      'browse pink colors',
    ],
    ogTitle: 'Pink Colors — Shades, Palettes & HEX Codes | Chromora',
    ogDescription:
      'Browse pink color shades from blush to hot pink with exact HEX and RGB codes. Find soft, playful pink palettes for beauty brands and UI design.',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Colors', url: '/colors' },
      { name: 'Pink Colors', url: '/colors/family/pink' },
    ],
    faqs: [],
  },
  '/color-tools': {
    route: '/color-tools',
    canonicalUrl: `${SITE_URL}/color-tools`,
    title: 'Free Online Color Tools — Color Picker, Wheel & Mixer Suite',
    h1: 'Free Online Color Tools — Exploration, Science & Color Wheels',
    description:
      'Free online color tools for designers and developers. Pick, explore, and mix colors with a 360-degree wheel, smart explorer, and OKLCH blender.',
    keywords: [
      'free online color tools',
      'color exploration tools',
      'interactive color wheel online',
      'online color mixer',
      'inspect hex rgb oklch',
    ],
    ogTitle: 'Free Online Color Tools — Color Picker, Wheel & Mixer Suite',
    ogDescription:
      'Explore our suite of free online color tools for designers and developers. Inspect hex codes, explore 360° color wheels, and mix colors in OKLCH.',
    schemaType: 'WebApplication',
    appName: 'Chromora Color Tools Suite',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Color Tools', url: '/color-tools' },
    ],
    faqs: [
      {
        question: 'What color tools are included in Chromora?',
        answer:
          'Chromora provides an interactive Color Picker, 360° Color Wheel, Multi-Space Converter, and OKLCH Color Mixer with client-side execution.',
      },
    ],
  },

  '/palette-tools': {
    route: '/palette-tools',
    canonicalUrl: `${SITE_URL}/palette-tools`,
    title: 'Color Palette Generators — Free Accessible Schemes & Moods',
    h1: 'Color Palette Generators & Color Scheme Creators',
    description:
      'Generate harmonious, accessible color palettes free. Use AI prompts, harmony rules, random discovery, and image extraction for UI and brand design.',
    keywords: [
      'color palette generators',
      'color scheme creators',
      'ai palette generator',
      'accessible color palettes',
      'mood color palette tools',
    ],
    ogTitle: 'Color Palette Generators — Free Accessible Schemes & Moods',
    ogDescription:
      'Generate harmonious, accessible color schemes with AI prompts, geometric harmony rules, random discovery, and photo extraction.',
    schemaType: 'WebApplication',
    appName: 'Chromora Palette Tools Suite',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Palette Tools', url: '/palette-tools' },
    ],
    faqs: [
      {
        question: 'How do Chromora palette tools calculate color harmonies?',
        answer:
          'Chromora uses geometric color wheel calculations (analogous, triadic, complementary, tetradic) and AI semantic prompt processing to build cohesive palettes.',
      },
    ],
  },

  '/accessibility-tools': {
    route: '/accessibility-tools',
    canonicalUrl: `${SITE_URL}/accessibility-tools`,
    title: 'Color Accessibility Tools — WCAG Contrast & Color Blindness',
    h1: 'Color Accessibility Tools — WCAG Contrast & Daltonism Auditing',
    description:
      'Audit color accessibility for your website. Test WCAG 2.1 AA and AAA contrast, simulate 8 color vision deficiencies, and auto-fix failing pairs.',
    keywords: [
      'color accessibility tools',
      'wcag contrast checker suite',
      'color blindness simulator',
      'accessible color design tools',
      'ada compliance color contrast',
    ],
    ogTitle: 'Color Accessibility Tools — WCAG Contrast & Color Blindness',
    ogDescription:
      'Audit WCAG 2.1 AA/AAA contrast ratios, simulate 8 color vision deficiencies, and get instant auto-fix recommendations.',
    schemaType: 'WebApplication',
    appName: 'Chromora Accessibility Suite',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Accessibility Tools', url: '/accessibility-tools' },
    ],
    faqs: [
      {
        question: 'What accessibility standards do Chromora tools audit?',
        answer:
          'Chromora audits contrast against W3C WCAG 2.1 Level AA (4.5:1) and AAA (7:1) for normal and large text, as well as UI components.',
      },
    ],
  },

  '/developer-color-tools': {
    route: '/developer-color-tools',
    canonicalUrl: `${SITE_URL}/developer-color-tools`,
    title: 'Developer Color Tools — Tailwind Scales, Formats & Tokens',
    h1: 'Developer Color Tools — Tailwind Scales, Formats & Design Tokens',
    description:
      'Developer-first color utilities. Generate Tailwind 50-950 scales, convert HEX, RGB, OKLCH, and CMYK, build gradients, and export design tokens.',
    keywords: [
      'developer color tools',
      'tailwind color scale generator',
      'css gradient generator',
      'multi space color converter',
      'design tokens exporter',
    ],
    ogTitle: 'Developer Color Tools — Tailwind Scales, Formats & Tokens',
    ogDescription:
      'Generate Tailwind 50-950 scales, convert across 10 color formats, generate gradients, and export production design tokens.',
    schemaType: 'WebApplication',
    appName: 'Chromora Developer Color Suite',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Developer Tools', url: '/developer-color-tools' },
    ],
    faqs: [
      {
        question: 'Can I export color tokens directly to Tailwind and Figma?',
        answer:
          'Yes, Chromora exports Tailwind theme config objects, CSS custom properties, and DTCG-compliant JSON design tokens for Figma.',
      },
    ],
  },

  '/image-color-tools': {
    route: '/image-color-tools',
    canonicalUrl: `${SITE_URL}/image-color-tools`,
    title: 'Image Color Tools — Extract Palettes From Any Photo',
    h1: 'Image Color Tools — Palette Extraction & Photo Eyedropper',
    description:
      'Extract color palettes from any photo or image. Sample pixels with an eyedropper and export HEX, RGB, and Tailwind codes - 100% private, in your browser.',
    keywords: [
      'image color tools',
      'image palette extractor',
      'photo eyedropper tool',
      'picture to hex palette',
      'extract colors from images',
    ],
    ogTitle: 'Image Color Tools — Extract Palettes From Any Photo',
    ogDescription:
      'Extract dominant color palettes and sample pixels from photos with 100% client-side privacy.',
    schemaType: 'WebApplication',
    appName: 'Chromora Image Color Suite',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Image Color Tools', url: '/image-color-tools' },
    ],
    faqs: [
      {
        question: 'Are uploaded images sent to any server?',
        answer:
          'No, all image extraction and pixel sampling is processed 100% locally in your browser using the HTML5 Canvas API.',
      },
    ],
  },
};

export function getRouteSEO(pathname: string): SEOConfig {
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/';

  // Check direct core route
  if (CORE_ROUTES_SEO[cleanPath]) {
    const data = CORE_ROUTES_SEO[cleanPath];
    return {
      title: data.title,
      description: data.description,
      canonicalUrl: data.canonicalUrl,
      keywords: data.keywords,
      breadcrumbs: data.breadcrumbs,
      faqs: data.faqs,
      softwareApp: data.schemaType === 'SoftwareApplication' || data.schemaType === 'WebApplication'
        ? {
            name: data.appName || data.h1,
            description: data.description,
            applicationCategory: data.appCategory || 'DesignApplication',
          }
        : undefined,
    };
  }

  // Check aliases mapping
  const aliases: Record<string, string> = {
    '/color-explorer': '/color-picker',
    '/palette-generator': '/color-palette-generator',
    '/color-palette-from-image': '/image-color-extractor',
    '/image-color-palette': '/image-color-extractor',
    '/image-color-palette-generator': '/image-color-extractor',
    '/image-palette': '/image-color-extractor',
    '/image-extractor': '/image-color-extractor',
    '/contrast-checker': '/wcag-contrast-checker',
    '/color-contrast-checker': '/wcag-contrast-checker',
    '/color-contrast': '/wcag-contrast-checker',
    '/gradient-studio': '/gradient-generator',
    '/ai-color-palette-generator': '/ai-palette-generator',
    '/prompt-palette': '/ai-palette-generator',
    '/shades-generator': '/color-shades-generator',
    '/color-shades': '/color-shades-generator',
    '/tint-generator': '/color-shades-generator',
    '/color-blend': '/color-mixer',
    '/color-blender': '/color-mixer',
    '/colorblind-simulator': '/color-blindness-simulator',
    '/color-blindness': '/color-blindness-simulator',
    '/random-color': '/random-color-generator',
    '/random-palette-generator': '/random-color-generator',
    '/random-palette': '/random-color-generator',
    '/pantone-converter': '/pantone-color-converter',
    '/ral-color-converter': '/pantone-color-converter',
    '/hex-to-pantone': '/pantone-color-converter',
    '/favicon-maker': '/favicon-generator',
    '/ico-generator': '/favicon-generator',
    '/wheel': '/color-wheel',
    '/color-harmonies': '/color-wheel',
    '/color-harmony': '/color-wheel',
    '/design-color-preview': '/design-preview',
    '/preview': '/design-preview',
  };

  const canonicalKey = aliases[cleanPath];
  if (canonicalKey && CORE_ROUTES_SEO[canonicalKey]) {
    const data = CORE_ROUTES_SEO[canonicalKey];
    return {
      title: data.title,
      description: data.description,
      canonicalUrl: data.canonicalUrl, // Canonical always points to primary route
      keywords: data.keywords,
      breadcrumbs: data.breadcrumbs,
      faqs: data.faqs,
      softwareApp: data.schemaType === 'SoftwareApplication' || data.schemaType === 'WebApplication'
        ? {
            name: data.appName || data.h1,
            description: data.description,
            applicationCategory: data.appCategory || 'DesignApplication',
          }
        : undefined,
    };
  }

  // Default fallback
  return {
    title: 'Chromora — Accessible Color Palette Generator & Design System Studio',
    description:
      'Free accessible color tools for designers and developers. Test WCAG contrast, extract colors from images, convert to OKLCH, and export Tailwind design tokens.',
    canonicalUrl: `${SITE_URL}${cleanPath}`,
  };
}
