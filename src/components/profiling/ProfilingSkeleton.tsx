function Sk({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-[#333] ${className}`} />
  );
}

// Pentágono da grade do radar (mesma proporção do RadarChart)
const PENTAGON_POINTS = "50,5 92.8,36.1 76.5,86.4 23.5,86.4 7.2,36.1";

function InsightCardSk() {
  return (
    <div className="space-y-3 rounded-xl bg-[#2A2A2A] p-5">
      <div className="flex items-center gap-2">
        <Sk className="h-2.5 w-2.5 rounded-full" />
        <Sk className="h-3 w-24" />
      </div>
      <Sk className="h-5 w-36" />
      <div className="space-y-2">
        <Sk className="h-3 w-full" />
        <Sk className="h-3 w-full" />
        <Sk className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export default function ProfilingSkeleton() {
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
            <Sk className="h-9 w-full md:w-24" />
          </header>

          <main className="p-4 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row">

              {/* Card do radar */}
              <div className="flex-1 rounded-xl bg-[#2A2A2A] p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <Sk className="h-9 w-9 shrink-0 rounded-full" />
                  <Sk className="h-5 w-40" />
                </div>

                <div className="mx-auto mt-6 w-full max-w-[560px]">
                  <svg
                    viewBox="0 0 100 92"
                    className="w-full animate-pulse"
                    aria-hidden="true"
                  >
                    {[1, 0.8, 0.6, 0.4, 0.2].map((scale) => (
                      <polygon
                        key={scale}
                        points={PENTAGON_POINTS}
                        fill={scale === 1 ? "#333" : "none"}
                        stroke="#3a3a3a"
                        strokeWidth={0.4}
                        transform={`translate(${50 * (1 - scale)} ${50 * (1 - scale)}) scale(${scale})`}
                      />
                    ))}
                  </svg>
                </div>

                <div className="mt-6 flex items-center justify-center gap-6">
                  <Sk className="h-3 w-28" />
                  <Sk className="h-3 w-28" />
                </div>
              </div>

              {/* Coluna de análises */}
              <div className="flex w-full flex-col gap-3 lg:w-[320px] lg:shrink-0">
                <InsightCardSk />
                <InsightCardSk />
                <InsightCardSk />
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
