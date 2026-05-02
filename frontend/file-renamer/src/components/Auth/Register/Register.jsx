import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { registerSchema } from '../../../utils/validations';
import './Register.css';

const Register = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: 'DOWNLOADER'
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [fieldErrors, setFieldErrors] = useState({});

	const { register } = useAuth();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setFieldErrors({});

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
		const registerResult = await register(formData);

		if (registerResult.success) {
			setSuccess('Usuario registrado correctamente');
			setTimeout(() => {
				navigate('/login');
			}, 2000);
		} else {
			setError(registerResult.error || 'Error al registrar usuario');
		}

		setIsLoading(false);
	};

	return (
		<div className="register">
			<div className="register__card">
				<h1 className="register__title">File Renamer</h1>
				<h2 className="register__subtitle">Registro de Usuario</h2>

				<form className="register__form" onSubmit={handleSubmit}>
					<div className="register__field">
						<label className="register__label">Nombre</label>
						<input
							type="text"
							name="name"
							className="register__input"
							value={formData.name}
							onChange={handleChange}
						/>
						{fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
					</div>

					<div className="register__field">
						<label className="register__label">Email</label>
						<input
							type="email"
							name="email"
							className="register__input"
							value={formData.email}
							onChange={handleChange}
						/>
						{fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
					</div>

					<div className="register__field">
						<label className="register__label">Contraseña</label>
						<input
							type="password"
							name="password"
							className="register__input"
							value={formData.password}
							onChange={handleChange}
						/>
						{fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
					</div>

					{error && <div className="register__error">{error}</div>}
					{success && <div className="register__success">{success}</div>}

					<button
						type="submit"
						className="register__button"
						disabled={isLoading}
					>
						{isLoading ? 'Registrando...' : 'Registrarse'}
					</button>

					<button
						type="button"
						className="register__link-button"
						onClick={() => navigate('/login')}
					>
						Volver al inicio de sesión
					</button>
				</form>
			</div>
		</div>
	);
};

export default Register;