import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AppSchemeBase extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String })
  code: string;

  @Prop({ type: Object })
  fk: object;
}

export const AppSchemeBaseSchema = SchemaFactory.createForClass(AppSchemeBase);
