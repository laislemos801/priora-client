import type { ReactNode } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";

/**
 * Cartão de uma página (ranking, evidências, perfilamento...) que cresce até o
 * fim da tela. Com isso o estado vazio ocupa toda a área, em vez de o cartão
 * terminar no meio da tela. 6.25rem = barra do topo (4rem) + margens da página.
 */
export const PAGE_CARD_FILL = "flex min-h-[calc(100vh-6.25rem)] flex-col";

/** Área de conteúdo do cartão: ocupa o espaço que sobra abaixo do cabeçalho. */
export const PAGE_BODY_FILL = "flex flex-1 flex-col";

type EmptyStateProps = {
  /** Ícone (SVG). O tamanho é padronizado aqui. */
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
};

/**
 * Estado vazio padrão de todas as abas: bloco centralizado que ocupa toda a
 * área disponível (precisa estar dentro de um contêiner flex em coluna, como
 * PAGE_CARD_FILL / PAGE_BODY_FILL).
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={`flex min-h-[320px] w-full flex-1 select-none flex-col items-center justify-center px-6 py-16 text-center ${className}`}
    >
      <div aria-hidden="true" className="text-white/10 [&>svg]:size-24">
        {icon}
      </div>

      <h2 className="mt-6 text-2xl font-medium text-white/60">{title}</h2>

      {description && (
        <p className="mt-2 max-w-xl text-base text-white/35">{description}</p>
      )}

      {action && (
        <div className="mt-8">
          <PrimaryButton onClick={action.onClick}>{action.label}</PrimaryButton>
        </div>
      )}
    </div>
  );
}
