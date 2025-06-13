// This file defines the main controller for handling HTTP requests to the root route.
// Controller: Handles incoming HTTP requests and returns responses using the AppService.

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Decorator: Marks this class as a NestJS controller to handle incoming requests for a specific route.
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Decorator: Maps HTTP GET requests to the getHello() method for the root path ('/').
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
