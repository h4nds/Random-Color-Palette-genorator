#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateRelatedPalette, PaletteStyle, paletteStyleDescriptions, parseColor, exportPalette, ExportFormat, randomHexColor } from '../shared/colorPalette';
import clipboardy from 'clipboardy';
import { Command } from 'commander';

const styles: PaletteStyle[] = ['analogous', 'monochromatic', 'complementary', 'triadic', 'tetradic'];

const program = new Command();

program
  .name('rwcolor-random')
  .version('1.0.0')
  .description('Generate beautiful color palettes from a base color')
  .option('-b, --base <color>', 'base color (hex, rgb, hsl, or color name)')
  .option('-s, --style <style>', `palette style (${styles.join(', ')})`)
  .option('--random', 'use a random base color')
  .option('--no-preview', 'skip showing all style previews')
  .option('--copy-first', 'automatically copy the first color to clipboard')
  .option('-e, --export <format>', 'export format (json, css, scss, tailwind, text)')
  .option('-o, --output <file>', 'output file path for export');

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
  if (options.random) {
    // Generate random base color
    baseColor = randomHexColor();
    console.log(chalk.cyan(`Generated random base color: ${baseColor}`));
  } else if (options.base) {
    // Parse the provided base color
    try {
      baseColor = parseColor(options.base);
      console.log(chalk.cyan(`Using base color: ${baseColor}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Invalid color format'}`));
      process.exit(1);
    }
  } else {
    // Interactive prompt
    const result = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseColor',
        message: 'Enter a base color (hex, rgb, hsl, or color name):',
        validate: (input: string) => {
          try {
            parseColor(input);
            return true;
          } catch (error) {
            return error instanceof Error ? error.message : 'Invalid color format';
          }
        }
      }
    ]);
    baseColor = parseColor(result.baseColor);
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
  
  // Step 5: Handle export
  if (options.export) {
    const palette = generateRelatedPalette(baseColor, style);
    const exportFormat = options.export as ExportFormat;
    
    try {
      const exported = exportPalette(palette, exportFormat, baseColor, style);
      
      if (options.output) {
        // Write to file
        const fs = require('fs');
        fs.writeFileSync(options.output, exported);
        console.log(chalk.green(`Palette exported to ${options.output}`));
      } else {
        // Output to console
        console.log(chalk.bold('\nExported Palette:'));
        console.log(exported);
      }
    } catch (error) {
      console.error(chalk.red(`Export error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  }
}

main(); 