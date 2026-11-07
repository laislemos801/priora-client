import Sk from "@/components/ui/Skeleton";

/** Relatório enquanto os dados do caso são reunidos (folha branca com tabelas). */
export default function ReportSkeleton() {
  return (
    <div className="min-h-screen bg-[#242424] px-4 pb-8 pt-3 md:px-6" role="status" aria-label="Montando o relatório">
      <div className="mx-auto mb-3 flex max-w-[900px] items-center justify-between gap-3">
        <div className="space-y-2">
          <Sk className="h-5 w-44" />
          <Sk className="h-3 w-72" />
        </div>
        <div className="flex gap-2">
          <Sk className="h-8 w-28" />
          <Sk className="h-8 w-40" />
        </div>
      </div>

      <div className="mx-auto max-w-[900px] rounded-md bg-white p-8 shadow-lg">
        <div className="space-y-2 border-b-2 border-gray-300 pb-3">
          <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-72 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-56 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-4 h-14 animate-pulse rounded bg-amber-100" />

        {[5, 4, 3].map((rows, s) => (
          <div key={s} className="mt-6 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="h-6 w-full animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
