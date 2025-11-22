import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import InicioUser from './pages/user/InicioUser';
import AdminPanel from './pages/admin/AdminPanel';
import './App.css'

// Componente para proteger rutas
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && rol !== requiredRole) {
    if (requiredRole === 'admin') {
      return <Navigate to="/InicioUser" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta de usuario */}
        <Route 
          path="/InicioUser" 
          element={
            <ProtectedRoute>
              <InicioUser />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;