import { Outlet } from "react-router-dom";

export default function CasePanel() {
  return (
    <div className="min-h-full bg-[#242424] print:h-auto print:bg-white">
      <Outlet />
    </div>
  );
}