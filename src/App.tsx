import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import { Toaster } from "react-hot-toast";

import Login from "./pages/login";
import Recover from "./pages/recover";
import EmailSend from "./pages/recover/email-send";
import NewPassword from "./pages/recover/new-password";
import UpdatedPassword from "./pages/recover/updated-password";
import VerifyEmail from "./pages/verify-email";
import PrivateRoute from "./routes/PrivateRoute";

import Home from "./pages/mycases";
import CasePanel from "./pages/case";
import Ranking from "./pages/case/ranking";
import Evidence from "./pages/case/evidence";
import Analysis from "./pages/case/analysis";
import CaseOverview from "./pages/case/caseOverview";
import Profiling from "./pages/case/profiling";
import Register from "./pages/register";
import EvidenceBoard from "./pages/case/evidenceBoard";
import Contact from "./pages/contact";
import ResponsibleUse from "./pages/responsibleUse";
import ErrorBoundary from "./components/ErrorBoundary";
import Profile from "./pages/profile";
import History from "./pages/case/history";
import ExportReport from "@/pages/case/export";
import Priority from "./pages/case/priority";

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

      <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/mycases" replace />} />

        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="/recover/email-send" element={<EmailSend />} />
        <Route path="/recover/new-password" element={<NewPassword />} />
        <Route path="/recover/updated-password" element={<UpdatedPassword />} />
      

        {/* privadas: todas com a mesma moldura (sidebar + TopBar com breadcrumb) */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/mycases" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/responsible-use" element={<ResponsibleUse />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/case/:id" element={<CasePanel />}>
            <Route index element={<CaseOverview />} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="evidence" element={<Evidence />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="profiling" element={<Profiling />} />
            <Route path="evidenceBoard" element={<EvidenceBoard />} />
            <Route path="priority" element={<Priority />} />
            {/* O contato é geral (sidebar → Contato); o endereço antigo continua funcionando */}
            <Route path="contact" element={<Contact />} />
            <Route path="help" element={<Navigate to="../contact" replace />} />
            {/* Uso responsável: dentro do caso mantém o menu do caso; fora dele, é geral */}
            <Route path="responsible-use" element={<ResponsibleUse />} />
            <Route path="history" element={<History />} />
            <Route path="export" element={<ExportReport />} />
          </Route>
        </Route>
      </Routes>
      </ErrorBoundary>
    </>
  );
}
export default App;
