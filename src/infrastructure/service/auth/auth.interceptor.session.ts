import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class SessionSignInInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    return next.handle().pipe(
      map((data) => {
        session.user = data;
        return data
      }),
    );
  }
}

@Injectable()
export class SessionSignOutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    return next.handle().pipe(tap(() => delete session.user));
  }
}
