import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const userSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: () => randomUUID()
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			select: false
		},
		name: {
			type: String,
			required: true
		},
		role: {
			type: String,
			required: true,
			enum: ['ADMIN', 'UPLOADER', 'DOWNLOADER']
		},
		token: {
			type: String,
			unique: true,
			sparse: true,
			select: false
		},
		createdAt: {
			type: Date,
			default: Date.now
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
		//Dejar el nombre de la tabla explícito y omitir el paso a plurar a la inglesa
		collection: 'users'
	}
);

//Campos a excluir de la consulta de BD
userSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.id;
		delete ret.password;
		delete ret.token;
		delete ret.createdAt;
		delete ret.validFrom;
		delete ret.validUntil;
		return ret;
	}
});

export default mongoose.model('Users', userSchema);