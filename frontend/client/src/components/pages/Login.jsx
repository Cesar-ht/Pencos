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
      // Aquí va tu llamada a la API del backend
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
        // Guardar token en localStorage o contexto
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', data.usuario);
        
        // Redirigir al dashboard
        navigate('/dashboard');
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
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              background: '#fadbd8',
              border: '1px solid #e74c3c',
              borderRadius: '6px',
              color: '#e74c3c',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div className="form__group">
            <label htmlFor="usuario" className="form__label">Usuario</label>
            <input
              type="text"
              className="form__input"
              id="Loginuser"
              name="usuario"
              placeholder="Ingresa el usuario"
              value={formData.usuario}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form__group" style={{ position: 'relative' }}>
            <label htmlFor="contraseña" className="form__label">Contraseña</label>
            <input
              type="password"
              className="form__input"
              id="loginPass"
              name="contraseña"
              placeholder="Número de Identificación"
              value={formData.contraseña}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="form__button"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <div className="form__links">
            <p>
              ¿No tienes cuenta? <br />
              <a href="/registrar" onClick={(e) => {
                e.preventDefault();
                navigate('/registrar');
              }}>
                Regístrate aquí
              </a>
            </p>
            <p>
              <a href="/recuperar" onClick={(e) => {
                e.preventDefault();
                navigate('/recuperar');
              }}>
                Olvidé mi contraseña
              </a>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;