export type EvolutionPoint = {
  calculadoEm: string;
  incerteza: number;
  casos: number;
};

type Props = {
  points: EvolutionPoint[];
};

const WIDTH = 300;
const HEIGHT = 96;
const PAD_LEFT = 24;
const PAD_RIGHT = 8;
const PAD_TOP = 8;
const PAD_BOTTOM = 8;

function formatDay(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(d);
}

function formatFull(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(d);
}

// Linha da incerteza média dos casos ativos ao longo dos recálculos (0–100%).
// Quanto mais baixa a linha, mais perto o conjunto dos casos está de uma conclusão.
export default function UncertaintyEvolutionChart({ points }: Props) {
  if (points.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-2 text-center text-xs text-gray-500">
        Sem análises ainda. A linha aparece quando houver suspeitos e evidências nos casos ativos.
      </div>
    );
  }

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const x = (i: number) =>
    PAD_LEFT + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (value: number) => PAD_TOP + plotH - (Math.min(Math.max(value, 0), 100) / 100) * plotH;

  const coords = points.map((p, i) => ({ x: x(i), y: y(p.incerteza), p }));
  const line = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `${PAD_LEFT},${PAD_TOP + plotH} ${line} ${coords[coords.length - 1].x.toFixed(1)},${PAD_TOP + plotH}`;
  const last = points[points.length - 1];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="min-h-0 flex-1"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Evolução da incerteza média: ${points
          .map((p) => `${formatFull(p.calculadoEm)} ${p.incerteza}%`)
          .join("; ")}`}
      >
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={y(v)}
              y2={y(v)}
              stroke="#ffffff"
              strokeOpacity={0.12}
              strokeWidth={1}
            />
            <text x={PAD_LEFT - 4} y={y(v) + 3} textAnchor="end" fill="#9ca3af" fontSize={8}>
              {v}
            </text>
          </g>
        ))}

        {points.length > 1 && <polygon points={area} fill="#139C73" fillOpacity={0.18} />}
        {points.length > 1 && (
          <polyline
            points={line}
            fill="none"
            stroke="#139C73"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {coords.map((c) => (
          <circle
            key={c.p.calculadoEm}
            cx={c.x}
            cy={c.y}
            r={points.length > 12 ? 1.6 : 2.6}
            fill="#139C73"
          >
            <title>{`${formatFull(c.p.calculadoEm)}: ${c.p.incerteza.toFixed(1)}% (${c.p.casos} ${
              c.p.casos === 1 ? "caso" : "casos"
            })`}</title>
          </circle>
        ))}
      </svg>

      <div className="flex justify-between px-1 text-[10px] text-gray-400">
        <span>{formatDay(points[0].calculadoEm)}</span>
        <span className="text-white">Agora: {last.incerteza.toFixed(1)}%</span>
        <span>{formatDay(last.calculadoEm)}</span>
      </div>
    </div>
  );
}
