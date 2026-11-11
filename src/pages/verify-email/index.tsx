import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";
import AuthLayout, { AUTH_LINK } from "@/components/auth/AuthLayout";
import { verifyEmail } from "@/routes/user";

type Status = "loading" | "ok" | "error";

const BUTTON =
  "inline-flex h-11 w-full items-center justify-center rounded-md bg-linear-to-r from-[#139C73] to-[#136D52] text-sm font-semibold text-white shadow-[0_6px_20px_-8px_rgba(19,156,115,0.6)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18C18A]";

/** Destino do link enviado por e-mail no cadastro: confirma a conta e leva ao login. */
export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : "Link de confirmação incompleto. Abra o link completo que enviamos por e-mail.",
  );
  // O token é de uso único: sem esta trava, o StrictMode chamaria a API duas vezes
  // e a segunda resposta (inválido) sobrescreveria o sucesso.
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    verifyEmail(token)
      .then(() => setStatus("ok"))
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Não foi possível confirmar o e-mail.");
        setStatus("error");
      });
  }, [token]);

  if (status === "loading") {
    return (
      <AuthLayout
        icon={<FiLoader size={22} className="animate-spin" />}
        title="Confirmando seu e-mail"
        subtitle="Só um instante..."
      >
        <span className="sr-only" role="status">
          Confirmando
        </span>
      </AuthLayout>
    );
  }

  if (status === "ok") {
    return (
      <AuthLayout
        icon={<FiCheck size={22} />}
        title="E-mail confirmado"
        subtitle="Tudo certo! Sua conta está ativa. Entre no Priora com seu e-mail e senha."
      >
        <Link to="/login" className={BUTTON}>
          Ir para o login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={<FiX size={22} />}
      title="Não foi possível confirmar"
      subtitle={message}
      footer={
        <>
          Já confirmou?{" "}
          <Link to="/login" className={AUTH_LINK}>
            Entrar
          </Link>
        </>
      }
    >
      <Link to="/login" className={BUTTON}>
        Voltar ao login para pedir um novo link
      </Link>
    </AuthLayout>
  );
}
