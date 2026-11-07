import Sk from "@/components/ui/Skeleton";

/** Cartões de ação enquanto o ganho de informação é calculado. */
export default function ActionCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Calculando ganho de informação">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <Sk className="h-4 w-3/5" />
              <Sk className="h-3 w-2/5" />
            </div>
            <Sk className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Sk className="h-12" />
            <Sk className="h-12" />
            <Sk className="h-12" />
          </div>
          <div className="mt-4 flex gap-2">
            <Sk className="h-8 w-28" />
            <Sk className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
