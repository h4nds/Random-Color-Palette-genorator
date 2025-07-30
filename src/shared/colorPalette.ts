// Generates a random hex color string, e.g., #A1B2C3
export function randomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `#${hex.toUpperCase()}`;
}

// Generates a palette of N random hex colors
export function generatePalette(count: number): string[] {
  return Array.from({ length: count }, randomHexColor);
}

// Color conversion helpers
export type HSL = { h: number; s: number; l: number };
export type RGB = { r: number; g: number; b: number };

// Color name to hex mapping
const colorNames: Record<string, string> = {
  red: '#FF0000', blue: '#0000FF', green: '#008000', yellow: '#FFFF00',
  orange: '#FFA500', purple: '#800080', pink: '#FFC0CB', brown: '#A52A2A',
  black: '#000000', white: '#FFFFFF', gray: '#808080', grey: '#808080',
  cyan: '#00FFFF', magenta: '#FF00FF', lime: '#00FF00', navy: '#000080',
  olive: '#808000', teal: '#008080', maroon: '#800000', silver: '#C0C0C0',
  gold: '#FFD700', indigo: '#4B0082', violet: '#EE82EE', coral: '#FF7F50',
  turquoise: '#40E0D0', salmon: '#FA8072', khaki: '#F0E68C', plum: '#DDA0DD',
  lavender: '#E6E6FA', beige: '#F5F5DC', mint: '#98FF98', peach: '#FFCBA4'
};

// Parse different color formats to hex
export function parseColor(color: string): string {
  const input = color.toLowerCase().trim();
  
  // Check if it's a color name
  if (colorNames[input]) {
    return colorNames[input];
  }
  
  // Check if it's already a hex color
  if (/^#?[0-9a-fA-F]{6}$/.test(input)) {
    return input.startsWith('#') ? input : `#${input}`;
  }
  
  // Parse RGB format: rgb(r, g, b)
  const rgbMatch = input.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return rgbToHex({ r: parseInt(r), g: parseInt(g), b: parseInt(b) });
  }
  
  // Parse HSL format: hsl(h, s%, l%)
  const hslMatch = input.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch;
    return hslToHex({ h: parseInt(h), s: parseInt(s), l: parseInt(l) });
  }
  
  throw new Error(`Invalid color format: ${color}. Supported formats: hex (#RRGGBB), rgb(r,g,b), hsl(h,s%,l%), or color names.`);
}

// Convert RGB to hex
export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Convert hex to RGB
export function hexToRGB(hex: string): RGB {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function hexToHSL(hex: string): HSL {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex({ h, s, l }: HSL): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export type PaletteStyle = 'analogous' | 'monochromatic' | 'complementary' | 'triadic' | 'tetradic';

export function generateRelatedPalette(baseHex: string, style: PaletteStyle): string[] {
  const base = hexToHSL(baseHex);
  
  // Helper function to add random jitter to a value within a specified range
  function jitter(val: number, range: number): number {
    return val + (Math.random() * 2 - 1) * range;
  }
  
  switch (style) {
    case 'analogous': {
      // +/- 30, 60 degrees with small hue jitter for variation
      return [0, -30, 30, -60, 60].map(dh => 
        hslToHex({ ...base, h: (jitter(base.h + dh, 10) + 360) % 360 })
      );
    }
    case 'monochromatic': {
      // Vary lightness with jitter for subtle variations
      return [-30, -15, 0, 15, 30].map(dl => 
        hslToHex({ ...base, l: Math.max(0, Math.min(100, jitter(base.l + dl, 8))) })
      );
    }
    case 'complementary': {
      // Opposite hue, and near neighbors with moderate jitter
      return [0, 180, 150, 210, 30].map(dh => 
        hslToHex({ ...base, h: (jitter(base.h + dh, 12) + 360) % 360 })
      );
    }
    case 'triadic': {
      // 0, 120, 240, and near neighbors with balanced jitter
      return [0, 120, 240, 110, 250].map(dh => 
        hslToHex({ ...base, h: (jitter(base.h + dh, 10) + 360) % 360 })
      );
    }
    case 'tetradic': {
      // 0, 90, 180, 270, and base with subtle jitter
      return [0, 90, 180, 270, 45].map(dh => 
        hslToHex({ ...base, h: (jitter(base.h + dh, 8) + 360) % 360 })
      );
    }
    default:
      return [baseHex];
  }
}

export const paletteStyleDescriptions: Record<PaletteStyle, string> = {
  analogous: 'Colors next to each other on the color wheel; harmonious and pleasing.',
  monochromatic: 'Different shades and tints of the same hue; subtle and unified.',
  complementary: 'Colors opposite each other on the color wheel; high contrast.',
  triadic: 'Three colors evenly spaced on the color wheel; vibrant and balanced.',
  tetradic: 'Four colors forming a rectangle on the color wheel; rich and diverse.'
};

// Export format types
export type ExportFormat = 'json' | 'css' | 'scss' | 'tailwind' | 'text';

// Export palette in different formats
export function exportPalette(palette: string[], format: ExportFormat, baseColor?: string, style?: PaletteStyle): string {
  switch (format) {
    case 'json':
      return JSON.stringify({
        baseColor,
        style,
        colors: palette,
        generatedAt: new Date().toISOString()
      }, null, 2);
    
    case 'css':
      return palette.map((color, i) => `--color-${i + 1}: ${color};`).join('\n');
    
    case 'scss':
      return palette.map((color, i) => `$color-${i + 1}: ${color};`).join('\n');
    
    case 'tailwind':
      return `module.exports = {
  theme: {
    extend: {
      colors: {
        custom: {
          ${palette.map((color, i) => `${i + 1}: '${color}'`).join(',\n          ')}
        }
      }
    }
  }
}`;
    
    case 'text':
      return palette.join('\n');
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
} 