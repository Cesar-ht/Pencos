import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../../config/api' 

function Sesion() {
    const navigate = useNavigate() 

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('') 
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' })
        }
        if (serverError) {
            setServerError('')
        }
    }

    const validateForm = () => {
        const newErrors = {}

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
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                navigate('/Perfil') 
            } else {
                setServerError(data.error || data.message || 'Error al iniciar sesión.')
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
                    <h2 className="form__title">Iniciar Sesión</h2>
                    <p style={{ color: '#aaa', fontSize: '14px', marginTop: '5px' }}>
                        Accede a tu biblioteca de juegos
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

                <div className="form__group">
                    <label htmlFor="password" className="form__label">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        className={`form__input ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        placeholder="Tu contraseña"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <span className="error-message" style={{ color: 'var(--color-error)' }}>
                            {errors.password}
                        </span>
                    )}
                </div>

                <div className="form__group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        style={{ width: 'auto' }}
                    />
                    <label htmlFor="rememberMe" className="form__label" style={{ margin: 0, cursor: 'pointer' }}>
                        Recordar sesión
                    </label>
                </div>

                <button 
                    type="submit" 
                    className="form__button"
                    disabled={loading}
                >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>

                <div className="form__links">
                    <p>
                        ¿No tienes cuenta en GameTracker? <br />
                        <Link to="/registro" style={{ fontWeight: '600' }}>
                            Crear cuenta nueva
                        </Link>
                    </p>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                        Al iniciar sesión aceptas nuestros{' '}
                        <Link to="/terminos" style={{ color: 'var(--color-primary)' }}>Términos de servicio</Link>
                        {' '}y{' '}
                        <Link to="/privacidad" style={{ color: 'var(--color-primary)' }}>Política de privacidad</Link>
                    </p>
                </div>
            </form>
        </section>
    )
}

export default Sesion