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
      <circle cx={cx} cy={cy} r={5} fill="#139C73" stroke="#0f7d5c" strokeWidth={1} />
      <text x={cx + 8} y={cy + 4} fontSize={10} fill="#e8e8e8">
        {`AÇÃO ${(index ?? 0) + 1}`}
      </text>
    </g>
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
            contentStyle={{ background: "#1f1f1f", border: "1px solid #3a3a3a", borderRadius: 8, fontSize: 12 }}
            labelFormatter={() => ""}
            formatter={(_value, _name, item) => [item.payload.titulo, `Ação ${(item.payload.index ?? 0) + 1}`]}
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
