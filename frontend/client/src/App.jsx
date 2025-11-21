import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Inicio from './components/pages/Inicio'
import Tienda from './components/pages/Tienda'
import Biblioteca from './components/pages/Biblioteca'
import Perfil from './components/pages/Perfil'
import Ajustes from './components/pages/Ajustes'
import Sesion from './components/pages/Sesion'
import Registro from './components/pages/Registrarse'
import EditarJuego from './components/pages/Editar'
import Crear from './components/pages/Crear'
import DetalleJuego from './components/pages/DetalleJuego'

function App() {
  useEffect(() => {
    document.body.classList.add('tema-oscuro')
  }, [])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/sesion" element={<Sesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="/biblioteca/editar/:id" element={<EditarJuego />} />
          <Route path="/Crear" element={<Crear />} />
          <Route path="/juego/:id" element={<DetalleJuego />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App