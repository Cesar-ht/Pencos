import { useState, useEffect } from 'react'

function EstadisticasPersonales() {
  const [stats, setStats] = useState({
    totalJuegos: 0,
    totalReseñas: 0,
    totalHoras: 0,
    juegosCompletados: 0,
    plataformaMasUsada: '-'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEstadisticas()
  }, [])

  const fetchEstadisticas = async () => {
    try {
      const resJuegos = await fetch('http://localhost:3000/api/games')
      const juegos = await resJuegos.json()

      const totalJuegos = juegos.length
      const totalHoras = juegos.reduce((sum, juego) => sum + (juego.horasJugadas || 0), 0)
      const juegosCompletados = juegos.filter(juego => juego.completado).length
      
      const plataformas = {}
      juegos.forEach(juego => {
        plataformas[juego.plataforma] = (plataformas[juego.plataforma] || 0) + 1
      })
      
      const plataformaMasUsada = Object.keys(plataformas).length > 0
        ? Object.keys(plataformas).reduce((a, b) => 
            plataformas[a] > plataformas[b] ? a : b
          )
        : '-'

      setStats({
        totalJuegos,
        totalReseñas: 0,
        totalHoras,
        juegosCompletados,
        plataformaMasUsada
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Cargando estadísticas...</p>

  return (
    <div>
      <h2>Estadísticas Personales</h2>
      <h4>Tu actividad en GameTracker</h4>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div className="stat-card">
          <h3 style={{ fontSize: '36px', color: '#4caf50', marginBottom: '10px' }}>
            {stats.totalJuegos}
          </h3>
          <p style={{ color: '#aaa' }}>Juegos en biblioteca</p>
        </div>

        <div className="stat-card">
          <h3 style={{ fontSize: '36px', color: '#ff9800', marginBottom: '10px' }}>
            {stats.totalHoras.toFixed(1)}h
          </h3>
          <p style={{ color: '#aaa' }}>Horas totales jugadas</p>
        </div>

        <div className="stat-card">
          <h3 style={{ fontSize: '36px', color: '#2196f3', marginBottom: '10px' }}>
            {stats.juegosCompletados}
          </h3>
          <p style={{ color: '#aaa' }}>Juegos completados</p>
        </div>

        <div className="stat-card">
          <h3 style={{ fontSize: '24px', color: '#9c27b0', marginBottom: '10px' }}>
            {stats.plataformaMasUsada}
          </h3>
          <p style={{ color: '#aaa' }}>Plataforma favorita</p>
        </div>
      </div>
    </div>
  )
}

export default EstadisticasPersonales