function Sk({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-[#333] ${className}`} />
  );
}

function PanelSk({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-[#3d3d3d] bg-[#252525] p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <Sk className="h-4 w-32" />
        <Sk className="h-7 w-16" />
      </div>
      {children}
    </div>
  );
}

function InfoCardSk() {
  return (
    <PanelSk>
      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Sk className="h-4 w-28 shrink-0" />
            <Sk className="h-4 w-full" />
          </div>
        ))}
      </div>
    </PanelSk>
  );
}

function MetricCardSk() {
  return (
    <div className="flex min-h-[112px] justify-between rounded-lg border border-[#3d3d3d] bg-[#252525] p-4">
      <div className="flex flex-col justify-between">
        <Sk className="h-3 w-32" />
        <Sk className="h-10 w-12" />
      </div>
      <Sk className="h-9 w-9 self-end" />
    </div>
  );
}

function ProfileCardSk() {
  return (
    <div className="rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-5">
      <div className="mb-4 flex items-center justify-between">
        <Sk className="h-4 w-36" />
        <Sk className="h-5 w-5" />
      </div>
      <Sk className="h-[200px] w-full" />
    </div>
  );
}

function UncertaintyCardSk() {
  return (
    <div className="rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-5">
      <div className="mb-6 flex items-center justify-between">
        <Sk className="h-4 w-44" />
        <Sk className="h-5 w-5 rounded-full" />
      </div>
      <Sk className="h-[200px] w-full" />
    </div>
  );
}

function PanelTextSk({ lines = 3 }: { lines?: number }) {
  return (
    <PanelSk>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Sk key={i} className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
    </PanelSk>
  );
}

export default function CaseOverviewSkeleton() {
  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 p-4 md:p-6">
        <div className="overflow-hidden rounded-xl border border-[#575757] bg-[#242424]">

          {/* Header */}
          <header className="border-b border-[#575757] px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Sk className="h-5 w-5" />
                  <Sk className="h-5 w-36" />
                </div>
                <Sk className="h-3 w-48" />
              </div>
              <Sk className="h-9 w-24" />
            </div>
          </header>

          <main className="grid gap-6 p-6 xl:grid-cols-[1fr_285px]">
            <section className="space-y-6">

              {/* InfoCard + MetricCards */}
              <div className="grid gap-4 lg:grid-cols-[1fr_190px]">
                <InfoCardSk />
                <div className="grid gap-4">
                  <MetricCardSk />
                  <MetricCardSk />
                </div>
              </div>

              {/* ProfileCard + UncertaintyCard (mobile) */}
              <div className="grid gap-6 lg:grid-cols-[1fr_280px] xl:hidden">
                <ProfileCardSk />
                <UncertaintyCardSk />
              </div>

              {/* Histórico */}
              <PanelTextSk lines={3} />

              {/* Próximo Passo */}
              <PanelTextSk lines={2} />

              {/* ContactsCard + MapCard */}
              <div className="grid gap-4 lg:grid-cols-2">
                <PanelSk>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Sk className="h-8 w-8 rounded-full shrink-0" />
                        <div className="flex-1 space-y-1">
                          <Sk className="h-3 w-32" />
                          <Sk className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </PanelSk>
                <Sk className="h-[220px] rounded-lg" />
              </div>

              {/* AccessCard (mobile) */}
              <div className="xl:hidden">
                <PanelSk>
                  <Sk className="h-24 w-full" />
                </PanelSk>
              </div>
            </section>

            {/* Aside (desktop) */}
            <aside className="hidden space-y-4 xl:block">
              <PanelSk>
                <Sk className="h-24 w-full" />
              </PanelSk>
              <ProfileCardSk />
              <UncertaintyCardSk />
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}