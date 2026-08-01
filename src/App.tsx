import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import { Toaster } from "react-hot-toast";

import Login from "./pages/login";
import Recover from "./pages/recover";
import EmailSend from "./pages/recover/email-send";
import NewPassword from "./pages/recover/new-password";
import UpdatedPassword from "./pages/recover/updated-password";
import PrivateRoute from "./routes/PrivateRoute";

import Home from "./pages/mycases";
import CasePanel from "./pages/case";
import Ranking from "./pages/case/ranking";
import Evidence from "./pages/case/evidence";
import Analysis from "./pages/case/analysis";
import CaseOverview from "./pages/case/caseOverview";
import Register from "./pages/register";
import EvidenceBoard from "./pages/case/evidenceBoard";


function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#2B2B2B",
            color: "#fff",
            border: "1px solid #434343",
          },
          success: {
            iconTheme: {
              primary: "#139C73",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#e05555",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/mycases" replace />} />

        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="/recover/email-send" element={<EmailSend />} />
        <Route path="/recover/new-password" element={<NewPassword />} />
        <Route path="/recover/updated-password" element={<UpdatedPassword />} />
      

        {/* privadas sem sidebar */}
        <Route
          element={
            <PrivateRoute>
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route path="/mycases" element={<Home />} />
        </Route>

        {/* privadas com sidebar */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/case/:id" element={<CasePanel />}>
            <Route index element={<CaseOverview />} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="evidence" element={<Evidence />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="evidenceBoard" element={<EvidenceBoard />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
export default App;
