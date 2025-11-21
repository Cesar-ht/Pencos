import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../../styles/index.css'
import API_URL from '../../config/api'

const Tienda = () => {
    const [juegos, setJuegos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [biblioteca, setBiblioteca] = useState([]);
    
    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGenero, setFilterGenero] = useState('');
    const [filterPlataforma, setFilterPlataforma] = useState('');

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        fetchJuegosTienda();
        fetchBiblioteca();
    }, []);

    const fetchJuegosTienda = async () => {
        try {
            const response = await fetch(`${API_URL}/games/tienda`);
            const data = await response.json();
            setJuegos(data);
        } catch (error) {
            console.error('Error al cargar tienda:', error);
            setError('No se pudieron cargar los juegos de la tienda');
        } finally {
            setLoading(false);
        }
    };

    const fetchBiblioteca = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/games/user/biblioteca`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setBiblioteca(data.map(j => j._id));
        } catch (error) {
            console.error('Error al cargar biblioteca:', error);
        }
    };

    const agregarABiblioteca = async (e, juegoId, titulo) => {
        e.preventDefault();
        e.stopPropagation();
        
        const token = getToken();
        
        if (!token) {
            alert('Debes iniciar sesión para agregar juegos a tu biblioteca');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/games/biblioteca/${juegoId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert(`"${titulo}" agregado a tu biblioteca`);
                setBiblioteca([...biblioteca, juegoId]);
            } else {
                const error = await response.json();
                alert(error.message || 'Error al agregar el juego');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar a biblioteca');
        }
    };

    const estaEnBiblioteca = (juegoId) => {
        return biblioteca.includes(juegoId);
    };

    // Filtros
    const juegosFiltrados = juegos.filter(juego => {
        const matchSearch = juego.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchGenero = !filterGenero || juego.genero === filterGenero;
        const matchPlataforma = !filterPlataforma || juego.plataforma === filterPlataforma;
        return matchSearch && matchGenero && matchPlataforma;
    });

    // Obtener géneros y plataformas únicos
    const generos = [...new Set(juegos.map(j => j.genero).filter(Boolean))];
    const plataformas = [...new Set(juegos.map(j => j.plataforma).filter(Boolean))];

    if (loading) {
        return (
            <div className="inicio-loading">
                <p>Cargando tienda...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="inicio-error">
                <p>{error}</p>
                <button onClick={fetchJuegosTienda}>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="hero-section">
                <h2 className="hero-title">Tienda de Juegos</h2>
                <h4 className="hero-subtitle">Explora y agrega juegos a tu biblioteca</h4>
                <Link to="/biblioteca">
                    <button className="explorar-tienda-btn">
                        Ver Mi Biblioteca
                    </button>
                </Link>
                <Link to="/crear">
                    <button className="explorar-tienda-btn">
                        Agregar Nuevo Juego
                    </button>
                </Link>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="filters-container">
                <div className="filters-grid">
                    {/* Búsqueda */}
                    <div className="filter-group">
                        <label>Buscar</label>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Buscar juego..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filtro Género */}
                    <div className="filter-group">
                        <label>Género</label>
                        <select
                            className="filter-select"
                            value={filterGenero}
                            onChange={(e) => setFilterGenero(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {generos.map(genero => (
                                <option key={genero} value={genero}>{genero}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro Plataforma */}
                    <div className="filter-group">
                        <label>Plataforma</label>
                        <select
                            className="filter-select"
                            value={filterPlataforma}
                            onChange={(e) => setFilterPlataforma(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {plataformas.map(plataforma => (
                                <option key={plataforma} value={plataforma}>{plataforma}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Contador de resultados */}
            <div className="results-counter">
                <h3>
                    {juegosFiltrados.length} {juegosFiltrados.length === 1 ? 'juego encontrado' : 'juegos encontrados'}
                </h3>
            </div>

            {/* Grid de Juegos */}
            {juegosFiltrados.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"></div>
                    <h4>No se encontraron juegos</h4>
                    <p>Intenta cambiar los filtros de búsqueda</p>
                </div>
            ) : (
                <div className="games-grid">
                    {juegosFiltrados.map(juego => (
                        <Link 
                            to={`/juego/${juego._id}`} 
                            key={juego._id} 
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="store-game-card">
                                {/* Imagen */}
                                {juego.imagenPortada && (
                                    <img 
                                        src={juego.imagenPortada} 
                                        alt={juego.titulo}
                                        className="store-game-image"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/280x180?text=Sin+Imagen'
                                        }}
                                    />
                                )}

                                {/* Información */}
                                <div className="game-content">
                                    <h4 className="game-title">
                                        {juego.titulo}
                                    </h4>

                                    <div className="game-badges">
                                        {juego.genero && (
                                            <span className="game-badge">{juego.genero}</span>
                                        )}
                                        {juego.plataforma && (
                                            <span className="game-badge">{juego.plataforma}</span>
                                        )}
                                    </div>

                                    {juego.desarrollador && (
                                        <p className="game-developer">
                                            {juego.desarrollador}
                                        </p>
                                    )}

                                    {juego.añoLanzamiento && (
                                        <p className="game-release-year">
                                            Año: {juego.añoLanzamiento}
                                        </p>
                                    )}

                                    {juego.descripcion && (
                                        <p className="game-description">
                                            {juego.descripcion}
                                        </p>
                                    )}

                                    {/* Botón Agregar o En Biblioteca */}
                                    {estaEnBiblioteca(juego._id) ? (
                                        <button
                                            className="add-button in-library"
                                            disabled
                                        >
                                            ✓ En Biblioteca
                                        </button>
                                    ) : (
                                        <button
                                            className="add-button"
                                            onClick={(e) => agregarABiblioteca(e, juego._id, juego.titulo)}
                                        >
                                            Agregar a Biblioteca
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
};

export default Tienda;