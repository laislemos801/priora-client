import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiKey, FiMail } from "react-icons/fi";
import { ApiError, requestPasswordReset } from "@/routes/user";
import AuthLayout, { AUTH_LINK } from "@/components/auth/AuthLayout";
import { AuthField } from "@/components/auth/AuthField";
import SubmitButton from "@/components/auth/SubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import { validateEmail } from "@/components/auth/validation";

/** Passo 1 da recuperação: pedir o e-mail e enviar o link de redefinição. */
export default function Recover() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = (location.state as { email?: string } | null)?.email ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | undefined>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;

    setSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      navigate("/recover/email-send", { state: { email: email.trim() } });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("Não encontramos uma conta com este e-mail.");
      } else {
        setServerError(err instanceof Error ? err.message : "Não foi possível enviar o e-mail.");
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      icon={<FiKey size={20} />}
      title="Esqueceu a senha?"
      subtitle="Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha."
      footer={
        <Link to="/login" className={`${AUTH_LINK} inline-flex items-center gap-1.5`}>
          <FiArrowLeft size={14} />
          Voltar para o login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {serverError && <FormAlert>{serverError}</FormAlert>}

        <AuthField
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nome@exemplo.com"
          icon={<FiMail size={16} />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(undefined);
          }}
          error={error}
          disabled={submitting}
          autoFocus
        />

        <SubmitButton loading={submitting} loadingText="Enviando link...">
          Enviar link de redefinição
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
