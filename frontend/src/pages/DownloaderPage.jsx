import { Header } from '../components/Layout';
import DownloaderPanel from '../components/Downloader/DownloaderPanel';

const DownloaderPage = () => {
	return (
		<div className="downloader-page">
			<main className="downloader-page__main">
				<DownloaderPanel />
			</main>
		</div>
	);
};

export default DownloaderPage;