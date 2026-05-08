// src/App.jsx
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';
import { Header, Footer } from './components/Layout'; // Importación única
import './css/layout.css'; // Asegúrate de cargar el CSS aquí

function App() {
    return (
        <div className="app">
            <AuthProvider>
                {/* El contenedor flex debe envolver todo 
                  para que el margin-top: auto del footer funcione 
                */}
                <div className="layout-container">
                    <Header title="File Renamer" />
                    
                    <main className="main-content">
                        <AppRoutes />
                    </main>
                    
                    <Footer />
                </div>
            </AuthProvider>
        </div>
    );
}

export default App;