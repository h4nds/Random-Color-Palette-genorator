import chalk from 'chalk';

// ASCII Art for the application
export const ASCII_ART = {
  logo: `
                                     ,-.----.               
,-.----.             .---.  ,----..  \\    /  \\    ,----..   
\\    /  \\           /. ./| /   /   \\ |   :    \\  /   /   \\  
;   :    \\      .--'.  ' ;|   :     :|   |  .\\ :|   :     : 
|   | .\\ :     /__./ \\ : |.   |  ;. /.   :  |: |.   |  ;. / 
.   : |: | .--'.  '   \\' ..   ; /--\` |   |   \\ :.   ; /--\`  
|   |  \\ :/___/ \\ |    ' ';   | ;    |   : .   /;   | ;  __ 
|   : .  /;   \\  \\;      :|   : |    ;   | |\`-' |   : |.' .'
;   | |  \\ \\   ;  \`      |.   | '___ |   | ;    .   | '_.' :
|   | ;\\  \\ .   \\    .\\  ;'   ; : .'|:   ' |    '   ; : \\  |
:   ' | \\.'  \\   \\   ' \\ |'   | '/  ::   : :    '   | '/  .'
:   : :-'     :   '  |--" |   :    / |   | :    |   :    /  
|   |.'        \\   \\ ;     \\   \\ .'  \`---'.|     \\   \\ .'   
\`---'           '---"       \`---\`      \`---\`      \`---\`     
`,

  palette: `
┌──────────────────────────────────────────────────────────────┐
│                    🎨 COLOR PALETTE 🎨                      │
└──────────────────────────────────────────────────────────────┘
`,

  accessibility: `
┌──────────────────────────────────────────────────────────────┐
│                  ♿ ACCESSIBILITY REPORT ♿                   │
└──────────────────────────────────────────────────────────────┘
`,

  colorblind: `
┌──────────────────────────────────────────────────────────────┐
│                🌈 COLOR BLINDNESS SIMULATION 🌈              │
└──────────────────────────────────────────────────────────────┘
`,

  export: `
┌──────────────────────────────────────────────────────────────┐
│                    📤 EXPORT FORMAT 📤                      │
└──────────────────────────────────────────────────────────────┘
`,

  success: `
┌──────────────────────────────────────────────────────────────┐
│                        ✅ SUCCESS ✅                         │
└──────────────────────────────────────────────────────────────┘
`,

  error: `
┌──────────────────────────────────────────────────────────────┐
│                        ❌ ERROR ❌                           │
└──────────────────────────────────────────────────────────────┘
`,

  info: `
┌──────────────────────────────────────────────────────────────┐
│                        ℹ️  INFO ℹ️                           │
└──────────────────────────────────────────────────────────────┘
`,

  separator: '─'.repeat(70),
  thickSeparator: '═'.repeat(70),
  thinSeparator: '─'.repeat(50)
};

// Color swatch ASCII art
export function createColorSwatch(color: string, label?: string): string {
  const colorBlock = chalk.bgHex(color).black('  ');
  const hexCode = chalk.hex(color)(color);
  const displayLabel = label ? ` ${label}` : '';
  
  return `${colorBlock} ${hexCode}${displayLabel}`;
}

// Progress bar ASCII art
export function createProgressBar(percentage: number, width: number = 30): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${percentage}%`;
}

// Status indicators
export const STATUS = {
  success: chalk.green('✅'),
  error: chalk.red('❌'),
  warning: chalk.yellow('⚠️'),
  info: chalk.blue('ℹ️'),
  loading: chalk.cyan('⏳'),
  done: chalk.green('✨'),
  copy: chalk.magenta('📋'),
  export: chalk.blue('📤'),
  accessibility: chalk.cyan('♿'),
  colorblind: chalk.yellow('🌈')
};

// Enhanced console output functions
export function printHeader(title: string, subtitle?: string): void {
  console.log(chalk.cyan.bold(ASCII_ART.separator));
  console.log(chalk.cyan.bold(`  ${title}`));
  if (subtitle) {
    console.log(chalk.cyan.italic(`  ${subtitle}`));
  }
  console.log(chalk.cyan.bold(ASCII_ART.separator));
}

export function printSection(title: string, content: string): void {
  console.log(chalk.yellow.bold(`\n📋 ${title}`));
  console.log(chalk.gray(ASCII_ART.thinSeparator));
  console.log(content);
}

export function printSuccess(message: string): void {
  console.log(chalk.green.bold(`\n${STATUS.success} ${message}`));
}

export function printError(message: string): void {
  console.log(chalk.red.bold(`\n${STATUS.error} ${message}`));
}

export function printInfo(message: string): void {
  console.log(chalk.blue.bold(`\n${STATUS.info} ${message}`));
}

export function printWarning(message: string): void {
  console.log(chalk.yellow.bold(`\n${STATUS.warning} ${message}`));
}

// Color palette display with enhanced styling
export function printColorPalette(colors: string[], title: string, description?: string): void {
  console.log(chalk.cyan.bold(ASCII_ART.palette));
  console.log(chalk.white.bold(`  ${title}`));
  if (description) {
    console.log(chalk.gray.italic(`  ${description}`));
  }
  console.log(chalk.cyan(ASCII_ART.separator));
  
  colors.forEach((color, index) => {
    const swatch = createColorSwatch(color, `Color ${index + 1}`);
    console.log(`  ${swatch}`);
  });
  
  console.log(chalk.cyan(ASCII_ART.separator));
}

// Accessibility report with enhanced styling
export function printAccessibilityReport(report: any): void {
  console.log(chalk.cyan.bold(ASCII_ART.accessibility));
  
  // Summary section
  console.log(chalk.yellow.bold('\n📊 SUMMARY'));
  console.log(chalk.gray(ASCII_ART.thinSeparator));
  console.log(chalk.cyan(`• Total color pairs: ${chalk.white.bold(report.summary.totalPairs)}`));
  console.log(chalk.cyan(`• WCAG AA compliant: ${chalk.white.bold(report.summary.aaCompliant)}/${chalk.white.bold(report.summary.totalPairs)} (${chalk.white.bold(Math.round(report.summary.aaCompliant/report.summary.totalPairs*100))}%)`));
  console.log(chalk.cyan(`• WCAG AAA compliant: ${chalk.white.bold(report.summary.aaaCompliant)}/${chalk.white.bold(report.summary.totalPairs)} (${chalk.white.bold(Math.round(report.summary.aaaCompliant/report.summary.totalPairs*100))}%)`));
  console.log(chalk.cyan(`• Average contrast ratio: ${chalk.white.bold(report.summary.averageContrast)}:1`));
  
  // Top contrast ratios
  const sortedPairs = report.colorPairs.sort((a: any, b: any) => b.contrast - a.contrast);
  console.log(chalk.yellow.bold('\n🏆 TOP 3 CONTRAST RATIOS'));
  console.log(chalk.gray(ASCII_ART.thinSeparator));
  sortedPairs.slice(0, 3).forEach((pair: any, i: number) => {
    const status = pair.wcag.aa ? STATUS.success : STATUS.error;
    const swatch1 = createColorSwatch(pair.color1);
    const swatch2 = createColorSwatch(pair.color2);
    console.log(`  ${i + 1}. ${swatch1} ↔ ${swatch2}`);
    console.log(`     Contrast: ${chalk.white.bold(pair.contrast)}:1 ${status} AA`);
  });
}

// Colorblind simulation with enhanced styling
export function printColorblindSimulation(originalColors: string[], simulatedColors: string[], type: string): void {
  console.log(chalk.cyan.bold(ASCII_ART.colorblind));
  console.log(chalk.yellow.bold(`\n🌈 ${type.toUpperCase()} SIMULATION`));
  console.log(chalk.gray(ASCII_ART.thinSeparator));
  
  console.log(chalk.cyan.bold('\n👁️  ORIGINAL COLORS:'));
  originalColors.forEach((color, i) => {
    const swatch = createColorSwatch(color, `Color ${i + 1}`);
    console.log(`  ${swatch}`);
  });
  
  console.log(chalk.cyan.bold('\n👁️  SIMULATED COLORS:'));
  simulatedColors.forEach((color, i) => {
    const swatch = createColorSwatch(color, `Color ${i + 1}`);
    console.log(`  ${swatch}`);
  });
}

// Export format display
export function printExportFormat(format: string, content: string): void {
  console.log(chalk.cyan.bold(ASCII_ART.export));
  console.log(chalk.yellow.bold(`\n📤 EXPORT FORMAT: ${chalk.white.bold(format.toUpperCase())}`));
  console.log(chalk.gray(ASCII_ART.thinSeparator));
  console.log(content);
}

// Loading animation
export function printLoading(message: string): void {
  process.stdout.write(chalk.cyan(`${STATUS.loading} ${message}...`));
}

export function clearLoading(): void {
  process.stdout.write('\r' + ' '.repeat(50) + '\r');
}

// Copy success message
export function printCopySuccess(color: string): void {
  console.log(chalk.green.bold(`\n${STATUS.copy} Copied ${chalk.hex(color)(color)} to clipboard!`));
}

// Export success message
export function printExportSuccess(filePath?: string): void {
  if (filePath) {
    console.log(chalk.green.bold(`\n${STATUS.export} Palette exported to ${chalk.white.bold(filePath)}`));
  } else {
    console.log(chalk.green.bold(`\n${STATUS.export} Palette exported successfully!`));
  }
} 