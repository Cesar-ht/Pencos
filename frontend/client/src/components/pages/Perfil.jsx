import { Link } from 'react-router-dom'
import './../../styles/index.css'
import { useAuth } from '../../hooks/useAuth' 
import EstadisticasPersonales from '../stats/EstadisticasPersonales' 
export function PerfilComponent() {
    const { user, isAuthenticated, loading, logout } = useAuth() 

    if (loading) {
        return <p>Cargando perfil...</p>
    }

    return (
        <>
            <h2>Mi Perfil</h2>
            
            {isAuthenticated && user ? (
                <>
                    <h4>Información de la Cuenta</h4>
                    <div className="stat-card" style={{ textAlign: 'left', padding: '25px', marginBottom: '40px' }}>
                        <p style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '10px' }}>
                            ¡Hola, {user.username}! 
                        </p>
                        <p className="login-text" style={{ color: 'var(--text-secondary)' }}>
                            Email: {user.email}
                        </p>
                        
                        <button 
                            className="login-button" 
                            style={{ 
                                marginTop: '20px', 
                                width: 'auto', 
                                padding: '10px 20px',
                                backgroundColor: 'var(--color-error)'
                            }}
                            onClick={logout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                    
                    <EstadisticasPersonales />
                </>

            ) : (
                <>
                    <h4>Información personal</h4>
                    <div className="login-container">
                        <p className="login-text">
                            ¿No has iniciado sesión aún?
                        </p>
                        <Link to="/Sesion">
                            <button className="login-button">
                                Iniciar Sesión
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </>
    )
}

export default PerfilComponent