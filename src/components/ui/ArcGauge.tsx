type Props = {
  /** Valor de 0 a 100 (posição do ponteiro). */
  value: number;
  /** Texto abaixo do valor (ex.: "Importância", "Incerteza do caso"). */
  label: string;
  /** Casas decimais do valor exibido. */
  decimals?: number;
};

/**
 * Medidor em arco (verde → amarelo → vermelho) com o valor em destaque
 * embaixo. Usado na Priorização (importância) e no painel do caso (incerteza),
 * para os dois ficarem iguais.
 */
export default function ArcGauge({ value, label, decimals = 0 }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  // 0% = -90°, 50% = 0°, 100% = 90°
  const angle = (clamped / 100) * 180 - 90;

  return (
    <div>
      <div className="flex justify-center">
        <div className="relative h-[130px] w-[220px]">
          <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M20 100 A80 80 0 0 1 70 30" fill="none" stroke="#10B981" strokeWidth="18" />
            <path d="M70 30 A80 80 0 0 1 130 30" fill="none" stroke="#FDE68A" strokeWidth="18" />
            <path d="M130 30 A80 80 0 0 1 180 100" fill="none" stroke="#FF6253" strokeWidth="18" />
          </svg>

          <div
            className="absolute bottom-[22px] left-1/2 h-[60px] w-[4px] origin-bottom -translate-x-1/2 rounded-full bg-white shadow-lg transition-transform duration-700"
            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
          />
          <div className="absolute bottom-[12px] left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border border-gray-300 bg-white" />
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-3xl font-semibold leading-none text-white">
          {clamped.toFixed(decimals)}%
        </p>
        <p className="mt-1 text-sm text-white/65">{label}</p>
      </div>
    </div>
  );
}
