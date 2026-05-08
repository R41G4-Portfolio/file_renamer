import { useEffect } from 'react';
import { Header, Footer } from '../components/Layout';
import Dashboard from '../components/Dashboard/Dashboard';

const DashboardPage = () => {
	useEffect(() => {
		document.title = 'Dashboard - File Renamer';
	}, []);

	return (
		<div className="dashboard-page">
			<Header title="File Renamer" />
			<main className="dashboard-page__main">
				<Dashboard />
			</main>
			<Footer />
		</div>
	);
};

export default DashboardPage;