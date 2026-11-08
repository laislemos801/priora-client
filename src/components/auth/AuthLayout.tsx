import type { ReactNode } from "react";
import logoHorizonImg from "@/assets/logoHorizon.png";
import NavIcon, { type NavIconName } from "@/components/ui/NavIcon";

const FEATURES: { icon: NavIconName; label: string }[] = [
  { icon: "ranking", label: "Ranking probabilístico" },
  { icon: "board", label: "Quadro investigativo" },
  { icon: "priority", label: "Priorização de ações" },
];

/** Dados fictícios, só para ilustrar a tela de ranking no painel da marca. */
const PREVIEW = [
  { initials: "S1", name: "Suspeito 1", value: 62, color: "#18C18A" },
  { initials: "S2", name: "Suspeito 2", value: 24, color: "#E8CF75" },
  { initials: "S3", name: "Suspeito 3", value: 14, color: "#8f8f8f" },
];

/** Prévia ilustrativa do Ranking de suspeitos, desenhada em código. */
function RankingPreview() {
  return (
    <div
      aria-hidden
      className="w-full rounded-xl border border-[#3d3d3d] bg-[#202020]/90 p-5 shadow-[0_30px_80px_-30px_rgba(19,156,115,0.45)] backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <NavIcon name="ranking" size={16} className="text-emerald-400" />
          Ranking de suspeitos
        </div>
        <span className="rounded-full bg-[#139C73]/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          Atualizado
        </span>
      </div>

      <ul className="mt-5 space-y-4">
        {PREVIEW.map(({ initials, name, value, color }, i) => (
          <li key={name} className="flex items-center gap-3">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: `${color}22`, color }}
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-white/80">
                  <span className="mr-1.5 text-white/40">#{i + 1}</span>
                  {name}
                </span>
                <span className="font-semibold" style={{ color }}>{value}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#333]">
                <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-[#333] pt-4 text-xs">
        <span className="text-white/50">Incerteza do caso</span>
        <span className="font-semibold text-[#E8CF75]">38%</span>
      </div>
    </div>
  );
}

type Props = {
  title: string;
  subtitle?: ReactNode;
  /** Ícone em destaque acima do título (telas de recuperação e confirmação) */
  icon?: ReactNode;
  /** Variação de cor do ícone em destaque */
  iconTone?: "brand" | "danger";
  children: ReactNode;
  /** Texto abaixo do cartão (ex.: "Não tem conta? Cadastre-se") */
  footer?: ReactNode;
};

/**
 * Moldura das telas públicas (login, cadastro e recuperação de senha).
 * Desktop: painel da marca à esquerda e formulário em cartão à direita.
 * Celular/tablet: só o logo e o cartão, ocupando a largura disponível.
 */
export default function AuthLayout({ title, subtitle, icon, iconTone = "brand", children, footer }: Props) {
  return (
    <div className="min-h-dvh bg-[#1A1A1A] text-white lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* ── Painel da marca (desktop) ── */}
      <aside className="relative hidden overflow-hidden border-r border-[#2a2a2a] bg-[#141414] lg:flex lg:flex-col">
        {/* Fundo liso com brilho verde suave (a grade pontilhada fica só no lado do formulário) */}
        <div className="pointer-events-none absolute -left-32 top-1/3 size-[520px] rounded-full bg-[#139C73]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 size-[380px] rounded-full bg-[#136D52]/25 blur-[110px]" />

        {/* Tudo numa coluna centralizada de largura fixa: o logo, o texto, a prévia e as
            etiquetas ficam alinhados entre si e próximos do centro da tela, sem vão gigante
            até o formulário em monitores largos. */}
        {/* Logo fixo no canto superior esquerdo da tela */}
        <img src={logoHorizonImg} alt="Priora" className="absolute left-8 top-8 z-20 h-8 w-auto xl:left-10 xl:top-10" />

        <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-10 py-10 2xl:max-w-xl 2xl:px-0">
          <div className="flex flex-1 flex-col justify-center gap-8 py-16 2xl:gap-10">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl 2xl:text-[2.75rem]">
              Investigação criminal guiada por <span className="text-[#18C18A]">evidências</span>.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60 2xl:text-base">
              O Priora organiza o caso, calcula a probabilidade de cada suspeito e indica o próximo
              passo da investigação.
            </p>
          </div>

          <RankingPreview />

          <ul className="flex flex-wrap gap-2">
            {FEATURES.map(({ icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-[#3d3d3d] bg-[#1E1E1E]/80 px-3 py-1.5 text-xs text-white/70"
              >
                <NavIcon name={icon} size={14} className="text-emerald-400" />
                {label}
              </li>
            ))}
          </ul>
          </div>
        </div>
      </aside>

      {/* ── Formulário ── */}
      <main className="dark-circuit-wrapper flex min-h-dvh items-center justify-center px-4 py-10 sm:px-6">
        <div className="dark-circuit-background" />

        <div className="relative z-10 w-full max-w-[420px] 2xl:max-w-[460px]">
          <img src={logoHorizonImg} alt="Priora" className="mx-auto mb-8 h-9 w-auto lg:hidden" />

          <section className="rounded-xl border border-[#3d3d3d] bg-[#242424]/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-sm">
            <header className="px-6 pt-7 sm:px-8">
              {icon && (
                <span
                  className={`mb-5 flex size-12 items-center justify-center rounded-full border ${
                    iconTone === "danger"
                      ? "border-red-500/40 bg-red-500/10 text-red-400"
                      : "border-[#139C73]/40 bg-[#139C73]/15 text-emerald-400"
                  }`}
                  aria-hidden
                >
                  {icon}
                </span>
              )}
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h1>
              {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-white/60">{subtitle}</p>}
            </header>

            <div className="px-6 pb-7 pt-6 sm:px-8">{children}</div>
          </section>

          {footer && <div className="mt-6 text-center text-sm text-white/65">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

/** Link de texto padrão das telas públicas. */
export const AUTH_LINK =
  "font-medium text-[#18C18A] underline-offset-4 transition-colors hover:text-[#4fd8a9] hover:underline focus-visible:outline-2 focus-visible:outline-[#139C73] rounded-sm";
