/** Bloco cinza pulsando: peça básica dos skeletons de carregamento das páginas. */
export default function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#333] ${className}`} />;
}
