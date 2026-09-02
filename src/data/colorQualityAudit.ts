// Quality Classification and Indexability Audit for Named Colors
// Tier A: Strong standalone search/user value (CSS standard, historical pigments, classic design names)
// Tier B: Useful technical/specialized colors (distinct chromatic profile, valid contrast & tokens)
// Tier C: Thin/redundant micro-modifiers or near-duplicate descriptors (set to noindex, follow)

export interface ColorAuditRecord {
  name: string;
  hex: string;
  tier: 'A' | 'B' | 'C';
  indexable: boolean;
  reason: string;
}

// Set of low-value synthetic modifier variants and redundant descriptors
export const CLASS_C_NAMES = new Set([
  'bittersweet shimmer',
  'blood orange red',
  'cabernet sauvignon',
  'cedar wood plank',
  'cherry cola',
  'cinnabar red',
  'deep fuchsia bloom',
  'fire opal orange',
  'havana brown cigar',
  'jasper red',
  'leather boot brown',
  'mahogany plank',
  'marsala wine purple',
  'plum pink sweet',
  'blush velvet',
  'sweet pink bubble',
  'natural cotton',
  'sweet apricot',
  'sweet tangerine',
  'sweet corn yellow',
  'caterpillar green',
  'emerald velvet',
  'laurel leaf green',
  'matcha tea powder',
  'oak leaf green',
  'sweet pea green',
  'aqua velvet',
  'jacaranda bloom',
  'brown sugar sweet',
  'raw umber natural',
  'rust metal patina',
  'gunmetal iron',
  'storm cloud slate',
  'cotton ball white',
  'aubergine velvet',
  'chocolate fudge',
  'ocean abyssal teal',
]);

export function getColorQualityTier(name: string): 'A' | 'B' | 'C' {
  const normalized = name.toLowerCase().trim();
  if (CLASS_C_NAMES.has(normalized)) {
    return 'C';
  }
  // Tier A: High-intent design standards, CSS colors, or classic pigments
  return 'A'; // or 'B' for specialized
}

export function isColorIndexable(nameOrSlug: string): boolean {
  const normalized = nameOrSlug
    .toLowerCase()
    .replace(/-[0-9a-f]{3,6}$/i, '')
    .replace(/-/g, ' ')
    .trim();

  return !CLASS_C_NAMES.has(normalized);
}
