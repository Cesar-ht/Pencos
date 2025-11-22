import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/inicio.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    contraseña: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.usuario || !formData.contraseña) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          contraseña: formData.contraseña
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', data.usuario);
        localStorage.setItem('nombre', data.nombre);
        localStorage.setItem('rol', data.rol);
        
        if (data.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/InicioUser');
        }
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="form-section">
        <form className="form needs-validation" onSubmit={handleSubmit}>
          <h2 className="form__title">Inicio de sesión</h2>

          {error && (
            <div className="form__error">
              {error}
            </div>
          )}

          <div className="form__group">
            <label htmlFor="usuario" className="form__label">Cédula</label>
            <input
              type="text"
              className="form__input"
              id="usuario"
              name="usuario"
              placeholder="Ingresa tu número de cédula"
              value={formData.usuario}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form__group">
            <label htmlFor="contraseña" className="form__label">Contraseña</label>
            <input
              type="password"
              className="form__input"
              id="contraseña"
              name="contraseña"
              placeholder="Ingresa tu contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={`form__button ${loading ? 'form__button--loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <div className="form__links">
            <p>
              ¿No tienes cuenta?<br />
              <a href="/registrar" onClick={(e) => {
                e.preventDefault();
                navigate('/registrar');
              }}>
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;