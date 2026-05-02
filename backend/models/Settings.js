import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const settingSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: () => randomUUID()
		},
		allowedExtensions: {
			type: [String],
			required: true,
			default: ['.pdf', '.jpg', '.png', '.docx']
		},
		forbiddenChars: {
			type: [String],
			required: true,
			default: ['<', '>', ':', '"', '|', '?', '*', '\\']
		},
		maxFileSizeMB: {
			type: Number,
			required: true,
			default: 10
		},
		maxExcelRows: {
			type: Number,
			required: true,
			default: 1000
		},
		normalizeRules: {
			type: {
				replaceSpaces: { type: Boolean, default: true },
				replaceUnderscores: { type: Boolean, default: true },
				toLowerCase: { type: Boolean, default: true }
			},
			required: true,
			default: {
				replaceSpaces: true,
				replaceUnderscores: true,
				toLowerCase: true
			}
		},
		updatedBy: {
			type: String,
			ref: 'Users',
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
		collection: 'settings'
	}
);

settingSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		return ret;
	}
});

export default mongoose.model('Settings', settingSchema);