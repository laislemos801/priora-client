function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#333] ${className}`} />;
}

function MobileCardSk() {
  return (
    <div className="bg-[#2B2B2B] rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Sk className="h-4 w-4 rounded" />
          <Sk className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Sk className="h-6 w-24 rounded-full" />
          <Sk className="h-7 w-7 rounded-md" />
        </div>
      </div>
      <Sk className="h-4 w-3/4 ml-6" />
      <div className="flex items-center justify-between pl-6">
        <Sk className="h-3 w-20" />
        <div className="flex -space-x-2">
          <Sk className="h-7 w-7 rounded-full" />
          <Sk className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function DesktopRowSk() {
  return (
    <tr>
      {/* checkbox */}
      <td className="p-3 bg-[#2B2B2B] first:rounded-l-lg">
        <Sk className="h-4 w-4 rounded" />
      </td>
      {/* tipo */}
      <td className="p-3 bg-[#2B2B2B]">
        <div className="flex items-center gap-2">
          <Sk className="h-5 w-5 rounded" />
          <Sk className="h-4 w-20" />
        </div>
      </td>
      {/* nome */}
      <td className="p-3 bg-[#2B2B2B]">
        <Sk className="h-4 w-48" />
      </td>
      {/* data */}
      <td className="p-3 bg-[#2B2B2B]">
        <Sk className="h-4 w-20" />
      </td>
      {/* status */}
      <td className="p-3 bg-[#2B2B2B]">
        <Sk className="h-6 w-24 rounded-full" />
      </td>
      {/* suspeitos */}
      <td className="p-3 bg-[#2B2B2B]">
        <div className="flex -space-x-2">
          <Sk className="h-7 w-7 rounded-full" />
          <Sk className="h-7 w-7 rounded-full" />
          <Sk className="h-7 w-7 rounded-full" />
        </div>
      </td>
      {/* ação */}
      <td className="p-3 bg-[#2B2B2B] last:rounded-r-lg">
        <Sk className="h-7 w-7 rounded-md" />
      </td>
    </tr>
  );
}

export default function EvidenceTableSkeleton() {
  return (
    <div className="p-2 sm:p-6 w-full">

      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center gap-2 px-1">
          <Sk className="h-4 w-4 rounded" />
          <Sk className="h-3 w-24" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <MobileCardSk key={i} />
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-y-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              {["w-4", "w-10", "w-32", "w-16", "w-20", "w-24", "w-6"].map((w, i) => (
                <th key={i} className="p-3 text-left">
                  <Sk className={`h-4 ${w}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <DesktopRowSk key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}