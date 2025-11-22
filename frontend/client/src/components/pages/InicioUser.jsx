import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/index.css'

const InicioUser = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    cedula: '',
    nombre: ''
  });
  const [certificateData, setCertificateData] = useState({
    nombreArchivo: 'Certificado_Alturas.pdf',
    fechaEmision: '15 de Junio de 2023',
    fechaVencimiento: '15 de Junio de 2026',
    estado: 'Vigente y Válido'
  });

  // Obtener datos del usuario al montar el componente
  useEffect(() => {
    const cedula = localStorage.getItem('usuario');
    const nombre = localStorage.getItem('nombre') || 'Usuario';
   
    if (!cedula) {
          navigate('/sesion');
          return;
        }

    setUserData({
      cedula: cedula,
      nombre: nombre
    });
  }, [navigate]);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openModal = () => {
    setModalOpen(true);
    setDropdownOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombre');
    navigate('/login');
  }
};

const downloadPDF = () => {
  const token = localStorage.getItem('token');
  
  fetch('/api/certificate/download', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = certificateData.nombreArchivo;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch(err => {
      console.error('Error al descargar:', err);
      alert('Error al descargar el certificado');
    });
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
            <div className="nav__user-avatar">CD</div>
            <div className="nav__user-details">
              <span className="nav__user-name">Cédula</span>
              <span className="nav__user-id">{userData.cedula}</span>
            </div>
          </div>

          <div className="nav__dropdown">
            <button className="nav__menu-btn" onClick={toggleDropdown}>
              ☰ Menú
            </button>
            {dropdownOpen && (
              <div className="nav__dropdown-menu active" id="dropdownMenu">
                <button 
                  className="nav__dropdown-item" 
                  onClick={openModal}
                >
                  📄 Ver Certificado
                </button>
                <button 
                  className="nav__dropdown-item"
                  style={{ color: '#e74c3c' }}
                  onClick={handleLogout}
                >
                  🚪 Cerrar Sesión
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
            Aquí puedes descargar tu certificado
          </p>
        </div>

        <div className="dashboard__content">
          <div className="card">
            <div className="card__title">
              <div className="card__icon">📄</div>
              Certificado de Alturas
            </div>
            <div className="card__description">
              Descarga tu certificado oficial de competencia en trabajo en alturas vigente.
            </div>
            <button className="card__button" onClick={openModal}>
              Descargar Certificado
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Certificado */}
      {modalOpen && (
        <div 
          className="modal active"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal__content">
            <div className="modal__header">
              <h2 className="modal__title">📄 Certificado de Alturas</h2>
              <button 
                className="modal__close" 
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="modal__body">
              <div className="modal__field">
                <label className="modal__label">Nombre del Certificado</label>
                <div className="modal__value">
                  Certificado_Alturas_{userData.cedula}.pdf
                </div>
              </div>

              <div className="modal__field">
                <label className="modal__label">Fecha de Emisión</label>
                <div className="modal__value">{certificateData.fechaEmision}</div>
              </div>

              <div className="modal__field">
                <label className="modal__label">Fecha de Vencimiento</label>
                <div className="modal__value">
                  {certificateData.fechaVencimiento}
                </div>
              </div>

              <div className="modal__field">
                <label className="modal__label">Estado</label>
                <div className="modal__value" style={{ color: '#27ae60' }}>
                  ✓ {certificateData.estado}
                </div>
              </div>
            </div>

            <div className="modal__actions">
              <button 
                className="modal_button modal_button-primary"
                onClick={downloadPDF}
              >
                ⬇ Descargar PDF
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