import { Injectable,UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Request } from 'express';


const extractCookie = (req: Request): string | null => {
  if (req.cookies && req.cookies.token) {
      return req.cookies.token;
  }
  if(req.body && req.body.token)
    return req.body.token;
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authService: AuthService) {
      
      super({
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: 'my-secret'
      });
    }
  
    async validate(payload: any) {
      const user = await this.authService.findUser(payload.userId);
      console.log(user)
      if (!user) {
        throw new UnauthorizedException();
      }
  
      return  user;
    }
}