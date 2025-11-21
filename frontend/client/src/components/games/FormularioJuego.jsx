import { useState, useEffect } from 'react'
import API_URL from '../../config/api'

function FormularioJuego({ juego, onGuardado, onCancelar }) {
  const [formData, setFormData] = useState({
    titulo: '',
    plataforma: 'PC',
    genero: '',
    añoLanzamiento: '',
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    horasJugadas: 0,
    completado: false
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (juego) {
      setFormData({
        titulo: juego.titulo || '',
        plataforma: juego.plataforma || 'PC',
        genero: juego.genero || '',
        añoLanzamiento: juego.añoLanzamiento || '',
        desarrollador: juego.desarrollador || '',
        imagenPortada: juego.imagenPortada || '',
        descripcion: juego.descripcion || '',
        horasJugadas: juego.horasJugadas || 0,
        completado: juego.completado || false
      })
    }
  }, [juego])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.titulo || !formData.plataforma) {
      alert('El título y la plataforma son obligatorios')
      return
    }

    setLoading(true)

    try {
      const url = juego 
        ? `${API_URL}/games/${juego._id}`
        : `${API_URL}/games`

      const method = juego ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        alert(juego ? 'Juego actualizado exitosamente' : 'Juego creado exitosamente')
        onGuardado()
      } else {
        alert(data.message || 'Error al guardar el juego')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container" style={{ marginBottom: '30px' }}>
      <h3>{juego ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">Título *</label>
          <input
            type="text"
            name="titulo"
            className="form-input"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Nombre del juego"
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">Plataforma *</label>
          <select
            name="plataforma"
            className="form-input"
            value={formData.plataforma}
            onChange={handleChange}
            required
          >
            <option value="PC">PC</option>
            <option value="PlayStation">PlayStation</option>
            <option value="Xbox">Xbox</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="Mobile">Mobile</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">Género</label>
          <input
            type="text"
            name="genero"
            className="form-input"
            value={formData.genero}
            onChange={handleChange}
            placeholder="Ej: RPG, Aventura, Shooter..."
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">Año de Lanzamiento</label>
          <input
            type="number"
            name="añoLanzamiento"
            className="form-input"
            value={formData.añoLanzamiento}
            onChange={handleChange}
            min="1950"
            max={new Date().getFullYear() + 5}
            placeholder="Ej: 2024"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">Desarrollador</label>
          <input
            type="text"
            name="desarrollador"
            className="form-input"
            value={formData.desarrollador}
            onChange={handleChange}
            placeholder="Ej: Nintendo, Sony, etc."
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">URL de Imagen Portada</label>
          <input
            type="url"
            name="imagenPortada"
            className="form-input"
            value={formData.imagenPortada}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-input"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del juego..."
            style={{ minHeight: '80px', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className="form-label">Horas Jugadas</label>
          <input
            type="number"
            name="horasJugadas"
            className="form-input"
            value={formData.horasJugadas}
            onChange={handleChange}
            min="0"
            step="0.5"
            placeholder="Ej: 25.5"
          />
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            name="completado"
            id="completado"
            checked={formData.completado}
            onChange={handleChange}
            style={{ width: 'auto', cursor: 'pointer' }}
          />
          <label htmlFor="completado" style={{ cursor: 'pointer', margin: 0 }}>
            Juego completado 
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
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
            {loading ? 'Guardando...' : (juego ? 'Actualizar' : 'Crear')}
          </button>

          <button
            type="button"
            onClick={onCancelar}
            style={{
              padding: '12px 30px',
              background: '#555',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioJuego