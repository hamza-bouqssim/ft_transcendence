import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Request } from 'express';



@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    cookieParser()(req, null, () => {});

    const token = req.cookies.token;
    if (token) {
      return true;
    }

    return false;
  }
}
