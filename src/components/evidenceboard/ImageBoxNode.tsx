import { useCallback, useState } from 'react';
import { Handle, Position, useReactFlow, useNodeId } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ImageBoxNodeType } from './types';

export default function ImageBoxNode({ data, selected }: NodeProps<ImageBoxNodeType>) {
  const nodeId = useNodeId();
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(data.caption);

  const commit = useCallback(() => {
    setIsEditing(false);
    if (nodeId) updateNodeData(nodeId, { caption: draft });
  }, [nodeId, draft, updateNodeData]);

  return (
    <div
      className={`
        w-40 rounded-lg overflow-hidden border bg-zinc-900 shadow-lg
        ${selected ? 'border-white/60 ring-2 ring-white/30' : 'border-zinc-700'}
      `}
    >
      <Handle type="target" position={Position.Top} className="bg-zinc-400! w-2! h-2!" />
      <Handle type="target" position={Position.Left} className="bg-zinc-400! w-2! h-2!" />

      <div className="w-full h-28 bg-zinc-800">
        {data.imageUrl ? (
          <img src={data.imageUrl} alt={data.caption} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
            sem imagem
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          autoFocus
          className="nodrag nowheel w-full bg-transparent text-xs text-center text-zinc-100 px-2 py-2 resize-none outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commit();
            }
            if (e.key === 'Escape') {
              setDraft(data.caption);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <p
          onDoubleClick={() => {
            setDraft(data.caption);
            setIsEditing(true);
          }}
          className="cursor-text text-xs text-center text-zinc-200 px-2 py-2 leading-snug"
        >
          {data.caption || 'Legenda...'}
        </p>
      )}

      <Handle type="source" position={Position.Right} className="bg-zinc-400! w-2! h-2!" />
      <Handle type="source" position={Position.Bottom} className="bg-zinc-400! w-2! h-2!" />
    </div>
  );
}
