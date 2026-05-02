import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Verificar autenticación al cargar la app
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const userData = await api.getPerfil();
				setUser(userData);
				setIsAuthenticated(true);
			} catch (error) {
				setIsAuthenticated(false);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		checkAuth();
	}, []);

	// Iniciar sesión
	const login = async (email, password) => {
		try {
			// Primero intentar cerrar sesión (limpia cookie en backend)
			await fetch('http://localhost:5000/auth/logout', {
				method: 'POST',
				credentials: 'include'
			});
			
			const result = await api.login({ email, password });
			
			if (result.message && result.message.includes('Sesión iniciada')) {
				const userData = await api.getPerfil();
				setUser(userData);
				setIsAuthenticated(true);
				return { success: true };
			}
			
			return { success: false, error: result.error };
		} catch (error) {
			return { success: false, error: 'Error de conexión' };
		}
	};

	// Registrar usuario
	const register = async (userData) => {
		try {
			await api.register(userData);
			return { success: true };
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	// Cerrar sesión
	const logout = async () => {
		try {
			await api.logout();
			setUser(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error('Error en logout:', error);
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