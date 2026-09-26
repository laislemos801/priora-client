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
              <div key={i} className="bg-[#2A2A2A] rounded-xl p-4 border border-[#3a3a3a] flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2 flex-1">
                    <Sk className="h-5 w-32" />
                    <Sk className="h-3 w-48" />
                  </div>
                  <Sk className="h-8 w-16 rounded-md shrink-0" />
                </div>
                <Sk className="h-14 w-full rounded-lg" />
                <Sk className="h-14 w-full rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Sk className="h-4 w-28 rounded-full" />
                  <Sk className="h-4 w-40" />
                  <Sk className="h-4 w-36" />
                  <Sk className="h-4 w-44" />
                  <Sk className="h-4 w-32" />
                </div>
                <div className="flex justify-between mt-2">
                  <Sk className="h-8 w-28 rounded-md" />
                  <Sk className="h-8 w-24 rounded-md" />
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