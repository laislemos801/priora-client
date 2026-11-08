import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import { timeAgo } from "@/lib/history";

type NotificationType =
  | "CONVITE"
  | "CONVITE_ACEITO"
  | "CONVITE_RECUSADO"
  | "PAPEL_ALTERADO"
  | "ACESSO_REMOVIDO"
  | "EVIDENCIA_NOVA"
  | "SUSPEITO_NOVO";

type Notification = {
  id: string;
  tipo: NotificationType;
  mensagem: string;
  casoId: string;
  lida: boolean;
  criadaEm: string;
  /** Só em convites: situação atual do convite para este usuário. */
  conviteStatus: "Pendente" | "Ativo" | null;
};

type NotificationList = { items: Notification[]; naoLidas: number };

const POLL_MS = 30_000;

const DOT: Record<NotificationType, string> = {
  CONVITE: "bg-sky-400",
  CONVITE_ACEITO: "bg-green-400",
  CONVITE_RECUSADO: "bg-orange-400",
  PAPEL_ALTERADO: "bg-yellow-400",
  ACESSO_REMOVIDO: "bg-red-400",
  EVIDENCIA_NOVA: "bg-green-400",
  SUSPEITO_NOVO: "bg-green-400",
};

function currentUserId(): string | null {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "null")?.id ?? null;
  } catch {
    return null;
  }
}

export default function NotificationButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<NotificationList>({ items: [], naoLidas: 0 });
  const [busyId, setBusyId] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/notifications/");
      if (!res.ok) return;
      setData(await res.json());
    } catch {
      // sem rede: tenta de novo no próximo ciclo
    }
  }, []);

  // Atualização periódica (polling), pausada com a aba oculta.
  useEffect(() => {
    load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  useEffect(() => {
    if (!open) return;
    load();
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, load]);

  async function markRead(n: Notification) {
    if (n.lida) return;
    setData((d) => ({
      items: d.items.map((i) => (i.id === n.id ? { ...i, lida: true } : i)),
      naoLidas: Math.max(0, d.naoLidas - 1),
    }));
    await apiFetch(`/notifications/${n.id}/read`, { method: "POST" }).catch(() => {});
  }

  async function markAllRead() {
    setData((d) => ({ items: d.items.map((i) => ({ ...i, lida: true })), naoLidas: 0 }));
    await apiFetch("/notifications/read-all", { method: "POST" }).catch(() => {});
  }

  function openNotification(n: Notification) {
    markRead(n);
    // Convite pendente e acesso removido não levam ao caso (ainda/mais sem acesso).
    if (n.tipo === "ACESSO_REMOVIDO" || n.tipo === "CONVITE_RECUSADO") return;
    if (n.tipo === "CONVITE" && n.conviteStatus !== "Ativo") return;
    setOpen(false);
    navigate(`/case/${n.casoId}`);
  }

  async function answerInvite(n: Notification, accept: boolean) {
    const userId = currentUserId();
    if (!userId) return;
    setBusyId(n.id);
    try {
      const res = await apiFetch(`/access/${accept ? "accept" : "decline"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, casoId: n.casoId }),
      });
      if (!res.ok) throw new Error();
      toast.success(accept ? "Convite aceito." : "Convite recusado.");
      await load();
      if (accept) {
        setOpen(false);
        navigate(`/case/${n.casoId}`);
      }
    } catch {
      toast.error("Não foi possível responder ao convite.");
    } finally {
      setBusyId(null);
    }
  }

  const unread = data.naoLidas;

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={unread > 0 ? `Notificações (${unread} não lidas)` : "Notificações"}
        aria-expanded={open}
        className="relative rounded-full bg-[#363636] p-2 hover:bg-[#4a4a4a]"
      >
        <FiBell size={16} className="md:hidden" />
        <FiBell size={20} className="hidden md:block" />

        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[#242424]">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        // max-w: no celular o painel não passa da largura da tela
        <div className="absolute right-0 z-50 mt-1 w-80 max-w-[calc(100vw-1rem)] rounded-lg border border-[#3a3a3a] bg-[#2A2A2A] shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-[#3a3a3a] p-3 text-sm font-semibold text-white">
            <span>Notificações</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-normal text-[#139C73] hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-96 space-y-1 overflow-y-auto p-2">
            {data.items.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-gray-400">
                Você não tem notificações.
              </p>
            ) : (
              data.items.map((n) => {
                const pendingInvite = n.tipo === "CONVITE" && n.conviteStatus === "Pendente";
                return (
                  <div
                    key={n.id}
                    className={`rounded-md p-2 text-sm hover:bg-[#3a3a3a] ${
                      n.lida ? "text-gray-400" : "text-gray-200"
                    }`}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openNotification(n)}
                      onKeyDown={(e) => e.key === "Enter" && openNotification(n)}
                      className="flex cursor-pointer items-start gap-2"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          n.lida ? "bg-gray-600" : DOT[n.tipo]
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p>{n.mensagem}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{timeAgo(n.criadaEm)}</p>
                      </div>
                    </div>

                    {pendingInvite && (
                      <div className="mt-2 flex gap-2 pl-4">
                        <button
                          disabled={busyId === n.id}
                          onClick={() => answerInvite(n, true)}
                          className="rounded-md bg-[#139C73] px-3 py-1 text-xs font-medium text-white hover:bg-[#0f8663] disabled:opacity-50"
                        >
                          Aceitar
                        </button>
                        <button
                          disabled={busyId === n.id}
                          onClick={() => answerInvite(n, false)}
                          className="rounded-md border border-[#575757] px-3 py-1 text-xs text-gray-200 hover:bg-[#3f3f3f] disabled:opacity-50"
                        >
                          Recusar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
