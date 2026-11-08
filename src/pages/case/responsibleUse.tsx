import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
  FiAlertTriangle,
  FiCpu,
  FiEye,
  FiLock,
  FiSliders,
  FiTarget,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import NavIcon from "@/components/ui/NavIcon";
import { PAGE_CARD_FILL } from "@/components/ui/EmptyState";

type Props = {
  onBack?: () => void;
  /** Leva à página de Contato (rota do caso ou global, conforme o contexto). */
  onContact?: () => void;
};

type Topic = {
  icon: ReactNode;
  title: string;
  body: ReactNode;
};

const TOPICS: Topic[] = [
  {
    icon: <FiAlertTriangle />,
    title: "Apoio à decisão, não prova",
    body: (
      <>
        As probabilidades, os rankings e as sugestões organizam hipóteses a partir dos dados
        cadastrados. Eles <strong>não são prova</strong>, laudo ou conclusão sobre a culpa de
        alguém, e não substituem a análise do investigador nem a decisão das autoridades
        competentes.
      </>
    ),
  },
  {
    icon: <FiSliders />,
    title: "Quem define os pesos é o investigador",
    body: (
      <>
        O peso de cada evidência (confiabilidade) e o peso de cada vínculo com um suspeito são
        atribuídos por quem cadastra. O sistema não verifica se foram bem atribuídos: pesos
        diferentes produzem rankings diferentes. Os pesos nunca são 0% nem 100%.
      </>
    ),
  },
  {
    icon: <FiTarget />,
    title: "O sistema não detecta culpa",
    body: (
      <>
        Não há reconhecimento de pessoas, biometria nem julgamento de culpa. O Priora apenas
        recalcula probabilidades a partir do que foi informado, partindo de uma distribuição
        uniforme entre os suspeitos, em respeito à presunção de inocência.
      </>
    ),
  },
  {
    icon: <FiUserCheck />,
    title: "Supervisão humana é indispensável",
    body: (
      <>
        Todo ranking, perfil ou sugestão deve ser revisto por uma pessoa habilitada antes de
        orientar qualquer diligência. O histórico registra quem alterou cada informação, mas não
        substitui a cadeia de custódia formal das evidências (arts. 158-A a 158-F do CPP).
      </>
    ),
  },
  {
    icon: <FiCpu />,
    title: "Limites do modelo",
    body: (
      <>
        O cálculo supõe que as evidências são independentes entre si (premissa do Naive Bayes) e
        depende da qualidade e da completude dos dados inseridos. O modelo ainda{" "}
        <strong>não foi validado empiricamente</strong> com casos reais.
      </>
    ),
  },
  {
    icon: <FiEye />,
    title: "Perfilamento e antecedentes",
    body: (
      <>
        O perfil criminal (cinco dimensões, inspiradas em Canter, 2000) é uma estimativa
        heurística preenchida pelo investigador. Ele e os antecedentes do suspeito{" "}
        <strong>não entram no cálculo de probabilidade</strong>: servem de apoio à comparação e
        ao raciocínio.
      </>
    ),
  },
  {
    icon: <FiSliders />,
    title: "Sugestões de ação",
    body: (
      <>
        A recompensa de cada sugestão é uma estimativa do ganho de informação, e o esforço é uma
        estimativa operacional, não probabilística. Os limites usados em cada tipo de sugestão
        são escolhas de projeto, ainda não calibradas com a rotina de investigadores. O ícone de
        informação de cada sugestão explica o seu critério.
      </>
    ),
  },
  {
    icon: <FiUsers />,
    title: "Acesso e sigilo",
    body: (
      <>
        Os dados de uma investigação são sigilosos. O acesso é controlado por papéis em cada caso
        (Responsável, Editor e Leitor): compartilhe um caso apenas com quem precisa dele para
        trabalhar e remova o acesso quando deixar de ser necessário.
      </>
    ),
  },
];

export function ResponsibleUse({ onBack, onContact }: Props) {
  return (
    <div>
      <div className="px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className={`rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>
          <header className="flex items-center gap-2.5 border-b border-[#575757] px-4 py-4 md:px-6">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Voltar"
                className="-ml-2 mr-1 rounded-full p-2 text-white/65 transition-colors hover:bg-[#363636] hover:text-white"
              >
                <IoIosArrowBack size={16} />
              </button>
            )}
            <NavIcon name="responsible" className="text-emerald-400" />
            <h1 className="text-lg font-semibold text-slate-100">Uso responsável e limitações</h1>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <p className="max-w-3xl text-sm leading-relaxed text-white/70">
              O Priora é uma ferramenta de <strong className="text-white">apoio à decisão</strong>{" "}
              para investigações com vários suspeitos e muitas evidências. Antes de usar os
              resultados, leia o que o sistema faz, o que ele não faz e quais são os seus limites.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {TOPICS.map((topic) => (
                <section
                  key={topic.title}
                  className="rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-5"
                >
                  <h2 className="flex items-center gap-2.5 text-base font-medium text-white">
                    <span className="text-emerald-400" aria-hidden="true">
                      {topic.icon}
                    </span>
                    {topic.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{topic.body}</p>
                </section>
              ))}
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2.5 text-sm text-white/70">
                <FiLock className="mt-0.5 flex-shrink-0 text-emerald-400" aria-hidden="true" />
                Ficou com dúvida sobre algum resultado ou limite? Fale com a equipe.
              </p>
              {onContact && (
                <button
                  type="button"
                  onClick={onContact}
                  className="self-start rounded-md border border-[#139C73]/60 px-4 py-2 text-sm text-[#139C73] transition-colors hover:bg-[#139C73]/10 sm:self-auto"
                >
                  Ir para Contato
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Rota dentro do caso (com o menu lateral). */
export default function CaseResponsibleUse() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ResponsibleUse onContact={() => navigate(`/case/${id}/help`)} />;
}
