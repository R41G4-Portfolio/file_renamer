import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';
import './App.css';

function App() {
    return (
        <div className="app">
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </div>
    );
}

export default App;