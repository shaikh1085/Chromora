import { GradientConfig } from '../types';

export interface GradientPreset {
  id: string;
  name: string;
  category: string;
  config: GradientConfig;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    category: 'Nature',
    config: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#00c6ff', position: 0 },
        { id: '2', color: '#0072ff', position: 50 },
        { id: '3', color: '#00f2fe', position: 100 },
      ],
    },
  },
  {
    id: 'california-sunset',
    name: 'Sunset Horizon',
    category: 'Atmosphere',
    config: {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#ff416c', position: 0 },
        { id: '2', color: '#ff4b2b', position: 100 },
      ],
    },
  },
  {
    id: 'ocean-abyss',
    name: 'Ocean Abyss',
    category: 'Nature',
    config: {
      type: 'linear',
      angle: 180,
      stops: [
        { id: '1', color: '#0b4f6c', position: 0 },
        { id: '2', color: '#00a896', position: 55 },
        { id: '3', color: '#028090', position: 100 },
      ],
    },
  },
  {
    id: 'candy-pop',
    name: 'Candy Pop',
    category: 'Vibrant',
    config: {
      type: 'linear',
      angle: 45,
      stops: [
        { id: '1', color: '#fa709a', position: 0 },
        { id: '2', color: '#fee140', position: 100 },
      ],
    },
  },
  {
    id: 'midnight-nebula',
    name: 'Midnight Nebula',
    category: 'Dark',
    config: {
      type: 'linear',
      angle: 225,
      stops: [
        { id: '1', color: '#0f0c29', position: 0 },
        { id: '2', color: '#302b63', position: 50 },
        { id: '3', color: '#24243e', position: 100 },
      ],
    },
  },
  {
    id: 'frosted-glass',
    name: 'Frosted Glass',
    category: 'Minimal',
    config: {
      type: 'linear',
      angle: 120,
      stops: [
        { id: '1', color: '#8ec5fc', position: 0 },
        { id: '2', color: '#e0c3fc', position: 100 },
      ],
    },
  },
  {
    id: 'cyberpunk-matrix',
    name: 'Cyberpunk Hyperdrive',
    category: 'Neon',
    config: {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#ff007f', position: 0 },
        { id: '2', color: '#7928ca', position: 50 },
        { id: '3', color: '#00dfd8', position: 100 },
      ],
    },
  },
  {
    id: 'rose-gold-luxury',
    name: 'Rose Gold Metallic',
    category: 'Luxury',
    config: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#f6d365', position: 0 },
        { id: '2', color: '#fda085', position: 60 },
        { id: '3', color: '#f093fb', position: 100 },
      ],
    },
  },
  {
    id: 'emerald-isle',
    name: 'Emerald Isle',
    category: 'Nature',
    config: {
      type: 'linear',
      angle: 45,
      stops: [
        { id: '1', color: '#0ba360', position: 0 },
        { id: '2', color: '#3cba92', position: 100 },
      ],
    },
  },
  {
    id: 'deep-cosmos-radial',
    name: 'Deep Cosmos Radial',
    category: 'Radial',
    config: {
      type: 'radial',
      angle: 0,
      shape: 'circle',
      position: 'center',
      stops: [
        { id: '1', color: '#667eea', position: 0 },
        { id: '2', color: '#764ba2', position: 60 },
        { id: '3', color: '#090a0f', position: 100 },
      ],
    },
  },
  {
    id: 'peach-blossom',
    name: 'Peach Blossom',
    category: 'Soft',
    config: {
      type: 'linear',
      angle: 60,
      stops: [
        { id: '1', color: '#ff9a9e', position: 0 },
        { id: '2', color: '#fecfef', position: 99 },
      ],
    },
  },
];

export function getCssGradientString(config: GradientConfig): string {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
  const stopStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');

  if (config.type === 'radial') {
    const shape = config.shape || 'circle';
    const pos = config.position || 'center';
    return `radial-gradient(${shape} at ${pos}, ${stopStr})`;
  }

  return `linear-gradient(${config.angle}deg, ${stopStr})`;
}

export const gradientPresets = GRADIENT_PRESETS;
export const generateCssGradient = getCssGradientString;
