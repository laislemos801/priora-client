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

export async function registerUser(userData: RegisterUserData) {
  const response = await apiFetch("/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erro ao cadastrar");
  }

  return data;
}


export async function loginUser(data: LoginData) {
  const response = await apiFetch(
    "/users/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Erro ao logar");
  }

  return result;
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const response = await apiFetch(
    `/users/check-email?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) throw new Error("Erro ao verificar email");

  const data = await response.json();
  return data.exists;
}