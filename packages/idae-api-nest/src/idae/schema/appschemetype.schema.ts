import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AppSchemeType extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String })
  code: string;

  @Prop({ type: Object })
  fk: object;
}


export const AppSchemeTypeSchema = SchemaFactory.createForClass(AppSchemeType);
