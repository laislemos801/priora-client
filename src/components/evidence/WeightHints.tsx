import InfoTip from "@/components/ui/InfoTip";

/**
 * Explicação dos dois pesos da evidência (seção 16 da documentação): o que cada um
 * representa e o que significam valores perto de 0 e perto de 1.
 */

function Scale({ low, high }: { low: string; high: string }) {
  return (
    <dl className="mt-2 space-y-1.5 border-t border-[#3a3a3a] pt-2">
      <div>
        <dt className="font-semibold text-white">Perto de 0</dt>
        <dd>{low}</dd>
      </div>
      <div>
        <dt className="font-semibold text-white">Perto de 1</dt>
        <dd>{high}</dd>
      </div>
    </dl>
  );
}

export function EvidenceWeightHint() {
  return (
    <InfoTip label="Peso da evidência" size={14}>
      <p className="mb-1 font-semibold text-white">Peso da evidência (confiabilidade)</p>
      <p>
        Quão confiável é a evidência em si: a origem, o método de coleta e o risco de contaminação
        ou falsificação. É um valor só para a evidência, igual para todos os suspeitos ligados a ela.
      </p>
      <Scale
        low="Pouco confiável: origem duvidosa, coleta falha ou indício de adulteração."
        high="Muito confiável: origem e coleta bem documentadas, sem indício de adulteração."
      />
      <p className="mt-2 text-white/60">
        Nunca 0 nem 1: nenhuma evidência é descartada de saída nem é infalível.
      </p>
    </InfoTip>
  );
}

export function LinkWeightHint() {
  return (
    <InfoTip label="Peso do vínculo" size={13}>
      <p className="mb-1 font-semibold text-white">Peso do vínculo</p>
      <p>
        Força da ligação entre a evidência e <strong>este</strong> suspeito: o quanto ela indica
        participação direta no crime. Cada suspeito ligado à evidência recebe o seu próprio valor.
      </p>
      <Scale
        low="Ligação fraca ou circunstancial: a evidência é compatível com muitas pessoas."
        high="Ligação forte: dificilmente se explica sem a participação do suspeito."
      />
      <p className="mt-2 text-white/60">
        Nunca 0 nem 1. Se a evidência liga vários suspeitos, o seu impacto se divide entre eles.
      </p>
    </InfoTip>
  );
}
