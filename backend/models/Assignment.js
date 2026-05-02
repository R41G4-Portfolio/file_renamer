import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const assignmentSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: () => randomUUID()
		},
		templateId: {
			type: String,
			ref: 'Templates',
			required: true
		},
		rowIndex: {
			type: Number,
			required: true
		},
		ruta: {
			type: String,
			required: true,
			trim: true
		},
		nombreDeseado: {
			type: String,
			required: true,
			trim: true
		},
		status: {
			type: String,
			required: true,
			enum: ['PENDING', 'UPLOADED', 'FAILED'],
			default: 'PENDING'
		},
		originalName: {
			type: String,
			default: null
		},
		normalizedName: {
			type: String,
			default: null
		},
		sha256: {
			type: String,
			default: null
		},
		filePath: {
			type: String,
			default: null
		},
		uploadedAt: {
			type: Date,
			default: null
		},
		schemaVersion: {
			type: Number,
			required: true,
			default: 1
		},
		validFrom: {
			type: Date,
			default: Date.now,
			select: false
		},
		validUntil: {
			type: Date,
			default: null,
			select: false
		}
	},
	{
		collection: 'assignments'
	}
);

assignmentSchema.index({ templateId: 1, rowIndex: 1 }, { unique: true });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ templateId: 1, status: 1 });

assignmentSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		return ret;
	}
});

export default mongoose.model('Assignments', assignmentSchema);