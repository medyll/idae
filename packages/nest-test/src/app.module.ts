// This file defines the main application module, which imports controllers and providers for the app.

import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SampleFilterFilter } from './sample-filter.filter';
import { APP_FILTER } from '@nestjs/core';
import { SampleGatewayGateway } from './sample-gateway.gateway';
import { SampleMiddlewareMiddleware } from './sample-middleware.middleware';
import { UsersController } from './users/users.controller';
import { SampleProvider } from './sample-provider';
import { IdaeModule } from './idae/idae.module';

// Decorator: Marks this class as a NestJS module, grouping related controllers and providers.
@Module({
  imports: [UsersModule, IdaeModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SampleFilterFilter,
    },
    SampleGatewayGateway,
    SampleProvider,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SampleMiddlewareMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.ALL },
        UsersController,
        { path: 'profile', method: RequestMethod.GET }
      );
  }
}
