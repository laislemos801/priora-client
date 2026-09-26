import PrimaryButton from "@/components/ui/PrimaryButton";
import { ShieldPlus } from "lucide-react";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center text-center">
      <ShieldPlus size={140} className="text-white/10" />

      <h2 className="mt-6 text-3xl font-medium text-white/60">
        Ainda não há casos cadastrados.
      </h2>

      <p className="mt-2 text-md text-white/35">
        Crie um caso para começar a investigar.
      </p>

      <div className="mt-8">
        <PrimaryButton onClick={onCreate}>
          Criar Novo Caso
        </PrimaryButton>
      </div>
    </div>
  );
}