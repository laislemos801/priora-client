import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from "reactflow";

export default function VinculoEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
}: any) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,

    targetX,
    targetY,
    targetPosition,

    borderRadius: 0,
  });

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
            transform: `translate(-50%, -50%) translate(${labelX + 20}px, ${labelY - 12}px)`,
            pointerEvents: "none",
          }}
          className="text-sm font-bold text-[#139C73]"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}