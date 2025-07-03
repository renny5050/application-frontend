// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
// src/components/ProtectedRoute.jsx
import { jwtDecode } from 'jwt-decode'; // Cambiado de import jwtDecode a { jwtDecode }

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRoleFromToken = () => {
      try {
        // 1. Obtener token de localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setLoading(false);
          return;
        }

        // 2. Decodificar el token (sin verificar firma)
        const decoded = jwtDecode(token);
        
        // 3. Verificar expiración
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('authToken');
          return;
        }

        setRole(decoded.role_id);
      } catch (error) {
        console.error('Error decodificando token:', error);
      } finally {
        setLoading(false);
      }
    };

    getRoleFromToken();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Mostrar spinner
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;