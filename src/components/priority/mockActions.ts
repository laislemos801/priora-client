import type { InvestigativeAction } from "./types";

/**
 * Dados de demonstração para a tela de Priorização de Ações (RF11).
 *
 * A documentação do Priora lista esta funcionalidade como trabalho
 * futuro ("priorização de ações investigativas com base em ganho de
 * informação"), sem uma fórmula de cálculo definida. Por isso, por
 * enquanto, o "ganho de informação" e a posição na matriz esforço x
 * recompensa são valores ilustrativos definidos manualmente — não vêm
 * de um cálculo real sobre o caso, ao contrário do ranking bayesiano.
 */
export const MOCK_ACTIONS: InvestigativeAction[] = [
  {
    id: "a1",
    titulo: "Solicitar quebra de sigilo bancário - Suspeito principal",
    status: "Em progresso",
    impacto: "Alto",
    metricaLabel: "Ganho de informações estimados",
    metricaValor: 45,
    esforco: 25,
    recompensa: 80,
  },
  {
    id: "a2",
    titulo: "Coletar depoimento e testemunha-chave #4",
    status: "Em aprovação",
    impacto: "Baixo",
    metricaLabel: "Influência predita - score na rede bayesiana",
    metricaValor: 4.5,
    esforco: 75,
    recompensa: 78,
  },
  {
    id: "a3",
    titulo: "Processar nova evidência de DNA de cena de crime",
    status: "Em progresso",
    impacto: "Baixo",
    metricaLabel: "Influência predita - score na rede bayesiana",
    metricaValor: 2.7,
    esforco: 58,
    recompensa: 48,
  },
  {
    id: "a4",
    titulo: "Verificar álibi de suspeito secundário",
    status: "Em progresso",
    impacto: "Médio",
    metricaLabel: "Influência predita - score na rede bayesiana",
    metricaValor: 0.8,
    esforco: 78,
    recompensa: 18,
  },
  {
    id: "a5",
    titulo: "Verificar análise de DNA coletada na cena do crime",
    status: "Em progresso",
    impacto: "Alto",
    metricaLabel: "Influência predita - score na rede bayesiana",
    metricaValor: 0.8,
    esforco: 22,
    recompensa: 15,
  },
];
