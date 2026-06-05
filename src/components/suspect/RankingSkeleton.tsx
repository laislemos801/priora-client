function Sk({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-[#333] ${className}`} />
  );
}

function RankingRowSk({ first = false }: { first?: boolean }) {
  return (
    <div className={`rounded-lg ${first ? "bg-[#139C73]/25" : "bg-[#2A2A2A]"}`}>
      {/* Mobile */}
      <div className="flex flex-col gap-4 p-4 lg:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sk className="h-12 w-12 rounded-full shrink-0" />
            <div className="space-y-2">
              <Sk className="h-4 w-32" />
              <Sk className="h-3 w-20" />
            </div>
          </div>
          <Sk className="h-4 w-4 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Sk className="h-16 rounded-md" />
          <Sk className="h-16 rounded-md" />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden min-h-[96px] items-center px-6 lg:grid lg:grid-cols-[60px_repeat(4,minmax(0,1fr))]">
        <div className="flex justify-center">
          <Sk className="h-4 w-4 rounded" />
        </div>
        <div className="flex justify-center">
          <Sk className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-4">
          <Sk className="h-12 w-12 rounded-full shrink-0" />
          <Sk className="h-4 w-32" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Sk className="h-5 w-16" />
          <Sk className="h-4 w-4 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Sk className="h-5 w-8" />
        </div>
      </div>
    </div>
  );
}

export default function RankingSkeleton() {
  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 p-4 md:p-6">
        <div className="relative rounded-xl border border-[#575757] bg-[#242424]">

          {/* Header */}
          <header className="flex flex-col gap-4 border-b border-[#575757] px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Sk className="h-5 w-5" />
              <Sk className="h-5 w-44" />
            </div>
            <div className="flex gap-2">
              <Sk className="h-9 w-36" />
              <Sk className="h-9 w-24" />
              <Sk className="h-9 w-20" />
              <Sk className="h-9 w-24" />
            </div>
          </header>

          {/* Table header */}
          <main className="p-4 md:p-6">
            <div className="space-y-3">
              <div className="hidden px-6 lg:grid lg:grid-cols-[60px_repeat(4,minmax(0,1fr))]">
                <div className="flex justify-center">
                  <Sk className="h-4 w-4 rounded" />
                </div>
                {["w-16", "w-12", "w-32", "w-24"].map((w, i) => (
                  <div key={i} className="flex justify-center">
                    <Sk className={`h-4 ${w}`} />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
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