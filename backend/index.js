import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import config from './config/index.js';
import authRoutes from './routes/authRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import zipRoutes from './routes/zipRoutes.js';
import userRoutes from './routes/userRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

const app = express();

//Ambiente del servidor
const isProduction = config.env === 'production';

//Conexión a base de datos
connectDB();

//Cabeceras CSP
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: isProduction ? ["'self'"] : ["'self'", "'unsafe-inline'"],
			styleSrc: isProduction ? ["'self'"] : ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'", "data:"],
			connectSrc: ["'self'", config.clientUrl, `http://localhost:${config.port}`],
			fontSrc: ["'self'"],
			objectSrc: ["'none'"],
			mediaSrc: ["'self'"],
			// Protección para iframes
			// Solo permite iframes del mismo origen
			frameSrc: ["'self'", "blob:", "data:", "http://localhost:5000"],

			// Evita que el sitio sea incrustado en otros
			frameAncestors: ["'self'", "http://localhost:3000"],
			
			// Evita que el iframe cargue cosas de otros sitios
			childSrc: ["'self'"],
			// Opcional: deshabilitar navegación del iframe
			scriptSrcAttr: ["'none'"]
		}
	}
}));

//Configuraciones del servidor
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Rutas
app.use('/auth', authRoutes);
app.use('/templates', templateRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/zip', zipRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
	setHeaders: (res, filePath) => {
		if (filePath.endsWith('.pdf')) {
			// Evitar que el PDF se cargue en iframes de otros sitios
			res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
			// Evitar el clickjacking
			res.setHeader('X-Frame-Options', 'SAMEORIGIN');
		}
	}
}));

app.use('/users', userRoutes);
app.use('/audit', auditRoutes);

app.get('/health', (req, res) => {
	res.json({ status: 'OK' });
});

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('config.env:', config.env);

app.listen(config.port, () => {
	console.log(`🚀 Server running on port ${config.port}`);
});
