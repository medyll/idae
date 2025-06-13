// This file provides the main service logic for the application, used by controllers.

import { Injectable } from '@nestjs/common';
import { SampleProvider } from './sample-provider';

// Decorator: Marks this class as a NestJS injectable service, allowing it to be injected into other components.
@Injectable()
export class AppService {
  constructor(private readonly sampleProvider: SampleProvider) {}

  getHello(): string {
    // Example logic using the injected provider
    if (this.sampleProvider instanceof SampleProvider) {
      return 'Hello from AppService using SampleProvider!';
    }
    return 'Hello World!';
  }
}
