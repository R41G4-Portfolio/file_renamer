import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const templateSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: () => randomUUID()
		},

		title: {
			type: String,
			required: true,
			default: 'Sin título'
		},
		uploadedBy: {
			type: String,
			ref: 'Users',
			required: true
		},
		uploadedAt: {
			type: Date,
			default: Date.now
		},
		excelFileName: {
			type: String,
			required: true
		},
		excelFilePath: {
			type: String,
			required: true
		},
		rowCount: {
			type: Number,
			required: true,
			min: 0
		},

		assignedTo: {
			type: String,
			ref: 'Users',
			default: null
		},

		status: {
			type: String,
			required: true,
			enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
			default: 'ACTIVE'
		},

		zipPath: {
			type: String,
			default: null
		},
		zipChecksum: {
			type: String,
			default: null
		},
		zipGeneratedAt: {
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
		collection: 'templates'
	}
);

templateSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.createdAt;
		delete ret.validFrom;
		delete ret.validUntil;
		return ret;
	}
});

export default mongoose.model('Templates', templateSchema);