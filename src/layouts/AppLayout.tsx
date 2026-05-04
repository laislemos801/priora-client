import { Outlet } from "react-router-dom";
import Sidebar from "@/components/ui/SideBar";

export default function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}