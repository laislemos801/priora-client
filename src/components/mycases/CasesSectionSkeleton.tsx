function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#333] ${className}`} />;
}

export default function CasesSectionSkeleton() {
  return (
    <div className="h-full rounded-md p-4 flex flex-col gap-4">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* LEFT */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Sk className="h-10 w-full rounded-md" />
            <Sk className="h-10 w-24 rounded-md shrink-0" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full max-w-sm">
                <div className="flex items-end justify-between">
                  <Sk className="h-7 w-24 rounded-b-none rounded-t-lg" />
                  <Sk className="mb-1 h-5 w-14 rounded-md" />
                </div>
                <div className="flex flex-col gap-2.5 rounded-b-xl rounded-tr-xl border border-[#3a3a3a] bg-[#2A2A2A] p-3.5">
                  <div className="flex flex-col gap-2">
                    <Sk className="h-4 w-40" />
                    <Sk className="h-3 w-52" />
                  </div>
                  <Sk className="h-11 w-full rounded-lg" />
                  <div className="grid grid-cols-2 gap-2">
                    <Sk className="h-3 w-24" />
                    <Sk className="h-3 w-24" />
                    <Sk className="col-span-2 h-3 w-36" />
                    <Sk className="h-3 w-24" />
                    <Sk className="h-3 w-20" />
                  </div>
                  <div className="mt-0.5 flex justify-between border-t border-[#3a3a3a] pt-2.5">
                    <Sk className="h-7 w-24 rounded-md" />
                    <Sk className="h-7 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - sidebar */}
        <div className="flex flex-col gap-4">
          <Sk className="h-32 rounded-xl" />
          <Sk className="h-32 rounded-xl" />
          <Sk className="h-44 rounded-xl" />
          <Sk className="h-44 rounded-xl" />
        </div>

      </div>
    </div>
  );
}