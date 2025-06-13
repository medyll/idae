// This file defines a custom interceptor for NestJS.
// Interceptors can bind extra logic before/after method execution, transform results, or extend basic method behavior.

// Decorator: Marks this class as a NestJS interceptor.
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SampleInterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}
