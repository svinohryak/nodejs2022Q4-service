import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const path = req.url.split('/');

    try {
      if (['', 'auth', 'doc'].includes(path[1])) {
        return true;
      }

      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Authorization error',
        });
      }

      // const test = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // jwt.verify(token, process.env.JWT_SECRET_KEY);
      // const user = this.jwtService.verify('secret123123');
      // const user = this.jwtService.verify(process.env.JWT_SECRET_KEY);
      // req.user = user;

      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // const user = this.jwtService.verify(token);
      // const user = this.jwtService.verify(token);
      req.user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Authorization error',
      });
    }
  }
}
