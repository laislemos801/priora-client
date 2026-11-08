/** Regras de validação compartilhadas pelas telas de autenticação e perfil. */

export const PASSWORD_MIN = 8;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Informe seu e-mail.";
  if (!EMAIL_RE.test(v)) return "Informe um e-mail válido, como nome@exemplo.com.";
  return undefined;
}

export function validateRequired(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message;
}

export function validateNewPassword(value: string): string | undefined {
  if (!value) return "Crie uma senha.";
  if (value.length < PASSWORD_MIN) return `A senha precisa ter pelo menos ${PASSWORD_MIN} caracteres.`;
  return undefined;
}

export function validateConfirm(password: string, confirm: string): string | undefined {
  if (!confirm) return "Confirme a senha.";
  if (password !== confirm) return "As senhas não coincidem.";
  return undefined;
}

/** True quando o objeto de erros não tem nenhuma mensagem. */
export function isValid(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).every((e) => !e);
}
