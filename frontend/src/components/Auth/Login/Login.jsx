import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { loginSchema } from '../../../utils/validations';

// Importación de constantes
import { IMAGES } from '../../../constants/images';
import { INTERNAL_ROUTES } from '../../../constants/routes';
import { PAGE_META } from '../../../constants/meta';
import { getUserMessage } from '../../../constants/responseCodes';
import HelmetMeta from '../../common/HelmetMeta'; // Tu componente para SEO

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();

	// Validaciones en tiempo real (Zod)
	const handleEmailChange = (e) => {
		const value = e.target.value;
		setEmail(value);
		const result = loginSchema.safeParse({ email: value, password });
		setEmailError(!result.success ? result.error.flatten().fieldErrors?.email?.[0] : '');
	};

	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);
		const result = loginSchema.safeParse({ email, password: value });
		setPasswordError(!result.success ? result.error.flatten().fieldErrors?.password?.[0] : '');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const result = await login(email, password);
			if (result.success) {
				navigate(INTERNAL_ROUTES.DASHBOARD);
			} else {
				// Aquí usamos tu función getUserMessage para transformar el error del backend
				setError(getUserMessage(result));
			}
		} catch (err) {
			setError(getUserMessage({ code: 'ERR-999' })); // Error de conexión
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{/* Integración de Meta Datos */}
			<HelmetMeta 
				title={PAGE_META.LOGIN.title} 
				description={PAGE_META.LOGIN.description} 
				keywords={PAGE_META.LOGIN.keywords} 
			/>

			<div className="login">
				<div className="login__card">
					{/* Imagen con constantes de src y alt */}
					
					{/*
					<img 
						src={IMAGES.LOGO.src} 
						alt={IMAGES.LOGO.alt} 
						className="login__logo" 
						aria-label={IMAGES.LOGO.ariaLabel}
					/>
					*/}
					
					<h1 className="login__title">File Renamer</h1>
					<h2 className="login__subtitle">Iniciar Sesión</h2>

					<form className="login__form" onSubmit={handleSubmit} noValidate>
						<div className="login__field">
							<label className="login__label">Email</label>
							<input
								type="email"
								className="login__input"
								value={email}
								onChange={handleEmailChange}
								placeholder="ejemplo@correo.com"
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
								placeholder="******"
							/>
							{passwordError && <span className="login__field-error">{passwordError}</span>}
						</div>

						{error && <div className="login__error-message">{error}</div>}

						{/* Uso de clases globales btn + clase específica */}
						<button
							type="submit"
							className="btn btn--primary login__button"
							disabled={isLoading}
						>
							{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
						</button>

						<button
							type="button"
							className="login__link-button"
							onClick={() => navigate(INTERNAL_ROUTES.REGISTER)}
						>
							¿No tienes cuenta? Regístrate
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default Login;