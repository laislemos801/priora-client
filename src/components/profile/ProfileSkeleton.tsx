import TopBar from "@/components/ui/TopBar";
import Sk from "@/components/ui/Skeleton";
import { PAGE_CARD_FILL } from "@/components/ui/EmptyState";

const CARD = "rounded-lg border border-[#3d3d3d] bg-[#2B2B2B]";

/** Página "Minha Conta" enquanto os dados do usuário carregam (mesmo layout da página). */
export default function ProfileSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1D1D1D] text-white" role="status" aria-label="Carregando perfil">
      <TopBar />

      <main className="flex flex-1 flex-col px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <section className={`overflow-hidden rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>
          <header className="flex items-center gap-3 border-b border-[#575757] px-4 py-4 md:px-6">
            <Sk className="h-6 w-6 rounded-full" />
            <Sk className="h-4 w-32" />
          </header>

          <div className="mx-auto grid w-full max-w-6xl gap-6 p-4 md:p-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-8 lg:p-8">
            {/* identidade */}
            <div className={`${CARD} overflow-hidden`}>
              <div className="h-20 border-b border-[#3d3d3d] bg-[#262626]" />
              <div className="flex flex-col items-center gap-2 px-6 pb-6">
                <Sk className="-mt-12 size-24 rounded-full ring-4 ring-[#2B2B2B]" />
                <Sk className="mt-3 h-5 w-36" />
                <Sk className="h-3 w-48" />
                <Sk className="mt-1 h-5 w-32 rounded-full" />
              </div>
              <div className="grid grid-cols-3 border-t border-[#3d3d3d]">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 py-4">
                    <Sk className="h-5 w-6" />
                    <Sk className="h-3 w-14" />
                  </div>
                ))}
              </div>
              <div className="border-t border-[#3d3d3d] px-5 py-3">
                <Sk className="h-3 w-full" />
              </div>
              <div className="flex justify-center border-t border-[#3d3d3d] py-3">
                <Sk className="h-4 w-24" />
              </div>
            </div>

            {/* configurações */}
            <div className={`${CARD} divide-y divide-[#3d3d3d]`}>
              {[0, 1].map((i) => (
                <div key={i} className="p-5 md:p-7">
                  <Sk className="h-4 w-36" />
                  <Sk className="mt-2 h-3 w-64" />
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Sk className="h-11" />
                    <Sk className="h-11" />
                  </div>
                  <Sk className="mt-5 h-11 w-full" />
                  <Sk className="ml-auto mt-5 h-11 w-36" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
