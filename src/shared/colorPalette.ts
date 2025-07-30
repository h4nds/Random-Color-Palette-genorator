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
export type ExportFormat = 'json' | 'css' | 'scss' | 'tailwind' | 'text' | 'accessibility' | 'colorblind';

// Accessibility types and constants
export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type WCAGLevel = 'AA' | 'AAA';

// WCAG contrast ratio thresholds
const WCAG_THRESHOLDS = {
  AA: { normal: 4.5, large: 3.0 },
  AAA: { normal: 7.0, large: 4.5 }
};

// Calculate relative luminance of a color
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRGB(hex);
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast ratio meets WCAG standards
export function meetsWCAGStandards(color1: string, color2: string, level: WCAGLevel = 'AA', size: 'normal' | 'large' = 'normal'): boolean {
  const ratio = getContrastRatio(color1, color2);
  return ratio >= WCAG_THRESHOLDS[level][size];
}

// Get WCAG compliance status
export function getWCAGStatus(color1: string, color2: string): {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
} {
  const ratio = getContrastRatio(color1, color2);
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= WCAG_THRESHOLDS.AA.normal,
    aaa: ratio >= WCAG_THRESHOLDS.AAA.normal,
    aaLarge: ratio >= WCAG_THRESHOLDS.AA.large,
    aaaLarge: ratio >= WCAG_THRESHOLDS.AAA.large
  };
}

// Color blindness simulation matrices
const COLORBLIND_MATRICES = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758]
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525]
  ]
};

// Simulate color blindness
export function simulateColorBlindness(hex: string, type: ColorBlindnessType): string {
  if (type === 'achromatopsia') {
    // Convert to grayscale
    const rgb = hexToRGB(hex);
    const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    return rgbToHex({ r: gray, g: gray, b: gray });
  }

  const rgb = hexToRGB(hex);
  const matrix = COLORBLIND_MATRICES[type];
  
  const newR = Math.round(rgb.r * matrix[0][0] + rgb.g * matrix[0][1] + rgb.b * matrix[0][2]);
  const newG = Math.round(rgb.r * matrix[1][0] + rgb.g * matrix[1][1] + rgb.b * matrix[1][2]);
  const newB = Math.round(rgb.r * matrix[2][0] + rgb.g * matrix[2][1] + rgb.b * matrix[2][2]);
  
  return rgbToHex({
    r: Math.max(0, Math.min(255, newR)),
    g: Math.max(0, Math.min(255, newG)),
    b: Math.max(0, Math.min(255, newB))
  });
}

// Generate accessibility report for a palette
export function generateAccessibilityReport(palette: string[]): {
  colorPairs: Array<{
    color1: string;
    color2: string;
    contrast: number;
    wcag: {
      aa: boolean;
      aaa: boolean;
      aaLarge: boolean;
      aaaLarge: boolean;
    };
  }>;
  summary: {
    totalPairs: number;
    aaCompliant: number;
    aaaCompliant: number;
    averageContrast: number;
  };
} {
  const colorPairs = [];
  let totalContrast = 0;
  let aaCompliant = 0;
  let aaaCompliant = 0;

  for (let i = 0; i < palette.length; i++) {
    for (let j = i + 1; j < palette.length; j++) {
      const color1 = palette[i];
      const color2 = palette[j];
      const wcag = getWCAGStatus(color1, color2);
      
      colorPairs.push({
        color1,
        color2,
        contrast: wcag.ratio,
        wcag: {
          aa: wcag.aa,
          aaa: wcag.aaa,
          aaLarge: wcag.aaLarge,
          aaaLarge: wcag.aaaLarge
        }
      });

      totalContrast += wcag.ratio;
      if (wcag.aa) aaCompliant++;
      if (wcag.aaa) aaaCompliant++;
    }
  }

  const totalPairs = colorPairs.length;
  
  return {
    colorPairs,
    summary: {
      totalPairs,
      aaCompliant,
      aaaCompliant,
      averageContrast: totalPairs > 0 ? Math.round((totalContrast / totalPairs) * 100) / 100 : 0
    }
  };
}

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
    
    case 'accessibility':
      const report = generateAccessibilityReport(palette);
      return `Accessibility Report for Palette
${'='.repeat(50)}

Summary:
- Total color pairs: ${report.summary.totalPairs}
- WCAG AA compliant: ${report.summary.aaCompliant}/${report.summary.totalPairs} (${Math.round(report.summary.aaCompliant/report.summary.totalPairs*100)}%)
- WCAG AAA compliant: ${report.summary.aaaCompliant}/${report.summary.totalPairs} (${Math.round(report.summary.aaaCompliant/report.summary.totalPairs*100)}%)
- Average contrast ratio: ${report.summary.averageContrast}:1

Color Pair Analysis:
${report.colorPairs.map(pair => 
  `${pair.color1} ↔ ${pair.color2}
  Contrast: ${pair.contrast}:1
  WCAG AA: ${pair.wcag.aa ? '✅' : '❌'} | AAA: ${pair.wcag.aaa ? '✅' : '❌'}
  Large Text AA: ${pair.wcag.aaLarge ? '✅' : '❌'} | AAA: ${pair.wcag.aaaLarge ? '✅' : '❌'}`
).join('\n\n')}`;
    
    case 'colorblind':
      const types: ColorBlindnessType[] = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];
      return `Color Blindness Simulation
${'='.repeat(50)}

Original Palette: ${palette.join(', ')}

Simulations:
${types.map(type => 
  `${type.charAt(0).toUpperCase() + type.slice(1)}:
  ${palette.map(color => simulateColorBlindness(color, type)).join(', ')}`
).join('\n\n')}`;
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
} 