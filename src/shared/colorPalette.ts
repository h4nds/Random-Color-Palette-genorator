// Generates a random hex color string, e.g., #A1B2C3
export function randomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `#${hex.toUpperCase()}`;
}

// Generates a palette of N random hex colors
export function generatePalette(count: number): string[] {
  return Array.from({ length: count }, randomHexColor);
} 