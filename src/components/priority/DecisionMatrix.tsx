import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import type { InvestigativeAction } from "./types";

type Props = {
  actions: InvestigativeAction[];
};

function LabelDot({ cx, cy, index }: { cx?: number; cy?: number; index?: number }) {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="#139C73" stroke="#0f7d5c" strokeWidth={1} />
      <text
        x={cx}
        y={cy}
        fontSize={9}
        fontWeight={700}
        fill="#0f2c22"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {(index ?? 0) + 1}
      </text>
    </g>
  );
}

type Point = InvestigativeAction & { index: number };

// Distância (em unidades do gráfico, 0–100) abaixo da qual dois pontos se cobrem.
const OVERLAP = 4;

// Um balão por ponto (o padrão do Recharts cria uma linha por eixo, repetindo o texto).
// Ações no mesmo ponto aparecem juntas; o texto quebra linha e fica dentro do gráfico.
function ActionTooltip({
  active,
  payload,
  data,
  viewBox,
}: {
  active?: boolean;
  payload?: Array<{ payload: Point }>;
  data: Point[];
  viewBox?: { width?: number };
}) {
  if (!active || !payload?.length) return null;
  const hovered = payload[0].payload;
  // Pontos que se sobrepõem no gráfico (círculos de ~9px) entram juntos no balão.
  const same = data.filter(
    (d) =>
      Math.abs(d.esforco - hovered.esforco) <= OVERLAP &&
      Math.abs(d.recompensa - hovered.recompensa) <= OVERLAP
  );

  return (
    <div
      style={{ maxWidth: Math.min(220, Math.max(120, (viewBox?.width ?? 220) - 16)) }}
      className="rounded-lg border border-[#3a3a3a] bg-[#1f1f1f] p-3 text-xs text-white shadow-lg"
    >
      <ul className="space-y-2">
        {same.map((a) => (
          <li key={a.id} className="break-words">
            <span className="font-semibold text-[#139C73]">Ação {a.index + 1}</span>
            <span className="block text-white/90">{a.titulo}</span>
            <span className="block text-white/50">
              Esforço {Math.round(a.esforco)} · Recompensa {Math.round(a.recompensa)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DecisionMatrix({ actions }: Props) {
  const data = actions.map((a, i) => ({ ...a, index: i }));

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
          <XAxis
            type="number"
            dataKey="esforco"
            domain={[0, 100]}
            tick={false}
            axisLine={{ stroke: "#3d3d3d" }}
            label={{ value: "ESFORÇO", position: "insideBottom", offset: -5, fill: "#888", fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="recompensa"
            domain={[0, 100]}
            tick={false}
            axisLine={{ stroke: "#3d3d3d" }}
            label={{ value: "RECOMPENSA", angle: -90, position: "insideLeft", fill: "#888", fontSize: 11 }}
          />
          <ReferenceLine x={50} stroke="#575757" strokeDasharray="4 4" />
          <ReferenceLine y={50} stroke="#575757" strokeDasharray="4 4" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            wrapperStyle={{ zIndex: 50, outline: "none" }}
            content={<ActionTooltip data={data} />}
          />
          <Scatter data={data} shape={<LabelDot />}>
            {data.map((d) => (
              <Cell key={d.id} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
