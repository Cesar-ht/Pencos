import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  // Form nuevo usuario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    cedula: '',
    nombre: '',
    email: ''
  });

  // Form subir certificado
  const [certForm, setCertForm] = useState({
    cedula: '',
    fechaEmision: '',
    fechaVencimiento: '',
    archivo: null
  });
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);

  const token = localStorage.getItem('token');

  // Verificar que sea admin
  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  // Cargar usuarios
  useEffect(() => {
    if (activeTab === 'usuarios') {
      cargarUsuarios();
    }
  }, [activeTab]);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsuarios(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 4000);
  };

  // Crear usuario
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario.cedula || !nuevoUsuario.nombre) {
      mostrarMensaje('error', 'Cédula y nombre son requeridos');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevoUsuario)
      });
      const data = await res.json();

      if (res.ok) {
        mostrarMensaje('exito', `Usuario ${nuevoUsuario.cedula} creado. Contraseña: ${nuevoUsuario.cedula}`);
        setNuevoUsuario({ cedula: '', nombre: '', email: '' });
        cargarUsuarios();
      } else {
        mostrarMensaje('error', data.message);
      }
    } catch (err) {
      mostrarMensaje('error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Buscar usuario para certificado
  const buscarUsuario = async () => {
    if (!certForm.cedula) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/buscar/${certForm.cedula}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setUsuarioEncontrado(data);
        mostrarMensaje('exito', `Usuario encontrado: ${data.nombre}`);
      } else {
        setUsuarioEncontrado(null);
        mostrarMensaje('error', 'Usuario no encontrado');
      }
    } catch (err) {
      mostrarMensaje('error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Subir certificado
  const handleSubirCertificado = async (e) => {
    e.preventDefault();
    
    if (!usuarioEncontrado || !certForm.archivo || !certForm.fechaEmision || !certForm.fechaVencimiento) {
      mostrarMensaje('error', 'Completa todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('usuarioId', usuarioEncontrado._id);
    formData.append('certificado', certForm.archivo);
    formData.append('fechaEmision', certForm.fechaEmision);
    formData.append('fechaVencimiento', certForm.fechaVencimiento);

    setLoading(true);
    try {
      const res = await fetch('/api/certificate/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (res.ok) {
        mostrarMensaje('exito', 'Certificado subido correctamente');
        setCertForm({ cedula: '', fechaEmision: '', fechaVencimiento: '', archivo: null });
        setUsuarioEncontrado(null);
      } else {
        mostrarMensaje('error', data.message);
      }
    } catch (err) {
      mostrarMensaje('error', 'Error al subir certificado');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleEliminar = async (id, cedula) => {
    if (!window.confirm(`¿Eliminar usuario ${cedula}?`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        mostrarMensaje('exito', 'Usuario eliminado');
        cargarUsuarios();
      }
    } catch (err) {
      mostrarMensaje('error', 'Error al eliminar');
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin">
      {/* Navegación */}
      <nav className="admin__nav">
        <div className="admin__logo">
          <span className="admin__logo-icon">⚙</span>
          <span>ITSA Admin</span>
        </div>
        <button className="admin__logout" onClick={handleLogout}>
          🚪 Cerrar Sesión
        </button>
      </nav>

      {/* Mensaje */}
      {mensaje.texto && (
        <div className={`admin__mensaje admin__mensaje--${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Tabs */}
      <div className="admin__tabs">
        <button 
          className={`admin__tab ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          👥 Usuarios
        </button>
        <button 
          className={`admin__tab ${activeTab === 'crear' ? 'active' : ''}`}
          onClick={() => setActiveTab('crear')}
        >
          ➕ Crear Usuario
        </button>
        <button 
          className={`admin__tab ${activeTab === 'certificado' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificado')}
        >
          📄 Subir Certificado
        </button>
      </div>

      <div className="admin__content">
        {/* Tab: Lista de Usuarios */}
        {activeTab === 'usuarios' && (
          <div className="admin__section">
            <h2>Lista de Usuarios</h2>
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Cédula</th>
                    <th>Nombre</th>
                    <th>Certificado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.filter(u => u.rol !== 'admin').map(user => (
                    <tr key={user._id}>
                      <td>{user.cedula}</td>
                      <td>{user.nombre}</td>
                      <td>
                        {user.certificado ? (
                          <span className="admin__badge admin__badge--ok">✓ Asignado</span>
                        ) : (
                          <span className="admin__badge admin__badge--pending">Sin certificado</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="admin__btn admin__btn--danger"
                          onClick={() => handleEliminar(user._id, user.cedula)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {usuarios.filter(u => u.rol !== 'admin').length === 0 && !loading && (
              <p className="admin__empty">No hay usuarios registrados</p>
            )}
          </div>
        )}

        {/* Tab: Crear Usuario */}
        {activeTab === 'crear' && (
          <div className="admin__section">
            <h2>Crear Nuevo Usuario</h2>
            <form className="admin__form" onSubmit={handleCrearUsuario}>
              <div className="admin__field">
                <label>Cédula *</label>
                <input
                  type="text"
                  value={nuevoUsuario.cedula}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, cedula: e.target.value})}
                  placeholder="Número de cédula"
                />
                <small>Esta será también la contraseña inicial</small>
              </div>
              <div className="admin__field">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={nuevoUsuario.nombre}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                  placeholder="Nombre del usuario"
                />
              </div>
              <div className="admin__field">
                <label>Email (opcional)</label>
                <input
                  type="email"
                  value={nuevoUsuario.email}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <button type="submit" className="admin__btn admin__btn--primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
            </form>
          </div>
        )}

        {/* Tab: Subir Certificado */}
        {activeTab === 'certificado' && (
          <div className="admin__section">
            <h2>Subir Certificado</h2>
            <form className="admin__form" onSubmit={handleSubirCertificado}>
              {/* Buscar usuario */}
              <div className="admin__field">
                <label>Buscar Usuario por Cédula</label>
                <div className="admin__search">
                  <input
                    type="text"
                    value={certForm.cedula}
                    onChange={(e) => {
                      setCertForm({...certForm, cedula: e.target.value});
                      setUsuarioEncontrado(null);
                    }}
                    placeholder="Ingresa la cédula"
                  />
                  <button type="button" onClick={buscarUsuario} disabled={loading}>
                    🔍 Buscar
                  </button>
                </div>
              </div>

              {/* Info usuario encontrado */}
              {usuarioEncontrado && (
                <div className="admin__user-found">
                  <p><strong>Usuario:</strong> {usuarioEncontrado.nombre}</p>
                  <p><strong>Cédula:</strong> {usuarioEncontrado.cedula}</p>
                  {usuarioEncontrado.certificado && (
                    <p className="admin__warning">⚠️ Este usuario ya tiene un certificado. Se reemplazará.</p>
                  )}
                </div>
              )}

              <div className="admin__field">
                <label>Fecha de Emisión</label>
                <input
                  type="date"
                  value={certForm.fechaEmision}
                  onChange={(e) => setCertForm({...certForm, fechaEmision: e.target.value})}
                />
              </div>

              <div className="admin__field">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={certForm.fechaVencimiento}
                  onChange={(e) => setCertForm({...certForm, fechaVencimiento: e.target.value})}
                />
              </div>

              <div className="admin__field">
                <label>Archivo PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCertForm({...certForm, archivo: e.target.files[0]})}
                />
              </div>

              <button 
                type="submit" 
                className="admin__btn admin__btn--primary" 
                disabled={loading || !usuarioEncontrado}
              >
                {loading ? 'Subiendo...' : '📤 Subir Certificado'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;