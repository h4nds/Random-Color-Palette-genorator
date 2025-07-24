#!/usr/bin/env node 
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const colorPalette_1 = require("../shared/colorPalette");
const styles = ['analogous', 'monochromatic', 'complementary', 'triadic', 'tetradic'];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { baseColor } = yield inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'baseColor',
                message: 'Enter a base color (hex, e.g. #3498db):',
                validate: (input) => /^#?[0-9a-fA-F]{6}$/.test(input) || 'Please enter a valid 6-digit hex color.'
            }
        ]);
        const { style } = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'style',
                message: 'Choose a palette style:',
                choices: styles.map(s => ({
                    name: `${s.charAt(0).toUpperCase() + s.slice(1)}: ${colorPalette_1.paletteStyleDescriptions[s]}`,
                    value: s
                }))
            }
        ]);
        let accepted = false;
        while (!accepted) {
            // Highlight the selected style in the main palette output
            const styleLabel = chalk_1.default.bgYellow.black.bold(` ${style.toUpperCase()} `);
            console.log(chalk_1.default.bold(`\nPalette for ${baseColor} (`) + styleLabel + chalk_1.default.bold('):'));
            console.log(chalk_1.default.italic(colorPalette_1.paletteStyleDescriptions[style]));
            const palette = (0, colorPalette_1.generateRelatedPalette)(baseColor, style);
            palette.forEach((color, i) => {
                console.log(chalk_1.default.bgHex(color).black(` ${color} `));
            });
            // Show all styles preview, highlighting the selected style
            console.log(chalk_1.default.bold('\nPreview of all palette styles:'));
            for (const s of styles) {
                const isSelected = s === style;
                const label = isSelected
                    ? chalk_1.default.bgYellow.black.bold(`${s.charAt(0).toUpperCase() + s.slice(1)}`)
                    : chalk_1.default.underline(`${s.charAt(0).toUpperCase() + s.slice(1)}`);
                console.log(label + ': ' + colorPalette_1.paletteStyleDescriptions[s]);
                const pal = (0, colorPalette_1.generateRelatedPalette)(baseColor, s);
                pal.forEach((color) => {
                    process.stdout.write(chalk_1.default.bgHex(color).black(` ${color} `) + ' ');
                });
                process.stdout.write('\n\n');
            }
            const { reroll } = yield inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'reroll',
                    message: 'Would you like to re-roll (regenerate) the palette?',
                    default: false
                }
            ]);
            accepted = !reroll;
        }
    });
}
main();
