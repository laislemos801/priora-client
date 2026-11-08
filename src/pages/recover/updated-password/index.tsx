import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import AuthLayout from "@/components/auth/AuthLayout";

/** Passo final da recuperação: senha redefinida com sucesso. */
export default function UpdatedPassword() {
  return (
    <AuthLayout
      icon={<FiCheck size={22} />}
      title="Senha redefinida"
      subtitle="Tudo certo! Sua senha foi alterada. Use a nova senha para entrar no Priora."
    >
      <Link
        to="/login"
        state={{ passwordReset: true }}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-linear-to-r from-[#139C73] to-[#136D52] text-sm font-semibold text-white shadow-[0_6px_20px_-8px_rgba(19,156,115,0.6)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18C18A]"
      >
        Ir para o login
      </Link>
    </AuthLayout>
  );
}
