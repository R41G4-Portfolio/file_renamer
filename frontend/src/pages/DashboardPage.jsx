import { useEffect } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';

const DashboardPage = () => {
	useEffect(() => {
		document.title = 'Dashboard - File Renamer';
	}, []);

	return (
		/* Esta clase 'layout-container' es la que activará el flex */
		<div className="layout-container">
			<main className="dashboard-page__main">
				<Dashboard />
			</main>
		</div>
	);
};

export default DashboardPage;