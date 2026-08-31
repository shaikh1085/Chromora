export interface PantoneColor {
  code: string;
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  cmyk: { c: number; m: number; y: number; k: number };
  category: 'Formula Guide (PMS)' | 'Fashion, Home + Interiors (TCX/TPG)' | 'Color of the Year' | 'Metallics' | 'Pastels & Neons';
  year?: number;
  description?: string;
  system?: string;
}

export interface RalColor {
  code: string; // e.g. "RAL 1000"
  name: string; // e.g. "Green beige"
  germanName: string; // e.g. "Grünbeige"
  hex: string;
  rgb: { r: number; g: number; b: number };
  category: 'Yellow' | 'Orange' | 'Red' | 'Violet' | 'Blue' | 'Green' | 'Grey' | 'Brown' | 'White and Black';
  system?: string;
}

export const PANTONE_COLORS: PantoneColor[] = [
  // Colors of the Year & Iconic Shades
  { code: 'PANTONE 13-1023', name: 'Peach Fuzz', hex: '#ffbe98', rgb: { r: 255, g: 190, b: 152 }, cmyk: { c: 0, m: 25, y: 40, k: 0 }, category: 'Color of the Year', year: 2024, description: 'A velvety gentle peach whose all-embracing spirit enriches mind, body, and heart.' },
  { code: 'PANTONE 18-1750', name: 'Viva Magenta', hex: '#be3455', rgb: { r: 190, g: 52, b: 85 }, cmyk: { c: 0, m: 73, y: 55, k: 25 }, category: 'Color of the Year', year: 2023, description: 'An unconventional red for an unconventional time, vibrating with vim and vigor.' },
  { code: 'PANTONE 17-3938', name: 'Very Peri', hex: '#6667ab', rgb: { r: 102, g: 103, b: 171 }, cmyk: { c: 40, m: 40, y: 0, k: 33 }, category: 'Color of the Year', year: 2022, description: 'A dynamic periwinkle blue hue with a vivifying violet red undertone.' },
  { code: 'PANTONE 17-5104', name: 'Ultimate Gray', hex: '#939597', rgb: { r: 147, g: 149, b: 151 }, cmyk: { c: 3, m: 1, y: 0, k: 41 }, category: 'Color of the Year', year: 2021, description: 'Emblematic of solid and dependable elements which are imperishable.' },
  { code: 'PANTONE 13-0647', name: 'Illuminating', hex: '#f5df4d', rgb: { r: 245, g: 223, b: 77 }, cmyk: { c: 0, m: 9, y: 69, k: 4 }, category: 'Color of the Year', year: 2021, description: 'A bright and cheerful yellow sparkling with vivacity, a warming yellow hue imbued with solar power.' },
  { code: 'PANTONE 19-4052', name: 'Classic Blue', hex: '#0f4c81', rgb: { r: 15, g: 76, b: 129 }, cmyk: { c: 88, m: 41, y: 0, k: 49 }, category: 'Color of the Year', year: 2020, description: 'Instilling calm, confidence, and connection, enduring blue hue highlights our desire for dependable foundation.' },
  { code: 'PANTONE 16-1546', name: 'Living Coral', hex: '#ff6f61', rgb: { r: 255, g: 111, b: 97 }, cmyk: { c: 0, m: 56, y: 62, k: 0 }, category: 'Color of the Year', year: 2019, description: 'An animating and life-affirming coral hue with a golden undertone.' },
  { code: 'PANTONE 18-3838', name: 'Ultra Violet', hex: '#5f4b8b', rgb: { r: 95, g: 75, b: 139 }, cmyk: { c: 32, m: 46, y: 0, k: 45 }, category: 'Color of the Year', year: 2018, description: 'A dramatically provocative and thoughtful purple shade communicating originality.' },
  { code: 'PANTONE 15-0343', name: 'Greenery', hex: '#88b04b', rgb: { r: 136, g: 176, b: 75 }, cmyk: { c: 23, m: 0, y: 57, k: 31 }, category: 'Color of the Year', year: 2017, description: 'A refreshing and revitalizing shade symbolic of new beginnings.' },
  { code: 'PANTONE 13-1520', name: 'Rose Quartz', hex: '#f7cac9', rgb: { r: 247, g: 202, b: 201 }, cmyk: { c: 0, m: 18, y: 19, k: 3 }, category: 'Color of the Year', year: 2016, description: 'A persuasive yet gentle tone conveying compassion and a sense of composure.' },
  { code: 'PANTONE 15-3919', name: 'Serenity', hex: '#92a8d1', rgb: { r: 146, g: 168, b: 209 }, cmyk: { c: 30, m: 20, y: 0, k: 18 }, category: 'Color of the Year', year: 2016, description: 'Weightless and airy, like the expanse of the blue sky above us.' },
  { code: 'PANTONE 18-1438', name: 'Marsala', hex: '#955251', rgb: { r: 149, g: 82, b: 81 }, cmyk: { c: 0, m: 45, y: 46, k: 42 }, category: 'Color of the Year', year: 2015, description: 'A naturally robust and earthy wine red that enriches our mind, body and soul.' },
  { code: 'PANTONE 18-3224', name: 'Radiant Orchid', hex: '#b163a3', rgb: { r: 177, g: 99, b: 163 }, cmyk: { c: 0, m: 44, y: 8, k: 31 }, category: 'Color of the Year', year: 2014, description: 'An enchanting harmony of fuchsia, purple and pink undertones.' },
  { code: 'PANTONE 17-5641', name: 'Emerald', hex: '#009b77', rgb: { r: 0, g: 155, b: 119 }, cmyk: { c: 100, m: 0, y: 23, k: 39 }, category: 'Color of the Year', year: 2013, description: 'Luminous, magnificent, and universally appealing.' },
  { code: 'PANTONE 17-1463', name: 'Tangerine Tango', hex: '#dd4124', rgb: { r: 221, g: 65, b: 36 }, cmyk: { c: 0, m: 71, y: 84, k: 13 }, category: 'Color of the Year', year: 2012, description: 'A spirited reddish orange that provides the energy boost to recharge.' },

  // Classic Pantone Formula Guide (PMS)
  { code: 'PANTONE Yellow C', name: 'Process Yellow', hex: '#fed100', rgb: { r: 254, g: 209, b: 0 }, cmyk: { c: 0, m: 18, y: 100, k: 0 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE Yellow 012 C', name: 'Yellow 012', hex: '#ffd700', rgb: { r: 255, g: 215, b: 0 }, cmyk: { c: 0, m: 16, y: 100, k: 0 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 100 C', name: 'Light Butter Yellow', hex: '#f4ed7c', rgb: { r: 244, g: 237, b: 124 }, cmyk: { c: 0, m: 3, y: 49, k: 4 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 109 C', name: 'Golden Sun Yellow', hex: '#ffd100', rgb: { r: 255, g: 209, b: 0 }, cmyk: { c: 0, m: 18, y: 100, k: 0 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 116 C', name: 'Sun Yellow', hex: '#ffcd00', rgb: { r: 255, g: 205, b: 0 }, cmyk: { c: 0, m: 20, y: 100, k: 0 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 123 C', name: 'Warm Amber Yellow', hex: '#ffc72c', rgb: { r: 255, g: 199, b: 44 }, cmyk: { c: 0, m: 22, y: 83, k: 0 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 130 C', name: 'Deep Gold Ochre', hex: '#f2a900', rgb: { r: 242, g: 169, b: 0 }, cmyk: { c: 0, m: 30, y: 100, k: 5 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 137 C', name: 'Marigold Tangerine', hex: '#ffa300', rgb: { r: 255, g: 163, b: 0 }, cmyk: { c: 0, m: 36, y: 100, k: 0 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 151 C', name: 'Vibrant Orange', hex: '#ff8200', rgb: { r: 255, g: 130, b: 0 }, cmyk: { c: 0, m: 49, y: 100, k: 0 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 165 C', name: 'Bright Safety Orange', hex: '#ff671f', rgb: { r: 255, g: 103, b: 31 }, cmyk: { c: 0, m: 60, y: 88, k: 0 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 172 C', name: 'Flaming Scarlet', hex: '#fa4616', rgb: { r: 250, g: 70, b: 22 }, cmyk: { c: 0, m: 72, y: 91, k: 2 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 179 C', name: 'Poppy Red', hex: '#e03c31', rgb: { r: 224, g: 60, b: 49 }, cmyk: { c: 0, m: 73, y: 78, k: 12 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 185 C', name: 'Classic Crimson Red', hex: '#e4002b', rgb: { r: 228, g: 0, b: 43 }, cmyk: { c: 0, m: 100, y: 81, k: 11 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 186 C', name: 'Corporate Red', hex: '#c8102e', rgb: { r: 200, g: 16, b: 46 }, cmyk: { c: 0, m: 92, y: 77, k: 22 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 199 C', name: 'Ruby Cardinal Red', hex: '#d50032', rgb: { r: 213, g: 0, b: 50 }, cmyk: { c: 0, m: 100, y: 77, k: 16 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 200 C', name: 'Rich Crimson', hex: '#ba0c2f', rgb: { r: 186, g: 12, b: 47 }, cmyk: { c: 0, m: 94, y: 75, k: 27 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 201 C', name: 'Burgundy Wine', hex: '#9d2235', rgb: { r: 157, g: 34, b: 53 }, cmyk: { c: 0, m: 78, y: 66, k: 38 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 207 C', name: 'Garnet Claret', hex: '#a6192e', rgb: { r: 166, g: 25, b: 46 }, cmyk: { c: 0, m: 85, y: 72, k: 35 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 219 C', name: 'Barbie Pink', hex: '#da1884', rgb: { r: 218, g: 24, b: 132 }, cmyk: { c: 0, m: 89, y: 39, k: 15 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 226 C', name: 'Electric Magenta Pink', hex: '#d60270', rgb: { r: 214, g: 2, b: 112 }, cmyk: { c: 0, m: 99, y: 48, k: 16 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 239 C', name: 'Wild Orchid Pink', hex: '#d742a0', rgb: { r: 215, g: 66, b: 160 }, cmyk: { c: 0, m: 69, y: 26, k: 16 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 259 C', name: 'Imperial Violet', hex: '#6d2077', rgb: { r: 109, g: 32, b: 119 }, cmyk: { c: 8, m: 73, y: 0, k: 53 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 268 C', name: 'Deep Royal Purple', hex: '#582c83', rgb: { r: 88, g: 44, b: 131 }, cmyk: { c: 33, m: 66, y: 0, k: 49 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 2728 C', name: 'Cobalt Azure', hex: '#0047bb', rgb: { r: 0, g: 71, b: 187 }, cmyk: { c: 100, m: 62, y: 0, k: 27 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 286 C', name: 'True Royal Blue', hex: '#0033a0', rgb: { r: 0, g: 51, b: 160 }, cmyk: { c: 100, m: 68, y: 0, k: 37 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 293 C', name: 'Medium Sapphire', hex: '#0051ba', rgb: { r: 0, g: 81, b: 186 }, cmyk: { c: 100, m: 56, y: 0, k: 27 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 300 C', name: 'Bright Brand Blue', hex: '#005eb8', rgb: { r: 0, g: 94, b: 184 }, cmyk: { c: 100, m: 49, y: 0, k: 28 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 312 C', name: 'Vibrant Turquoise', hex: '#00a3e0', rgb: { r: 0, g: 163, b: 224 }, cmyk: { c: 100, m: 27, y: 0, k: 12 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 320 C', name: 'Lagoon Teal', hex: '#009ca6', rgb: { r: 0, g: 156, b: 166 }, cmyk: { c: 100, m: 6, y: 0, k: 35 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 3278 C', name: 'Peacock Sea Green', hex: '#009a7b', rgb: { r: 0, g: 154, b: 123 }, cmyk: { c: 100, m: 0, y: 20, k: 40 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 347 C', name: 'Irish Kelly Green', hex: '#009a44', rgb: { r: 0, g: 154, b: 68 }, cmyk: { c: 100, m: 0, y: 56, k: 40 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 354 C', name: 'Electric Shamrock', hex: '#00b140', rgb: { r: 0, g: 177, b: 64 }, cmyk: { c: 100, m: 0, y: 64, k: 31 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 368 C', name: 'Fresh Spring Lime', hex: '#78be20', rgb: { r: 120, g: 190, b: 32 }, cmyk: { c: 37, m: 0, y: 83, k: 25 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 375 C', name: 'Fluorescent Green', hex: '#97d700', rgb: { r: 151, g: 215, b: 0 }, cmyk: { c: 30, m: 0, y: 100, k: 16 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 424 C', name: 'Steel Neutral Grey', hex: '#707372', rgb: { r: 112, g: 115, b: 114 }, cmyk: { c: 3, m: 0, y: 1, k: 55 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 469 C', name: 'Rich Espresso Brown', hex: '#5b341e', rgb: { r: 91, g: 52, b: 30 }, cmyk: { c: 0, m: 43, y: 67, k: 64 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE Black C', name: 'Standard Black', hex: '#2d2926', rgb: { r: 45, g: 41, b: 38 }, cmyk: { c: 0, m: 9, y: 16, k: 82 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE Cool Gray 1 C', name: 'Cool Gray 1', hex: '#d9d9d6', rgb: { r: 217, g: 217, b: 214 }, cmyk: { c: 0, m: 0, y: 1, k: 15 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE Cool Gray 7 C', name: 'Cool Gray 7', hex: '#97999b', rgb: { r: 151, g: 153, b: 155 }, cmyk: { c: 3, m: 1, y: 0, k: 39 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE Cool Gray 11 C', name: 'Cool Gray 11', hex: '#53565a', rgb: { r: 83, g: 86, b: 90 }, cmyk: { c: 8, m: 4, y: 0, k: 65 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE Warm Gray 1 C', name: 'Warm Gray 1', hex: '#d7d2cb', rgb: { r: 215, g: 210, b: 203 }, cmyk: { c: 0, m: 2, y: 6, k: 16 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE Warm Gray 8 C', name: 'Warm Gray 8', hex: '#8c827a', rgb: { r: 140, g: 130, b: 122 }, cmyk: { c: 0, m: 7, y: 13, k: 45 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE Reflex Blue C', name: 'Reflex Blue', hex: '#0a1172', rgb: { r: 10, g: 17, b: 114 }, cmyk: { c: 91, m: 85, y: 0, k: 55 }, category: 'Formula Guide (PMS)' },
  { code: 'PANTONE 877 C', name: 'Metallic Silver', hex: '#8a8d8f', rgb: { r: 138, g: 141, b: 143 }, cmyk: { c: 3, m: 1, y: 0, k: 44 }, category: 'Metallics' },
  { code: 'PANTONE 871 C', name: 'Metallic Gold', hex: '#86724c', rgb: { r: 134, g: 114, b: 76 }, cmyk: { c: 0, m: 15, y: 43, k: 47 }, category: 'Metallics' },
  { code: 'PANTONE 806 C', name: 'Neon Hot Pink', hex: '#ff3eb5', rgb: { r: 255, g: 62, b: 181 }, cmyk: { c: 0, m: 76, y: 29, k: 0 }, category: 'Pastels & Neons' },
  { code: 'PANTONE 802 C', name: 'Neon Acid Green', hex: '#44d62c', rgb: { r: 68, g: 214, b: 44 }, cmyk: { c: 68, m: 0, y: 79, k: 16 }, category: 'Pastels & Neons' },
];

export const RAL_COLORS: RalColor[] = [
  // Yellows
  { code: 'RAL 1000', name: 'Green beige', germanName: 'Grünbeige', hex: '#cfb078', rgb: { r: 207, g: 176, b: 120 }, category: 'Yellow' },
  { code: 'RAL 1001', name: 'Beige', germanName: 'Beige', hex: '#d0b084', rgb: { r: 208, g: 176, b: 132 }, category: 'Yellow' },
  { code: 'RAL 1002', name: 'Sand yellow', germanName: 'Sandgelb', hex: '#d2aa6d', rgb: { r: 210, g: 170, b: 109 }, category: 'Yellow' },
  { code: 'RAL 1003', name: 'Signal yellow', germanName: 'Signalgelb', hex: '#f9a800', rgb: { r: 249, g: 168, b: 0 }, category: 'Yellow' },
  { code: 'RAL 1004', name: 'Golden yellow', germanName: 'Goldgelb', hex: '#e49e00', rgb: { r: 228, g: 158, b: 0 }, category: 'Yellow' },
  { code: 'RAL 1005', name: 'Honey yellow', germanName: 'Honiggelb', hex: '#cb8e00', rgb: { r: 203, g: 142, b: 0 }, category: 'Yellow' },
  { code: 'RAL 1012', name: 'Lemon yellow', germanName: 'Zitronengelb', hex: '#d1a100', rgb: { r: 209, g: 161, b: 0 }, category: 'Yellow' },
  { code: 'RAL 1013', name: 'Oyster white', germanName: 'Perlweiß', hex: '#e3d9c6', rgb: { r: 227, g: 217, b: 198 }, category: 'Yellow' },
  { code: 'RAL 1015', name: 'Light ivory', germanName: 'Hellelfenbein', hex: '#e6d2b5', rgb: { r: 230, g: 210, b: 181 }, category: 'Yellow' },
  { code: 'RAL 1018', name: 'Zinc yellow', germanName: 'Zinkgelb', hex: '#f8f32b', rgb: { r: 248, g: 243, b: 43 }, category: 'Yellow' },
  { code: 'RAL 1021', name: 'Rape yellow (Colza)', germanName: 'Rapsgelb', hex: '#eedc00', rgb: { r: 238, g: 220, b: 0 }, category: 'Yellow' },
  { code: 'RAL 1023', name: 'Traffic yellow', germanName: 'Verkehrsgelb', hex: '#f7b500', rgb: { r: 247, g: 181, b: 0 }, category: 'Yellow' },
  { code: 'RAL 1028', name: 'Melon yellow', germanName: 'Melonengelb', hex: '#ffa400', rgb: { r: 255, g: 164, b: 0 }, category: 'Yellow' },

  // Oranges
  { code: 'RAL 2000', name: 'Yellow orange', germanName: 'Gelborange', hex: '#ed760e', rgb: { r: 237, g: 118, b: 14 }, category: 'Orange' },
  { code: 'RAL 2001', name: 'Red orange', germanName: 'Rotorange', hex: '#c93c20', rgb: { r: 201, g: 60, b: 32 }, category: 'Orange' },
  { code: 'RAL 2002', name: 'Vermilion', germanName: 'Blutorange', hex: '#cb2821', rgb: { r: 203, g: 40, b: 33 }, category: 'Orange' },
  { code: 'RAL 2003', name: 'Pastel orange', germanName: 'Pastellorange', hex: '#ff7514', rgb: { r: 255, g: 117, b: 20 }, category: 'Orange' },
  { code: 'RAL 2004', name: 'Pure orange', germanName: 'Reinorange', hex: '#f44611', rgb: { r: 244, g: 70, b: 17 }, category: 'Orange' },
  { code: 'RAL 2008', name: 'Bright red orange', germanName: 'Hellrotorange', hex: '#f75e25', rgb: { r: 247, g: 94, b: 37 }, category: 'Orange' },
  { code: 'RAL 2009', name: 'Traffic orange', germanName: 'Verkehrsorange', hex: '#f54021', rgb: { r: 245, g: 64, b: 33 }, category: 'Orange' },
  { code: 'RAL 2011', name: 'Deep orange', germanName: 'Tieforange', hex: '#ec7c26', rgb: { r: 236, g: 124, b: 38 }, category: 'Orange' },

  // Reds
  { code: 'RAL 3000', name: 'Flame red', germanName: 'Feuerrot', hex: '#af2b1e', rgb: { r: 175, g: 43, b: 30 }, category: 'Red' },
  { code: 'RAL 3001', name: 'Signal red', germanName: 'Signalrot', hex: '#a52019', rgb: { r: 165, g: 32, b: 25 }, category: 'Red' },
  { code: 'RAL 3002', name: 'Carmine red', germanName: 'Karminrot', hex: '#9b111e', rgb: { r: 155, g: 17, b: 30 }, category: 'Red' },
  { code: 'RAL 3003', name: 'Ruby red', germanName: 'Rubinrot', hex: '#6b1c23', rgb: { r: 107, g: 28, b: 35 }, category: 'Red' },
  { code: 'RAL 3004', name: 'Purple red', germanName: 'Purpurrot', hex: '#6c1b26', rgb: { r: 108, g: 27, b: 38 }, category: 'Red' },
  { code: 'RAL 3005', name: 'Wine red', germanName: 'Weinrot', hex: '#581e22', rgb: { r: 88, g: 30, b: 34 }, category: 'Red' },
  { code: 'RAL 3011', name: 'Brown red', germanName: 'Braunrot', hex: '#792423', rgb: { r: 121, g: 36, b: 35 }, category: 'Red' },
  { code: 'RAL 3015', name: 'Light pink', germanName: 'Hellrosa', hex: '#d8a0a6', rgb: { r: 216, g: 160, b: 166 }, category: 'Red' },
  { code: 'RAL 3017', name: 'Rose', germanName: 'Rosé', hex: '#d3545f', rgb: { r: 211, g: 84, b: 95 }, category: 'Red' },
  { code: 'RAL 3020', name: 'Traffic red', germanName: 'Verkehrsrot', hex: '#cc0605', rgb: { r: 204, g: 6, b: 5 }, category: 'Red' },
  { code: 'RAL 3024', name: 'Luminous red', germanName: 'Leuchtrot', hex: '#f70000', rgb: { r: 247, g: 0, b: 0 }, category: 'Red' },

  // Violets
  { code: 'RAL 4001', name: 'Red lilac', germanName: 'Rotlila', hex: '#6d3b53', rgb: { r: 109, g: 59, b: 83 }, category: 'Violet' },
  { code: 'RAL 4002', name: 'Red violet', germanName: 'Rotviolett', hex: '#863240', rgb: { r: 134, g: 50, b: 64 }, category: 'Violet' },
  { code: 'RAL 4003', name: 'Heather violet', germanName: 'Erikaviolett', hex: '#c4618c', rgb: { r: 196, g: 97, b: 140 }, category: 'Violet' },
  { code: 'RAL 4004', name: 'Claret violet', germanName: 'Bordeauxviolett', hex: '#641c34', rgb: { r: 100, g: 28, b: 52 }, category: 'Violet' },
  { code: 'RAL 4005', name: 'Blue lilac', germanName: 'Blaulila', hex: '#6c4675', rgb: { r: 108, g: 70, b: 117 }, category: 'Violet' },
  { code: 'RAL 4006', name: 'Traffic purple', germanName: 'Verkehrspurpur', hex: '#903373', rgb: { r: 144, g: 51, b: 115 }, category: 'Violet' },
  { code: 'RAL 4007', name: 'Purple violet', germanName: 'Purpurviolett', hex: '#47243b', rgb: { r: 71, g: 36, b: 59 }, category: 'Violet' },
  { code: 'RAL 4008', name: 'Signal violet', germanName: 'Signalviolett', hex: '#844c82', rgb: { r: 132, g: 76, b: 130 }, category: 'Violet' },
  { code: 'RAL 4010', name: 'Telemagenta', germanName: 'Telemagenta', hex: '#bc4077', rgb: { r: 188, g: 64, b: 119 }, category: 'Violet' },

  // Blues
  { code: 'RAL 5000', name: 'Violet blue', germanName: 'Violettblau', hex: '#31445b', rgb: { r: 49, g: 68, b: 91 }, category: 'Blue' },
  { code: 'RAL 5001', name: 'Green blue', germanName: 'Grünblau', hex: '#1b5561', rgb: { r: 27, g: 85, b: 97 }, category: 'Blue' },
  { code: 'RAL 5002', name: 'Ultramarine blue', germanName: 'Ultramarinblau', hex: '#1e3888', rgb: { r: 30, g: 56, b: 136 }, category: 'Blue' },
  { code: 'RAL 5003', name: 'Sapphire blue', germanName: 'Saphirblau', hex: '#1d334a', rgb: { r: 29, g: 51, b: 74 }, category: 'Blue' },
  { code: 'RAL 5004', name: 'Black blue', germanName: 'Schwarzblau', hex: '#181d24', rgb: { r: 24, g: 29, b: 36 }, category: 'Blue' },
  { code: 'RAL 5005', name: 'Signal blue', germanName: 'Signalblau', hex: '#154889', rgb: { r: 21, g: 72, b: 137 }, category: 'Blue' },
  { code: 'RAL 5007', name: 'Brilliant blue', germanName: 'Brillantblau', hex: '#3b6e8c', rgb: { r: 59, g: 110, b: 140 }, category: 'Blue' },
  { code: 'RAL 5010', name: 'Gentian blue', germanName: 'Enzianblau', hex: '#0e518d', rgb: { r: 14, g: 81, b: 141 }, category: 'Blue' },
  { code: 'RAL 5012', name: 'Light blue', germanName: 'Lichtblau', hex: '#2483be', rgb: { r: 36, g: 131, b: 190 }, category: 'Blue' },
  { code: 'RAL 5015', name: 'Sky blue', germanName: 'Himmelblau', hex: '#2271b3', rgb: { r: 34, g: 113, b: 179 }, category: 'Blue' },
  { code: 'RAL 5017', name: 'Traffic blue', germanName: 'Verkehrsblau', hex: '#063971', rgb: { r: 6, g: 57, b: 113 }, category: 'Blue' },
  { code: 'RAL 5021', name: 'Water blue', germanName: 'Wasserblau', hex: '#256d7b', rgb: { r: 37, g: 109, b: 123 }, category: 'Blue' },
  { code: 'RAL 5024', name: 'Pastel blue', germanName: 'Pastellblau', hex: '#5d9b9b', rgb: { r: 93, g: 155, b: 155 }, category: 'Blue' },

  // Greens
  { code: 'RAL 6000', name: 'Patina green', germanName: 'Patinagrün', hex: '#316650', rgb: { r: 49, g: 102, b: 80 }, category: 'Green' },
  { code: 'RAL 6001', name: 'Emerald green', germanName: 'Smaragdgrün', hex: '#287233', rgb: { r: 40, g: 114, b: 51 }, category: 'Green' },
  { code: 'RAL 6002', name: 'Leaf green', germanName: 'Laubgrün', hex: '#2d572c', rgb: { r: 45, g: 87, b: 44 }, category: 'Green' },
  { code: 'RAL 6005', name: 'Moss green', germanName: 'Moosgrün', hex: '#2f4538', rgb: { r: 47, g: 69, b: 56 }, category: 'Green' },
  { code: 'RAL 6009', name: 'Fir green', germanName: 'Tannengrün', hex: '#26392f', rgb: { r: 38, g: 57, b: 47 }, category: 'Green' },
  { code: 'RAL 6018', name: 'Yellow green', germanName: 'Gelbgrün', hex: '#48a43f', rgb: { r: 72, g: 164, b: 63 }, category: 'Green' },
  { code: 'RAL 6019', name: 'Pastel green', germanName: 'Pastellgrün', hex: '#b9ceac', rgb: { r: 185, g: 206, b: 172 }, category: 'Green' },
  { code: 'RAL 6024', name: 'Traffic green', germanName: 'Verkehrsgrün', hex: '#308446', rgb: { r: 48, g: 132, b: 70 }, category: 'Green' },
  { code: 'RAL 6027', name: 'Light green', germanName: 'Lichtgrün', hex: '#77b5a8', rgb: { r: 119, g: 181, b: 168 }, category: 'Green' },
  { code: 'RAL 6032', name: 'Signal green', germanName: 'Signalgrün', hex: '#226343', rgb: { r: 34, g: 99, b: 67 }, category: 'Green' },

  // Greys
  { code: 'RAL 7001', name: 'Silver grey', germanName: 'Silbergrau', hex: '#8a9597', rgb: { r: 138, g: 149, b: 151 }, category: 'Grey' },
  { code: 'RAL 7004', name: 'Signal grey', germanName: 'Signalgrau', hex: '#969992', rgb: { r: 150, g: 153, b: 146 }, category: 'Grey' },
  { code: 'RAL 7005', name: 'Mouse grey', germanName: 'Mausgrau', hex: '#6b6b6b', rgb: { r: 107, g: 107, b: 107 }, category: 'Grey' },
  { code: 'RAL 7016', name: 'Anthracite grey', germanName: 'Anthrazitgrau', hex: '#293133', rgb: { r: 41, g: 49, b: 51 }, category: 'Grey' },
  { code: 'RAL 7021', name: 'Black grey', germanName: 'Schwarzgrau', hex: '#23282b', rgb: { r: 35, g: 40, b: 43 }, category: 'Grey' },
  { code: 'RAL 7024', name: 'Graphite grey', germanName: 'Graphitgrau', hex: '#474b4e', rgb: { r: 71, g: 75, b: 78 }, category: 'Grey' },
  { code: 'RAL 7035', name: 'Light grey', germanName: 'Lichtgrau', hex: '#d7d7d7', rgb: { r: 215, g: 215, b: 215 }, category: 'Grey' },
  { code: 'RAL 7040', name: 'Window grey', germanName: 'Fenstergrau', hex: '#9da1aa', rgb: { r: 157, g: 161, b: 170 }, category: 'Grey' },

  // Browns
  { code: 'RAL 8001', name: 'Ochre brown', germanName: 'Ockerbraun', hex: '#955f20', rgb: { r: 149, g: 95, b: 32 }, category: 'Brown' },
  { code: 'RAL 8003', name: 'Clay brown', germanName: 'Lehmbraun', hex: '#734222', rgb: { r: 115, g: 66, b: 34 }, category: 'Brown' },
  { code: 'RAL 8011', name: 'Nut brown', germanName: 'Nussbraun', hex: '#59351f', rgb: { r: 89, g: 53, b: 31 }, category: 'Brown' },
  { code: 'RAL 8017', name: 'Chocolate brown', germanName: 'Schokoladenbraun', hex: '#45322e', rgb: { r: 69, g: 50, b: 46 }, category: 'Brown' },

  // White and Black
  { code: 'RAL 9001', name: 'Cream', germanName: 'Cremeweiß', hex: '#fdf4e3', rgb: { r: 253, g: 244, b: 227 }, category: 'White and Black' },
  { code: 'RAL 9002', name: 'Grey white', germanName: 'Grauweiß', hex: '#e7ebda', rgb: { r: 231, g: 235, b: 218 }, category: 'White and Black' },
  { code: 'RAL 9003', name: 'Signal white', germanName: 'Signalweiß', hex: '#f4f4f4', rgb: { r: 244, g: 244, b: 244 }, category: 'White and Black' },
  { code: 'RAL 9005', name: 'Jet black', germanName: 'Tiefschwarz', hex: '#0a0a0a', rgb: { r: 10, g: 10, b: 10 }, category: 'White and Black' },
  { code: 'RAL 9006', name: 'White aluminium', germanName: 'Weißaluminium', hex: '#a5a5a5', rgb: { r: 165, g: 165, b: 165 }, category: 'White and Black' },
  { code: 'RAL 9010', name: 'Pure white', germanName: 'Reinweiß', hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 }, category: 'White and Black' },
  { code: 'RAL 9011', name: 'Graphite black', germanName: 'Graphitschwarz', hex: '#1c1c1c', rgb: { r: 28, g: 28, b: 28 }, category: 'White and Black' },
  { code: 'RAL 9016', name: 'Traffic white', germanName: 'Verkehrsweiß', hex: '#f6f6f6', rgb: { r: 246, g: 246, b: 246 }, category: 'White and Black' },
  { code: 'RAL 9018', name: 'Papyrus white', germanName: 'Papyrusweiß', hex: '#c8cbc4', rgb: { r: 200, g: 203, b: 196 }, category: 'White and Black' },
];

// Perceptual Delta-E color distance calculation
export function calculateColorDistance(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);

  // Weighted Euclidean in sRGB space prioritizing human eye's green sensitivity
  const rmean = (c1.r + c2.r) / 2;
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;

  const weightR = 2 + rmean / 256;
  const weightG = 4.0;
  const weightB = 2 + (255 - rmean) / 256;

  const dist = Math.sqrt(weightR * dr * dr + weightG * dg * dg + weightB * db * db);
  return Number((dist / 3).toFixed(2));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return { r, g, b };
}

export function findNearestPantone(
  hex: string,
  count = 1
): Array<{
  item: PantoneColor;
  color: PantoneColor;
  distance: number;
  matchScore: number;
  matchQuality: 'Exact' | 'Excellent' | 'Good' | 'Fair' | 'Approximate';
}> {
  const scored = PANTONE_COLORS.map((p) => {
    const dist = calculateColorDistance(hex, p.hex);
    let matchQuality: 'Exact' | 'Excellent' | 'Good' | 'Fair' | 'Approximate' = 'Approximate';
    if (dist === 0) matchQuality = 'Exact';
    else if (dist <= 4.0) matchQuality = 'Excellent';
    else if (dist <= 10.0) matchQuality = 'Good';
    else if (dist <= 20.0) matchQuality = 'Fair';
    const matchScore = Math.max(15, Math.min(100, Math.round(100 - dist * 2.2)));
    const enriched = { ...p, system: p.system || 'Pantone PMS' };
    return { item: enriched, color: enriched, distance: dist, matchScore, matchQuality };
  }).sort((a, b) => a.distance - b.distance);

  return scored.slice(0, count);
}

export function findNearestRal(
  hex: string,
  count = 1
): Array<{
  item: RalColor;
  color: RalColor;
  distance: number;
  matchScore: number;
  matchQuality: 'Exact' | 'Excellent' | 'Good' | 'Fair' | 'Approximate';
}> {
  const scored = RAL_COLORS.map((r) => {
    const dist = calculateColorDistance(hex, r.hex);
    let matchQuality: 'Exact' | 'Excellent' | 'Good' | 'Fair' | 'Approximate' = 'Approximate';
    if (dist === 0) matchQuality = 'Exact';
    else if (dist <= 4.0) matchQuality = 'Excellent';
    else if (dist <= 10.0) matchQuality = 'Good';
    else if (dist <= 20.0) matchQuality = 'Fair';
    const matchScore = Math.max(15, Math.min(100, Math.round(100 - dist * 2.2)));
    const enriched = { ...r, system: r.system || 'RAL Classic' };
    return { item: enriched, color: enriched, distance: dist, matchScore, matchQuality };
  }).sort((a, b) => a.distance - b.distance);

  return scored.slice(0, count);
}

export type PantoneEntry = PantoneColor;
export type RalEntry = RalColor;
export const PANTONE_DATABASE = PANTONE_COLORS;
export const RAL_DATABASE = RAL_COLORS;

export function searchPantoneRal(query: string): Array<{
  code: string;
  name: string;
  hex: string;
  system: 'Pantone' | 'RAL';
}> {
  const q = query.toLowerCase().trim();
  if (!q) {
    const pSample = PANTONE_COLORS.slice(0, 4).map((p) => ({
      code: p.code,
      name: p.name,
      hex: p.hex,
      system: 'Pantone' as const,
    }));
    const rSample = RAL_COLORS.slice(0, 4).map((r) => ({
      code: r.code,
      name: r.name,
      hex: r.hex,
      system: 'RAL' as const,
    }));
    return [...pSample, ...rSample];
  }

  const pMatches = PANTONE_COLORS.filter(
    (p) =>
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.hex.toLowerCase().includes(q)
  ).map((p) => ({
    code: p.code,
    name: p.name,
    hex: p.hex,
    system: 'Pantone' as const,
  }));

  const rMatches = RAL_COLORS.filter(
    (r) =>
      r.code.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.germanName.toLowerCase().includes(q) ||
      r.hex.toLowerCase().includes(q)
  ).map((r) => ({
    code: r.code,
    name: r.name,
    hex: r.hex,
    system: 'RAL' as const,
  }));

  return [...pMatches, ...rMatches];
}

