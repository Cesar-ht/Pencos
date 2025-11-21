import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import StarRating from '../reviews/StarRating'
import FormularioReseña from '../reviews/FormularioReseña'
import TarjetaReseña from '../reviews/TarjetaReseña'
import '../../styles/components/DetalleJuego.css'
import API_URL from '../../config/api'

function DetalleJuego() {
  const { id } = useParams() // Obtener el ID del juego desde la URL
  const [juego, setJuego] = useState(null)
  const [reseñas, setReseñas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFormulario, setShowFormulario] = useState(false)

  useEffect(() => {
    fetchJuego()
    fetchReseñas()
  }, [id])

  const fetchJuego = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/games/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (!response.ok) {
        throw new Error('Juego no encontrado')
      }

      const data = await response.json()
      setJuego(data)
    } catch (error) {
      console.error('Error:', error)
      setError('No se pudo cargar el juego')
    } finally {
      setLoading(false)
    }
  }

  const fetchReseñas = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/game/${id}`)
      const data = await response.json()
      
      // Ajustar según la estructura de respuesta de tu API
      setReseñas(Array.isArray(data) ? data : (data.data || []))
    } catch (error) {
      console.error('Error al cargar reseñas:', error)
      setReseñas([]) 
    }
  }

  const handleReseñaCreada = (nuevaReseña) => {
    setReseñas([nuevaReseña, ...reseñas])
    setShowFormulario(false)
  }

  const handleReseñaEliminada = async (reseñaId) => {
    try {
      const response = await fetch(`${API_URL}/reseñas/${reseñaId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setReseñas(reseñas.filter(r => r._id !== reseñaId))
        alert('Reseña eliminada exitosamente')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar la reseña')
    }
  }

  const calcularPromedioReseñas = () => {
    if (reseñas.length === 0) return 0
    const suma = reseñas.reduce((acc, r) => acc + r.puntuacion, 0)
    return (suma / reseñas.length).toFixed(1)
  }

  const agregarABiblioteca = () => {
    alert(`"${juego.titulo}" agregado a tu biblioteca`)
  }

  if (loading) {
    return (
      <div className="inicio-loading">
        <p>Cargando detalles del juego...</p>
      </div>
    )
  }

  if (error || !juego) {
    return (
      <div className="inicio-error">
        <p>{error || 'Juego no encontrado'}</p>
        <Link to="/tienda">
          <button>Volver a la Tienda</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="detalle-juego-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/tienda">← Volver a la Tienda</Link>
      </div>

      {/* Header con Imagen y Info Principal */}
      <div className="juego-header">
        {/* Imagen Principal */}
        <div className="juego-imagen-container">
          {juego.imagenPortada ? (
            <img 
              src={juego.imagenPortada} 
              alt={juego.titulo}
              className="juego-imagen-grande"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x500?text=Sin+Imagen'
              }}
            />
          ) : (
            <div className="juego-imagen-placeholder">
              <span>🎮</span>
            </div>
          )}
        </div>

        {/* Información Principal */}
        <div className="juego-info-principal">
          <h1 className="juego-titulo">{juego.titulo}</h1>

          {/* Calificación y Reseñas */}
          {reseñas.length > 0 && (
            <div className="juego-calificacion">
              <StarRating rating={Math.round(calcularPromedioReseñas())} readOnly />
              <span className="promedio-texto">
                {calcularPromedioReseñas()}/5 ({reseñas.length} {reseñas.length === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="juego-badges-container">
            {juego.genero && (
              <span className="juego-badge-detail">{juego.genero}</span>
            )}
            {juego.plataforma && (
              <span className="juego-badge-detail">{juego.plataforma}</span>
            )}
            {juego.añoLanzamiento && (
              <span className="juego-badge-detail">{juego.añoLanzamiento}</span>
            )}
          </div>

          {/* Desarrollador */}
          {juego.desarrollador && (
            <p className="juego-desarrollador-detail">
              <strong>Desarrollador:</strong> {juego.desarrollador}
            </p>
          )}

          {/* Descripción */}
          {juego.descripcion && (
            <div className="juego-descripcion-section">
              <h3>Descripción</h3>
              <p className="juego-descripcion-texto">{juego.descripcion}</p>
            </div>
          )}

          {/* Botón Agregar */}
          <button 
            className="btn-agregar-biblioteca"
            onClick={agregarABiblioteca}
          >
            Agregar a Biblioteca
          </button>
        </div>
      </div>

      {/* Sección de Reseñas */}
      <div className="seccion-reseñas">
        <div className="reseñas-header">
          <h2>Reseñas de Usuarios</h2>
          <button 
            className="btn-escribir-reseña"
            onClick={() => setShowFormulario(!showFormulario)}
          >
            {showFormulario ? 'Cancelar' : 'Escribir Reseña'}
          </button>
        </div>

        {/* Formulario de Reseña */}
        {showFormulario && (
          <FormularioReseña 
            juegoId={id}
            onReviewCreated={handleReseñaCreada}
          />
        )}

        {/* Lista de Reseñas */}
        {reseñas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <h4>Aún no hay reseñas</h4>
            <p>¡Sé el primero en compartir tu opinión sobre este juego!</p>
          </div>
        ) : (
          <div className="lista-reseñas">
            {reseñas.map(reseña => (
              <TarjetaReseña
                key={reseña._id}
                reseña={reseña}
                onDelete={handleReseñaEliminada}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DetalleJuego