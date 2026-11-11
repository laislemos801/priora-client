import type { ButtonHTMLAttributes } from "react";
import Spinner from "@/components/ui/Spinner";
import { usePendingClick } from "@/hooks/usePendingClick";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Força o estado de carregamento (além do detectado pelo `onClick` assíncrono). */
  loading?: boolean;
  /** Botão só com ícone: o spinner substitui o ícone em vez de aparecer ao lado. */
  iconOnly?: boolean;
};

/**
 * `<button>` com indicador de carregamento automático: se o `onClick` for assíncrono,
 * mostra o spinner e desabilita o botão até terminar. Aceita as mesmas props e classes
 * de um `<button>` comum, então serve para botões com estilo próprio.
 */
export default function LoadingButton({
  loading = false,
  iconOnly = false,
  onClick,
  disabled,
  children,
  type = "button",
  ...rest
}: Props) {
  const { pending, handleClick } = usePendingClick(onClick);
  const busy = loading || pending;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...rest}
    >
      {busy && <Spinner className={iconOnly ? "size-3.5" : "mr-2 inline size-3.5 align-[-2px]"} />}
      {busy && iconOnly ? null : children}
    </button>
  );
}
