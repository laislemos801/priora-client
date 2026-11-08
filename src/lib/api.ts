// No aplicativo desktop (Electron), o endereço da API vem do próprio aplicativo
// (variável PRIORA_API_URL ou config.json); no navegador, do build (VITE_API_URL).
const desktopApiUrl = (window as unknown as { priora?: { apiUrl?: string } }).priora?.apiUrl;

export const API_URL = desktopApiUrl || import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function withAuthHeaders(extra?: HeadersInit): HeadersInit {
  const token = localStorage.getItem("token");

  return {
    ...(extra || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Wrapper de fetch que aponta para a API do Priora e injeta
 * automaticamente o header Authorization com o token salvo no login.
 * `path` pode ser relativo ("/cases/...") ou uma URL absoluta.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const hadToken = !!localStorage.getItem("token");

  const response = await fetch(url, {
    ...init,
    headers: withAuthHeaders(init.headers),
  });

  // Sessão expirada (o token dura 12 h): limpa a sessão e volta ao login.
  // Não se aplica ao próprio login, onde 401 significa senha errada.
  if (response.status === 401 && hadToken && !path.includes("/users/login")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }

  return response;
}
