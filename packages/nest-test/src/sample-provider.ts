// This file defines a custom provider for NestJS.
// Providers are used to inject and share values, classes, or factories across your application.

// Decorator: Marks this class as a NestJS injectable provider.
import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleProvider {}
