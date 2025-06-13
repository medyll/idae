// This file defines a custom guard for protecting routes or gateways in NestJS.
// Guards determine whether a request will be handled by the route handler or not.

// Decorator: Marks this class as a NestJS guard.
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SampleGuardGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
