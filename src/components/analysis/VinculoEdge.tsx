import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
} from "reactflow";

export default function VinculoEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
}: any) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  // o percentual fica perto do cartão da evidência (as ligações convergem no suspeito e se
  // cruzariam no meio do caminho)
  const labelX = sourceX + (targetX - sourceX) * 0.28;
  const labelY = sourceY + (targetY - sourceY) * 0.28;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
            stroke: "#d3d3d3",
            strokeWidth: 2,
            strokeDasharray: "6 6",
        }}
        />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "none",
          }}
          className="rounded bg-[#1e1e1e] px-1 text-xs font-bold text-[#139C73]"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}