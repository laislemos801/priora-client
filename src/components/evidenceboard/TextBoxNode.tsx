import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Handle, Position, NodeToolbar, useReactFlow, useNodeId } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { TextBoxNodeType } from './types';
import ColorPicker from './ColorPicker';

export const DEFAULT_BOX_COLOR = '#9b6ff0';
export const DEFAULT_POSTIT_COLOR = '#fde68a';

// rotação levemente aleatória (porém estável) baseada no id do node,
// pra dar aquele efeito de post-it colado à mão
function rotationFromId(id: string | null): number {
  if (!id) return 0;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i);
  return (hash % 7) - 3; // entre -3deg e 3deg
}

// decide se o texto deve ser claro ou escuro dependendo do brilho da cor de fundo
function contrastText(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return '#f4f4f5';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#1f2937' : '#f4f4f5';
}


function EditableText({
  value,
  onCommit,
  className = '',
  placeholder = 'Texto aqui...',
}: {
  value: string;
  onCommit: (next: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const commit = useCallback(() => {
    setIsEditing(false);
    onCommit(draft);
  }, [draft, onCommit]);

  // cresce a caixa junto com o texto em vez de mostrar scrollbar
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, isEditing]);

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        autoFocus
        rows={1}
        placeholder={placeholder}
        className={`nodrag nowheel w-full bg-transparent resize-none outline-none overflow-hidden placeholder:text-current placeholder:opacity-40 ${className}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            commit();
          }
          if (e.key === 'Escape') {
            setDraft(value);
            setIsEditing(false);
          }
        }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      onDoubleClick={() => {
        setDraft(value); // começa vazio se ainda não tem texto — sem nada pra apagar
        setIsEditing(true);
      }}
      className={`cursor-text whitespace-pre-wrap ${!value ? 'opacity-40' : ''} ${className}`}
    >
      {value || placeholder}
    </span>
  );
}

export default function TextBoxNode({ data, selected }: NodeProps<TextBoxNodeType>) {
  const nodeId = useNodeId();
  const { updateNodeData } = useReactFlow();

  const isPostit = data.variant === 'postit';
  const shape = data.shape ?? 'rectangle';
  const color = data.color || (isPostit ? DEFAULT_POSTIT_COLOR : DEFAULT_BOX_COLOR);
  const rotation = useMemo(() => rotationFromId(nodeId), [nodeId]);

  const handleCommit = useCallback(
    (next: string) => {
      if (nodeId) updateNodeData(nodeId, { label: next });
    },
    [nodeId, updateNodeData]
  );

  const handleColorChange = useCallback(
    (hex: string) => {
      if (nodeId) updateNodeData(nodeId, { color: hex });
    },
    [nodeId, updateNodeData]
  );

  const editable = (extraClass = '') => (
    <EditableText value={data.label} onCommit={handleCommit} className={extraClass} />
  );

  // ══════════════ POST-IT ══════════════
  if (isPostit) {
    return (
      <div style={{ transform: `rotate(${rotation}deg)` }}>
        <NodeToolbar isVisible={selected} position={Position.Top} offset={10}>
          <ColorPicker value={color} onChange={handleColorChange} />
        </NodeToolbar>

        <Handle type="target" position={Position.Top} className="bg-zinc-400! w-2! h-2!" />
        <Handle type="target" position={Position.Left} className="bg-zinc-400! w-2! h-2!" />

        <div
          className={`relative w-40 min-h-[140px] p-3 shadow-[2px_4px_10px_rgba(0,0,0,0.45)] text-sm leading-snug ${
            selected ? 'ring-2 ring-white/50' : ''
          }`}
          style={{
            backgroundColor: color,
            color: contrastText(color),
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 92%, 8% 100%, 0 100%)',
          }}
        >
          {editable()}
        </div>

        <Handle type="source" position={Position.Right} className="bg-zinc-400! w-2! h-2!" />
        <Handle type="source" position={Position.Bottom} className="bg-zinc-400! w-2! h-2!" />
      </div>
    );
  }

  const boxStyle = {
    borderColor: color,
    color: `color-mix(in srgb, ${color} 70%, white)`,
    backgroundColor: `color-mix(in srgb, ${color} 18%, #09090b)`,
  };

  // ══════════════ LOSANGO ══════════════
  if (shape === 'diamond') {
    return (
      <div className="relative w-36 h-36">
        <NodeToolbar isVisible={selected} position={Position.Top} offset={10}>
          <ColorPicker value={color} onChange={handleColorChange} />
        </NodeToolbar>

        <Handle type="target" position={Position.Top} className="bg-zinc-400! w-2! h-2!" />
        <Handle type="target" position={Position.Left} className="bg-zinc-400! w-2! h-2!" />

        <div
          className={`absolute inset-2 rotate-45 border-2 shadow-lg ${selected ? 'ring-2 ring-white/40' : ''}`}
          style={boxStyle}
        />
        <div className="absolute inset-0 flex items-center justify-center px-6 overflow-hidden">
          <div className="text-xs font-medium text-center leading-snug" style={{ color: boxStyle.color }}>
            {editable('text-center')}
          </div>
        </div>

        <Handle type="source" position={Position.Right} className="bg-zinc-400! w-2! h-2!" />
        <Handle type="source" position={Position.Bottom} className="bg-zinc-400! w-2! h-2!" />
      </div>
    );
  }

  // ══════════════ CÍRCULO ══════════════
  if (shape === 'circle') {
    return (
      <div className="relative">
        <NodeToolbar isVisible={selected} position={Position.Top} offset={10}>
          <ColorPicker value={color} onChange={handleColorChange} />
        </NodeToolbar>

        <div
          className={`w-32 h-32 rounded-full border-2 shadow-lg flex items-center justify-center px-4 text-center text-sm font-medium leading-snug overflow-hidden ${
            selected ? 'ring-2 ring-white/40' : ''
          }`}
          style={boxStyle}
        >
          <Handle type="target" position={Position.Top} className="bg-zinc-400! w-2! h-2!" />
          <Handle type="target" position={Position.Left} className="bg-zinc-400! w-2! h-2!" />

          {editable('text-center')}

          <Handle type="source" position={Position.Right} className="bg-zinc-400! w-2! h-2!" />
          <Handle type="source" position={Position.Bottom} className="bg-zinc-400! w-2! h-2!" />
        </div>
      </div>
    );
  }

  // ══════════════ RETÂNGULO (padrão) ══════════════
  return (
    <div className="relative">
      <NodeToolbar isVisible={selected} position={Position.Top} offset={10}>
        <ColorPicker value={color} onChange={handleColorChange} />
      </NodeToolbar>

      <div
        className={`min-w-[180px] max-w-[240px] rounded-lg border-2 px-4 py-3 text-sm font-medium leading-snug shadow-lg ${
          selected ? 'ring-2 ring-white/40' : ''
        }`}
        style={boxStyle}
      >
        <Handle type="target" position={Position.Top} className="bg-zinc-400! w-2! h-2!" />
        <Handle type="target" position={Position.Left} className="bg-zinc-400! w-2! h-2!" />

        {editable()}

        <Handle type="source" position={Position.Right} className="bg-zinc-400! w-2! h-2!" />
        <Handle type="source" position={Position.Bottom} className="bg-zinc-400! w-2! h-2!" />
      </div>
    </div>
  );
}
