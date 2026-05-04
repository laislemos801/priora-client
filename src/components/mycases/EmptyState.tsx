import { MdOutlineAddModerator } from "react-icons/md";
import PrimaryButton from "../ui/PrimaryButton";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center gap-3">

      {/* Ícone */}
      <div className="w-24 h-24 rounded-full bg-[#2a2a2a] flex items-center justify-center">
        <MdOutlineAddModerator className="text-[#A6A6A6] text-5xl" />
      </div>

      {/* Texto */}
      <h3 className="text-[#A6A6A6] text-lg md:text-2xl font-medium">
        Ainda não há casos cadastrados.
      </h3>

      <p className="text-[#666] text-sm max-w-md">
        Crie um caso para começar a investigar.
      </p>

      {/* Botão */}
      <PrimaryButton onClick={onCreate}>
        Criar Novo Caso
      </PrimaryButton>

    </div>
  );
}