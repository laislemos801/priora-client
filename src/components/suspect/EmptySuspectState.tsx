import PrimaryButton from "@/components/ui/PrimaryButton";
import { ShieldPlus } from "lucide-react";

type Props = {
  onCreate: () => void;
};

export default function EmptySuspectState({
  onCreate,
}: Props) {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center text-center">
      <ShieldPlus
        size={120}
        className="text-white/10"
      />

      <h2 className="mt-6 text-4xl font-medium text-white/60">
        Adicione um novo suspeito.
      </h2>

      <p className="mt-2 text-lg text-white/35">
        E comece a priorizar suas investigações.
      </p>

      <div className="mt-8">
        <PrimaryButton onClick={onCreate}>
          Adicionar Suspeito
        </PrimaryButton>
      </div>
    </div>
  );
}