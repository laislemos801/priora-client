import { useCallback, useState } from 'react';
import { Handle, Position, useReactFlow, useNodeId } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { NoteNodeType } from './types';

export default function NoteNode({ data, selected }: NodeProps<NoteNodeType>) {
  const nodeId = useNodeId();
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(data.text);

  const commit = useCallback(() => {
    setIsEditing(false);
    if (nodeId) updateNodeData(nodeId, { text: draft });
  }, [nodeId, draft, updateNodeData]);

  return (
    <div
      className={`
        px-1 py-0.5 text-xs text-zinc-300 whitespace-nowrap
        ${selected ? 'outline outline-white/40 rounded' : ''}
      `}
    >
      <Handle type="target" position={Position.Left} className="bg-transparent! border-none w-1! h-1!" />

      {isEditing ? (
        <input
          autoFocus
          placeholder="Texto aqui..."
          className="nodrag bg-transparent outline-none border-b border-zinc-500 text-xs placeholder:text-zinc-500"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') {
              setDraft(data.text);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <span
          onDoubleClick={() => {
            setDraft(data.text);
            setIsEditing(true);
          }}
          className="cursor-text"
        >
          {data.text || 'Texto aqui...'}
        </span>
      )}

      <Handle type="source" position={Position.Right} className="bg-transparent! border-none w-1! h-1!" />
    </div>
  );
}
