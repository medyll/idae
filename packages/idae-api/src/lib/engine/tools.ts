// packages\idae-api\src\lib\engine\tools.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

interface DynamicDocument extends Document {
	[key: string]: any;
}

export const getModel = <T extends Document>(collectionName: string): Model<T> => {
	if (mongoose.models[collectionName]) {
		return mongoose.models[collectionName] as Model<T>;
	}

	const schema = new Schema({}, { strict: false });
	//schema.plugin(AutoIncrement, { inc_field: 'idFieldName' });
	return mongoose.model<T>(collectionName, schema, collectionName);
};
