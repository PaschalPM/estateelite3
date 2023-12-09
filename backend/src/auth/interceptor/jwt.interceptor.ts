import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { JwtStrategy } from '../strategy/jwt.strategy';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(private readonly jwtStrategy: JwtStrategy){}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse()
    return next.handle().pipe(tap(() => this.jwtStrategy.implicitRefresh(req, res)));
  }
}
