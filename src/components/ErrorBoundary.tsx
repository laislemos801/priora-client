import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { failed: boolean };

/**
 * Evita a tela branca: se alguma tela quebrar, mostra uma mensagem com
 * opções de recarregar ou voltar, em vez de desmontar o aplicativo inteiro.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#1D1D1D] px-6 text-center text-white">
        <h1 className="text-lg font-semibold">Algo deu errado ao exibir esta tela</h1>
        <p className="max-w-md text-sm text-white/65">
          Os seus dados não foram perdidos. Tente recarregar a página ou volte para a lista de casos.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md bg-[#139C73] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f8663]"
          >
            Recarregar
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/mycases")}
            className="rounded-md border border-[#575757] px-4 py-2 text-sm text-white/80 hover:bg-[#333]"
          >
            Meus casos
          </button>
        </div>
      </div>
    );
  }
}
