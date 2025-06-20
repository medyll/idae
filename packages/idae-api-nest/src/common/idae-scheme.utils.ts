import { Schema as MongooseSchema } from 'mongoose';

export type FkValue = {
  code: string;
  multiple: boolean;
  order: number;
};

export function createFkSchema() {
  return new MongooseSchema(
    {
      code: { type: String, required: true },
      multiple: { type: Boolean, required: true },
      order: { type: Number, required: true },
    },
    { _id: false }
  );
}
