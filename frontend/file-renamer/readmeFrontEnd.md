FRONTEND README.md - File Renamer

Tecnologías

- React 18
- Vite
- React Router DOM
- CSS BEM (responsivo)

Estructura

src/
├── components/
├── pages/
├── contexts/
├── services/
├── constants/
├── routes/
├── App.jsx
└── main.jsx

Variables de entorno

VITE_API_URL=http://localhost:5000

Scripts

npm run dev
npm run build

Endpoints que consume

POST /auth/register - Registro
POST /auth/login - Login
POST /auth/logout - Logout
GET /auth/perfil - Obtener usuario
GET /dashboard - Dashboard principal