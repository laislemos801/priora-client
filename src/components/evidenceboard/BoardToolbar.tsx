import {
  MousePointer2,
  Square,
  Circle,
  Diamond,
  StickyNote,
  Type,
  Image as ImageIcon,
  ArrowRight,
  Save,
  Trash2,
} from 'lucide-react';

export type ShapeTool = 'rectangle' | 'circle' | 'diamond' | 'note' | 'text' | 'image' | 'arrow';

interface BoardToolbarProps {
  onAddShape: (tool: ShapeTool) => void;
  onSave: () => void;
  onDeleteSelected: () => void;
  isSaving?: boolean;
}

const shapeButtons: { tool: ShapeTool; icon: React.ReactNode; label: string }[] = [
  { tool: 'rectangle', icon: <Square size={16} />, label: 'Retângulo' },
  { tool: 'circle', icon: <Circle size={16} />, label: 'Círculo' },
  { tool: 'diamond', icon: <Diamond size={16} />, label: 'Losango' },
  { tool: 'note', icon: <StickyNote size={16} />, label: 'Nota' },
  { tool: 'text', icon: <Type size={16} />, label: 'Texto' },
  { tool: 'image', icon: <ImageIcon size={16} />, label: 'Imagem' },
  { tool: 'arrow', icon: <ArrowRight size={16} />, label: 'Conexão' },
];


export default function BoardToolbar({
  onAddShape,
  onSave,
  onDeleteSelected,
  isSaving,
}: BoardToolbarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800 bg-zinc-950">
      <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
        <MousePointer2 size={16} className="text-[#139C73]" />
        Quadro investigativo
      </span>

      <div className="h-5 w-px bg-zinc-700 mx-1" />

      <span className="text-xs uppercase tracking-wide text-zinc-500">Ferramenta</span>
      <button className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-300" title="Selecionar">
        <MousePointer2 size={16} />
      </button>

      <div className="h-5 w-px bg-zinc-700 mx-1" />

      <span className="text-xs uppercase tracking-wide text-zinc-500">Adicionar</span>
      <div className="flex items-center gap-1">
        {shapeButtons.map(({ tool, icon, label }) => (
          <button
            key={tool}
            onClick={() => onAddShape(tool)}
            title={label}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            {icon}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onSave}
          disabled={isSaving}
          title="Salvar quadro"
          className="p-2 rounded-md hover:bg-zinc-800 text-[#139C73] disabled:opacity-50"
        >
          <Save size={22} />
        </button>
        <button
          onClick={onDeleteSelected}
          title="Excluir selecionado"
          className="p-2 rounded-md hover:bg-red-950 text-red-500"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
}
