#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateRelatedPalette, PaletteStyle, paletteStyleDescriptions } from '../shared/colorPalette';
import clipboardy from 'clipboardy';
import { Command } from 'commander';

const styles: PaletteStyle[] = ['analogous', 'monochromatic', 'complementary', 'triadic', 'tetradic'];

const program = new Command();

program
  .name('rwcolor-random')
  .version('1.0.0')
  .description('Generate beautiful color palettes from a base color')
  .option('-b, --base <color>', 'base color in hex format (e.g., #3498db)')
  .option('-s, --style <style>', `palette style (${styles.join(', ')})`)
  .option('--no-preview', 'skip showing all style previews')
  .option('--copy-first', 'automatically copy the first color to clipboard');

// Helper function to display palette
function showPalette(baseColor: string, style: PaletteStyle, showPreview: boolean = true) {
  // Highlight the selected style in the main palette output
  const styleLabel = chalk.bgYellow.black.bold(` ${style.toUpperCase()} `);
  console.log(chalk.bold(`\nPalette for ${baseColor} (`) + styleLabel + chalk.bold('):'));
  console.log(chalk.italic(paletteStyleDescriptions[style]));
  
  const palette = generateRelatedPalette(baseColor, style);
  palette.forEach((color, i) => {
    console.log(chalk.bgHex(color).black(` ${color} `));
  });

  if (showPreview) {
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
  }
}

// Helper function to handle copying
async function handleCopying(baseColor: string, style: PaletteStyle, copyFirst: boolean = false) {
  if (copyFirst) {
    const palette = generateRelatedPalette(baseColor, style);
    const firstColor = palette[0];
    clipboardy.writeSync(firstColor);
    console.log(chalk.green(`Copied ${firstColor} to clipboard!`));
  } else {
    const { copyColor } = await inquirer.prompt([
      {
        type: 'input',
        name: 'copyColor',
        message: 'Enter a color hex to copy to clipboard (or just leave blank to skip)',
        validate: (input: string) => !input || /^#([0-9a-fA-F]{6})$/.test(input) || 'Enter a valid hex or leave blank.'
      }
    ]);
    if (copyColor) {
      clipboardy.writeSync(copyColor);
      console.log(chalk.green(`Copied ${copyColor} to clipboard!`));
    }
  }
}

async function main() {
  // Parse command line arguments first
  program.parse();
  const options = program.opts();
  
  // Step 1: Get base color (from args or prompt)
  let baseColor: string;
  if (options.base) {
    // Validate the provided base color
    if (!/^#?[0-9a-fA-F]{6}$/.test(options.base)) {
      console.error(chalk.red('Error: Invalid base color format. Use hex format like #3498db'));
      process.exit(1);
    }
    baseColor = options.base.startsWith('#') ? options.base : `#${options.base}`;
    console.log(chalk.cyan(`Using base color: ${baseColor}`));
  } else {
    // Interactive prompt
    const result = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseColor',
        message: 'Enter a base color (hex, e.g. #3498db):',
        validate: (input: string) => /^#?[0-9a-fA-F]{6}$/.test(input) || 'Please enter a valid 6-digit hex color.'
      }
    ]);
    baseColor = result.baseColor;
  }

  // Step 2: Get style (from args or prompt)  
  let style: PaletteStyle;
  if (options.style) {
    // Validate the provided style
    if (!styles.includes(options.style as PaletteStyle)) {
      console.error(chalk.red(`Error: Invalid style. Choose from: ${styles.join(', ')}`));
      process.exit(1);
    }
    style = options.style as PaletteStyle;
    console.log(chalk.cyan(`Using style: ${style}`));
  } else {
    // Interactive prompt
    const result = await inquirer.prompt([
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
    style = result.style;
  }

  // Step 3: Determine if we should use interactive mode for rerolling
  const isInteractiveMode = !options.base || !options.style;
  
  if (isInteractiveMode) {
    // Interactive mode - existing reroll logic
    let accepted = false;
    while (!accepted) {
      showPalette(baseColor, style, options.preview !== false);
      
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
  } else {
    // Non-interactive mode - show once
    showPalette(baseColor, style, options.preview !== false);
  }

  // Step 4: Handle copying
  await handleCopying(baseColor, style, options.copyFirst);
}

main(); 