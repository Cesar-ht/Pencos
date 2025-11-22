import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InicioUser from './components/pages/InicioUser'
import Login from './components/pages/Login'  // ← Mayúscula
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioUser />} />
        <Route path="/sesion" element={<Login />} />  {/* ← Mayúscula */}
      </Routes>
    </BrowserRouter>
  )
}

export default App