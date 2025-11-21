import { useState, useEffect } from 'react'
import TarjetaJuego from './TarjetaJuego'
import FormularioJuego from './FormularioJuego'
import API_URL from '../../config/api'

function BibliotecaJuegos() {
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [juegoEditando, setJuegoEditando] = useState(null) 
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    fetchJuegos()
  }, [])

  const fetchJuegos = async () => {
    try {
      const response = await fetch(`${API_URL}/games`)
      const data = await response.json()
      setJuegos(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (juego) => {
    setJuegoEditando(juego) 
    setMostrarFormulario(true) 
  }

  const handleJuegoGuardado = () => {
    setJuegoEditando(null)
    setMostrarFormulario(false)
    fetchJuegos() 
  }

  const handleCancelar = () => {
    setJuegoEditando(null)
    setMostrarFormulario(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este juego?')) return
    
    try {
      await fetch(`${API_URL}/games/${id}`, {
        method: 'DELETE'
      })
      fetchJuegos()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) return <p>Cargando juegos...</p>

  return (
    <div>
      <button 
        onClick={() => setMostrarFormulario(true)}
        style={{
          padding: '10px 20px',
          background: '#3a3a3a',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        + Agregar Juego
      </button>

      {mostrarFormulario && (
        <FormularioJuego 
          juego={juegoEditando} 
          onGuardado={handleJuegoGuardado}
          onCancelar={handleCancelar}
        />
      )}

      <div className="biblioteca-grid">
        {juegos.length === 0 ? (
          <p>No tienes juegos aún</p>
        ) : (
          juegos.map(juego => (
            <TarjetaJuego 
              key={juego._id} 
              juego={juego}
              onEdit={handleEdit} 
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default BibliotecaJuegos