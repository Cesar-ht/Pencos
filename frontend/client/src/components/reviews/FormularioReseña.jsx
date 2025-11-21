import { useState } from 'react'
import StarRating from './StarRating'
import API_URL from '../../config/api'

function FormularioReseña({ juegoId, onReviewCreated }) {
  // Estados
  const [puntuacion, setPuntuacion] = useState(0)
  const [textoReseña, setTextoReseña] = useState('')
  const [horasJugadas, setHorasJugadas] = useState(0)
  const [dificultad, setDificultad] = useState('Normal')
  const [recomendaria, setRecomendaria] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validaciones
    if (puntuacion === 0) {
      alert('Por favor selecciona una calificación')
      return
    }

    if (textoReseña.trim() === '') {
      alert('Por favor escribe una reseña')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          juegoId, 
          puntuacion, 
          textoReseña,
          horasJugadas,
          dificultad,
          recomendaria
        })
      })

      const data = await response.json()

      if (data.success) {
        // Limpiar formulario
        setPuntuacion(0)
        setTextoReseña('')
        setHorasJugadas(0)
        setDificultad('Normal')
        setRecomendaria(true)
        
        onReviewCreated(data.data)
        alert('¡Reseña creada exitosamente!')
      } else {
        alert(data.message || 'Error al crear la reseña')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container" style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '20px' }}>Escribe tu reseña</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Puntuación con Estrellas */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">Puntuación *</label>
          <StarRating 
            rating={puntuacion} 
            onRatingChange={setPuntuacion}
          />
        </div>

        {/* Texto de la Reseña */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">Tu Reseña *</label>
          <textarea
            className="form-input"
            value={textoReseña}
            onChange={(e) => setTextoReseña(e.target.value)}
            placeholder="¿Qué te pareció este juego? Comparte tu experiencia..."
            maxLength={1000}
            style={{ minHeight: '120px', resize: 'vertical' }}
          />
          <small style={{ color: '#aaa', fontSize: '12px' }}>
            {textoReseña.length}/1000 caracteres
          </small>
        </div>

        {/* Horas Jugadas */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">Horas Jugadas</label>
          <input
            type="number"
            className="form-input"
            value={horasJugadas}
            onChange={(e) => setHorasJugadas(Number(e.target.value))}
            min="0"
            placeholder="0"
          />
        </div>

        {/* Dificultad */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">Dificultad</label>
          <select
            className="settings-select"
            value={dificultad}
            onChange={(e) => setDificultad(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="Fácil">Fácil</option>
            <option value="Normal">Normal</option>
            <option value="Difícil">Difícil</option>
          </select>
        </div>

        {/* ¿Recomendarías? */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={recomendaria}
              onChange={(e) => setRecomendaria(e.target.checked)}
              style={{ marginRight: '10px', width: '18px', height: '18px' }}
            />
            <span className="form-label" style={{ margin: 0 }}>
              ¿Recomendarías este juego?
            </span>
          </label>
        </div>

        {/* Botón Enviar */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 30px',
            background: loading ? '#555' : '#3a3a3a',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {loading ? 'Publicando...' : 'Publicar Reseña'}
        </button>
      </form>
    </div>
  )
}

export default FormularioReseña