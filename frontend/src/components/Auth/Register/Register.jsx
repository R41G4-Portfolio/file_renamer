import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { registerSchema } from '../../../utils/validations';

// Constantes e Infraestructura
import { INTERNAL_ROUTES } from '../../../constants/routes';
import { PAGE_META } from '../../../constants/meta';
import { getUserMessage } from '../../../constants/responseCodes';
import HelmetMeta from '../../common/HelmetMeta';

const Register = () => {
	const navigate = useNavigate();
	const { register } = useAuth();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		// El rol ya no se envía desde el formulario, 
		// el backend lo asignará por defecto (DOWNLOADER).
	});
	
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [fieldErrors, setFieldErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		
		if (fieldErrors[name]) {
			setFieldErrors({ ...fieldErrors, [name]: '' });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setFieldErrors({});

		// Validación con Zod
		const result = registerSchema.safeParse(formData);
		if (!result.success) {
			const errors = {};
			result.error.errors.forEach((err) => {
				errors[err.path[0]] = err.message;
			});
			setFieldErrors(errors);
			return;
		}

		setIsLoading(true);
		try {
			// Enviamos los datos. El backend ignorará roles inyectados o usará su default.
			const registerResult = await register(formData);

			if (registerResult.success) {
				setSuccess('Usuario registrado correctamente. Redirigiendo...');
				setTimeout(() => {
					navigate(INTERNAL_ROUTES.LOGIN);
				}, 2000);
			} else {
				setError(getUserMessage(registerResult));
			}
		} catch (err) {
			setError(getUserMessage({ code: 'ERR-999' }));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<HelmetMeta 
				title={PAGE_META.REGISTER.title} 
				description={PAGE_META.REGISTER.description} 
				keywords={PAGE_META.REGISTER.keywords} 
			/>

			<div className="register">
				<div className="register__card">
					<h1 className="register__title">File Renamer</h1>
					<h2 className="register__subtitle">Registro de Usuario</h2>

					<form className="register__form" onSubmit={handleSubmit} noValidate>
						<div className="register__field">
							<label className="register__label">Nombre</label>
							<input
								type="text"
								name="name"
								className="register__input"
								value={formData.name}
								onChange={handleChange}
								placeholder="Tu nombre"
								autoComplete="name"
							/>
							{fieldErrors.name && <span className="register__field-error">{fieldErrors.name}</span>}
						</div>

						<div className="register__field">
							<label className="register__label">Email</label>
							<input
								type="email"
								name="email"
								className="register__input"
								value={formData.email}
								onChange={handleChange}
								placeholder="ejemplo@correo.com"
								autoComplete="email"
							/>
							{fieldErrors.email && <span className="register__field-error">{fieldErrors.email}</span>}
						</div>

						<div className="register__field">
							<label className="register__label">Contraseña</label>
							<input
								type="password"
								name="password"
								className="register__input"
								value={formData.password}
								onChange={handleChange}
								placeholder="******"
								autoComplete="new-password"
							/>
							{fieldErrors.password && <span className="register__field-error">{fieldErrors.password}</span>}
						</div>

						{error && <div className="register__error-message">{error}</div>}
						{success && <div className="register__success-message">{success}</div>}

						<button
							type="submit"
							className="btn btn--primary register__button"
							disabled={isLoading}
						>
							{isLoading ? 'Registrando...' : 'Registrarse'}
						</button>

						<button
							type="button"
							className="login__link-button"
							onClick={() => navigate(INTERNAL_ROUTES.LOGIN)}
						>
							¿Ya tienes cuenta? Inicia sesión
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default Register;