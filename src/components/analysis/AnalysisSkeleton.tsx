function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#333] ${className}`} />;
}

function SectionSk({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">
      <Sk className="h-5 w-48 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#333] bg-[#2A2A2A] p-4 space-y-2">
            <div className="flex justify-between">
              <div className="space-y-1">
                <Sk className="h-4 w-36" />
                <Sk className="h-3 w-20" />
              </div>
              <Sk className="h-5 w-12" />
            </div>
            <Sk className="h-3 w-3/4" />
            <Sk className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalysisSkeleton() {
  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-[#575757] bg-[#1e1e1e] overflow-hidden">

          {/* Header */}
          <header className="flex flex-col gap-4 border-b border-[#575757] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Sk className="h-5 w-5" />
              <Sk className="h-5 w-48" />
            </div>
            <Sk className="h-9 w-56 rounded-lg" />
          </header>

          <main className="p-4 md:p-6 space-y-6">

            {/* Grafo */}
            <Sk className="h-[520px] w-full rounded-xl" />

            {/* Seções da explicação */}
            <SectionSk rows={2} />

            <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">
              <Sk className="h-5 w-56 mb-4" />
              <Sk className="h-4 w-48 mx-auto mb-4" />
              <div className="text-center space-y-3">
                <Sk className="h-6 w-72 mx-auto" />
                <Sk className="h-4 w-4 mx-auto" />
                <Sk className="h-6 w-32 mx-auto" />
              </div>
            </div>

            <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">
              <Sk className="h-5 w-64 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-lg bg-[#2A2A2A] p-4 text-center space-y-2">
                    <Sk className="h-3 w-20 mx-auto" />
                    <Sk className="h-5 w-28 mx-auto" />
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-[#333] bg-[#2A2A2A] p-4 space-y-2">
                <Sk className="h-3 w-32" />
                <Sk className="h-4 w-48" />
                <Sk className="h-4 w-24" />
              </div>
            </div>

            <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">
              <Sk className="h-5 w-44 mb-4" />
              <div className="max-w-md mx-auto space-y-4">
                <div className="rounded-lg border border-[#333] bg-[#2A2A2A] p-5 space-y-3">
                  <Sk className="h-3 w-16 mx-auto" />
                  <Sk className="h-5 w-32 mx-auto border-b border-[#333] pb-2" />
                  <Sk className="h-5 w-32 mx-auto" />
                  <Sk className="h-6 w-24 mx-auto" />
                </div>
                <Sk className="h-8 w-28 mx-auto" />
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}