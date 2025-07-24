import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateRelatedPalette, PaletteStyle, paletteStyleDescriptions } from '../shared/colorPalette';

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

  console.log(chalk.bold(`\nPalette for ${baseColor} (${style}):`));
  console.log(chalk.italic(paletteStyleDescriptions[style as PaletteStyle]));
  const palette = generateRelatedPalette(baseColor, style as PaletteStyle);
  palette.forEach((color, i) => {
    console.log(chalk.bgHex(color).black(` ${color} `));
  });

  // Show all styles preview
  console.log(chalk.bold('\nPreview of all palette styles:'));
  for (const s of styles) {
    const pal = generateRelatedPalette(baseColor, s);
    console.log(chalk.underline(`${s.charAt(0).toUpperCase() + s.slice(1)}: ${paletteStyleDescriptions[s]}`));
    pal.forEach((color) => {
      process.stdout.write(chalk.bgHex(color).black(` ${color} `) + ' ');
    });
    process.stdout.write('\n\n');
  }
}

main(); 