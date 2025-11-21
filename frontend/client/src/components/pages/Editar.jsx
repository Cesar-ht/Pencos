import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormularioJuego from '../games/FormularioJuego' // Ajusta la ruta según tu estructura
import API_URL from '../../config/api'

function EditarJuego() {
    // 1. Obtener el ID del juego de la URL
    const { id } = useParams() 
    const navigate = useNavigate()

    const [juegoData, setJuegoData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // 2. Cargar los datos del juego específico
        const fetchJuego = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`${API_URL}/games/${id}`, {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                })

                if (!response.ok) {
                    throw new Error('Juego no encontrado o no autorizado')
                }
                
                const data = await response.json()
                setJuegoData(data)
            } catch (err) {
                console.error('Error al cargar datos del juego:', err)
                setError('No se pudo cargar el juego para edición.')
            } finally {
                setLoading(false)
            }
        }

        fetchJuego()
    }, [id])

    const handleJuegoGuardado = () => {
        navigate('/biblioteca') 
    }

    if (loading) return <p>Cargando datos del juego...</p>
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>
    if (!juegoData) return <p>Juego no encontrado.</p>

    return (
        <div className="pagina-edicion">
            <h2>Editar Juego: {juegoData.titulo}</h2>
            <FormularioJuego 
                juego={juegoData} // Le pasamos los datos precargados
                onGuardado={handleJuegoGuardado}
                onCancelar={() => navigate('/biblioteca')} // Volver a la biblioteca
            />
        </div>
    )
}

export default EditarJuego