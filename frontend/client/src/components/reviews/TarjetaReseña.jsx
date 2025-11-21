import StarRating from './StarRating'

function TarjetaReseña({ reseña, onDelete }) {
  const formatearFecha = (fecha) => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  return (
    <div 
      className="tarjeta-reseña"
      style={{
        background: '#2a2a2a',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #3a3a3a'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <StarRating rating={reseña.puntuacion} readOnly />
          <p style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
            {formatearFecha(reseña.createdAt)}
          </p>
        </div>
        
        <button 
          onClick={() => onDelete(reseña._id)}
          style={{
            background: '#d32f2f',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 12px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Eliminar
        </button>
      </div>
      <p style={{ color: '#ddd', lineHeight: '1.6', marginBottom: '10px' }}>
        {reseña.textoReseña}
      </p>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '12px', color: '#888' }}>
        {reseña.horasJugadas > 0 && (
          <span>{reseña.horasJugadas} horas jugadas</span>
        )}
        
        {reseña.dificultad && (
          <span>Dificultad: {reseña.dificultad}</span>
        )}
        
        {reseña.recomendaria !== undefined && (
          <span>{reseña.recomendaria ? 'Recomendado' : 'No recomendado'}</span>
        )}
      </div>
    </div>
  )
}
export default TarjetaReseña