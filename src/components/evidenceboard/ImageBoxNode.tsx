import { useCallback, useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow, useNodeId } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ImageBoxNodeType } from './types';
import { uploadBoardImage } from "../../api/board";
import toast from 'react-hot-toast';
import { FiUpload } from "react-icons/fi";

export default function ImageBoxNode({ data, selected }: NodeProps<ImageBoxNodeType>) {
  const nodeId = useNodeId();
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(data.caption);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const commit = useCallback(() => {
    setIsEditing(false);
    if (nodeId) updateNodeData(nodeId, { caption: draft });
  }, [nodeId, draft, updateNodeData]);

  // cresce a caixa junto com o texto em vez de mostrar scrollbar
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, isEditing]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !nodeId) return;

    try {

      const url = await uploadBoardImage(data.caseId, file);

      
      updateNodeData(nodeId, {
        imageUrl: url,
      });
      

    } catch (e) {

      toast.error("Erro ao enviar imagem");

    }
  };

  return (
    <div
      className={`
        w-40 rounded-lg overflow-hidden border bg-zinc-900 shadow-lg
        ${selected ? 'border-white/60 ring-2 ring-white/30' : 'border-zinc-700'}
      `}
    >
      <Handle type="target" position={Position.Top} className="bg-zinc-400! w-2! h-2!" />
      <Handle type="target" position={Position.Left} className="bg-zinc-400! w-2! h-2!" />

      <div className="relative w-full h-28 bg-zinc-800">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.caption}
            className="w-full h-full object-cover"
          />
        ) : null}

        <label
          className="
            absolute inset-0 flex items-center justify-center cursor-pointer
          "
        >
          <span
            className="
              flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white hover:bg-zinc-900/90 transition
            "
          >
            <FiUpload size={16} />
            {data.imageUrl ? "Trocar imagem" : "Escolher imagem"}
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          autoFocus
          rows={1}
          placeholder="Legenda..."
          className="nodrag nowheel w-full bg-transparent text-xs text-center text-zinc-100 px-2 py-2 resize-none outline-none overflow-hidden placeholder:text-zinc-500"
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
          className={`cursor-text text-xs text-center px-2 py-2 leading-snug ${
            data.caption ? 'text-zinc-200' : 'text-zinc-500'
          }`}
        >
          {data.caption || 'Legenda...'}
        </p>
      )}

      <Handle type="source" position={Position.Right} className="bg-zinc-400! w-2! h-2!" />
      <Handle type="source" position={Position.Bottom} className="bg-zinc-400! w-2! h-2!" />
    </div>
  );
}
