import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";

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
import Register from "./pages/register";

function App() {
  return (
  <Routes>
  <Route path="/" element={<Navigate to="/mycases" replace />} />

  {/* públicas */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/recover" element={<Recover />} />
  <Route path="/recover/email-send" element={<EmailSend />} />
  <Route path="/recover/new-password" element={<NewPassword />} />
  <Route path="/recover/updated-password" element={<UpdatedPassword />} />

  {/* privadas */}
  <Route
    element={
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    }
  >
    <Route path="/mycases" element={<Home />} />

    <Route path="/case/:id" element={<CasePanel />}>
      <Route
        index
        element={<div className="text-white p-4">Overview</div>}
      />

      <Route path="ranking" element={<Ranking />} />
      <Route path="evidence" element={<Evidence />} />
      <Route path="analysis" element={<Analysis />} />
    </Route>
  </Route>
</Routes>
  );
}

export default App;
