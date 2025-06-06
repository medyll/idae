import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppScheme,
  AppSchemeBase,
  AppSchemeBaseSchema,
  AppSchemeSchema,
  AppSchemeTypeSchema,
  AppSchemeFieldSchema,
} from './idae.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppScheme.name, schema: AppSchemeSchema },
      { name: AppSchemeBase.name, schema: AppSchemeBaseSchema },
      { name: 'AppSchemeType', schema: AppSchemeTypeSchema },
      { name: 'AppSchemeField', schema: AppSchemeFieldSchema },
    ]),
  ],
})
export class IdaeModule {}
