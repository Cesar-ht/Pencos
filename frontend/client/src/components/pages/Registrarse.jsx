import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../../config/api'

function Registro() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })

        // Limpiar errores al escribir
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' })
        }
        if (serverError) {
            setServerError('')
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.username) {
            newErrors.username = 'El nombre de usuario es obligatorio'
        }

        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido'
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria'
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
        }

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError('')

        const newErrors = validateForm()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // Envía todo el objeto de datos
            })

            const data = await response.json()

            if (response.ok) {
                // Registro exitoso: Guarda token y usuario (opcionalmente) y redirige
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                
                // Redirigir al perfil o a la página principal después del registro y login automático
                navigate('/Perfil') 
            } else {
                // Manejar errores de backend (ej: El usuario o email ya existe)
                setServerError(data.error || 'Error al registrar el usuario.')
            }
        } catch (error) {
            console.error('Error de conexión:', error)
            setServerError('Error al conectar con el servidor. Intenta de nuevo más tarde.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="form-section">
            <form className="form needs-validation" onSubmit={handleSubmit}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <h2 className="form__title">Crear Cuenta</h2>
                    <p style={{ color: '#aaa', fontSize: '14px', marginTop: '5px' }}>
                        Únete a GameTracker y gestiona tu biblioteca
                    </p>
                </div>
                
                {/* Mostrar error del servidor si existe */}
                {serverError && (
                    <div style={{ 
                        padding: '10px', 
                        marginBottom: '20px', 
                        borderRadius: '6px', 
                        backgroundColor: 'var(--color-error)',
                        color: 'var(--color-white)',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {serverError}
                    </div>
                )}

                {/* --- Campo Username --- */}
                <div className="form__group">
                    <label htmlFor="username" className="form__label">
                        Nombre de Usuario
                    </label>
                    <input
                        type="text"
                        className={`form__input ${errors.username ? 'is-invalid' : ''}`}
                        id="username"
                        name="username"
                        placeholder="Tu nombre en la plataforma"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && (
                        <span className="error-message" style={{ color: 'var(--color-error)' }}>
                            {errors.username}
                        </span>
                    )}
                </div>

                {/* --- Campo Email --- */}
                <div className="form__group">
                    <label htmlFor="email" className="form__label">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        className={`form__input ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <span className="error-message" style={{ color: 'var(--color-error)' }}>
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* --- Campo Password --- */}
                <div className="form__group">
                    <label htmlFor="password" className="form__label">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        className={`form__input ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <span className="error-message" style={{ color: 'var(--color-error)' }}>
                            {errors.password}
                        </span>
                    )}
                </div>

                <button 
                    type="submit" 
                    className="form__button"
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                <div className="form__links">
                    <p>
                        ¿Ya tienes una cuenta? <br />
                        <Link to="/Sesion" style={{ fontWeight: '600' }}>
                            Iniciar sesión
                        </Link>
                    </p>
                </div>
            </form>
        </section>
    )
}

export default Registro