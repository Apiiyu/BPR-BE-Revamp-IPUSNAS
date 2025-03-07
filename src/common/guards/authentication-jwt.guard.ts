// NestJS LIbraries
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticationJWTGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  public handleRequest(error: Error, user: any, info: string) {
    // You can throw an exception based on either "info" or "err" arguments
    if (error || !user) {
      throw error || new UnauthorizedException();
    }

    return user;
  }
}
