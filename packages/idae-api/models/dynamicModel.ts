import mongoose, { Schema, Document, Model } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
const AutoIncrement = AutoIncrementFactory(mongoose);

export const getModel = (collectionName: string): Model<Document> => {
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName] as Model<Document>;
  }

  const schema = new Schema({}, { strict: false });
  schema.plugin(AutoIncrement, { inc_field: "idFieldName" });
  return mongoose.model<Document>(collectionName, schema, collectionName);
};
