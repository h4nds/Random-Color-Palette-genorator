import { useState } from 'react';
import { generateRelatedPalette, paletteStyleDescriptions } from '../../../shared/colorPalette';
import './App.css';

const styles = ['analogous', 'monochromatic', 'complementary', 'triadic', 'tetradic'] as const;

export default function App() {
  const [baseColor, setBaseColor] = useState('#3498db');
  const [style, setStyle] = useState<typeof styles[number]>('analogous');
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    setPalette(generateRelatedPalette(baseColor, style));
    setCopied(null);
  };

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="app-container">
      <h1>Random Color Palette Generator</h1>
      <label>
        Base Color:&nbsp;
        <input
          type="color"
          value={baseColor}
          onChange={e => setBaseColor(e.target.value)}
        />
        <input
          type="text"
          value={baseColor}
          onChange={e => setBaseColor(e.target.value)}
          placeholder="#3498db"
        />
      </label>
      <label>
        Style:&nbsp;
        <select value={style} onChange={e => setStyle(e.target.value as typeof style)}>
          {styles.map(s => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}: {paletteStyleDescriptions[s]}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleGenerate}>Generate Palette</button>
      {palette.length > 0 && (
        <div className="palette-row">
          {palette.map(color => (
            <div
              key={color}
              className={`palette-color${copied === color ? ' copied' : ''}`}
              style={{
                background: color,
                color: '#fff',
                textShadow: '0 1px 2px rgba(0,0,0,0.25)'
              }}
              onClick={() => handleCopy(color)}
              title="Click to copy"
            >
              {copied === color ? 'Copied!' : color}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}