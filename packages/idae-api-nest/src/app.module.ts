import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntityController } from './entity/entity.controller';
import { IdaeModule } from './idae/idae.module';
import { DatabaseService } from './database/database.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EntityService } from './entity/entity.service';
import configuration from './config/configurations';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot('mongodb://localhost/default'),
    AppModule,
    IdaeModule,
  ],
  controllers: [AppController, EntityController],
  providers: [AppService, DatabaseService, EntityService],
})
export class AppModule {}
