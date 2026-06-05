import { registerUser, checkEmailExists } from "@/routes/user";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import {
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import toast from "react-hot-toast"; 
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [visibilityPassword, setVisibilityPassword] = useState(false);
  const [visibilityPasswordConfirm, setVisibilityPasswordConfirm] =
    useState(false);

  const [email, setEmail] = useState("");
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: false,
    primeiroNome: false,
    sobrenome: false,
    senha: false,
    confirmSenha: false,
  });

  const inputClass = (hasError: boolean): string => {
    return `bg-[#0E0E10] w-full h-12 text-[#A6A6A6] flex items-center justify-between px-5 rounded-full border transition-all duration-200 ${
      hasError
        ? "border-red-800"
        : "border-transparent focus-within:border-[#139C73]"
    }`;
  };

 async function handleRegister() {
  const newErrors = {
    email: !email.trim(),
    primeiroNome: !primeiroNome.trim(),
    sobrenome: !sobrenome.trim(),
    senha: !senha.trim(),
    confirmSenha: !confirmSenha.trim(),
  };

  setErrors(newErrors);

  if (Object.values(newErrors).some(Boolean)) {
    toast.error("Todos os campos são obrigatórios");
    return;
  }

  if (senha.length < 8) {
    toast.error("A senha deve conter pelo menos 8 caracteres");
    return;
  }

  if (senha !== confirmSenha) {
    toast.error("As senhas não coincidem");
    return;
  }

  
  try {
    const emailJaCadastrado = await checkEmailExists(email);
    if (emailJaCadastrado) {
      setErrors((prev) => ({ ...prev, email: true }));
      toast.error("Este email já está cadastrado");
      return;
    }
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    toast.error("Não foi possível verificar o email");
    return;
  }
  try {
    const data = await registerUser({
      email,
      primeiroNome,
      sobrenome,
      senha,
    });

    console.log(data);

    toast.success("Usuário cadastrado com sucesso!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Erro inesperado");
    }
  }
}

  return (
    <div className="dark-circuit-wrapper flex w-full h-screen justify-between items-center">
      <div className="dark-circuit-background" />
      <div className="w-[60%] ml-4 lg:block hidden h-[95%] transition-all">
        <img
          src="src/assets/er.png"
          alt="imagem-decorativa"
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 flex w-full lg:w-[35%] max-w-125 h-full flex-col items-center justify-center px-6 mx-auto gap-10">
        <div>
          <img src="src/assets/logoHorizon.png" alt="logo" />
        </div>

        <div>
          <p className="text-[#D9D9D9]  sm:text-sm  md:text-2xl font-semibold mb-4">
            Cadastro
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full">

          <div>
            <div className={inputClass(errors.email)}>
              <input
                type="text"
                placeholder="Email"
                className="w-full bg-transparent text-white outline-none"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: false }));
                }}
              />
              <MdOutlineMail size={24} />
            </div>

            {errors.email && (
              <p className="text-red-600 text-sm mt-1 ml-5">
                Campo obrigatório
              </p>
            )}
          </div>

          <div>
          <div className={inputClass(errors.primeiroNome)}>
            <input
              type="text"
              placeholder="Primeiro Nome"
              className="w-full bg-transparent text-white outline-none"
              value={primeiroNome}
              onChange={(e) => {
                setPrimeiroNome(e.target.value);
                setErrors((prev) => ({ ...prev, primeiroNome: false }));
              }}
            />
          </div>

          {errors.primeiroNome && (
            <p className="text-red-600 text-sm mt-1 ml-5">
              Campo obrigatório
            </p>
          )}
        </div>

          <div>
            <div className={inputClass(errors.sobrenome)}>
              <input
                type="text"
                placeholder="Sobrenome"
                className="w-full bg-transparent text-white outline-none"
                value={sobrenome}
                onChange={(e) => {
                  setSobrenome(e.target.value);
                  setErrors((prev) => ({ ...prev, sobrenome: false }));
                }}
              />
            </div>

            {errors.sobrenome && (
              <p className="text-red-600 text-xs mt-1 ml-3">
                Campo obrigatório
              </p>
            )}
          </div>

          <div>
            <div className={inputClass(errors.senha)}>
              <input
                type={visibilityPassword ? "text" : "password"}
                placeholder="Senha"
                className="w-full bg-transparent text-white outline-none"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErrors((prev) => ({ ...prev, senha: false }));
                }}
              />

              {visibilityPassword ? (
                <MdOutlineVisibilityOff
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setVisibilityPassword(false)}
                />
              ) : (
                <MdOutlineVisibility
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setVisibilityPassword(true)}
                />
              )}
            </div>
            {errors.senha && (
              <p className="text-red-600 text-sm mt-1 ml-5">
                Campo obrigatório
              </p>
            )}

            <p className="text-[#8B8B8B] text-sm ml-5 mt-2">
              Sua senha deve conter 8 ou mais caracteres.
            </p>
            
          </div>
          <div> 
            <div className={inputClass(errors.confirmSenha)}>
              <input
                type={visibilityPasswordConfirm ? "text" : "password"}
                placeholder="Confirmar Senha"
                className="w-full bg-transparent text-white outline-none"
                value={confirmSenha}
                onChange={(e) => {
                  setConfirmSenha(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmSenha: false }));
                }}
              />

              {visibilityPasswordConfirm ? (
                <MdOutlineVisibilityOff
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setVisibilityPasswordConfirm(false)}
                />
              ) : (
                <MdOutlineVisibility
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setVisibilityPasswordConfirm(true)}
                />
              )}
            </div>
            {errors.confirmSenha && (
              <p className="text-red-600 text-xs mt-1 ml-3">
                Campo obrigatório
              </p>
            )}
          </div>
        </div>
        <div className="w-full items-center flex flex-col gap-4">
          <button
            onClick={handleRegister}
            className="
                bg-[linear-gradient(90deg,#139C73,#136D52)]
                w-full
                py-3
                rounded-full
                text-white
                font-bold
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_20px_rgba(19,156,115,0.35)]
                hover:brightness-110
                active:scale-[0.98]
                cursor-pointer
              "          >
            CADASTRAR
          </button>

          <div>
            <p className="text-white">
              Já tem uma conta?{" "}
              <a className="text-[#139C73] underline hover:text-[#4ea38a]" href="/login">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}