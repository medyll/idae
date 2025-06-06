import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AppSchemeBase } from './appschemebase.schema.js';
import { AppSchemeType } from './appschemetype.schema.js';
import { AppSchemeGroup } from './appschemegroup.schema.js';

@Schema({ timestamps: true })
export class AppScheme extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String })
  code: string;

  @Prop({ type: Object })
  fk: {
    appscheme_base: AppSchemeBase;
    appscheme_type: AppSchemeType;
    appscheme_group: AppSchemeGroup;
  };
}

export const AppSchemeSchema = SchemaFactory.createForClass(AppScheme);
