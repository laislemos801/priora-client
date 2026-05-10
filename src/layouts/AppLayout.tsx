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
    <div className="flex h-screen">
        <Sidebar onLogout={handleLogout} />

      <div className="flex flex-col flex-1">
        <TopBar_cases />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}