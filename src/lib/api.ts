export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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
export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  return fetch(url, {
    ...init,
    headers: withAuthHeaders(init.headers),
  });
}
