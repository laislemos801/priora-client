import ArcGauge from "@/components/ui/ArcGauge";
import InfoTip from "@/components/ui/InfoTip";

type Props = {
  incerteza: number | null;
  className?: string;
};

export default function UncertaintyCard({ incerteza, className = "" }: Props) {
  return (
    <section className={`flex flex-col rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-5 ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-medium text-white">Nível de incerteza</h2>

        <InfoTip label="Como funciona a incerteza do caso">
          <p className="mb-1 font-semibold text-white">Incerteza do caso</p>
          <p>
            Mostra o quanto o sistema ainda tem de dúvida sobre quem é o principal suspeito do caso.
          </p>
          <p className="mt-2">
            <strong className="text-white">Fórmula:</strong> Incerteza = 100 − P(H|E), em que P(H|E)
            é a probabilidade do suspeito com maior probabilidade no ranking.
          </p>
          <dl className="mt-2 space-y-1.5 border-t border-[#3a3a3a] pt-2">
            <div>
              <dt className="font-semibold text-white">Perto de 0%</dt>
              <dd>Um suspeito já se destaca com folga dos demais.</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Valores altos</dt>
              <dd>Nenhum suspeito se destaca ainda; as evidências não separam os suspeitos.</dd>
            </div>
          </dl>
        </InfoTip>
      </div>

      <div className="flex flex-1 items-center justify-center">
        {incerteza != null ? (
          <ArcGauge value={incerteza} label="Incerteza do caso" decimals={1} />
        ) : (
          <p className="text-sm text-white/65">Incerteza ainda não calculada.</p>
        )}
      </div>
    </section>
  );
}
