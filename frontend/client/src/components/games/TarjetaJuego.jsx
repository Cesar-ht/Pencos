import StarRating from '../reviews/StarRating'

function TarjetaJuego({ juego, onEdit, onDelete }) {
  return (
    <div className="tarjeta-juego">
      {juego.imagenPortada && (
        <img 
          src={juego.imagenPortada} 
          alt={juego.titulo}
          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px 6px 0 0' }}
        />
      )}
      
      <div className="juego-info">
        <h3>{juego.titulo}</h3>
        <p><strong>Plataforma:</strong> {juego.plataforma}</p>
        <p><strong>Género:</strong> {juego.genero || 'No especificado'}</p>
        {juego.desarrollador && <p><strong>Desarrollador:</strong> {juego.desarrollador}</p>}
        
        {juego.horasJugadas > 0 && (
          <p style={{ color: '#4caf50', fontSize: '14px' }}>
            {juego.horasJugadas} horas jugadas
          </p>
        )}

        {juego.completado && (
          <p style={{ color: '#ffd700', fontSize: '14px' }}>
            Completado
          </p>
        )}

        <StarRating rating={juego.rating || 0} readOnly />
      </div>
      
      <div className="juego-acciones">
        <button onClick={() => onEdit(juego)}>Editar</button>
        <button onClick={() => onDelete(juego._id)}>Eliminar</button>
      </div>
    </div>
  )
}

export default TarjetaJuego