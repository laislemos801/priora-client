import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";

/** Mesmo padrão de rótulo e campo usado no restante do app (Contato, modais, Perfil). */
export const FIELD_LABEL =
  "mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-[#8f8f8f]";

const FIELD_BOX =
  "flex items-center gap-2 rounded-md border bg-[#1E1E1E] px-3 transition-colors focus-within:border-[#139C73] focus-within:ring-2 focus-within:ring-[#139C73]/20";

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  /** Mensagem de erro; quando presente o campo fica vermelho e é anunciado ao leitor de tela */
  error?: string;
  /** Texto de ajuda abaixo do campo (some quando há erro) */
  hint?: ReactNode;
  /** Ícone à esquerda */
  icon?: ReactNode;
  /** Conteúdo à direita (ex.: botão de mostrar senha) */
  trailing?: ReactNode;
  /** Ação ao lado do rótulo (ex.: link "Esqueceu a senha?") */
  labelAction?: ReactNode;
};

export const AuthField = forwardRef<HTMLInputElement, FieldProps>(function AuthField(
  { label, error, hint, icon, trailing, labelAction, id, className, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-msg`;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={inputId} className={FIELD_LABEL}>
          {label}
        </label>
        {labelAction}
      </div>

      <div
        className={[
          FIELD_BOX,
          error
            ? "border-red-500/70 focus-within:border-red-400 focus-within:ring-red-500/20"
            : "border-[#434343] hover:border-[#606060]",
          disabled ? "opacity-60" : "",
        ].join(" ")}
      >
        {icon && <span className="shrink-0 text-[#8f8f8f]">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className="h-11 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6b6b6b] disabled:cursor-not-allowed"
          {...rest}
        />
        {trailing}
      </div>

      {error ? (
        <p id={messageId} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs text-red-400">
          <FiAlertCircle className="mt-px shrink-0" size={13} />
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-xs text-white/50">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

type PasswordProps = Omit<FieldProps, "type" | "trailing">;

/** Campo de senha com botão acessível de mostrar/ocultar. */
export const PasswordField = forwardRef<HTMLInputElement, PasswordProps>(function PasswordField(
  props,
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField
      ref={ref}
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={props.disabled}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          className="-mr-1 shrink-0 rounded p-1.5 text-[#8f8f8f] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#139C73]"
        >
          {visible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      }
    />
  );
});
