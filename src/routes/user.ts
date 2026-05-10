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
  const response = await fetch("http://127.0.0.1:8000/users/", {
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
  const response = await fetch(
    "http://127.0.0.1:8000/users/login",
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