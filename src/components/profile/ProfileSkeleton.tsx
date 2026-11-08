import TopBar from "@/components/ui/TopBar";
import Sk from "@/components/ui/Skeleton";

/** Página "Minha Conta" enquanto os dados do usuário carregam. */
export default function ProfileSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1D1D1D] text-white" role="status" aria-label="Carregando perfil">
      <TopBar />

      <main className="flex flex-1 flex-col px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <section className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[#575757]">
          <header className="flex items-center gap-3 border-b border-[#575757] px-4 py-4 md:px-6">
            <Sk className="h-6 w-6 rounded-full" />
            <Sk className="h-4 w-32" />
          </header>

          <div className="relative flex flex-1 flex-col">
            <div className="absolute inset-x-0 top-0 h-[30%] border-b border-[#575757] bg-[#262626]" />

            <div className="relative z-10 flex flex-1 flex-col gap-6 px-4 pb-6 pt-10 md:px-8 lg:gap-[3vw] lg:px-[3vw] lg:pb-[3vw] lg:pt-[5vw] lg:flex-row">
              {/* cartão do perfil */}
              <div className="flex w-full shrink-0 flex-col items-center gap-4 self-start rounded-lg border border-[#575757] bg-[#292929] p-6 lg:w-[18%]">
                <Sk className="h-24 w-24 rounded-full" />
                <Sk className="h-4 w-32" />
                <Sk className="h-3 w-24" />
                <div className="mt-2 w-full space-y-3">
                  <Sk className="h-3 w-full" />
                  <Sk className="h-3 w-full" />
                  <Sk className="h-3 w-full" />
                </div>
              </div>

              {/* formulários */}
              <div className="flex flex-1 flex-col gap-6">
                <div className="rounded-lg border border-[#575757] bg-[#292929] p-6">
                  <Sk className="mb-5 h-4 w-40" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Sk className="h-10" />
                    <Sk className="h-10" />
                  </div>
                  <Sk className="mt-4 h-10 w-full" />
                  <Sk className="mt-5 h-9 w-28" />
                </div>

                <div className="rounded-lg border border-[#575757] bg-[#292929] p-6">
                  <Sk className="mb-5 h-4 w-32" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Sk className="h-10" />
                    <Sk className="h-10" />
                  </div>
                  <Sk className="mt-5 h-9 w-28" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
