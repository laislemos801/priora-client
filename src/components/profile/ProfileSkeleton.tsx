import TopBar from "@/components/ui/TopBar";
import Sk from "@/components/ui/Skeleton";

const CARD = "rounded-xl border border-[#3d3d3d] bg-[#2B2B2B]";

/** Página "Minha Conta" enquanto os dados do usuário carregam (mesmo layout: cartão + abas). */
export default function ProfileSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1D1D1D] text-white" role="status" aria-label="Carregando perfil">
      <TopBar />

      <main className="flex flex-1 flex-col px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <section className="flex flex-col overflow-hidden rounded-xl border border-[#575757] bg-[#242424]">
          <header className="flex items-center gap-3 border-b border-[#575757] px-4 py-4 md:px-6">
            <Sk className="h-6 w-6 rounded-full" />
            <Sk className="h-4 w-32" />
          </header>

          <div className="grid w-full gap-5 p-4 md:p-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
            {/* cartão do perfil */}
            <div className={`${CARD} flex flex-col`}>
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 pb-8 pt-10">
                <Sk className="size-28 rounded-full" />
                <Sk className="mt-4 h-5 w-36" />
                <Sk className="h-3 w-48" />
                <Sk className="mt-2 h-5 w-32 rounded-full" />
              </div>
              <div className="grid grid-cols-3 border-t border-[#3d3d3d]">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 py-4">
                    <Sk className="h-5 w-6" />
                    <Sk className="h-3 w-14" />
                  </div>
                ))}
              </div>
              <div className="flex justify-center border-t border-[#3d3d3d] py-3.5">
                <Sk className="h-4 w-24" />
              </div>
            </div>

            {/* abas */}
            <div className={CARD}>
              <div className="flex gap-6 border-b border-[#3d3d3d] px-6 py-4">
                <Sk className="h-4 w-28" />
                <Sk className="h-4 w-20" />
              </div>
              <div className="space-y-5 p-5 sm:p-7">
                <Sk className="h-3 w-72" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Sk className="h-11" />
                  <Sk className="h-11" />
                  <Sk className="h-11" />
                  <Sk className="h-11" />
                </div>
                <Sk className="ml-auto h-11 w-40" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
