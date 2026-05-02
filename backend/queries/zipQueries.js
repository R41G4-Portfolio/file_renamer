import { Template, Assignment } from '../models/index.js';
import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import crypto from 'crypto';

// Consultas para respuestas HTTP (SIN lean)
export const findTemplateForZip = async (templateId) => {
	return await Template.findById(templateId);
};

export const findUploadedAssignments = async (templateId) => {
	return await Assignment.find({ 
		templateId, 
		status: 'UPLOADED' 
	}).lean();
};

// Operación de generación de ZIP
export const generateZipFromAssignments = async (assignments, template) => {
	const tempDir = path.join(process.cwd(), 'uploads', 'temp', template.id);
	await fs.ensureDir(tempDir);

	const checksums = {};
	const filesToZip = [];

	for (const assignment of assignments) {
		const sourcePath = path.join(process.cwd(), assignment.filePath);
		const targetPath = path.join(assignment.ruta, assignment.normalizedName);
		const targetFullPath = path.join(tempDir, targetPath);
		
		await fs.ensureDir(path.dirname(targetFullPath));
		await fs.copy(sourcePath, targetFullPath);
		
		const fileBuffer = await fs.readFile(targetFullPath);
		const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
		checksums[targetPath] = sha256;
		
		filesToZip.push(targetFullPath);
	}

	const checksumContent = Object.entries(checksums)
		.map(([file, hash]) => `${file}: ${hash}`)
		.join('\n');
	const checksumPath = path.join(tempDir, 'signature.checksum');
	await fs.writeFile(checksumPath, checksumContent);
	filesToZip.push(checksumPath);

	const zipFileName = `template_${template.id}_${Date.now()}.zip`;
	const zipPath = path.join(process.cwd(), 'uploads', 'output', zipFileName);
	await fs.ensureDir(path.dirname(zipPath));

	await new Promise((resolve, reject) => {
		const output = fs.createWriteStream(zipPath);
		const archive = archiver('zip', { zlib: { level: 9 } });

		output.on('close', resolve);
		archive.on('error', reject);
		archive.pipe(output);

		for (const file of filesToZip) {
			const relativePath = path.relative(tempDir, file);
			archive.file(file, { name: relativePath });
		}

		archive.finalize();
	});

	const zipBuffer = await fs.readFile(zipPath);
	const zipChecksum = crypto.createHash('sha256').update(zipBuffer).digest('hex');

	await fs.remove(tempDir);

	return {
		zipPath,
		zipChecksum,
		fileCount: Object.keys(checksums).length
	};
};

// Operaciones de escritura
export const updateTemplateZipInfo = async (templateId, zipPath, zipChecksum) => {
	await Template.findByIdAndUpdate(templateId, {
		zipPath,
		zipChecksum,
		zipGeneratedAt: new Date()
	});
};