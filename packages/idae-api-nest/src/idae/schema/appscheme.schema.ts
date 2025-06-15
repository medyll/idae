import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { Document,Schema as MongooseSchema } from 'mongoose';

export type FkValue = {
  code: string;
  multiple: boolean;
  order: number;
};

@Schema({ timestamps: true })
export class AppScheme extends Document {
  @Prop({ required: true })
  idappscheme: number;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String })
  code: string;

  @Prop({ type: Number })
  order: number

  @Prop({ type: String })
  icon: string

  @Prop({type:String})
  color: string;

  @Prop({
    type: Map,
    of: new MongooseSchema(
      {
        code: { type: String, required: true },
        multiple: { type: Boolean, required: true },
        order: { type: Number, required: true },
      },
      { _id: false }
    ),
    default: {},
  })
  fk: Map<string, FkValue>;
}

export const AppSchemeSchema = SchemaFactory.createForClass(AppScheme);
