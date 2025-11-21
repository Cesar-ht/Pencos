import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api/auth'; 

export function useAuth() {
    // Intenta leer el usuario y el token de localStorage al inicio
    const initialUser = JSON.parse(localStorage.getItem('user')) || null;
    const initialToken = localStorage.getItem('token') || null;

    const [user, setUser] = useState(initialUser);
    const [token, setToken] = useState(initialToken);
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Sincronizar el estado con localStorage
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
        }
    }, [token, user]);

    /**
     * Función para iniciar sesión.
     */
    const login = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Almacenar el token y el usuario en el estado
            setToken(data.token);
            setUser(data.user);
            return data.user;

        } catch (error) {
            console.error('Login fallido:', error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    const logout = () => {
        setToken(null);
        setUser(null);
        // localStorage se limpia en el useEffect gracias a la dependencia [token]
    };

    return {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
    };
}