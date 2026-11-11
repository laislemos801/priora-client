import { apiFetch } from "@/lib/api";

interface RegisterUserData {
  email: string;
  primeiroNome: string;
  sobrenome: string;
  senha: string;
}

interface LoginData {
  email: string;
  senha: string;
}

/**
 * Extrai uma mensagem legível da resposta de erro da API.
 * O FastAPI devolve `detail` como texto (HTTPException) ou como lista de
 * erros de validação (422); nos dois casos o usuário vê uma frase.
 */
export function apiErrorMessage(data: unknown, fallback: string): string {
  const detail = (data as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (detail && typeof detail === "object" && !Array.isArray(detail)) {
    const message = (detail as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: string; loc?: unknown[] };
    const field = Array.isArray(first?.loc) ? String(first.loc[first.loc.length - 1]) : "";
    if (field === "email") return "Informe um e-mail válido.";
    if (typeof first?.msg === "string") return first.msg;
  }
  return fallback;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/** Erro de rede (servidor fora do ar, sem internet) com texto amigável. */
function networkError(): Error {
  return new Error("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
}

async function request(path: string, init: RequestInit, fallback: string) {
  let response: Response;
  try {
    response = await apiFetch(path, init);
  } catch {
    throw networkError();
  }

  const data = await readJson(response);
  if (!response.ok) {
    throw new ApiError(apiErrorMessage(data, fallback), response.status, errorCode(data));
  }
  return data;
}

export class ApiError extends Error {
  status: number;
  /** Código estável enviado pela API em alguns erros (ex.: "email_nao_confirmado"). */
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function errorCode(data: unknown): string | undefined {
  const detail = (data as { detail?: unknown } | null)?.detail;
  const code = detail && typeof detail === "object" ? (detail as { code?: unknown }).code : undefined;
  return typeof code === "string" ? code : undefined;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

export interface RegisterResult {
  /** A conta só entra depois de confirmar o e-mail. */
  verificacaoNecessaria?: boolean;
  /** O e-mail com o link saiu; se false, a pessoa pode pedir o reenvio. */
  emailEnviado?: boolean;
}

export async function registerUser(userData: RegisterUserData) {
  return (await request(
    "/users/",
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(userData) },
    "Não foi possível concluir o cadastro.",
  )) as RegisterResult;
}

/** Confirma o e-mail com o token recebido no link. */
export async function verifyEmail(token: string) {
  return request(
    "/users/verify-email",
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ token }) },
    "Não foi possível confirmar o e-mail.",
  );
}

/** Pede um novo link de confirmação (a resposta é a mesma exista a conta ou não). */
export async function resendVerification(email: string) {
  return request(
    "/users/resend-verification",
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ email }) },
    "Não foi possível reenviar o e-mail.",
  );
}

export async function loginUser(data: LoginData) {
  return (await request(
    "/users/login",
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(data) },
    "Não foi possível entrar. Tente novamente.",
  )) as { token: string; user: unknown };
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const data = (await request(
    `/users/check-email?email=${encodeURIComponent(email)}`,
    {},
    "Não foi possível verificar o e-mail.",
  )) as { exists: boolean };
  return data.exists;
}

/** Envia o e-mail com o link de redefinição de senha. */
export async function requestPasswordReset(email: string) {
  return request(
    "/users/recover",
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ email }) },
    "Não foi possível enviar o e-mail de recuperação.",
  );
}

/** Define a nova senha usando o token recebido por e-mail. */
export async function resetPassword(token: string, novaSenha: string) {
  return request(
    "/users/reset-password",
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ token, novaSenha }) },
    "Não foi possível redefinir a senha.",
  );
}
