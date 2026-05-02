import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('token='));
		
		if (!hasCookie) {
			setLoading(false);
			return;
		}
		
		// No validamos la cookie con el backend, solo asumimos que es válida
		setIsAuthenticated(true);
		setLoading(false);
	}, []);

	const login = async (email, password) => {
		try {
			// Limpiar cookie existente
			document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			
			const response = await api.login({ email, password });
			
			if (response.success && response.data) {
				// Los datos vienen directamente del login
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
			console.error('Error en login:', error);
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
			document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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