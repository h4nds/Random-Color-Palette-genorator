#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateRelatedPalette, PaletteStyle, paletteStyleDescriptions } from '../shared/colorPalette';
import clipboardy from 'clipboardy';

const styles: PaletteStyle[] = ['analogous', 'monochromatic', 'complementary', 'triadic', 'tetradic'];

async function main() {
  const { baseColor } = await inquirer.prompt([
    {
      type: 'input',
      name: 'baseColor',
      message: 'Enter a base color (hex, e.g. #3498db):',
      validate: (input: string) => /^#?[0-9a-fA-F]{6}$/.test(input) || 'Please enter a valid 6-digit hex color.'
    }
  ]);

  const { style } = await inquirer.prompt([
    {
      type: 'list',
      name: 'style',
      message: 'Choose a palette style:',
      choices: styles.map(s => ({
        name: `${s.charAt(0).toUpperCase() + s.slice(1)}: ${paletteStyleDescriptions[s]}`,
        value: s
      }))
    }
  ]);

  let accepted = false;
  while (!accepted) {
    // Highlight the selected style in the main palette output
    const styleLabel = chalk.bgYellow.black.bold(` ${style.toUpperCase()} `);
    console.log(chalk.bold(`\nPalette for ${baseColor} (`) + styleLabel + chalk.bold('):'));
    console.log(chalk.italic(paletteStyleDescriptions[style as PaletteStyle]));
    const palette = generateRelatedPalette(baseColor, style as PaletteStyle);
    palette.forEach((color, i) => {
      console.log(chalk.bgHex(color).black(` ${color} `));
    });

    // Show all styles preview, highlighting the selected style
    console.log(chalk.bold('\nPreview of all palette styles:'));
    for (const s of styles) {
      const isSelected = s === style;
      const label = isSelected
        ? chalk.bgYellow.black.bold(`${s.charAt(0).toUpperCase() + s.slice(1)}`)
        : chalk.underline(`${s.charAt(0).toUpperCase() + s.slice(1)}`);
      console.log(label + ': ' + paletteStyleDescriptions[s]);
      const pal = generateRelatedPalette(baseColor, s);
      pal.forEach((color) => {
        process.stdout.write(chalk.bgHex(color).black(` ${color} `) + ' ');
      });
      process.stdout.write('\n\n');
    }

    const { reroll } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'reroll',
        message: 'Would you like to re-roll (regenerate) the palette?',
        default: false
      }
    ]);
    accepted = !reroll;
  }

  const {copyColor} = await inquirer.prompt([
    {
      type:'input',
      name:'copyColor',
      message:'Enter a color hex to copy to clipboard (or just leave blank to skip)',
      validate:(input: string) => !input || /^#([0-9a-fA-F]{6})$/.test(input) || 'Enter a valid hex or leave blank.'
    }
  ]);
  if (copyColor) {
    clipboardy.writeSync(copyColor);
    console.log(chalk.green('Copied ${copyColor} to clipboard!'))
  }
}

main(); 