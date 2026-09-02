export interface GuideSection {
  id: string;
  heading: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  callout?: {
    type: 'tip' | 'info' | 'warning';
    title: string;
    text: string;
  };
}

export interface GuideToolLink {
  name: string;
  route: string;
  description: string;
  badge?: string;
}

export interface GuideArticle {
  slug: string;
  title: string;
  h1: string;
  primaryKeyword: string;
  metaDescription: string;
  readTime: string;
  category: 'Color Formats' | 'Accessibility' | 'UI & Web Design' | 'Color Theory';
  publishDate: string;
  lastUpdated: string;
  summary: string;
  sections: GuideSection[];
  relatedTools: GuideToolLink[];
  relatedGuides: string[];
  faqs: { question: string; answer: string }[];
}

export const GUIDES_DATABASE: Record<string, GuideArticle> = {
  'hex-vs-rgb-vs-hsl': {
    slug: 'hex-vs-rgb-vs-hsl',
    title: 'HEX vs RGB vs HSL — Which Color Format Should You Use in CSS?',
    h1: 'HEX vs RGB vs HSL: Color Formats Explained for Web Developers',
    primaryKeyword: 'hex vs rgb vs hsl',
    metaDescription:
      'Understand the differences between HEX, RGB, and HSL color formats in web design and CSS. Learn when to use each format, readability trade-offs, and conversion examples.',
    readTime: '6 min read',
    category: 'Color Formats',
    publishDate: '2026-08-15',
    lastUpdated: '2026-09-01',
    summary:
      'While HEX, RGB, and HSL all describe digital colors on computer displays, they represent distinct mental models. Choosing the right format impacts your CSS workflow, component theming, and code maintainability.',
    sections: [
      {
        id: 'overview-comparison',
        heading: 'Quick Comparison: HEX, RGB, and HSL at a Glance',
        content:
          'Hexadecimal (HEX) codes are compact 6-character strings representing Red, Green, and Blue byte values (00 to FF). RGB explicitly expresses these channels as decimal numbers from 0 to 255. HSL shifts from additive hardware channels to human-perceptual coordinates: Hue (0° to 360° on the color wheel), Saturation (0% to 100%), and Lightness (0% to 100%).',
        callout: {
          type: 'info',
          title: 'Core Takeaway',
          text: 'Use HEX for static brand tokens and copy-pasting from design tools. Use RGB for alpha channel manipulation in legacy code. Use HSL for dynamic color generation and algorithmic hover states.',
        },
      },
      {
        id: 'how-hex-works',
        heading: '1. Hexadecimal (HEX) Notation: The Web Standard',
        content:
          'HEX represents red, green, and blue as base-16 integers. For example, #6366F1 translates to Red = 99 (0x63), Green = 102 (0x66), Blue = 241 (0xF1). Modern CSS also supports 8-digit HEX for alpha transparency, where the last two characters represent opacity (e.g. #6366F180 for 50% alpha).',
        codeSnippet: {
          language: 'css',
          code: '/* Standard 6-digit HEX */\n.button-primary {\n  background-color: #6366f1;\n}\n\n/* 8-digit HEX with 50% opacity (0x80 = 128/255) */\n.button-hover {\n  background-color: #6366f180;\n}',
        },
      },
      {
        id: 'how-rgb-works',
        heading: '2. RGB & RGBA: Direct Hardware Channels',
        content:
          'RGB directly mirrors the physical subpixels of LED and OLED screens. Specifying rgb(99, 102, 241) instructs the display hardware to illuminate the red subpixel at 39%, the green at 40%, and the blue at 95%. In modern CSS Color Module Level 4, the space-separated syntax rgb(99 102 241 / 0.5) is preferred over the older rgba() function.',
        codeSnippet: {
          language: 'css',
          code: '/* Modern CSS Color 4 syntax */\n.card-surface {\n  background: rgb(99 102 241);\n  box-shadow: 0 4px 20px rgb(99 102 241 / 0.25);\n}',
        },
      },
      {
        id: 'how-hsl-works',
        heading: '3. HSL: Intuitive Human-Centered Coordinates',
        content:
          'HSL solves the biggest drawback of HEX and RGB: unintuitive color tweaking. In HSL, changing lightness from hsl(239, 84%, 67%) to hsl(239, 84%, 55%) darkens the color without altering its hue or saturation. This makes HSL ideal for creating programmatic hover states, active presses, and disabled states in CSS custom properties.',
        codeSnippet: {
          language: 'css',
          code: ':root {\n  --brand-h: 239;\n  --brand-s: 84%;\n  --brand-l: 67%;\n}\n\n.btn {\n  background-color: hsl(var(--brand-h) var(--brand-s) var(--brand-l));\n}\n\n.btn:hover {\n  /* Easily create a 10% darker hover shade */\n  background-color: hsl(var(--brand-h) var(--brand-s) calc(var(--brand-l) - 10%));\n}',
        },
      },
      {
        id: 'decision-matrix',
        heading: 'When to Use Each Color Format',
        content:
          '• Choose HEX when copy-pasting tokens from Figma or maintaining compact JSON design systems.\n• Choose RGB when working with Canvas APIs, WebGL, or legacy browser toolchains.\n• Choose HSL when building theme switchers or runtime CSS calculations.\n• Consider OKLCH for modern CSS projects requiring perceptual uniformity across all hues.',
      },
    ],
    relatedTools: [
      {
        name: 'HEX to RGB Converter',
        route: '/hex-to-rgb',
        description: 'Instant conversion from hex codes to integer decimal RGB values.',
        badge: 'Converter',
      },
      {
        name: 'RGB to HEX Converter',
        route: '/rgb-to-hex',
        description: 'Convert RGB coordinates back into compact 6-digit HEX format.',
        badge: 'Converter',
      },
      {
        name: 'Multi-Space Color Converter',
        route: '/color-converter',
        description: 'Convert between HEX, RGB, HSL, HSV, CMYK, and OKLCH.',
        badge: 'Universal Tool',
      },
      {
        name: 'Color Shades Generator',
        route: '/color-shades-generator',
        description: 'Generate 50-950 lightness curves with automated contrast calculation.',
        badge: 'Scale Builder',
      },
    ],
    relatedGuides: ['what-is-oklch', 'css-color-formats', 'how-to-choose-website-colors'],
    faqs: [
      {
        question: 'Is HEX faster for browsers to render than RGB or HSL?',
        answer:
          'No. Modern browser rendering engines parse all CSS color formats into standard 32-bit floating-point sRGB or Display P3 color values at layout time. There is no measurable performance difference between HEX, RGB, and HSL.',
      },
      {
        question: 'Why does HSL sometimes feel perceptually uneven between yellow and blue?',
        answer:
          'Standard HSL is a geometric deformation of sRGB and does not account for human eye sensitivity. Yellow at 50% lightness appears much brighter to the human retina than blue at 50% lightness. For true perceptual uniformity, use OKLCH.',
      },
      {
        question: 'Can I use CSS variables with HEX colors for opacity?',
        answer:
          'With 8-digit HEX, dynamic opacity is difficult to interpolate in CSS. Modern CSS color-mix() or HSL variables allow dynamic alpha adjustment much more easily.',
      },
    ],
  },

  'what-is-oklch': {
    slug: 'what-is-oklch',
    title: 'What is OKLCH? The Modern CSS Color Space Explained',
    h1: 'What is OKLCH? Modern CSS Perceptual Color Space Explained',
    primaryKeyword: 'what is oklch',
    metaDescription:
      'Learn why OKLCH is replacing HEX and HSL in modern web design. Discover perceptual uniformity, wide color gamut (P3), predictable lightness, and CSS syntax.',
    readTime: '7 min read',
    category: 'Color Formats',
    publishDate: '2026-08-20',
    lastUpdated: '2026-09-01',
    summary:
      'OKLCH is a modern CSS color space designed around human visual perception. Unlike HSL and RGB, colors with the same OKLCH lightness have identical perceived brightness across all hues.',
    sections: [
      {
        id: 'why-oklch-matters',
        heading: 'Why HSL is Flawed and Why OKLCH Was Created',
        content:
          'In traditional HSL, setting Lightness to 50% yields wildly different perceptual results: pure yellow (#FFFF00) at 50% lightness blinds the user with high luminance, while pure blue (#0000FF) at 50% lightness appears dark and muddy. This makes building automated accessible color scales in HSL almost impossible. OKLCH fixes this by aligning lightness directly with human retinal response.',
        callout: {
          type: 'tip',
          title: 'Perceptual Uniformity',
          text: 'In OKLCH, lightness 0.7 on blue has the exact same visual brightness and contrast ratio as lightness 0.7 on green, orange, or purple.',
        },
      },
      {
        id: 'oklch-coordinates',
        heading: 'Understanding OKLCH Coordinates: L, C, and H',
        content:
          'OKLCH uses three intuitive dimensions:\n• L (Lightness): 0% (pure black) to 100% or 0 to 1.0 (pure white).\n• C (Chroma): The intensity or purity of the color, starting from 0 (neutral gray) up to ~0.37 for vivid wide-gamut shades.\n• H (Hue): The angle on the chromatic color circle from 0° to 360° (0° = Pink/Red, 90° = Yellow, 145° = Green, 240° = Blue).',
        codeSnippet: {
          language: 'css',
          code: '/* Modern CSS OKLCH declaration */\n:root {\n  --brand-primary: oklch(0.65 0.22 250);\n  --brand-surface: oklch(0.98 0.01 250);\n  --brand-dark: oklch(0.25 0.05 250);\n}',
        },
      },
      {
        id: 'wide-gamut-p3',
        heading: 'Accessing 30% More Colors on Modern Screens (Display P3)',
        content:
          'Standard HEX and RGB are locked to the legacy sRGB gamut from 1996. Modern iPhones, MacBooks, and high-end OLED displays can reproduce the wider Display P3 gamut. OKLCH natively accesses these ultra-vivid greens, bright teals, and saturated pinks without clipping.',
      },
      {
        id: 'browser-support',
        heading: 'CSS Syntax and Browser Support',
        content:
          'OKLCH is supported across 100% of modern web browsers (Chrome 111+, Safari 15.4+, Firefox 113+, Edge 111+). You can safely use OKLCH in production CSS or export it directly using Chromora.',
        codeSnippet: {
          language: 'css',
          code: '/* Creating a predictable theme scale with OKLCH */\n.badge-success {\n  background: oklch(0.92 0.05 145);\n  color: oklch(0.35 0.15 145);\n  border: 1px solid oklch(0.80 0.08 145);\n}',
        },
      },
    ],
    relatedTools: [
      {
        name: 'HEX to OKLCH Converter',
        route: '/hex-to-oklch',
        description: 'Convert legacy HEX codes into modern perceptual OKLCH coordinates.',
        badge: 'Converter',
      },
      {
        name: 'Color Mixer Online',
        route: '/color-mixer',
        description: 'Blend colors in OKLCH perceptual space without muddy gray deadzones.',
        badge: 'Perceptual Mixer',
      },
      {
        name: 'Color Shades Generator',
        route: '/color-shades-generator',
        description: 'Generate Tailwind-compatible 50-950 scales with perceptual lightness curves.',
        badge: 'Shades',
      },
      {
        name: 'WCAG Contrast Checker',
        route: '/wcag-contrast-checker',
        description: 'Verify contrast ratios for OKLCH, HEX, and RGB palettes.',
        badge: 'Accessibility',
      },
    ],
    relatedGuides: ['hex-vs-rgb-vs-hsl', 'css-color-formats', 'color-contrast-accessibility'],
    faqs: [
      {
        question: 'How do I convert my existing HEX palette to OKLCH?',
        answer:
          'Use Chromora’s free HEX to OKLCH Converter. Simply paste your HEX codes to instantly receive exact Lightness, Chroma, and Hue values.',
      },
      {
        question: 'Does Tailwind CSS support OKLCH?',
        answer:
          'Yes, Tailwind CSS v4 defaults to OKLCH for its entire core color palette, ensuring smoother gradients and accessible contrast steps.',
      },
    ],
  },

  'how-to-choose-website-colors': {
    slug: 'how-to-choose-website-colors',
    title: 'How to Choose Website Colors — A Step-by-Step UI/UX Guide',
    h1: 'How to Choose Website Colors: A Practical Guide for UI/UX Designers',
    primaryKeyword: 'how to choose website colors',
    metaDescription:
      'Learn how to choose the best website color scheme. Master the 60-30-10 rule, brand psychology, background neutrals, action colors, and WCAG contrast testing.',
    readTime: '8 min read',
    category: 'UI & Web Design',
    publishDate: '2026-08-22',
    lastUpdated: '2026-09-01',
    summary:
      'Choosing website colors is not guesswork. By following structured visual hierarchy rules, color psychology, and accessibility guidelines, you can craft digital interfaces that look professional and convert users.',
    sections: [
      {
        id: 'the-60-30-10-rule',
        heading: '1. Master the 60-30-10 Spatial Rule',
        content:
          'The 60-30-10 rule is an interior design principle that creates balanced web interfaces:\n• 60% Dominant Neutral: Backgrounds, clean canvas whitespace, and large structural containers (#FFFFFF, #FAFAFA, #0F172A).\n• 30% Structural Secondary: Navigation headers, card borders, secondary text, and sidebars (#1E293B, #F1F5F9).\n• 10% High-Impact Accent: Call-to-action buttons, active tabs, notification badges, and links (#6366F1, #10B981).',
        callout: {
          type: 'tip',
          title: 'Design Rule',
          text: 'If your accent color covers more than 15% of the viewport, it loses its visual hierarchy. Keep bright accents reserved for clickable elements.',
        },
      },
      {
        id: 'color-psychology',
        heading: '2. Align Color Choices with Brand Intent & Industry',
        content:
          'Different color families evoke specific psychological responses in digital products:\n• Blue: Trust, reliability, security (Finance, SaaS, Healthcare, Enterprise).\n• Green: Growth, balance, wealth, sustainability (Fintech, Eco, Wellness).\n• Purple/Indigo: Innovation, creativity, premium luxury (AI tools, Web3, Creative studios).\n• Orange/Coral: Energy, friendliness, momentum (Food, Delivery, Social apps).\n• Neutral Dark/Charcoal: Elegance, minimalism, high-end design (Portfolios, Luxury retail).',
      },
      {
        id: 'ui-state-colors',
        heading: '3. Never Forget Functional Semantic UI Colors',
        content:
          'Every website design system requires dedicated functional status colors that remain distinct from your brand colors:\n• Success (#10B981): Form confirmations, positive growth metrics.\n• Warning (#F59E0B): Pending actions, rate limits, caution alerts.\n• Danger/Error (#EF4444): Form validation errors, destructive deletions.\n• Information (#0284C7): Helper tooltips, contextual callouts.',
      },
      {
        id: 'testing-mockups',
        heading: '4. Test Your Colors on Real UI Mockups Before Finalizing',
        content:
          'Never pick colors in isolation. A color swatch that looks beautiful as a square may become unreadable when rendered as a small 14px button or a dark navigation bar. Use Chromora’s Design Preview Studio to test your palette on realistic dashboard and landing page components.',
      },
    ],
    relatedTools: [
      {
        name: 'Color Palette Generator',
        route: '/color-palette-generator',
        description: 'Generate 5-color balanced schemes with locking and export.',
        badge: 'Palette Creator',
      },
      {
        name: 'Live Design Preview Studio',
        route: '/design-preview',
        description: 'Preview your color palette across realistic SaaS dashboards and mobile cards.',
        badge: 'UI Tester',
      },
      {
        name: 'WCAG Contrast Checker',
        route: '/wcag-contrast-checker',
        description: 'Ensure button text and headlines pass WCAG 2.1 accessibility.',
        badge: 'Audit',
      },
      {
        name: 'AI Palette Generator',
        route: '/ai-palette-generator',
        description: 'Generate contextual color palettes using natural language prompts.',
        badge: 'AI Engine',
      },
    ],
    relatedGuides: ['color-contrast-accessibility', 'how-to-create-a-color-palette', 'website-color-palette-guide'],
    faqs: [
      {
        question: 'How many colors should a website color palette have?',
        answer:
          'Most professional websites use 5 core colors: 1 primary brand accent, 1 secondary support tone, 1 dark text neutral, 1 light background neutral, and 1 highlight/alert color.',
      },
      {
        question: 'What is the best background color for modern websites?',
        answer:
          'Pure white (#FFFFFF) can create optical glare. Soft off-whites like #F8FAFC, #FAFAFA, or #F4F4F5 provide clean contrast while reducing eye fatigue.',
      },
    ],
  },

  'color-contrast-accessibility': {
    slug: 'color-contrast-accessibility',
    title: 'Color Contrast Accessibility Guide — WCAG 2.1 AA & AAA Standards',
    h1: 'Color Contrast Accessibility Guide: WCAG 2.1 AA & AAA Compliance',
    primaryKeyword: 'color contrast accessibility',
    metaDescription:
      'Learn how WCAG 2.1 color contrast ratios work for normal text, large text, and UI components. Understand AA vs AAA compliance and how to fix failing contrast.',
    readTime: '7 min read',
    category: 'Accessibility',
    publishDate: '2026-08-25',
    lastUpdated: '2026-09-01',
    summary:
      'Web accessibility is both a moral imperative and a legal requirement under ADA and EAA regulations. This guide breaks down WCAG 2.1 relative luminance math, threshold ratios, and practical UI contrast strategies.',
    sections: [
      {
        id: 'what-is-contrast-ratio',
        heading: 'What is a WCAG Contrast Ratio?',
        content:
          'A contrast ratio measures the difference in relative luminance (perceived brightness) between foreground text and its background surface. It is expressed as a ratio from 1:1 (pure black on black, zero contrast) to 21:1 (pure black on pure white, maximum contrast).',
      },
      {
        id: 'wcag-thresholds',
        heading: 'WCAG 2.1 AA and AAA Thresholds Explained',
        content:
          'The W3C Web Content Accessibility Guidelines (WCAG) specify strict minimum ratios:\n• Level AA (Minimum Standard for Web):\n  - Normal Body Text (< 18pt or < 14pt bold): Minimum 4.5:1 ratio.\n  - Large Text (≥ 18pt regular or ≥ 14pt bold): Minimum 3.0:1 ratio.\n  - UI Components & Graphical Objects (Input borders, icons, buttons): Minimum 3.0:1 ratio.\n\n• Level AAA (Enhanced Standard for High-Accessibility Sites):\n  - Normal Body Text: Minimum 7.0:1 ratio.\n  - Large Text: Minimum 4.5:1 ratio.',
        callout: {
          type: 'warning',
          title: 'Common Design Mistake',
          text: 'Light gray body text (#94A3B8) on a white background (#FFFFFF) has a contrast ratio of only 2.6:1, severely failing WCAG AA. Always use #475569 or darker for readable body copy.',
        },
      },
      {
        id: 'color-blindness-considerations',
        heading: 'Designing for Color Vision Deficiency (Daltonism)',
        content:
          'Approximately 8% of men and 0.5% of women have color vision deficiency. Never rely on color alone to communicate critical states. Pair red error text with exclamation icons, green success messages with checkmarks, and underline hyperlinks in body copy.',
      },
      {
        id: 'how-to-fix-failing-contrast',
        heading: 'How to Fix Failing Color Contrast Without Breaking Your Brand',
        content:
          'If your brand color fails 4.5:1 on white (e.g. bright yellow or neon cyan), do not abandon the hue. Instead, use a darker shade from its 50-950 scale for small text, or use the bright color as a solid background with dark text (#09090B) inside.',
      },
    ],
    relatedTools: [
      {
        name: 'WCAG Contrast Checker',
        route: '/wcag-contrast-checker',
        description: 'Audit AA/AAA compliance with live component previews and smart auto-fix.',
        badge: 'Accessibility',
      },
      {
        name: 'Color Blindness Simulator',
        route: '/color-blindness-simulator',
        description: 'Simulate 8 visual conditions (Protanopia, Deuteranopia, Tritanopia) on palettes.',
        badge: 'Daltonism',
      },
      {
        name: 'Color Shades Generator',
        route: '/color-shades-generator',
        description: 'Generate darker accessible shades for body text and button borders.',
        badge: 'Shades',
      },
      {
        name: 'Live Design Preview',
        route: '/design-preview',
        description: 'Preview accessible contrast pairings in full UI layouts.',
        badge: 'Preview',
      },
    ],
    relatedGuides: ['how-to-choose-website-colors', 'what-is-oklch', 'color-theory-for-web-design'],
    faqs: [
      {
        question: 'Does placeholder text in form inputs need to meet WCAG AA contrast?',
        answer:
          'Under WCAG 2.1 Success Criterion 1.4.3, all meaningful text must meet 4.5:1. Because placeholder text is often read as instructions, aiming for at least 4.5:1 is strongly recommended.',
      },
      {
        question: 'Can I use pure black text (#000000) on pure white (#FFFFFF)?',
        answer:
          'While 21:1 passes AAA with ease, pure black on pure white can cause high optical vibration for users with dyslexia or astigmatism. Dark slate (#0F172A) or rich charcoal (#18181B) provides a softer, premium reading experience while easily passing AAA.',
      },
    ],
  },

  'how-to-create-a-color-palette': {
    slug: 'how-to-create-a-color-palette',
    title: 'How to Create a Color Palette from Scratch — Design System Guide',
    h1: 'How to Create a Cohesive Color Palette from Scratch',
    primaryKeyword: 'how to create a color palette',
    metaDescription:
      'Learn how to create a complete color palette for brands, websites, and UI design systems. Master base color selection, harmony math, shade scales, and token export.',
    readTime: '7 min read',
    category: 'UI & Web Design',
    publishDate: '2026-08-26',
    lastUpdated: '2026-09-01',
    summary:
      'A great color palette is more than 5 nice swatches. It is a functional system of primary accents, supporting neutrals, semantic states, and accessible shade steps.',
    sections: [
      {
        id: 'step-1-base-color',
        heading: 'Step 1: Pick a Strong Primary Base Color',
        content:
          'Start with one signature brand hue. This color represents your product identity across logos, primary buttons, and hero highlights. If you do not have a base color, use Chromora’s Interactive Color Wheel or AI Prompt Generator to explore emotional archetypes.',
      },
      {
        id: 'step-2-harmonies',
        heading: 'Step 2: Generate Mathematical Color Harmonies',
        content:
          'Using color wheel geometry guarantees visual cohesion:\n• Analogous: Colors adjacent on the wheel (e.g. Blue + Teal + Indigo) for serene, unified interfaces.\n• Complementary: Colors opposite each other (e.g. Indigo + Amber) for punchy high-contrast callouts.\n• Triadic: Three evenly spaced hues (e.g. Purple + Green + Orange) for playful, dynamic branding.',
      },
      {
        id: 'step-3-neutrals-scale',
        heading: 'Step 3: Build a 50-950 Tonal Shade Scale',
        content:
          'In modern UI design (such as Tailwind CSS), a single color is never enough. You need 11 lightness steps:\n• 50–100: Subtle background tints and chip backgrounds.\n• 200–300: Card borders and disabled button outlines.\n• 500–600: Default buttons and clickable link text.\n• 700–900: Dark text on light chips, pressed button states, and deep contrast elements.',
      },
      {
        id: 'step-4-export-tokens',
        heading: 'Step 4: Export to Standard Design Tokens',
        content:
          'Once your palette is finalized, export it directly into CSS custom properties, Tailwind theme configs, or W3C JSON design tokens for Figma synchronization.',
      },
    ],
    relatedTools: [
      {
        name: 'Color Palette Generator',
        route: '/color-palette-generator',
        description: 'Build 5-color palettes with 12 harmony modes and instant export.',
        badge: 'Palette Studio',
      },
      {
        name: 'Color Wheel & Harmonies',
        route: '/color-wheel',
        description: 'Explore geometric harmony relationships on a 360° chromatic wheel.',
        badge: 'Color Wheel',
      },
      {
        name: 'Tailwind Shades Generator',
        route: '/color-shades-generator',
        description: 'Generate production 50-950 scales with copyable CSS configs.',
        badge: 'Scale Generator',
      },
      {
        name: 'Image Color Extractor',
        route: '/image-color-extractor',
        description: 'Extract natural color palettes from photos and mood boards.',
        badge: 'Photo Extraction',
      },
    ],
    relatedGuides: ['color-harmony', 'website-color-palette-guide', 'how-to-choose-website-colors'],
    faqs: [
      {
        question: 'Should my neutral grays be tinted with my primary brand color?',
        answer:
          'Yes! Pure desaturated gray (#808080) can look lifeless. Adding 3% to 6% of your primary brand hue into your neutral grays (e.g. slate blue or warm taupe) makes the entire design feel cohesive.',
      },
    ],
  },

  'color-harmony': {
    slug: 'color-harmony',
    title: 'Color Harmony Rules — Complementary, Analogous & Triadic Explained',
    h1: 'Color Harmony Rules: Complementary, Analogous, Triadic & More',
    primaryKeyword: 'color harmony',
    metaDescription:
      'Master color harmony theory for graphic design and web development. Explore complementary, split-complementary, analogous, triadic, and tetradic color wheels.',
    readTime: '6 min read',
    category: 'Color Theory',
    publishDate: '2026-08-28',
    lastUpdated: '2026-09-01',
    summary:
      'Color harmony is the aesthetic balance of colors that pleases the human visual cortex. Discover how geometric angles on the color wheel create proven harmonic palettes.',
    sections: [
      {
        id: 'what-is-harmony',
        heading: 'The Geometry of Color Harmonies',
        content:
          'Harmonious color combinations are rooted in the physical optics of the 360° color wheel. When colors are positioned at specific geometric angular intervals, they produce visual equilibrium rather than chaotic discord or bland monotony.',
      },
      {
        id: 'harmony-types',
        heading: 'The 6 Essential Color Harmony Rules',
        content:
          '1. Monochromatic (0° delta): Variations in lightness and saturation of a single hue. Elegant, minimal, and impossible to clash.\n2. Analogous (30°–45° delta): Colors sitting immediately adjacent on the wheel (e.g. Yellow-Green, Green, Blue-Green). Found frequently in nature.\n3. Complementary (180° delta): Colors located directly opposite. Delivers maximum visual contrast and energetic tension (e.g. Blue and Orange).\n4. Split-Complementary (150° and 210° delta): Uses the base color plus the two colors adjacent to its complement. Delivers contrast with less visual vibration.\n5. Triadic (120° delta): Three colors equidistant from each other forming an equilateral triangle. Rich, balanced, and vibrant.\n6. Tetradic / Square (90° delta): Four colors arranged in two complementary pairs. Highly dynamic, requiring one dominant hue and three accents.',
      },
    ],
    relatedTools: [
      {
        name: 'Interactive Color Wheel',
        route: '/color-wheel',
        description: 'Drag harmony handles across a live 360° wheel to see angles in real time.',
        badge: 'Harmonies',
      },
      {
        name: 'Color Palette Generator',
        route: '/color-palette-generator',
        description: 'Generate 12 geometric harmony styles with one click.',
        badge: 'Palettes',
      },
      {
        name: 'CSS Gradient Studio',
        route: '/gradient-generator',
        description: 'Blend analogous and complementary harmonies into smooth CSS gradients.',
        badge: 'Gradients',
      },
    ],
    relatedGuides: ['color-theory-for-web-design', 'how-to-create-a-color-palette', 'hex-vs-rgb-vs-hsl'],
    faqs: [
      {
        question: 'What is the easiest harmony rule for beginners?',
        answer:
          'Analogous palettes (combining hues within 30° to 45° of each other) are the safest because they naturally blend without harsh visual contrast.',
      },
    ],
  },

  'website-color-palette-guide': {
    slug: 'website-color-palette-guide',
    title: 'Website Color Palette Guide — Modern UI Themes & Color Systems',
    h1: 'Website Color Palette Guide: Modern UI Schemes & Systems',
    primaryKeyword: 'website color palette guide',
    metaDescription:
      'Curated website color palette guide for SaaS apps, e-commerce stores, modern agencies, and developer portfolios. Includes hex codes, tokens, and preview tools.',
    readTime: '8 min read',
    category: 'UI & Web Design',
    publishDate: '2026-08-30',
    lastUpdated: '2026-09-01',
    summary:
      'Explore proven, production-tested website color palettes for SaaS platforms, fintech dashboards, e-commerce brands, and creative portfolios.',
    sections: [
      {
        id: 'saas-palettes',
        heading: '1. Modern SaaS & Tech Application Schemes',
        content:
          'Modern software products rely on high-clarity indigos (#6366F1), electric cyans (#06B6D4), and deep slate backgrounds (#0F172A). These tones convey technological sophistication, crisp information density, and effortless focus.',
      },
      {
        id: 'fintech-palettes',
        heading: '2. Fintech & Banking Color Palettes',
        content:
          'Financial platforms pair deep emerald greens (#059669) and navy blues (#1E3A8A) with crisp white containers and gold accents. This instills institutional stability, security, and monetary growth.',
      },
      {
        id: 'ecommerce-palettes',
        heading: '3. E-Commerce & Retail Color Palettes',
        content:
          'Modern lifestyle brands favor warm neutral stone backgrounds (#F5F5F4), rich charcoal typography (#1C1917), and energetic coral or terracotta accents (#EA580C) to stimulate purchase momentum.',
      },
    ],
    relatedTools: [
      {
        name: 'Live Design Preview',
        route: '/design-preview',
        description: 'Test your website color palette on SaaS and e-commerce templates.',
        badge: 'UI Preview',
      },
      {
        name: 'AI Color Palette Generator',
        route: '/ai-palette-generator',
        description: 'Generate specific website schemes by typing your industry or mood prompt.',
        badge: 'AI Generator',
      },
      {
        name: 'WCAG Contrast Checker',
        route: '/wcag-contrast-checker',
        description: 'Verify your website palette meets accessibility contrast standards.',
        badge: 'Contrast',
      },
    ],
    relatedGuides: ['how-to-choose-website-colors', 'how-to-create-a-color-palette', 'color-contrast-accessibility'],
    faqs: [
      {
        question: 'How do I test my website palette before building the frontend?',
        answer:
          'Use Chromora’s Design Preview tool. It renders your 5-color palette into live interactive SaaS dashboards, mobile widgets, and store cards in real time.',
      },
    ],
  },

  'css-color-formats': {
    slug: 'css-color-formats',
    title: 'Modern CSS Color Formats — HEX, RGB, HSL, HWB, Lab & OKLCH',
    h1: 'Modern CSS Color Formats: HEX, RGB, HSL, HWB, Lab & OKLCH',
    primaryKeyword: 'css color formats',
    metaDescription:
      'Complete developer guide to modern CSS color formats. Compare hex, rgb(), hsl(), hwb(), lab(), lch(), oklab(), and oklch() with code examples.',
    readTime: '7 min read',
    category: 'Color Formats',
    publishDate: '2026-08-31',
    lastUpdated: '2026-09-01',
    summary:
      'CSS Color Module Level 4 and Level 5 revolutionized how developers declare colors. Learn how to leverage modern color functions including color-mix() and wide-gamut OKLCH.',
    sections: [
      {
        id: 'evolution-of-css-colors',
        heading: 'The Evolution of CSS Color Functions',
        content:
          'From simple 3-character HEX in the 1990s to modern perceptually uniform color spaces, CSS now provides 8 distinct ways to declare colors. Understanding when to use legacy sRGB versus modern gamut formats is crucial for modern web performance and visual fidelity.',
      },
      {
        id: 'modern-syntax-guide',
        heading: 'Modern Space-Separated Syntax with Alpha',
        content:
          'Comma-separated rgb(r, g, b) and hsl(h, s, l) are now legacy syntax. Modern CSS uses space separation with a slash for alpha transparency across all functions.',
        codeSnippet: {
          language: 'css',
          code: '/* Modern CSS Color Level 4 syntax */\n.color-examples {\n  color: rgb(255 105 180);\n  color: hsl(330 100% 70% / 0.8);\n  color: oklch(0.7 0.25 350 / 0.9);\n  color: color-mix(in oklch, #6366f1 70%, #10b981 30%);\n}',
        },
      },
    ],
    relatedTools: [
      {
        name: 'Multi-Space Color Converter',
        route: '/color-converter',
        description: 'Convert between all CSS color formats with one click.',
        badge: 'Converter',
      },
      {
        name: 'HEX to OKLCH Converter',
        route: '/hex-to-oklch',
        description: 'Migrate legacy CSS HEX codes to modern OKLCH.',
        badge: 'OKLCH',
      },
      {
        name: 'Color Shades Generator',
        route: '/color-shades-generator',
        description: 'Export Tailwind and CSS custom properties.',
        badge: 'Tokens',
      },
    ],
    relatedGuides: ['hex-vs-rgb-vs-hsl', 'what-is-oklch', 'color-contrast-accessibility'],
    faqs: [
      {
        question: 'What is the color-mix() function in CSS?',
        answer:
          'color-mix(in <color-space>, <color1> <percentage>, <color2> <percentage>) mixes two colors directly in CSS at runtime without requiring JavaScript.',
      },
    ],
  },

  'color-theory-for-web-design': {
    slug: 'color-theory-for-web-design',
    title: 'Color Theory for Web Design — Psychology, Contrast & Harmony',
    h1: 'Color Theory for Web Design: Psychology, Contrast & Harmony',
    primaryKeyword: 'color theory for web design',
    metaDescription:
      'Learn fundamental color theory applied to web design and UI development. Discover additive vs subtractive color, visual weight, emotional psychology, and UI contrast.',
    readTime: '8 min read',
    category: 'Color Theory',
    publishDate: '2026-09-01',
    lastUpdated: '2026-09-01',
    summary:
      'Master color theory tailored specifically for digital screens. Learn how additive RGB optics, human focal depth, and contrast psychology guide user behavior.',
    sections: [
      {
        id: 'additive-vs-subtractive',
        heading: 'Additive (RGB) vs Subtractive (CMYK) Color in Web Design',
        content:
          'Print design uses subtractive CMYK ink where combining cyan, magenta, and yellow absorbs light and creates dark muddy black. Web design uses additive RGB light where combining Red, Green, and Blue light creates pure white. Understanding additive light prevents designers from picking over-saturated muddy screen tones.',
      },
      {
        id: 'visual-weight-and-hierarchy',
        heading: 'Visual Weight and Focal Hierarchy',
        content:
          'Warm colors (Red, Orange, Yellow) have high focal wavelength and optically advance toward the user, grabbing instant attention. Cool colors (Blue, Green, Slate) recede into the background. Use warm tones for key conversion actions and cool tones for calming structural layout surfaces.',
      },
    ],
    relatedTools: [
      {
        name: 'Interactive Color Wheel',
        route: '/color-wheel',
        description: 'Rotate and experiment with color theory geometries on a live wheel.',
        badge: 'Theory',
      },
      {
        name: 'Color Palette Generator',
        route: '/color-palette-generator',
        description: 'Generate harmonic palettes based on proven color theory rules.',
        badge: 'Generator',
      },
      {
        name: 'WCAG Contrast Checker',
        route: '/wcag-contrast-checker',
        description: 'Ensure color theory choices pass digital accessibility standards.',
        badge: 'Contrast',
      },
    ],
    relatedGuides: ['color-harmony', 'how-to-choose-website-colors', 'website-color-palette-guide'],
    faqs: [
      {
        question: 'Why do so many tech websites use blue?',
        answer:
          'Blue is universally associated with calm, security, logic, and dependability. It also boasts the highest color vision accessibility rates among all chromatic hues.',
      },
    ],
  },
};
