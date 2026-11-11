import { useEffect, useRef } from "react";

export type ConfirmOptions = {
  /** Texto de apoio abaixo da pergunta. */
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Botão de confirmar em vermelho (ações que apagam dados). */
  danger?: boolean;
};

export default function ConfirmDialogView({
  message,
  description,
  confirmLabel,
  cancelLabel,
  danger,
  onResult,
}: Required<Omit<ConfirmOptions, "description">> & {
  message: string;
  description?: string;
  onResult: (value: boolean) => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // o foco começa em "Cancelar": Enter sem querer não apaga nada
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onResult(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onResult]);

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 p-3"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onResult(false);
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={message}
        className="w-full max-w-sm rounded-[10px] border border-[#2e2e2e] bg-[#282828] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <div className="px-5 pb-4 pt-5">
          <h2 className="text-[15px] font-medium text-[#e8e8e8]">{message}</h2>
          {description && <p className="mt-2 text-sm leading-relaxed text-[#A6A6A6]">{description}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#2e2e2e] px-5 py-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={() => onResult(false)}
            className="rounded-md border border-[#434343] px-4 py-2 text-sm text-[#c8c8c8] transition-colors hover:bg-[#333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#606060]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => onResult(true)}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              danger
                ? "bg-[#c0392b] focus-visible:outline-[#e05555]"
                : "bg-linear-to-r from-[#139C73] to-[#136D52] focus-visible:outline-[#18C18A]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
