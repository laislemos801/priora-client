import Spinner from "@/components/ui/Spinner";
import { usePendingClick } from "@/hooks/usePendingClick";

type Props = {
  children: React.ReactNode;
  /** Se devolver uma Promise (função async), o botão mostra o carregamento até ela terminar. */
  onClick?: () => unknown;
  loading?: boolean;
};

export default function SecondaryButton({ children, onClick, loading = false }: Props) {
  const { pending, handleClick } = usePendingClick(onClick ? () => onClick() : undefined);
  const busy = loading || pending;

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      aria-busy={busy || undefined}
      className="
        inline-flex items-center gap-1.5
        px-4 py-1 rounded-2xl text-[12px] font-bold font-sans text-white
        bg-linear-to-r from-[#139C73] to-[#136D52]
        hover:opacity-90
        disabled:cursor-not-allowed disabled:opacity-60
        transition
      "
    >
      {busy && <Spinner className="size-3" />}
      {children}
    </button>
  );
}
