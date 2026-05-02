import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './Header.css';

const Header = ({ title, showBackButton = false, backPath = '/dashboard' }) => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<header className="header">
			<h1 className="header__title">{title}</h1>
			<div className="header__user-info">
				<span className="header__user-name">{user?.name}</span>
				<span className="header__user-role">{user?.role}</span>
				{showBackButton && (
					<button 
						className="header__back-btn"
						onClick={() => navigate(backPath)}
					>
						← Volver
					</button>
				)}
				<button className="header__logout" onClick={handleLogout}>
					Cerrar sesión
				</button>
			</div>
		</header>
	);
};

export default Header;