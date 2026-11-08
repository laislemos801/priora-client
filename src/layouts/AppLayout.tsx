import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/components/ui/sidebar";
import TopBar_cases from "@/components/ui/TopBar_cases";

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
    <div className="flex h-dvh print:block print:h-auto">
      <Sidebar
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />

      {/* min-w-0: sem isso a coluna cresce até a largura mínima do conteúdo
          e a página inteira rola na horizontal em telas estreitas */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="print:hidden">
          <TopBar_cases onMenuClick={() => setMobileMenuOpen(true)} />
        </div>

        <main className="flex-1 min-h-0 overflow-auto print:overflow-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
