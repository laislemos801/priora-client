import Sk from "@/components/ui/Skeleton";

/** Quadro investigativo enquanto carrega: barra de ferramentas e tela com alguns nós. */
export default function BoardSkeleton() {
  return (
    <div
      className="flex h-[calc(100vh-4rem)] flex-col bg-zinc-950"
      role="status"
      aria-label="Carregando quadro investigativo"
    >
      <div className="flex items-center gap-2 border-b border-[#2a2a2a] px-4 py-3">
        <Sk className="h-8 w-8" />
        <Sk className="h-8 w-8" />
        <Sk className="h-8 w-8" />
        <Sk className="h-8 w-8" />
        <div className="flex-1" />
        <Sk className="h-8 w-24" />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <Sk className="absolute left-[12%] top-[16%] h-24 w-44" />
        <Sk className="absolute left-[42%] top-[10%] h-28 w-52" />
        <Sk className="absolute left-[68%] top-[22%] h-24 w-44" />
        <Sk className="absolute left-[24%] top-[52%] h-24 w-48" />
        <Sk className="absolute left-[56%] top-[58%] h-20 w-40" />
      </div>
    </div>
  );
}
