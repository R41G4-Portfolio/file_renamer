import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
/*
export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			try {
				const response = await api.getSessionData();
				if (response.success && response.data) {
					setUser(response.data);
					setIsAuthenticated(true);
				} else {
					// Si el servidor dice que no, limpiamos
					setIsAuthenticated(false);
					setUser(null);
				}
			} catch (error) {
				setIsAuthenticated(false);
				console.error("Sesión no válida");
			} finally {
				setLoading(false);
			}
		};
		initAuth();
	}, []);

	const login = async (email, password) => {
        try {
            const response = await api.login({ email, password });
            if (response.success && response.data) {
                setUser({
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role
                });
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, error: response.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

	const register = async (userData) => {
		try {
			const response = await api.register(userData);
			if (response.success) {
				return { success: true };
			}
			return { success: false, error: response.message };
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            // No intentamos borrar la cookie por JS si es httpOnly, 
            // el backend ya debió enviar el Set-Cookie de borrado.
        }
    };

	return (
		<AuthContext.Provider value={{
			isAuthenticated,
			user,
			loading,
			login,
			register,
			logout
		}}>
			{children}
		</AuthContext.Provider>
	);
};
*/

// src/contexts/AuthContext.jsx
export const AuthProvider = ({ children }) => {
    // FORZAMOS ESTADO AUTENTICADO PARA PRUEBAS DE ESTILO
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [user, setUser] = useState({
        name: 'Usuario Probeta',
        email: 'test@example.com',
        role: 'ADMIN' // Cámbialo aquí a 'DOWNLOADER' o 'UPLOADER' para probar cada vista
    });
    const [loading, setLoading] = useState(false); // Siempre false para no ver el spinner

    // Deja las funciones vacías por ahora para que no truene al hacer click
    const login = async () => ({ success: true });
    const register = async () => ({ success: true });
    const logout = () => {
        setIsAuthenticated(false);
        console.log("Logout simulado");
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};