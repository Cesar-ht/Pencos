import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/index.css';

const InicioUser = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    cedula: '',
    nombre: ''
  });
  const [certificateData, setCertificateData] = useState(null);

  const token = localStorage.getItem('token');

  // Obtener datos del usuario y certificado al montar
  useEffect(() => {
    const cedula = localStorage.getItem('usuario');
    const nombre = localStorage.getItem('nombre') || 'Usuario';
   
    if (!cedula || !token) {
      navigate('/login');
      return;
    }

    setUserData({ cedula, nombre });
    obtenerCertificado();
  }, [navigate, token]);

  // Obtener certificado desde la API
  const obtenerCertificado = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/certificate/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCertificateData({
          nombreArchivo: data.nombreArchivo,
          fechaEmision: formatearFecha(data.fechaEmision),
          fechaVencimiento: formatearFecha(data.fechaVencimiento),
          estado: data.estado === 'vigente' ? 'Vigente y Válido' : 
                  data.estado === 'vencido' ? 'Vencido' : 'Revocado'
        });
      } else {
        setCertificateData(null);
      }
    } catch (err) {
      console.error('Error al obtener certificado:', err);
      setCertificateData(null);
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha a español (sin problemas de zona horaria)
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    // Usar UTC para evitar desfase de zona horaria
    const dia = fecha.getUTCDate();
    const mes = fecha.toLocaleString('es-ES', { month: 'long', timeZone: 'UTC' });
    const año = fecha.getUTCFullYear();
    return `${dia} de ${mes} de ${año}`;
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav__dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const openModal = () => {
    setModalOpen(true);
    setDropdownOpen(false);
  };

  const closeModal = () => setModalOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const downloadPDF = async () => {
    try {
      const res = await fetch('/api/certificate/download', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        alert('Error al descargar el certificado');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = certificateData?.nombreArchivo || 'certificado.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error al descargar:', err);
      alert('Error al descargar el certificado');
    }
  };

  return (
    <>
      {/* Navegación */}
      <nav>
        <div className="nav__logo">
          <div className="nav__logo-icon">⚙</div>
          <span className="nav__logo-text">ITSA</span>
        </div>

        <div className="nav__user-section">
          <div className="nav__user-info">
            <div className="nav__user-avatar">
              {userData.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="nav__user-details">
              <span className="nav__user-name">{userData.nombre}</span>
              <span className="nav__user-id">{userData.cedula}</span>
            </div>
          </div>

          <div className="nav__dropdown">
            <button className="nav__menu-btn" onClick={toggleDropdown}>
              ☰ Menú
            </button>
            {dropdownOpen && (
              <div className="nav__dropdown-menu active">
                {certificateData && (
                  <button className="nav__dropdown-item" onClick={openModal}>
                    Ver Certificado
                  </button>
                )}
                <button 
                  className="nav__dropdown-item"
                  style={{ color: '#e74c3c' }}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="container">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Bienvenido, {userData.nombre}</h1>
          <p className="dashboard__subtitle">
            {certificateData 
              ? 'Aquí puedes descargar tu certificado'
              : 'Aún no tienes un certificado asignado'}
          </p>
        </div>

        <div className="dashboard__content">
          {loading ? (
            <p>Cargando...</p>
          ) : certificateData ? (
            <div className="card">
              <div className="card__title">
                <div className="card__icon"></div>
                Certificado de Alturas
              </div>
              <div className="card__description">
                <p><strong>Estado:</strong> {certificateData.estado}</p>
                <p><strong>Vence:</strong> {certificateData.fechaVencimiento}</p>
              </div>
              <button className="card__button" onClick={openModal}>
                Ver Certificado
              </button>
            </div>
          ) : (
            <div className="card">
              <div className="card__title">
                <div className="card__icon"></div>
                Sin Certificado
              </div>
              <div className="card__description">
                No tienes un certificado asignado. Contacta al administrador.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Certificado */}
      {modalOpen && certificateData && (
        <div 
          className="modal active"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal__content">
            <div className="modal__header">
              <h2 className="modal__title">Certificado de Alturas</h2>
              <button className="modal__close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="modal__body">
              <div className="modal__field">
                <label className="modal__label">Nombre del Archivo</label>
                <div className="modal__value">{certificateData.nombreArchivo}</div>
              </div>

              <div className="modal__field">
                <label className="modal__label">Fecha de Emisión</label>
                <div className="modal__value">{certificateData.fechaEmision}</div>
              </div>

              <div className="modal__field">
                <label className="modal__label">Fecha de Vencimiento</label>
                <div className="modal__value">{certificateData.fechaVencimiento}</div>
              </div>

              <div className="modal__field">
                <label className="modal__label">Estado</label>
                <div className="modal__value" style={{ 
                  color: certificateData.estado === 'Vigente y Válido' ? '#27ae60' : '#e74c3c' 
                }}>
                  {certificateData.estado === 'Vigente y Válido' ? '✓' : '✗'} {certificateData.estado}
                </div>
              </div>
            </div>

            <div className="modal__actions">
              <button 
                className="modal_button modal_button-primary"
                onClick={downloadPDF}
              >
                Descargar PDF
              </button>
              <button 
                className="modal_button modal_button-secondary"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InicioUser;