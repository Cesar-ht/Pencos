// Configuración de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper para hacer peticiones
export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const headers = {
    ...options.headers,
  };

  // Solo agregar Content-Type si no es FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Solo agregar Authorization si hay token Y no está en la lista de exclusión
  const noAuthEndpoints = ['/api/auth/login', '/api/auth/registro'];
  if (token && !noAuthEndpoints.includes(endpoint)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);
  return response;
};