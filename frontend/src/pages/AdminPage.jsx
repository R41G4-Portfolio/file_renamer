import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Layout';
import { AdminStats, AdminTable, AdminAuditTable } from '../components/Admin';
import { api } from '../services/api';
import Spinner from '../components/Spinner';
import Swal from 'sweetalert2';
import styles from '../components/Admin/AdminPage.module.css';

const AdminPage = () => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [templates, setTemplates] = useState([]);
	const [stats, setStats] = useState({});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const allTemplates = await api.getTemplates();
			setTemplates(allTemplates);
			
			const statsData = {
				total: allTemplates.length,
				active: allTemplates.filter(t => t.status === 'ACTIVE').length,
				completed: allTemplates.filter(t => t.status === 'COMPLETED').length,
				cancelled: allTemplates.filter(t => t.status === 'CANCELLED').length,
				totalUploads: 0
			};
			
			allTemplates.forEach(template => {
				if (template.assignments) {
					statsData.totalUploads += template.assignments.filter(a => a.status === 'UPLOADED').length;
				}
			});
			
			setStats(statsData);
		} catch (error) {
			console.error('Error:', error);
			Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spinner />;

	return (
		<div className={styles.adminPage}>
			<Header title="File Renamer - Admin" />
			<main className={styles.main}>
				<h2>Panel de monitoreo</h2>
				<AdminStats stats={stats} />
				<AdminTable templates={templates} onRefresh={fetchData} />
				<AdminAuditTable />
			</main>
		</div>
	);
};

export default AdminPage;