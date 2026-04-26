import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Recover from './pages/recover'
import EmailSend from './pages/recover/email-send'
import NewPassword from './pages/recover/new-password'
import UpdatedPassword from './pages/recover/updated-password'


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/recover/email-send" element={<EmailSend />} />
      <Route path="/recover/new-password" element={<NewPassword />} />
      <Route path="/recover/updated-password" element={<UpdatedPassword />} />

    </Routes>
  )
}

export default App