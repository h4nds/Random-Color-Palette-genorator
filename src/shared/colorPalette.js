"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paletteStyleDescriptions = void 0;
exports.randomHexColor = randomHexColor;
exports.generatePalette = generatePalette;
exports.hexToHSL = hexToHSL;
exports.hslToHex = hslToHex;
exports.generateRelatedPalette = generateRelatedPalette;
// Generates a random hex color string, e.g., #A1B2C3
function randomHexColor() {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    return `#${hex.toUpperCase()}`;
}
// Generates a palette of N random hex colors
function generatePalette(count) {
    return Array.from({ length: count }, randomHexColor);
}
function hexToHSL(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3)
        c = c.split('').map(x => x + x).join('');
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
            case rNorm:
                h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
                break;
            case gNorm:
                h = (bNorm - rNorm) / d + 2;
                break;
            case bNorm:
                h = (rNorm - gNorm) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToHex({ h, s, l }) {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
        const color = l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
function generateRelatedPalette(baseHex, style) {
    const base = hexToHSL(baseHex);
    switch (style) {
        case 'analogous': {
            // +/- 30, 60 degrees
            return [0, -30, 30, -60, 60].map(dh => hslToHex(Object.assign(Object.assign({}, base), { h: (base.h + dh + 360) % 360 })));
        }
        case 'monochromatic': {
            // Vary lightness
            return [-30, -15, 0, 15, 30].map(dl => hslToHex(Object.assign(Object.assign({}, base), { l: Math.max(0, Math.min(100, base.l + dl)) })));
        }
        case 'complementary': {
            // Opposite hue, and near neighbors
            return [0, 180, 150, 210, 30].map(dh => hslToHex(Object.assign(Object.assign({}, base), { h: (base.h + dh) % 360 })));
        }
        case 'triadic': {
            // 0, 120, 240, and near neighbors
            return [0, 120, 240, 110, 250].map(dh => hslToHex(Object.assign(Object.assign({}, base), { h: (base.h + dh) % 360 })));
        }
        case 'tetradic': {
            // 0, 90, 180, 270, and base
            return [0, 90, 180, 270, 45].map(dh => hslToHex(Object.assign(Object.assign({}, base), { h: (base.h + dh) % 360 })));
        }
        default:
            return [baseHex];
    }
}
exports.paletteStyleDescriptions = {
    analogous: 'Colors next to each other on the color wheel; harmonious and pleasing.',
    monochromatic: 'Different shades and tints of the same hue; subtle and unified.',
    complementary: 'Colors opposite each other on the color wheel; high contrast.',
    triadic: 'Three colors evenly spaced on the color wheel; vibrant and balanced.',
    tetradic: 'Four colors forming a rectangle on the color wheel; rich and diverse.'
};
