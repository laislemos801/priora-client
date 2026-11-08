import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft, FiLock } from "react-icons/fi";
import { ApiError, resetPassword } from "@/routes/user";
import AuthLayout, { AUTH_LINK } from "@/components/auth/AuthLayout";
import { PasswordField } from "@/components/auth/AuthField";
import SubmitButton from "@/components/auth/SubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import PasswordChecklist from "@/components/auth/PasswordChecklist";
import { isValid, validateConfirm, validateNewPassword } from "@/components/auth/validation";

const BACK_TO_LOGIN = (
  <Link to="/login" className={`${AUTH_LINK} inline-flex items-center gap-1.5`}>
    <FiArrowLeft size={14} />
    Voltar para o login
  </Link>
);

/** Passo 3 da recuperação: definir a nova senha a partir do link do e-mail. */
export default function NewPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [errors, setErrors] = useState<{ senha?: string; confirmSenha?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [linkExpired, setLinkExpired] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sem token na URL (link incompleto) ou token recusado pelo servidor
  if (!token || linkExpired) {
    return (
      <AuthLayout
        icon={<FiAlertTriangle size={20} />}
        iconTone="danger"
        title="Link inválido ou expirado"
        subtitle="Este link de redefinição não funciona mais. Por segurança, cada link vale por pouco tempo e só pode ser usado uma vez."
        footer={BACK_TO_LOGIN}
      >
        <Link
          to="/recover"
          className="inline-flex h-11 w-full items-center justify-center rounded-md bg-linear-to-r from-[#139C73] to-[#136D52] text-sm font-semibold text-white transition hover:brightness-110"
        >
          Solicitar novo link
        </Link>
      </AuthLayout>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    const next = {
      senha: validateNewPassword(senha),
      confirmSenha: validateConfirm(senha, confirmSenha),
    };
    setErrors(next);
    if (!isValid(next)) return;

    setSubmitting(true);
    try {
      await resetPassword(token!, senha);
      navigate("/recover/updated-password");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setLinkExpired(true);
      } else {
        setServerError(err instanceof Error ? err.message : "Não foi possível redefinir a senha.");
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      icon={<FiLock size={20} />}
      title="Crie uma nova senha"
      subtitle="Escolha uma senha que você não use em outros sites."
      footer={BACK_TO_LOGIN}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {serverError && <FormAlert>{serverError}</FormAlert>}

        <PasswordField
          label="Nova senha"
          name="new-password"
          autoComplete="new-password"
          placeholder="Crie uma senha"
          icon={<FiLock size={16} />}
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            if (errors.senha) setErrors((p) => ({ ...p, senha: undefined }));
          }}
          error={errors.senha}
          disabled={submitting}
          autoFocus
        />

        <PasswordField
          label="Confirmar nova senha"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          icon={<FiLock size={16} />}
          value={confirmSenha}
          onChange={(e) => {
            setConfirmSenha(e.target.value);
            if (errors.confirmSenha) setErrors((p) => ({ ...p, confirmSenha: undefined }));
          }}
          error={errors.confirmSenha}
          disabled={submitting}
        />

        <PasswordChecklist password={senha} confirm={confirmSenha} />

        <SubmitButton loading={submitting} loadingText="Salvando...">
          Redefinir senha
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
