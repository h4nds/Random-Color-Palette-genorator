# 🎨 Random Color Palette Generator

A modern, full-stack color palette generator with both a user-friendly CLI and a visually striking web UI. Built with TypeScript, React, and Vite.

---

## Features

### 🌈 Web UI
- **Pick a base color** using a color picker or hex input
- **Choose palette style**: Analogous, Monochromatic, Complementary, Triadic, Tetradic
- **Generate beautiful palettes** instantly
- **Copy any color** to clipboard with a click (with animated feedback)
- **Fully responsive and centered layout**
- **Modern, unique design** with custom backgrounds and interactive elements

### ⚡ CLI Tool
- **Interactive prompts** for base color and palette style
- **Command-line arguments** for automation and scripting
- **Multiple color input formats** (hex, RGB, HSL, color names)
- **Random color generation** for inspiration
- **Export formats** (JSON, CSS, SCSS, Tailwind, text)
- **File output** for integration with projects
- **Preview all palette styles** in the terminal
- **Copy color hex codes** to clipboard
- **Non-interactive mode** for quick palette generation
- **Easy to use for developers and power users**

---

## Getting Started

### Web UI
1. `cd src/ui/CR_ui`
2. `npm install`
3. `npm run dev`
4. Open the local URL (usually http://localhost:5173)

### CLI

#### Quick Start
1. `cd` to project root
2. `npm install`
3. `npm run build:cli` (build the CLI)
4. `node dist/cli.js` (run the CLI)

#### Installation (Optional)
Install globally to use `rwcolor-random` command anywhere:
```bash
npm install -g .
```

#### Usage Examples

**Interactive Mode (Default):**
```bash
node dist/cli.js
# Follow the prompts to select base color and palette style
```

**Command-Line Arguments:**
```bash
# Quick palette generation
node dist/cli.js --base="#3498db" --style=analogous

# Multiple color input formats
node dist/cli.js --base="red" --style=complementary
node dist/cli.js --base="rgb(255, 0, 0)" --style=triadic
node dist/cli.js --base="hsl(0, 100%, 50%)" --style=tetradic

# Random color generation
node dist/cli.js --random --style=monochromatic

# Short flags
node dist/cli.js -b "#ff5733" -s triadic

# Skip preview and copy first color automatically
node dist/cli.js --base="#2ecc71" --style=monochromatic --no-preview --copy-first

# Export formats
node dist/cli.js --base="purple" --style=analogous --export=json
node dist/cli.js --base="orange" --style=complementary --export=css --output=colors.css

# Show help
node dist/cli.js --help

# Show version
node dist/cli.js --version
```

#### Available Options
- `-b, --base <color>` - Base color (hex, rgb, hsl, or color name)
- `-s, --style <style>` - Palette style (analogous, monochromatic, complementary, triadic, tetradic)
- `--random` - Use a random base color
- `--no-preview` - Skip showing all style previews
- `--copy-first` - Automatically copy the first color to clipboard
- `-e, --export <format>` - Export format (json, css, scss, tailwind, text)
- `-o, --output <file>` - Output file path for export
- `-h, --help` - Display help information
- `-V, --version` - Display version number

#### Supported Color Input Formats
- **Hex**: `#FF0000`, `FF0000`
- **RGB**: `rgb(255, 0, 0)`
- **HSL**: `hsl(0, 100%, 50%)`
- **Color Names**: `red`, `blue`, `green`, `orange`, `purple`, `teal`, `coral`, etc.

#### Export Formats
- **JSON**: Complete palette data with metadata
- **CSS**: CSS custom properties (`--color-1`, `--color-2`, etc.)
- **SCSS**: SCSS variables (`$color-1`, `$color-2`, etc.)
- **Tailwind**: Tailwind CSS config format
- **Text**: Simple hex color list

#### Palette Styles
- **Analogous**: Colors next to each other on the color wheel; harmonious and pleasing
- **Monochromatic**: Different shades and tints of the same hue; subtle and unified
- **Complementary**: Colors opposite each other on the color wheel; high contrast
- **Triadic**: Three colors evenly spaced on the color wheel; vibrant and balanced
- **Tetradic**: Four colors forming a rectangle on the color wheel; rich and diverse

#### Advanced Usage

**Automation & Scripting:**
```bash
# Generate palette and copy to clipboard for use in scripts
node dist/cli.js --base="#ff5733" --style=complementary --no-preview --copy-first

# Use in shell scripts
PALETTE=$(node dist/cli.js --base="#3498db" --style=analogous --no-preview --copy-first)
echo "Generated palette: $PALETTE"

# Export to file for project integration
node dist/cli.js --base="teal" --style=analogous --export=css --output=src/styles/colors.css
node dist/cli.js --base="coral" --style=triadic --export=tailwind --output=tailwind.config.js
```

**Design Workflow:**
```bash
# Quick color exploration
node dist/cli.js --base="#2ecc71" --style=triadic

# Generate multiple variations
for style in analogous monochromatic complementary triadic tetradic; do
  echo "=== $style ==="
  node dist/cli.js --base="#e74c3c" --style=$style --no-preview
done
```

---

## Architecture

### Functional Programming Approach
This project follows functional programming principles:
- **Pure Functions**: Palette generation functions are pure and deterministic
- **Immutability**: All color transformations return new values
- **Composability**: Helper functions can be combined for complex operations
- **Separation of Concerns**: CLI logic is separate from color generation logic

### Project Structure
```
src/
├── shared/
│   └── colorPalette.ts    # Core color logic (shared by CLI and UI)
├── cli/
│   └── index.ts          # CLI interface with command-line arguments
└── ui/
    └── CR_ui/            # React web interface
```

---

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Backend/Shared:** TypeScript color logic (reused in both CLI and UI)
- **CLI:** Node.js, Inquirer, Chalk, Clipboardy, Commander.js

---

## Why This Project?
- **Demonstrates full-stack TypeScript skills**
- **Reusable logic**: Palette generation is shared between CLI and UI
- **Modern, accessible design**
- **Functional programming approach** with pure functions and immutability
- **Flexible CLI** with both interactive and non-interactive modes
- **Great for designers, developers, and anyone who loves color!**

---

## Screenshots
> _will be adding screenshots here_

---

## Author
Ray wretch   
enwretched.com 