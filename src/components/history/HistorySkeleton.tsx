import Sk from "@/components/ui/Skeleton";

/** Linhas do histórico enquanto carrega (o cabeçalho da página já aparece normal). */
export default function HistoryListSkeleton() {
  return (
    <div className="w-full space-y-6" role="status" aria-label="Carregando histórico">
      {[3, 4].map((rows, section) => (
        <div key={section} className="space-y-2">
          <Sk className="h-3 w-24" />
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-md border-b border-[#202020] bg-[#2B2B2B] px-4 py-3"
            >
              <Sk className="h-9 w-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Sk className="h-3.5 w-3/5" />
                <Sk className="h-3 w-2/5" />
              </div>
              <Sk className="h-5 w-20" />
              <Sk className="h-3 w-12" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
