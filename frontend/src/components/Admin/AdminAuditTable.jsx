import { useEffect, useState } from 'react';
import styles from './AdminPage.module.css';

const AdminAuditTable = () => {
	const [auditLogs, setAuditLogs] = useState([]);
	const [filteredLogs, setFilteredLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		userId: '',
		action: '',
		startDate: '',
		endDate: ''
	});
	const [users, setUsers] = useState([]);
	const [actions, setActions] = useState([]);
	const [stats, setStats] = useState({ totalUsers: 0, totalActions: 0 });

	useEffect(() => {
		fetchAuditLogs();
	}, []);

	const fetchAuditLogs = async () => {
		try {
			const response = await fetch('http://localhost:5000/audit', {
				credentials: 'include'
			});
			const data = await response.json();
			setAuditLogs(data);
			setFilteredLogs(data);
			
			// Extraer usuarios distintos por NOMBRE (no por ID)
			const uniqueUsersMap = new Map();
			data.forEach(log => {
				let userName = 'N/A';
				
				switch (true) {
					case !!log.userName:
						userName = log.userName;
						break;
					case !!log.userId?.name:
						userName = log.userId.name;
						break;
					case !!log.userId?.email:
						userName = log.userId.email.split('@')[0];
						break;
					case typeof log.userId === 'string':
						userName = null;
						break;
					default:
						userName = 'N/A';
				}
				
				if (userName && !uniqueUsersMap.has(userName)) {
					uniqueUsersMap.set(userName, { id: userName, name: userName });
				}
			});
			
			const uniqueUsers = Array.from(uniqueUsersMap.values());
			setUsers(uniqueUsers);
			
			// Extraer acciones distintas
			const uniqueActions = [...new Set(data.map(log => log.action))];
			setActions(uniqueActions);
			
			setStats({
				totalUsers: uniqueUsers.length,
				totalActions: uniqueActions.length
			});
		} catch (error) {
			console.error('Error al cargar auditoría:', error);
		} finally {
			setLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...auditLogs];
		
		if (filters.userId) {
			filtered = filtered.filter(log => {
				let logUserName = null;
				
				switch (true) {
					case !!log.userName:
						logUserName = log.userName;
						break;
					case !!log.userId?.name:
						logUserName = log.userId.name;
						break;
					case !!log.userId?.email:
						logUserName = log.userId.email.split('@')[0];
						break;
					default:
						logUserName = null;
				}
				
				return logUserName === filters.userId;
			});
		}
		
		if (filters.action) {
			filtered = filtered.filter(log => log.action === filters.action);
		}
		
		if (filters.startDate) {
			const start = new Date(filters.startDate);
			start.setHours(0, 0, 0);
			filtered = filtered.filter(log => new Date(log.timestamp) >= start);
		}
		
		if (filters.endDate) {
			const end = new Date(filters.endDate);
			end.setHours(23, 59, 59);
			filtered = filtered.filter(log => new Date(log.timestamp) <= end);
		}
		
		setFilteredLogs(filtered);
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters(prev => ({ ...prev, [name]: value }));
	};

	const handleApplyFilters = () => {
		applyFilters();
	};

	const handleResetFilters = () => {
		setFilters({
			userId: '',
			action: '',
			startDate: '',
			endDate: ''
		});
		setFilteredLogs(auditLogs);
	};

	const getActionText = (action) => {
		const actionsMap = {
			'LOGIN': 'Inicio de sesión',
			'LOGOUT': 'Cierre de sesión',
			'UPLOAD_TEMPLATE': 'Subió plantilla',
			'UPLOAD_FILE': 'Subió archivo',
			'GENERATE_ZIP': 'Generó ZIP',
			'DOWNLOAD_ZIP': 'Descargó ZIP',
			'APPROVE_TEMPLATE': 'Aprobó plantilla',
			'CANCEL_TEMPLATE': 'Canceló plantilla',
			'ASSIGN_TEMPLATE': 'Asignó usuario',
			'REGISTER': 'Registro'
		};
		return actionsMap[action] || action;
	};

	const getActionClass = (action) => {
		const classesMap = {
			'LOGIN': styles.actionLogin,
			'LOGOUT': styles.actionLogout,
			'UPLOAD_TEMPLATE': styles.actionUploadTemplate,
			'UPLOAD_FILE': styles.actionUploadFile,
			'GENERATE_ZIP': styles.actionGenerateZip,
			'DOWNLOAD_ZIP': styles.actionDownloadZip,
			'APPROVE_TEMPLATE': styles.actionApprove,
			'CANCEL_TEMPLATE': styles.actionCancel
		};
		return classesMap[action] || '';
	};

	const getUserDisplayName = (log) => {
		switch (true) {
			case !!log.userName:
				return log.userName;
			case !!log.userId?.name:
				return log.userId.name;
			case !!log.userId?.email:
				return log.userId.email.split('@')[0];
			default:
				return 'N/A';
		}
	};

	if (loading) {
		return <div className={styles.auditLoading}>Cargando auditoría...</div>;
	}

	return (
		<div className={styles.auditContainer}>
			<h3>Movimientos recientes</h3>
			
			<div className={styles.auditStats}>
				<span className={styles.auditStat}>
					📊 Usuarios distintos: <strong>{stats.totalUsers}</strong>
				</span>
				<span className={styles.auditStat}>
					📋 Acciones distintas: <strong>{stats.totalActions}</strong>
				</span>
				<span className={styles.auditStat}>
					📝 Total registros: <strong>{auditLogs.length}</strong>
				</span>
			</div>
			
			<div className={styles.auditFilters}>
				<select name="userId" value={filters.userId} onChange={handleFilterChange}>
					<option value="">Todos los usuarios</option>
					{users.map(user => (
						<option key={user.id} value={user.id}>{user.name}</option>
					))}
				</select>
				
				<select name="action" value={filters.action} onChange={handleFilterChange}>
					<option value="">Todas las acciones</option>
					{actions.map(action => (
						<option key={action} value={action}>{getActionText(action)}</option>
					))}
				</select>
				<label className={styles.filterLabel}>Desde:</label>
				<input
					type="date"
					name="startDate"
					value={filters.startDate}
					onChange={handleFilterChange}
				/>
				<label className={styles.filterLabel}>Hasta:</label>
				<input
					type="date"
					name="endDate"
					value={filters.endDate}
					onChange={handleFilterChange}
				/>
				
				<button className={styles.filterApplyBtn} onClick={handleApplyFilters}>
					Filtrar
				</button>
				
				<button className={styles.filterResetBtn} onClick={handleResetFilters}>
					Limpiar
				</button>
			</div>
			
			<div className={styles.auditTableWrapper}>
				<table className={styles.auditTable}>
					<thead>
						<tr>
							<th>Usuario</th>
							<th>Acción</th>
							<th>Recurso</th>
							<th>IP</th>
							<th>Fecha</th>
						</tr>
					</thead>
					<tbody>
						{filteredLogs.map((log) => (
							<tr key={log.id || log._id}>
								<td>{getUserDisplayName(log)}</td>
								<td className={getActionClass(log.action)}>
									{getActionText(log.action)}
								</td>
								<td>{log.targetId || '—'}</td>
								<td>{log.ipAddress || '—'}</td>
								<td>{new Date(log.timestamp).toLocaleString()}</td>
								</tr>
						))}
					</tbody>
				</table>
			</div>
			
			{filteredLogs.length === 0 && (
				<p className={styles.auditEmpty}>No hay registros de auditoría</p>
			)}
		</div>
	);
};

export default AdminAuditTable;