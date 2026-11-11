import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { registerUser, checkEmailExists } from "@/routes/user";
import AuthLayout, { AUTH_LINK } from "@/components/auth/AuthLayout";
import { AuthField, PasswordField } from "@/components/auth/AuthField";
import SubmitButton from "@/components/auth/SubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import PasswordChecklist from "@/components/auth/PasswordChecklist";
import {
  isValid,
  validateConfirm,
  validateEmail,
  validateNewPassword,
  validateRequired,
} from "@/components/auth/validation";

type Form = {
  primeiroNome: string;
  sobrenome: string;
  email: string;
  senha: string;
  confirmSenha: string;
};
type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = { primeiroNome: "", sobrenome: "", email: "", senha: "", confirmSenha: "" };

function validateForm(f: Form): Errors {
  return {
    primeiroNome: validateRequired(f.primeiroNome, "Informe seu nome."),
    sobrenome: validateRequired(f.sobrenome, "Informe seu sobrenome."),
    email: validateEmail(f.email),
    senha: validateNewPassword(f.senha),
    confirmSenha: validateConfirm(f.senha, f.confirmSenha),
  };
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  function update<K extends keyof Form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (key === "email") setEmailTaken(false);
  }

  /** Valida um campo ao sair dele, mas só depois que a pessoa digitou algo. */
  function validateOnBlur(key: keyof Form) {
    if (!form[key]) return;
    setErrors((e) => ({ ...e, [key]: validateForm(form)[key] }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    const next = validateForm(form);
    setErrors(next);
    if (!isValid(next)) return;

    setSubmitting(true);
    try {
      if (await checkEmailExists(form.email.trim())) {
        setEmailTaken(true);
        setErrors((p) => ({ ...p, email: "Já existe uma conta com este e-mail." }));
        setSubmitting(false);
        return;
      }

      const result = await registerUser({
        email: form.email.trim(),
        primeiroNome: form.primeiroNome.trim(),
        sobrenome: form.sobrenome.trim(),
        senha: form.senha,
      });

      toast.success("Conta criada com sucesso!");
      navigate("/login", {
        state: {
          registered: true,
          email: form.email.trim(),
          // com confirmação exigida, o login avisa para olhar o e-mail e oferece o reenvio
          verifyEmail: !!result?.verificacaoNecessaria,
          emailEnviado: result?.emailEnviado !== false,
        },
      });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Não foi possível concluir o cadastro.");
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Cadastre-se para criar casos e convidar sua equipe."
      footer={
        <>
          Já tem uma conta?{" "}
          <Link to="/login" className={AUTH_LINK}>
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {serverError && <FormAlert>{serverError}</FormAlert>}

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            label="Nome"
            name="given-name"
            autoComplete="given-name"
            placeholder="Ana"
            icon={<FiUser size={16} />}
            value={form.primeiroNome}
            onChange={(e) => update("primeiroNome", e.target.value)}
            error={errors.primeiroNome}
            disabled={submitting}
            autoFocus
          />
          <AuthField
            label="Sobrenome"
            name="family-name"
            autoComplete="family-name"
            placeholder="Silva"
            value={form.sobrenome}
            onChange={(e) => update("sobrenome", e.target.value)}
            error={errors.sobrenome}
            disabled={submitting}
          />
        </div>

        <AuthField
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nome@exemplo.com"
          icon={<FiMail size={16} />}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={() => validateOnBlur("email")}
          error={errors.email}
          disabled={submitting}
        />
        {emailTaken && (
          <p className="-mt-3 text-xs text-white/60">
            É você?{" "}
            <Link to="/login" state={{ email: form.email.trim() }} className={AUTH_LINK}>
              Entrar com este e-mail
            </Link>
          </p>
        )}

        <PasswordField
          label="Senha"
          name="new-password"
          autoComplete="new-password"
          placeholder="Crie uma senha"
          icon={<FiLock size={16} />}
          value={form.senha}
          onChange={(e) => update("senha", e.target.value)}
          error={errors.senha}
          disabled={submitting}
        />

        <PasswordField
          label="Confirmar senha"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          icon={<FiLock size={16} />}
          value={form.confirmSenha}
          onChange={(e) => update("confirmSenha", e.target.value)}
          onBlur={() => validateOnBlur("confirmSenha")}
          error={errors.confirmSenha}
          disabled={submitting}
        />

        <PasswordChecklist password={form.senha} confirm={form.confirmSenha} />

        <SubmitButton loading={submitting} loadingText="Criando conta..." className="mt-1">
          Criar conta
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
