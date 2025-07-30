#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateRelatedPalette, PaletteStyle, paletteStyleDescriptions, parseColor, exportPalette, ExportFormat, randomHexColor, generateAccessibilityReport, simulateColorBlindness, ColorBlindnessType } from '../shared/colorPalette';
import clipboardy from 'clipboardy';
import { Command } from 'commander';
import { 
  ASCII_ART, 
  STATUS, 
  printHeader, 
  printColorPalette, 
  printAccessibilityReport, 
  printColorblindSimulation, 
  printExportFormat, 
  printSuccess, 
  printError, 
  printInfo, 
  printCopySuccess, 
  printExportSuccess,
  createColorSwatch 
} from './ascii';

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
  .option('-e, --export <format>', 'export format (json, css, scss, tailwind, text, accessibility, colorblind)')
  .option('-o, --output <file>', 'output file path for export')
  .option('--accessibility', 'show accessibility information for the palette')
  .option('--colorblind <type>', 'simulate color blindness (protanopia, deuteranopia, tritanopia, achromatopsia)');

// Helper function to display palette
function showPalette(baseColor: string, style: PaletteStyle, showPreview: boolean = true, showAccessibility: boolean = false, colorblindType?: ColorBlindnessType) {
  const palette = generateRelatedPalette(baseColor, style);
  
  // Show main palette with enhanced styling
  printColorPalette(palette, `${baseColor} (${style.toUpperCase()})`, paletteStyleDescriptions[style]);

  // Show colorblind simulation if requested
  if (colorblindType) {
    const simulatedPalette = palette.map(color => simulateColorBlindness(color, colorblindType));
    printColorblindSimulation(palette, simulatedPalette, colorblindType);
  }

  // Show accessibility information if requested
  if (showAccessibility) {
    const report = generateAccessibilityReport(palette);
    printAccessibilityReport(report);
  }

  if (showPreview) {
    // Show all styles preview with enhanced styling
    printHeader('Preview of All Palette Styles');
    for (const s of styles) {
      const isSelected = s === style;
      const label = isSelected
        ? chalk.bgYellow.black.bold(` ${s.toUpperCase()} `)
        : chalk.underline(s.charAt(0).toUpperCase() + s.slice(1));
      console.log(chalk.white.bold(`\n${label}: ${chalk.gray.italic(paletteStyleDescriptions[s])}`));
      
      const pal = generateRelatedPalette(baseColor, s);
      pal.forEach((color) => {
        const swatch = createColorSwatch(color);
        process.stdout.write(`  ${swatch}  `);
      });
      process.stdout.write('\n');
    }
    console.log(chalk.cyan(ASCII_ART.separator));
  }
}

// Helper function to handle copying
async function handleCopying(baseColor: string, style: PaletteStyle, copyFirst: boolean = false) {
  if (copyFirst) {
    const palette = generateRelatedPalette(baseColor, style);
    const firstColor = palette[0];
    clipboardy.writeSync(firstColor);
    printCopySuccess(firstColor);
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
      printCopySuccess(copyColor);
    }
  }
}

async function main() {
  // Parse command line arguments first
  program.parse();
  const options = program.opts();
  
  // Show welcome message if no arguments provided (interactive mode)
  if (!options.base && !options.style && !options.random && !options.export) {
    console.log(chalk.cyan.bold(ASCII_ART.logo));
    printInfo('Welcome to the Random Color Palette Generator!');
    console.log(chalk.gray(ASCII_ART.separator));
  }
  
  // Step 1: Get base color (from args or prompt)
  let baseColor: string;
  if (options.random) {
    // Generate random base color
    baseColor = randomHexColor();
    printInfo(`Generated random base color: ${createColorSwatch(baseColor)}`);
  } else if (options.base) {
    // Parse the provided base color
    try {
      baseColor = parseColor(options.base);
      printInfo(`Using base color: ${createColorSwatch(baseColor)}`);
    } catch (error) {
      printError(`Invalid color format: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      printError(`Invalid style. Choose from: ${styles.join(', ')}`);
      process.exit(1);
    }
    style = options.style as PaletteStyle;
    printInfo(`Using style: ${chalk.white.bold(style)}`);
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
  
  // Validate colorblind type if provided
  let colorblindType: ColorBlindnessType | undefined;
  if (options.colorblind) {
    const validTypes: ColorBlindnessType[] = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];
    if (!validTypes.includes(options.colorblind as ColorBlindnessType)) {
      printError(`Invalid colorblind type. Choose from: ${validTypes.join(', ')}`);
      process.exit(1);
    }
    colorblindType = options.colorblind as ColorBlindnessType;
  }

  if (isInteractiveMode) {
    // Interactive mode - existing reroll logic
    let accepted = false;
    while (!accepted) {
      showPalette(baseColor, style, options.preview !== false, options.accessibility, colorblindType);
      
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
    showPalette(baseColor, style, options.preview !== false, options.accessibility, colorblindType);
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
        printExportSuccess(options.output);
      } else {
        // Output to console
        printExportFormat(exportFormat, exported);
      }
    } catch (error) {
      printError(`Export error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  }
}

main(); 