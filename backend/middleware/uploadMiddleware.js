import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import config from '../config/index.js';

// Asegurar que el directorio de uploads existe
const ensureDir = async (dir) => {
	await fs.ensureDir(dir);
};

// Configuración base de almacenamiento
const createStorage = (subfolder) => {
	return multer.diskStorage({
		destination: async (req, file, cb) => {
			const uploadDir = path.join(config.uploadsPath, subfolder);
			await ensureDir(uploadDir);
			cb(null, uploadDir);
		},
		filename: (req, file, cb) => {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
			cb(null, uniqueSuffix + path.extname(file.originalname));
		}
	});
};

// Filtro para archivos Excel
const excelFilter = (req, file, cb) => {
	const allowedExtensions = ['.xlsx', '.xls'];
	const ext = path.extname(file.originalname).toLowerCase();
	if (allowedExtensions.includes(ext)) {
		cb(null, true);
	} else {
		cb(new Error('Solo archivos Excel (.xlsx, .xls)'), false);
	}
};

// Filtro para documentos (PDF, imágenes, Word)
const documentFilter = (req, file, cb) => {
	const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
	const ext = path.extname(file.originalname).toLowerCase();
	if (allowedExtensions.includes(ext)) {
		cb(null, true);
	} else {
		cb(new Error('Tipo de archivo no permitido. Permitidos: PDF, JPG, PNG, DOCX'), false);
	}
};

// Middleware para subir Excel
export const uploadExcel = multer({
	storage: createStorage('templates'),
	limits: {
		fileSize: (config.maxFileSizeMB || 10) * 1024 * 1024
	},
	fileFilter: excelFilter
}).single('excel');

// Middleware para subir documentos
export const uploadDocument = multer({
	storage: createStorage('documents'),
	limits: {
		fileSize: (config.maxFileSizeMB || 10) * 1024 * 1024
	},
	fileFilter: documentFilter
}).single('file');

export default { uploadExcel, uploadDocument };