import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/components/ui/sidebar";
import TopBar_cases from "@/components/ui/TopBar_cases";

export default function AppLayout() {

   const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <div className="flex h-screen print:block print:h-auto">
        <Sidebar onLogout={handleLogout} />

      <div className="flex flex-col flex-1">
        <div className="print:hidden">
          <TopBar_cases />
        </div>

        <main className="flex-1 overflow-auto print:overflow-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
}