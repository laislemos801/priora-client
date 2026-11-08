import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { loginUser } from "@/routes/user";
import AuthLayout, { AUTH_LINK } from "@/components/auth/AuthLayout";
import { AuthField, PasswordField } from "@/components/auth/AuthField";
import SubmitButton from "@/components/auth/SubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import { isValid, validateEmail, validateRequired } from "@/components/auth/validation";

type LoginState = { registered?: boolean; passwordReset?: boolean; email?: string } | null;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginState;

  const [email, setEmail] = useState(state?.email ?? "");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {
      email: validateEmail(email),
      senha: validateRequired(senha, "Informe sua senha."),
    };
    setErrors(next);
    return isValid(next);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await loginUser({ email: email.trim(), senha });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/mycases");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Não foi possível entrar.");
      setSubmitting(false);
    }
  }

  const notice = state?.registered
    ? "Conta criada! Entre com seu e-mail e senha."
    : state?.passwordReset
      ? "Senha redefinida. Entre com a nova senha."
      : null;

  return (
    <AuthLayout
      title="Entrar no Priora"
      subtitle="Acesse seus casos e continue a investigação."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link to="/register" className={AUTH_LINK}>
            Cadastre-se
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {notice && !serverError && <FormAlert variant="success">{notice}</FormAlert>}
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
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          onBlur={() => email && setErrors((p) => ({ ...p, email: validateEmail(email) }))}
          error={errors.email}
          disabled={submitting}
          autoFocus={!state?.email}
        />

        <PasswordField
          label="Senha"
          name="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          icon={<FiLock size={16} />}
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            if (errors.senha) setErrors((p) => ({ ...p, senha: undefined }));
          }}
          error={errors.senha}
          disabled={submitting}
          autoFocus={!!state?.email}
          labelAction={
            <Link to="/recover" className={`${AUTH_LINK} text-xs`}>
              Esqueceu a senha?
            </Link>
          }
        />

        <SubmitButton loading={submitting} loadingText="Entrando..." className="mt-1">
          Entrar
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
