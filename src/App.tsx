import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'

import Login from './pages/login'
import Register from './pages/register'
import Recover from './pages/recover'
import EmailSend from './pages/recover/email-send'
import NewPassword from './pages/recover/new-password'
import UpdatedPassword from './pages/recover/updated-password'

import Home from './pages/mycases'
import CasePanel from './pages/case'
import Ranking from './pages/case'
import Evidence from './pages/case'
import Analysis from './pages/case'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mycases" replace />} />

      {/* Rotas SEM sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/recover/email-send" element={<EmailSend />} />
      <Route path="/recover/new-password" element={<NewPassword />} />
      <Route path="/recover/updated-password" element={<UpdatedPassword />} />
      <Route path="/mycases" element={<Home />} />

      {/* Rotas COM sidebar */}
      <Route element={<AppLayout />}>
        <Route path="/case/:id" element={<CasePanel />}>
          <Route index element={<CasePanel />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="evidence" element={<Evidence />} />
          <Route path="analysis" element={<Analysis />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App