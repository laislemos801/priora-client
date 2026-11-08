import { FiCheck } from "react-icons/fi";
import { PASSWORD_MIN } from "./validation";

/**
 * Requisitos da nova senha, marcados em tempo real.
 * `confirm` é opcional: sem ele, o item "senhas coincidem" não aparece.
 */
export default function PasswordChecklist({
  password,
  confirm,
}: {
  password: string;
  confirm?: string;
}) {
  const items = [
    { ok: password.length >= PASSWORD_MIN, label: `Pelo menos ${PASSWORD_MIN} caracteres` },
    ...(confirm !== undefined
      ? [{ ok: password.length > 0 && password === confirm, label: "As duas senhas coincidem" }]
      : []),
  ];

  return (
    <ul className="space-y-1.5" aria-label="Requisitos da senha">
      {items.map(({ ok, label }) => (
        <li
          key={label}
          className={`flex items-center gap-2 text-xs transition-colors ${ok ? "text-emerald-400" : "text-white/50"}`}
        >
          <span
            className={`flex size-4 items-center justify-center rounded-full border transition-colors ${
              ok ? "border-emerald-400 bg-emerald-400/15" : "border-[#575757]"
            }`}
            aria-hidden
          >
            {ok && <FiCheck size={10} />}
          </span>
          {label}
          <span className="sr-only">{ok ? "(atendido)" : "(pendente)"}</span>
        </li>
      ))}
    </ul>
  );
}
