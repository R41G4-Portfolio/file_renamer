import './AdminStats.css'
const AdminStats = ({ stats }) => {
	return (
		<table className="admin-stats-table">
			<thead>
				<tr>
					<th>Total</th>
					<th>Activas</th>
					<th>Completadas</th>
					<th>Canceladas</th>
					<th>Archivos subidos</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{stats.total}</td>
					<td className="stat-active">{stats.active}</td>
					<td className="stat-completed">{stats.completed}</td>
					<td className="stat-cancelled">{stats.cancelled}</td>
					<td>{stats.totalUploads}</td>
				</tr>
			</tbody>
		</table>
	);
};

export default AdminStats;