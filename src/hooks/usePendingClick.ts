import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

type Handler = ((e: MouseEvent<HTMLButtonElement>) => unknown) | undefined;

/**
 * Acompanha um clique que dispara trabalho assíncrono: se o `onClick` devolve uma
 * Promise (função `async`), `pending` fica verdadeiro até ela terminar. Assim todo
 * botão mostra o carregamento sem precisar de um `useState` em cada tela.
 * Cliques repetidos enquanto pendente são ignorados (evita enviar duas vezes).
 */
export function usePendingClick(onClick: Handler) {
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (busy.current) return;
      const result = onClick?.(e);
      if (result && typeof (result as Promise<unknown>).then === "function") {
        busy.current = true;
        setPending(true);
        const done = () => {
          busy.current = false;
          if (mounted.current) setPending(false);
        };
        (result as Promise<unknown>).then(done, done);
      }
    },
    [onClick],
  );

  return { pending, handleClick };
}
