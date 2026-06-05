import { MdOutlineAddModerator } from "react-icons/md";


interface EmptyEvidenceStateProps {
  /** Called when the user clicks "Adicionar Evidências" */
  onAdd?: () => void;
}

export default function EmptyEvidenceState({ onAdd }: EmptyEvidenceStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 select-none">
      {/* Icon */}
      <div className="mb-6 text-[#575757]">
        <MdOutlineAddModerator size={80} />
      </div>

      {/* Heading */}
      <p className="text-slate-100 font-semibold text-xl mb-2 text-center">
        Adicione uma nova evidência
      </p>

      {/* Subtitle */}
      <p className="text-slate-400 text-sm mb-8 text-center">
        E comece a investigar seus casos.
      </p>

      {/* CTA button — only rendered when a handler is provided */}
      {onAdd && (
        <button
          onClick={onAdd}
          className="bg-[#139C73] hover:bg-[#0f7d5c] active:scale-95 transition-all duration-150 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
        >
          Adicionar Evidências
        </button>
      )}
    </div>
  );
}

