import { createRoot } from "react-dom/client";
import ConfirmDialogView, { type ConfirmOptions } from "@/components/ui/ConfirmDialogView";

/**
 * Pergunta de confirmação em um diálogo próprio (no lugar do `confirm()` do navegador).
 * Resolve `true` ao confirmar e `false` ao cancelar, apertar Esc ou clicar fora.
 * Avisos informativos continuam sendo toasts; só decisões (confirmar/cancelar) usam isto.
 */
export function confirmDialog(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  const { description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", danger = true } = options;

  return new Promise<boolean>((resolve) => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    let done = false;

    const onResult = (value: boolean) => {
      if (done) return;
      done = true;
      root.unmount();
      host.remove();
      resolve(value);
    };

    root.render(
      <ConfirmDialogView
        message={message}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        danger={danger}
        onResult={onResult}
      />,
    );
  });
}
