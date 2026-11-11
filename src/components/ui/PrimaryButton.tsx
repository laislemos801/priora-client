import Spinner from "@/components/ui/Spinner";
import { usePendingClick } from "@/hooks/usePendingClick";

type Props = {
  children: React.ReactNode;
  /** Se devolver uma Promise (função async), o botão mostra o carregamento até ela terminar. */
  onClick?: () => unknown;
  disabled?: boolean;
  loading?: boolean;
};

export default function PrimaryButton({ children, onClick, disabled, loading = false }: Props) {
  const { pending, handleClick } = usePendingClick(onClick ? () => onClick() : undefined);
  const busy = loading || pending;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className="
        inline-flex items-center justify-center gap-2
        px-6 py-2 rounded-md text-sm font-bold font-sans text-white
        bg-linear-to-r from-[#139C73] to-[#136D52]
        hover:opacity-90
        disabled:cursor-not-allowed disabled:opacity-50
        transition
      "
    >
      {busy && <Spinner />}
      {children}
    </button>
  );
}
