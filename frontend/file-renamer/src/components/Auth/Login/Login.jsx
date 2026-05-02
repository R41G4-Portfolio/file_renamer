import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { loginSchema } from '../../../utils/validations';
import './Login.css';

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();

	const handleEmailChange = (e) => {
		const value = e.target.value;
		setEmail(value);
		const result = loginSchema.safeParse({ email: value, password });
		if (!result.success) {
			const flattened = result.error.flatten();
			setEmailError(flattened.fieldErrors?.email?.[0] || '');
		} else {
			setEmailError('');
		}
	};

	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);
		const result = loginSchema.safeParse({ email, password: value });
		if (!result.success) {
			const flattened = result.error.flatten();
			setPasswordError(flattened.fieldErrors?.password?.[0] || '');
		} else {
			setPasswordError('');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const result = await login(email, password);

			if (result.success) {
				navigate('/dashboard');
			} else {
				setError(result.error || 'Error al iniciar sesión');
			}
		} catch (err) {
			setError('Error de conexión');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="login">
			<div className="login__card">
				<h1 className="login__title">File Renamer</h1>
				<h2 className="login__subtitle">Iniciar Sesión</h2>

				<form className="login__form" onSubmit={handleSubmit} noValidate>
					<div className="login__field">
						<label className="login__label">Email</label>
						<input
							type="text"
							className="login__input"
							value={email}
							onChange={handleEmailChange}
						/>
						{emailError && <span className="login__field-error">{emailError}</span>}
					</div>

					<div className="login__field">
						<label className="login__label">Contraseña</label>
						<input
							type="password"
							className="login__input"
							value={password}
							onChange={handlePasswordChange}
						/>
						{passwordError && <span className="login__field-error">{passwordError}</span>}
					</div>

					{error && <div className="login__error">{error}</div>}

					<button
						type="submit"
						className="login__button"
						disabled={isLoading}
					>
						{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
					</button>

					<button
						type="button"
						className="login__link-button"
						onClick={() => navigate('/register')}
					>
						¿No tienes cuenta? Regístrate
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;