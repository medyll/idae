import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createFkSchema, type FkValue } from './idae-scheme.utils';

@Schema({ timestamps: true })
export class AppSchemeBase extends Document {
  @Prop({ required: true })
  idappscheme_base: number;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String })
  code: string;

  @Prop({ type: Number })
  order: number;

  @Prop({ type: String })
  icon: string;

  @Prop({
    type: Map,
    of: createFkSchema(),
    default: {},
  })
  fk: Map<string, FkValue>;
}

export const AppSchemeBaseSchema = SchemaFactory.createForClass(AppSchemeBase);
