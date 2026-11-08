import { PAGE_BODY_FILL, PAGE_CARD_FILL } from "@/components/ui/EmptyState";

// Mesmas colunas da tabela do ranking (components/suspect/RankingTable.tsx)
const GRID = "lg:grid-cols-[40px_56px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_72px]";

function Sk({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-[#333] ${className}`} />
  );
}

function RankingRowSk({ first = false }: { first?: boolean }) {
  return (
    <div className={`rounded-lg ${first ? "bg-[#139C73]/25" : "bg-[#2A2A2A]"}`}>
      {/* Mobile */}
      <div className="flex flex-col gap-3 p-3 lg:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sk className="h-9 w-9 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Sk className="h-4 w-32" />
              <Sk className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sk className="h-6 w-6 rounded-md" />
            <Sk className="h-5 w-5 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Sk className="h-14 rounded-md" />
          <Sk className="h-14 rounded-md" />
        </div>
      </div>

      {/* Desktop */}
      <div className={`hidden min-h-[60px] items-center gap-x-4 px-6 py-1 lg:grid ${GRID}`}>
        <div className="flex justify-center">
          <Sk className="h-5 w-5 rounded" />
        </div>
        <div className="flex justify-center">
          <Sk className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-3">
          <Sk className="h-9 w-9 shrink-0 rounded-full" />
          <Sk className="h-4 w-32" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Sk className="h-4 w-14" />
          <Sk className="h-4 w-4 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Sk className="h-4 w-6" />
        </div>
        <div className="flex justify-center">
          <Sk className="h-6 w-6 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function RankingSkeleton() {
  return (
    <div className="min-h-full bg-[#242424]">
      <div className="flex-1 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className={`relative rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>

          {/* Header: ícone, título, "i" e botões */}
          <header className="flex flex-col gap-4 border-b border-[#575757] px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Sk className="h-5 w-5" />
              <Sk className="h-5 w-44" />
              <Sk className="h-4 w-4 rounded-full" />
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <Sk className="h-9 w-full md:w-36" />
              <Sk className="h-9 w-full md:w-24" />
              <Sk className="h-9 w-full md:w-20" />
              <Sk className="h-9 w-full md:w-24" />
            </div>
          </header>

          <main className={`${PAGE_BODY_FILL} p-4 md:p-6`}>
            <div className="space-y-3">
              {/* Cabeçalho da tabela */}
              <div className={`hidden items-center gap-x-4 px-6 lg:grid ${GRID}`}>
                <div className="flex justify-center">
                  <Sk className="h-5 w-5 rounded" />
                </div>
                {["w-14", "w-10", "w-32", "w-24", "w-16"].map((w, i) => (
                  <div key={i} className="flex justify-center">
                    <Sk className={`h-4 ${w}`} />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <RankingRowSk first />
                <RankingRowSk />
                <RankingRowSk />
                <RankingRowSk />
                <RankingRowSk />
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
