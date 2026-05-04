import { Outlet } from "react-router-dom";
import Sidebar from "@/components/ui/sidebar";
import TopBar_cases from "@/components/ui/TopBar_cases";

export default function AppLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <TopBar_cases />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}