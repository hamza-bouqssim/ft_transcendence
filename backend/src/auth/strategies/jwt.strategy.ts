import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Request } from 'express';

const extractCookie = (req: Request): string | null => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
    secretOrKey: process.env.COOKIE_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.findUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}