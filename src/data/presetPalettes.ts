import { AIPromptPreset } from '../types';

export interface TrendingPalette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
  likes: number;
}

export const POPULAR_COLORS = [
  { name: 'Deep Ocean Blue', hex: '#0b4f6c', family: 'blue' },
  { name: 'Imperial Red', hex: '#ed2939', family: 'red' },
  { name: 'Emerald', hex: '#50c878', family: 'green' },
  { name: 'Cyber Yellow', hex: '#ffd300', family: 'yellow' },
  { name: 'Amethyst', hex: '#9966cc', family: 'purple' },
  { name: 'Sunset Orange', hex: '#fd5e53', family: 'orange' },
  { name: 'Rose Gold', hex: '#b76e79', family: 'pink' },
  { name: 'Nordic Spruce', hex: '#1c3132', family: 'green' },
  { name: 'Champagne Gold', hex: '#f7e7ce', family: 'yellow' },
  { name: 'Cobalt Blue', hex: '#0047ab', family: 'blue' },
  { name: 'Burgundy Velvet', hex: '#800020', family: 'red' },
  { name: 'Sage Green', hex: '#bcb88a', family: 'green' },
];

export const TRENDING_PALETTES: TrendingPalette[] = [
  {
    id: 'nordic-aurora',
    name: 'Nordic Aurora',
    colors: ['#0f172a', '#0284c7', '#38bdf8', '#34d399', '#f8fafc'],
    tags: ['Tech', 'Cool', 'Minimal'],
    likes: 1420,
  },
  {
    id: 'tokyo-neon',
    name: 'Tokyo Cyber Neon',
    colors: ['#09090b', '#7928ca', '#ff0080', '#00dfd8', '#f4f4f5'],
    tags: ['Neon', 'Dark', 'Gaming'],
    likes: 2180,
  },
  {
    id: 'terracotta-clay',
    name: 'Terracotta & Olive',
    colors: ['#2d2d2a', '#4c573f', '#a55337', '#d97d54', '#f6f4f1'],
    tags: ['Earthy', 'Warm', 'Interior'],
    likes: 980,
  },
  {
    id: 'parisian-luxury',
    name: 'Parisian Atelier Gold',
    colors: ['#121316', '#2b2c30', '#c5a059', '#e5c98d', '#faf8f5'],
    tags: ['Luxury', 'Fashion', 'Brand'],
    likes: 1840,
  },
  {
    id: 'matcha-botanicals',
    name: 'Matcha & Pistachio',
    colors: ['#1c2826', '#3b5a45', '#709775', '#a1cca5', '#edf5e1'],
    tags: ['Nature', 'Health', 'Organic'],
    likes: 1310,
  },
  {
    id: 'california-sunset',
    name: 'California Sunset',
    colors: ['#1d1135', '#4a154b', '#9b1d5c', '#ea4c46', '#f69e6b'],
    tags: ['Warm', 'Gradient', 'Summer'],
    likes: 1650,
  },
  {
    id: 'fintech-trust',
    name: 'Apex Fintech Blue',
    colors: ['#0a192f', '#172a45', '#3b82f6', '#60a5fa', '#f8fafc'],
    tags: ['SaaS', 'Finance', 'Trust'],
    likes: 1120,
  },
  {
    id: 'rose-quartz-dream',
    name: 'Rose Quartz & Mauve',
    colors: ['#2e1f27', '#6c4b5e', '#b98b9f', '#e0b0c6', '#f9f1f5'],
    tags: ['Pastel', 'Beauty', 'Soft'],
    likes: 1240,
  },
];

export const ASIAN_GLOBAL_INSPIRATIONS = [
  {
    id: 'asian-ramadan',
    name: 'Ramadan Moonlight & Gold',
    prompt: 'Ramadan night crescent and lantern',
    palette: ['#0b132b', '#1c2541', '#3a506b', '#d4af37', '#f8f9fa'],
    description: 'Serene spiritual twilight featuring deep midnight navy, contemplative dusk indigo, gleaming crescent gold, and pure lantern starlight.',
    tags: ['Ramadan', 'Islamic', 'Spiritual', 'Night'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-eid-celebration',
    name: 'Elegant Eid Festive Collection',
    prompt: 'Elegant Eid collection',
    palette: ['#0f3b38', '#1a535c', '#c5a059', '#e8d5b5', '#faf7f2'],
    description: 'Regal celebratory elegance blending rich pine teal, embroidered zari gold, festive pistachio undertones, and crisp ceremonial linen.',
    tags: ['Eid', 'Celebration', 'Festive', 'Luxury'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-mehndi-ceremony',
    name: 'Pakistani Mehndi & Henna',
    prompt: 'Pakistani mehndi invitation',
    palette: ['#421808', '#8b263e', '#e07a5f', '#f4a261', '#e9c46a'],
    description: 'Vibrant celebratory warmth capturing traditional bridal henna tones, radiant marigold petals, sunset amber, and royal mustard velvet.',
    tags: ['Mehndi', 'Wedding', 'Desi', 'Cultural'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-south-asian-wedding',
    name: 'Royal South Asian Wedding',
    prompt: 'South Asian wedding ceremony',
    palette: ['#4a0515', '#800020', '#c29b38', '#e5c158', '#fdfbf7'],
    description: 'Timeless bridal grandeur featuring deep crimson velvet, regal royal maroon, antique zari gold foil, and warm ivory cardstock.',
    tags: ['Wedding', 'South Asia', 'Luxury', 'Ceremony'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-diwali-festival',
    name: 'Diwali Festival of Lights',
    prompt: 'Diwali diya festival of lights',
    palette: ['#1e0c24', '#780016', '#c1121f', '#fdf0d5', '#ffaa00'],
    description: 'Auspicious illumination inspired by clay diya flames, ceremonial vermilion, peacock jewel tones, and luminous golden sparks.',
    tags: ['Diwali', 'Festival', 'India', 'Warm'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-holi-colors',
    name: 'Holi Festival of Colors',
    prompt: 'Holi festive color powder',
    palette: ['#7209b7', '#f72585', '#4361ee', '#4cc9f0', '#fee440'],
    description: 'Explosive joy mirroring pure gulal powder clouds: vivid magenta, sunlit saffron yellow, electric sky turquoise, and royal purple.',
    tags: ['Holi', 'Playful', 'Vibrant', 'Festival'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-lunar-new-year',
    name: 'Lunar New Year Spring Festival',
    prompt: 'Lunar New Year red and gold',
    palette: ['#590d22', '#a4133c', '#ff4d6d', '#ffb703', '#fdf0d5'],
    description: 'Prosperity and vitality featuring imperial cinnabar red, ceremonial gilded gold foil, festive lantern warmth, and fortune accents.',
    tags: ['Lunar New Year', 'Prosperity', 'Celebration', 'Red'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-dubai-luxury',
    name: 'Minimal Dubai Real Estate',
    prompt: 'Minimal Dubai real estate brand',
    palette: ['#10141a', '#1e242f', '#a68a56', '#d4c29d', '#faf9f6'],
    description: 'Ultra-prime architectural prestige blending desert shadow obsidian, brushed champagne bronze, titanium limestone, and sunlit pearl.',
    tags: ['Dubai', 'Luxury', 'Real Estate', 'Minimal'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-indonesian-tropical',
    name: 'Indonesian Tropical & Batik',
    prompt: 'Indonesian tropical rainforest and batik',
    palette: ['#1b3022', '#2c5e3b', '#a67c52', '#d4a373', '#fefae0'],
    description: 'Organic island serenity grounded in Bali rainforest canopy greens, handcrafted batik earth tones, and sun-warmed bamboo beige.',
    tags: ['Indonesia', 'Tropical', 'Nature', 'Organic'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-japanese-minimal',
    name: 'Japanese Minimalist Wabi-Sabi',
    prompt: 'Japanese minimal interior aesthetic',
    palette: ['#1a1a1a', '#3e3d39', '#8a8880', '#c8c6be', '#f2f0ea'],
    description: 'Contemplative zen balance rooted in sumi ink charcoal, weathered cedar tones, matcha mist, and textured unbleached washi paper.',
    tags: ['Japanese', 'Zen', 'Minimal', 'Neutral'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'asian-korean-pastel',
    name: 'Korean Aesthetic Pastel',
    prompt: 'Korean cafe pastel aesthetic',
    palette: ['#2e3842', '#ffd6e0', '#c8e7f5', '#d8f3dc', '#fff1e6'],
    description: 'Trendy Seoul cafe culture featuring soft strawberry milk pink, lavender sky tint, gentle mint glaze, and warm vanilla porcelain.',
    tags: ['Korean', 'Pastel', 'Trendy', 'Soft'],
    category: 'Asian & Global Inspirations',
  },
];

export const AI_PROMPT_PRESETS: AIPromptPreset[] = [
  {
    id: 'luxury-coffee-brand',
    prompt: 'Luxury coffee brand',
    name: 'Artisan Roast & Bourbon',
    palette: ['#1e140f', '#3e2723', '#8d6e63', '#d7ccc8', '#c5a059'],
    description:
      'Grounded in rich single-origin espresso blacks, roasted crema neutrals, and a refined metallic bronze-gold accent for premium artisanal packaging.',
    tags: ['Luxury', 'Earthy', 'Food', 'Warm'],
    category: 'Food & Beverage',
  },
  {
    id: 'modern-saas-dashboard',
    prompt: 'Modern SaaS dashboard',
    name: 'Apex Cloud Analytics',
    palette: ['#0b0f19', '#1e293b', '#6366f1', '#a855f7', '#f8fafc'],
    description:
      'Tailored for developer tools and high-velocity SaaS products. Deep obsidian background, high-contrast indigo primary, violet gradient accent, and crisp light surface.',
    tags: ['SaaS', 'Tech', 'Modern', 'Minimal'],
    category: 'Software',
  },
  {
    id: 'elegant-eid-collection',
    prompt: 'Elegant Eid collection',
    name: 'Regal Crescent & Silk Gold',
    palette: ['#0b2926', '#145048', '#c5a059', '#e8d4a2', '#fdfbf7'],
    description:
      'Celebratory high-fashion luxury combining royal emerald velvet, luminous zari embroidery gold, and delicate silk cream.',
    tags: ['Eid', 'Celebration', 'Luxury', 'Fashion'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'pakistani-mehndi-invitation',
    prompt: 'Pakistani mehndi invitation',
    name: 'Royal Mehndi & Marigold Zari',
    palette: ['#4a0e17', '#8b263e', '#e07a5f', '#d4af37', '#fdf5e6'],
    description:
      'Celebratory grandeur featuring deep royal maroon, bridal henna tones, antique embroidered gold foil, and warm ivory cardstock for timeless South Asian elegance.',
    tags: ['Mehndi', 'Wedding', 'Cultural', 'Desi'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'minimal-dubai-real-estate',
    prompt: 'Minimal Dubai real estate brand',
    name: 'Burj Horizon & Titanium Gold',
    palette: ['#0c0f14', '#19202c', '#b39255', '#dbcbab', '#f9f8f5'],
    description:
      'Architectural prestige engineered with obsidian glass, sunlit Arabian desert gold, and high-contrast editorial limestone.',
    tags: ['Dubai', 'Real Estate', 'Luxury', 'Minimal'],
    category: 'Asian & Global Inspirations',
  },
  {
    id: 'cyberpunk-gaming-app',
    prompt: 'Cyberpunk gaming app',
    name: 'Neo-Tokyo HUD Protocol',
    palette: ['#09090b', '#18181b', '#00f0ff', '#ff0055', '#ffe600'],
    description:
      'A high-voltage dark canvas anchored by true OLED onyx, electric hyper-cyan telemetry counters, laser magenta accents, and hazard yellow status alerts.',
    tags: ['Neon', 'Dark', 'Gaming', 'Tech'],
    category: 'Gaming',
  },
  {
    id: 'calm-healthcare-app',
    prompt: 'A calm healthcare app',
    name: 'Vitalis Health & Wellness',
    palette: ['#0f172a', '#0284c7', '#38bdf8', '#e0f2fe', '#ffffff'],
    description:
      'Engineered with clinical cyan, trusted deep slate, and breathable soft aqua. Promotes cognitive calm, medical authority, and rapid optical clarity for patient metrics.',
    tags: ['Health', 'Medical', 'Accessible', 'Blue'],
    category: 'Healthcare',
  },
  {
    id: 'organic-botanical-skincare',
    prompt: 'Organic botanical skincare',
    name: 'Flora Flora Eco Pure',
    palette: ['#1b2d2a', '#3f5e5a', '#84a98c', '#cad2c5', '#faf7f2'],
    description:
      'Earthy chlorophyll tones, sage mist, and warm unbleached linen. Communicates clean ingredients, biocompatibility, and holistic serenity.',
    tags: ['Nature', 'Beauty', 'Organic', 'Green'],
    category: 'Cosmetics',
  },
  {
    id: 'fintech-wealth-management',
    prompt: 'Fintech wealth management',
    name: 'Sovereign Capital & Trust',
    palette: ['#08121e', '#132a45', '#10b981', '#38bdf8', '#f1f5f9'],
    description:
      'Institutional midnight blue conveying fiduciary stability, coupled with vibrant emerald alpha indicators and precision icy slate data surfaces.',
    tags: ['Finance', 'Banking', 'Corporate', 'Green'],
    category: 'Finance',
  },
  {
    id: 'minimalist-architecture-studio',
    prompt: 'Minimalist architecture studio',
    name: 'Monolith Brutalist Mono',
    palette: ['#121212', '#282828', '#737373', '#d4d4d4', '#f5f5f5'],
    description:
      'Pristine optical grayscale hierarchy with calculated contrast ratios, celebrating raw materiality, negative space, and typographic authority.',
    tags: ['Minimal', 'Design', 'Architecture', 'Monochrome'],
    category: 'Design',
  },
];

// Deterministic mock NLP keyword analyzer for prompts
export function generatePaletteFromPrompt(promptText: string): AIPromptPreset {
  const query = promptText.toLowerCase().trim();

  // 1. Check Asian & Global Inspiration matches
  if (query.includes('ramadan') || query.includes('iftar') || query.includes('tarawih') || query.includes('islamic')) {
    return ASIAN_GLOBAL_INSPIRATIONS[0];
  }
  if (query.includes('eid') || query.includes('bairam')) {
    return ASIAN_GLOBAL_INSPIRATIONS[1];
  }
  if (query.includes('mehndi') || query.includes('henna') || query.includes('mayun') || query.includes('haldi')) {
    return ASIAN_GLOBAL_INSPIRATIONS[2];
  }
  if (query.includes('desi') || query.includes('pakistan') || (query.includes('wedding') && (query.includes('south asian') || query.includes('indian') || query.includes('punjabi')))) {
    return ASIAN_GLOBAL_INSPIRATIONS[3];
  }
  if (query.includes('diwali') || query.includes('deepavali') || query.includes('diya')) {
    return ASIAN_GLOBAL_INSPIRATIONS[4];
  }
  if (query.includes('holi') || query.includes('gulal') || query.includes('rangoli')) {
    return ASIAN_GLOBAL_INSPIRATIONS[5];
  }
  if (query.includes('lunar') || query.includes('chinese new year') || query.includes('spring festival') || query.includes('lantern festival')) {
    return ASIAN_GLOBAL_INSPIRATIONS[6];
  }
  if (query.includes('dubai') || query.includes('emirates') || query.includes('real estate') || query.includes('arabian') || query.includes('burj')) {
    return ASIAN_GLOBAL_INSPIRATIONS[7];
  }
  if (query.includes('indonesia') || query.includes('bali') || query.includes('batik') || query.includes('tropical')) {
    return ASIAN_GLOBAL_INSPIRATIONS[8];
  }
  if (query.includes('japan') || query.includes('tokyo') || query.includes('zen') || query.includes('wabi') || query.includes('kyoto')) {
    return ASIAN_GLOBAL_INSPIRATIONS[9];
  }
  if (query.includes('korean') || query.includes('k-pop') || query.includes('seoul') || query.includes('hanbok')) {
    return ASIAN_GLOBAL_INSPIRATIONS[10];
  }

  // 2. Core Industries & Concepts
  if (query.includes('coffee') || query.includes('cafe') || query.includes('roast') || query.includes('espresso') || query.includes('bakery')) {
    return AI_PROMPT_PRESETS[0];
  }
  if (query.includes('saas') || query.includes('dashboard') || query.includes('analytics') || query.includes('cloud') || query.includes('b2b')) {
    return AI_PROMPT_PRESETS[1];
  }
  if (query.includes('cyber') || query.includes('game') || query.includes('gaming') || query.includes('esport') || query.includes('hud') || query.includes('synth')) {
    return AI_PROMPT_PRESETS[5];
  }
  if (query.includes('health') || query.includes('medic') || query.includes('doctor') || query.includes('clinic') || query.includes('care') || query.includes('wellness')) {
    return AI_PROMPT_PRESETS[6];
  }
  if (query.includes('skin') || query.includes('nature') || query.includes('botanical') || query.includes('organic') || query.includes('eco') || query.includes('plant') || query.includes('matcha')) {
    return AI_PROMPT_PRESETS[7];
  }
  if (query.includes('finance') || query.includes('bank') || query.includes('money') || query.includes('crypto') || query.includes('invest') || query.includes('wealth')) {
    return AI_PROMPT_PRESETS[8];
  }
  if (query.includes('minimal') || query.includes('arch') || query.includes('mono') || query.includes('studio') || query.includes('black and white')) {
    return AI_PROMPT_PRESETS[9];
  }

  // 3. Mood and aesthetic keywords
  if (query.includes('luxury') || query.includes('gold') || query.includes('premium') || query.includes('royal') || query.includes('vip')) {
    return {
      id: `custom-luxury-${Date.now()}`,
      prompt: promptText,
      name: 'Imperial Reserve Luxury',
      palette: ['#0d0d11', '#1f1f27', '#c9a86a', '#e8d4a2', '#fbf9f5'],
      description: `Tailored for "${promptText}". Uses dark obsidian depth balanced with soft champagne gold and high-contrast editorial neutrals.`,
      tags: ['Luxury', 'Custom', 'Gold'],
      category: 'Luxury',
    };
  }

  if (query.includes('ocean') || query.includes('sea') || query.includes('water') || query.includes('surf') || query.includes('marine')) {
    return {
      id: `custom-ocean-${Date.now()}`,
      prompt: promptText,
      name: 'Deep Oceanic Trench',
      palette: ['#061a24', '#0d3b66', '#00a896', '#02c39a', '#f0fdf4'],
      description: `Synthesized for "${promptText}". Deep sapphire abyss flowing into vibrant bioluminescent teal and crisp coastal white.`,
      tags: ['Ocean', 'Cool', 'Water'],
      category: 'Nature',
    };
  }

  if (query.includes('sunset') || query.includes('warm') || query.includes('fire') || query.includes('summer') || query.includes('autumn') || query.includes('fall')) {
    return {
      id: `custom-sunset-${Date.now()}`,
      prompt: promptText,
      name: 'Solstice Horizon',
      palette: ['#1f0d24', '#591a4f', '#a83262', '#e85d04', '#ffba08'],
      description: `Dynamic warm palette for "${promptText}". Emulates golden hour twilight, radiant amber highlights, and velvet dusk shadows.`,
      tags: ['Sunset', 'Warm', 'Vibrant'],
      category: 'Atmosphere',
    };
  }

  if (query.includes('pastel') || query.includes('cute') || query.includes('baby') || query.includes('soft') || query.includes('dream')) {
    return {
      id: `custom-pastel-${Date.now()}`,
      prompt: promptText,
      name: 'Ethereal Cloud Pastels',
      palette: ['#2b2d42', '#ffd1dc', '#c1e1c1', '#b5ead7', '#ffdac1'],
      description: `Muted, gentle palette matching "${promptText}". Delivers delicate low-contrast friendliness while preserving essential typographic readability.`,
      tags: ['Pastel', 'Soft', 'Dreamy'],
      category: 'Playful',
    };
  }

  if (query.includes('food') || query.includes('restaurant') || query.includes('kitchen') || query.includes('dining') || query.includes('pizza') || query.includes('burger')) {
    return {
      id: `custom-food-${Date.now()}`,
      prompt: promptText,
      name: 'Gourmet Bistro & Saffron',
      palette: ['#1c1917', '#7c2d12', '#ea580c', '#fbbf24', '#fef3c7'],
      description: `Appetite-stimulating palette for "${promptText}". Rich toasted charcoal, warm spicy terracotta, and vibrant saffron accents.`,
      tags: ['Food', 'Culinary', 'Warm'],
      category: 'Hospitality',
    };
  }

  // Dynamic default intelligent synthesis
  let hash = 0;
  for (let i = 0; i < promptText.length; i++) {
    hash = (hash << 5) - hash + promptText.charCodeAt(i);
    hash |= 0;
  }
  const baseHue = Math.abs(hash) % 360;

  return {
    id: `custom-prompt-${Date.now()}`,
    prompt: promptText,
    name: `Custom System: ${promptText.slice(0, 24)}...`,
    palette: [
      '#090d16',
      '#1a2234',
      `#${baseHue > 180 ? '38bdf8' : '6366f1'}`,
      `#${baseHue > 180 ? '34d399' : 'ec4899'}`,
      '#f8fafc',
    ],
    description: `Specially calibrated for "${promptText}". Formatted with cohesive hue hierarchy, calculated surface contrasts, and semantic accent role distribution.`,
    tags: ['Custom', 'AI Synthesis', 'Adaptive'],
    category: 'Generative',
  };
}

export const aiPromptPresets = AI_PROMPT_PRESETS;
export const generateAiPromptPalette = generatePaletteFromPrompt;
export const trendingPalettes = TRENDING_PALETTES;
