import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import crypto from 'crypto';

export const generateZipFromAssignments = async (assignments, template) => {
	const tempDir = path.join(process.cwd(), 'uploads', 'temp', template.id);
	await fs.ensureDir(tempDir);

	const checksums = {};
	const filesToZip = [];

	for (const assignment of assignments) {
		if (assignment.status !== 'UPLOADED') continue;
		
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

	// Crear checksum.txt
	const checksumContent = Object.entries(checksums)
		.map(([file, hash]) => `${file}: ${hash}`)
		.join('\n');
	const checksumPath = path.join(tempDir, 'signature.checksum');
	await fs.writeFile(checksumPath, checksumContent);
	
	// Verificar que existe ANTES de agregar al ZIP
	console.log('Checksum creado en:', checksumPath);
	console.log('Contenido:', checksumContent);
	
	if (await fs.pathExists(checksumPath)) {
		console.log('✅ checksum.txt existe, agregando al ZIP');
		filesToZip.push(checksumPath);
	} else {
		console.error('❌ checksum.txt NO existe');
	}

	// Crear ZIP
	const zipFileName = `template_${template.id}_${Date.now()}.zip`;
	const zipPath = path.join(process.cwd(), 'uploads', 'output', zipFileName);
	await fs.ensureDir(path.dirname(zipPath));

	console.log('Archivos a empaquetar:', filesToZip.length);
	for (const f of filesToZip) {
		console.log('  -', f);
	}

	await new Promise((resolve, reject) => {
		const output = fs.createWriteStream(zipPath);
		const archive = archiver('zip', { zlib: { level: 9 } });

		output.on('close', () => {
			console.log('ZIP creado, tamaño:', archive.pointer());
			resolve();
		});
		
		archive.on('error', reject);
		archive.pipe(output);

		for (const file of filesToZip) {
			const relativePath = path.relative(tempDir, file);
			console.log(`  → agregando: ${relativePath}`);
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
		fileCount: filesToZip.length - 1 // menos checksum.txt
	};
};