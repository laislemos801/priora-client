import { Outlet } from "react-router-dom";

export default function CasePanel() {
  return (
    <div className="h-screen bg-[#242424] print:h-auto print:bg-white">
      <Outlet />
    </div>
  );
}