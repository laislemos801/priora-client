import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/components/ui/sidebar";
import AppTopBar from "@/components/ui/AppTopBar";

/**
 * Moldura ÚNICA de todas as telas logadas (Meus casos, Perfil, Contato e as
 * telas de um caso): sidebar à esquerda e TopBar com breadcrumb em cima.
 */
export default function AppLayout() {
  const navigate = useNavigate();
  // Menu lateral em gaveta (só no celular; no desktop a sidebar fica fixa)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="flex h-dvh bg-[#1D1D1D] text-white print:block print:h-auto">
      <Sidebar onLogout={handleLogout} mobileOpen={mobileMenuOpen} onMobileClose={closeMobileMenu} />

      {/* min-w-0: sem isso a coluna cresce até a largura mínima do conteúdo
          e a página inteira rola na horizontal em telas estreitas */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="print:hidden">
          <AppTopBar onMenuClick={() => setMobileMenuOpen(true)} />
        </div>

        <main className="min-h-0 flex-1 overflow-auto print:overflow-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
