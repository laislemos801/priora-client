import { useEffect, useRef, useState } from 'react';

// ── Conversões de cor ──
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, '0'))
      .join('')
  );
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return [h, s, v];
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState<[number, number, number]>(() => rgbToHsv(...hexToRgb(value)));
  const [hexInput, setHexInput] = useState(value);

  const containerRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  // sincroniza quando o valor muda por fora (ex: trocou de node selecionado)
  useEffect(() => {
    setHsv(rgbToHsv(...hexToRgb(value)));
    setHexInput(value);
  }, [value]);

  // fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const commit = (next: [number, number, number]) => {
    setHsv(next);
    const hex = rgbToHex(...hsvToRgb(...next));
    setHexInput(hex);
    onChange(hex);
  };

  const handleSvDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = svRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    const update = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
      commit([hsv[0], x / rect.width, 1 - y / rect.height]);
    };

    update(e.clientX, e.clientY);
    const onMove = (ev: PointerEvent) => update(ev.clientX, ev.clientY);
    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  };

  const handleHueDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = hueRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    const update = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      commit([(x / rect.width) * 360, hsv[1], hsv[2]]);
    };

    update(e.clientX);
    const onMove = (ev: PointerEvent) => update(ev.clientX);
    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  };

  const handleHexSubmit = () => {
    const clean = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
    if (HEX_PATTERN.test(clean)) {
      onChange(clean);
      setHsv(rgbToHsv(...hexToRgb(clean)));
    } else {
      setHexInput(value);
    }
  };

  const [h, s, v] = hsv;
  const hueColor = rgbToHex(...hsvToRgb(h, 1, 1));
  const thumbColor = rgbToHex(...hsvToRgb(h, s, v));

  return (
    <div ref={containerRef} className="relative nodrag nopan nowheel">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-full pl-1 pr-2.5 py-1 shadow-xl hover:border-zinc-500 transition-colors"
      >
        <span
          className="w-5 h-5 rounded-full border-2 border-white/40 shadow-inner"
          style={{ backgroundColor: value }}
        />
        <span className="text-[10px] text-zinc-400 uppercase tracking-wide font-mono">
          {value}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 top-9 left-1/2 -translate-x-1/2 w-52 p-3 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl space-y-3">
          {/* quadrado de saturação/brilho */}
          <div
            ref={svRef}
            onPointerDown={handleSvDrag}
            className="relative w-full h-32 rounded-lg cursor-crosshair touch-none"
            style={{
              backgroundColor: hueColor,
              backgroundImage:
                'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
            }}
          >
            <div
              className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.6)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%`, backgroundColor: thumbColor }}
            />
          </div>

          {/* barra de matiz */}
          <div
            ref={hueRef}
            onPointerDown={handleHueDrag}
            className="relative h-3 rounded-full cursor-pointer touch-none"
            style={{
              background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
            }}
          >
            <div
              className="absolute top-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${(h / 360) * 100}%`, backgroundColor: hueColor }}
            />
          </div>

          {/* campo hex */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-zinc-500 tracking-wide">Hex</span>
            <input
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={handleHexSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleHexSubmit()}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 font-mono outline-none focus:border-[#139C73]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
