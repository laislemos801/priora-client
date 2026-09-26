import type { ProfileAxis, ProfileValues } from "./types";

type RadarSeries = {
  id: string;
  label: string;
  color: string;
  values: ProfileValues;
};

type RadarChartProps = {
  axes: ProfileAxis[];
  series: RadarSeries[];
  max?: number;
  className?: string;
};

// Geometria do SVG (unidades do viewBox)
const VIEW_WIDTH = 480;
const VIEW_HEIGHT = 330;
const CENTER_X = VIEW_WIDTH / 2;
const CENTER_Y = 178;
const RADIUS = 120;
const LABEL_OFFSET = 20;
// Altura de linha em "em": acompanha a fonte responsiva dos rótulos
const LABEL_LINE_EM = 1.15;
const GRID_LEVELS = 5;
const WRAP_MIN_LENGTH = 12;

function clamp(value: number, max: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), max);
}

function angleFor(index: number, total: number) {
  return -Math.PI / 2 + (index * 2 * Math.PI) / total;
}

function pointAt(index: number, total: number, distance: number) {
  const angle = angleFor(index, total);
  return {
    x: CENTER_X + Math.cos(angle) * distance,
    y: CENTER_Y + Math.sin(angle) * distance,
  };
}

function toPoints(coords: { x: number; y: number }[]) {
  return coords.map((c) => `${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(" ");
}

// Quebra rótulos longos no espaço mais próximo do meio
function wrapLabel(label: string) {
  if (label.length < WRAP_MIN_LENGTH || !label.includes(" ")) return [label];
  const middle = label.length / 2;
  let best = -1;
  for (let i = 0; i < label.length; i++) {
    if (label[i] === " " && (best < 0 || Math.abs(i - middle) < Math.abs(best - middle))) {
      best = i;
    }
  }
  return [label.slice(0, best), label.slice(best + 1)];
}

export default function RadarChart({ axes, series, max = 100, className = "" }: RadarChartProps) {
  const total = axes.length;
  const safeMax = max > 0 ? max : 100;

  const ariaLabel =
    series.length === 0
      ? "Gráfico radar sem dados"
      : `Gráfico radar. ${series
          .map(
            (s) =>
              `${s.label}: ${axes
                .map((a) => `${a.label} ${Math.round(clamp(s.values[a.key], safeMax))}`)
                .join(", ")}`,
          )
          .join(". ")}.`;

  const levels = Array.from({ length: GRID_LEVELS }, (_, i) => (i + 1) / GRID_LEVELS);
  const ticks = Array.from({ length: GRID_LEVELS + 1 }, (_, i) => i / GRID_LEVELS);

  return (
    <div className={`mx-auto w-full max-w-[560px] ${className}`}>
      {total >= 3 && (
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label={ariaLabel}
        >
          {/* Grade de pentágonos concêntricos */}
          {levels.map((level) => (
            <polygon
              key={level}
              points={toPoints(axes.map((_, i) => pointAt(i, total, RADIUS * level)))}
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity={0.14}
              strokeWidth={1}
            />
          ))}

          {/* Eixos radiais */}
          {axes.map((axis, i) => {
            const end = pointAt(i, total, RADIUS);
            return (
              <line
                key={axis.key}
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={end.x}
                y2={end.y}
                stroke="#FFFFFF"
                strokeOpacity={0.14}
                strokeWidth={1}
              />
            );
          })}

          {/* Séries */}
          {series.map((s) => {
            const coords = axes.map((axis, i) =>
              pointAt(i, total, (clamp(s.values[axis.key], safeMax) / safeMax) * RADIUS),
            );
            return (
              <g key={s.id}>
                <polygon
                  points={toPoints(coords)}
                  fill={s.color}
                  fillOpacity={0.5}
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                {coords.map((c, i) => (
                  <circle key={axes[i].key} cx={c.x} cy={c.y} r={2.5} fill={s.color} />
                ))}
              </g>
            );
          })}

          {/* Escala no eixo do topo */}
          {ticks.map((tick) => (
            <text
              key={tick}
              x={CENTER_X + 5}
              y={CENTER_Y - RADIUS * tick}
              dy="0.35em"
              // Fonte em unidades do viewBox: maior no mobile, onde o SVG encolhe
              className="text-[15px] sm:text-[12px] md:text-[10px]"
              fill="#FFFFFF"
              fillOpacity={0.6}
            >
              {Math.round(tick * safeMax)}
            </text>
          ))}

          {/* Rótulos dos eixos */}
          {axes.map((axis, i) => {
            const angle = angleFor(i, total);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const pos = pointAt(i, total, RADIUS + LABEL_OFFSET);
            const lines = wrapLabel(axis.label);
            const anchor = Math.abs(cos) < 0.1 ? "middle" : cos > 0 ? "start" : "end";

            // Deslocamento da primeira linha, em "em", conforme a posição do eixo
            const extra = (lines.length - 1) * LABEL_LINE_EM;
            let firstDy: number;
            if (sin < -0.5) firstDy = -extra;
            else if (sin > 0.5) firstDy = 0.85;
            else firstDy = 0.35 - extra / 2;

            return (
              <text
                key={axis.key}
                x={pos.x}
                y={pos.y}
                textAnchor={anchor}
                className="text-[18px] sm:text-[15px] md:text-[12px]"
                fill="#FFFFFF"
                fillOpacity={0.8}
              >
                {lines.map((line, li) => (
                  <tspan key={line} x={pos.x} dy={`${li === 0 ? firstDy : LABEL_LINE_EM}em`}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
        </svg>
      )}

      {series.length > 0 && (
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {series.map((s) => (
            <li key={s.id} className="flex items-center gap-2 text-xs text-white/70">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden="true"
              />
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
