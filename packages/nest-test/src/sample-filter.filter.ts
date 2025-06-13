// This file defines a custom exception filter for handling errors in NestJS.
// Filters allow you to catch and handle exceptions thrown by your application.

// Decorator: Marks this class as a NestJS exception filter.
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class SampleFilterFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    console.log('Exception caught by SampleFilterFilter:', exception);
  }
}
