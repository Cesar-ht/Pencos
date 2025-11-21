import { useState, useEffect } from 'react'
import TarjetaReseña from './TarjetaReseña'
import API_URL from '../../config/api'

function ListaReseñas({ gameId }) {
  const [reseñas, setReseñas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (gameId) {
      fetchReseñas()
    }
  }, [gameId])

  const fetchReseñas = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/${gameId}`)
      const data = await response.json()
      setReseñas(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta reseña?')) return
    
    try {
      await fetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE'
      })
      fetchReseñas() // Recargar lista
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) return <p>Cargando reseñas...</p>

  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>Reseñas ({reseñas.length})</h3>
      
      {reseñas.length === 0 ? (
        <p style={{ color: '#aaa' }}>No hay reseñas aún. ¡Sé el primero en escribir una!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reseñas.map(reseña => (
            <TarjetaReseña 
              key={reseña._id} 
              reseña={reseña}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ListaReseñas