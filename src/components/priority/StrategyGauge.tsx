type Props = {
  importancia: number;
  resumo: string;
};

export default function StrategyGauge({ importancia, resumo }: Props) {
  // 0% = -90°, 50% = 0°, 100% = 90°
  const angle = (importancia / 100) * 180 - 90;

  return (
    <div>
      <p className="text-sm text-white/65 leading-relaxed">{resumo}</p>

      <div className="flex justify-center mt-4">
        <div className="relative h-[130px] w-[220px]">
          <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full">
            <path d="M20 100 A80 80 0 0 1 70 30" fill="none" stroke="#10B981" strokeWidth="18" />
            <path d="M70 30 A80 80 0 0 1 130 30" fill="none" stroke="#FDE68A" strokeWidth="18" />
            <path d="M130 30 A80 80 0 0 1 180 100" fill="none" stroke="#FF6253" strokeWidth="18" />
          </svg>

          <div
            className="absolute bottom-[22px] left-1/2 h-[60px] w-[4px] origin-bottom -translate-x-1/2 rounded-full bg-white shadow-lg transition-transform duration-700"
            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
          />
          <div className="absolute bottom-[12px] left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-white border border-gray-300" />

          <div className="absolute left-1/2 top-[68px] -translate-x-1/2 text-center">
            <div className="text-sm text-gray-400">Importância: {importancia}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
