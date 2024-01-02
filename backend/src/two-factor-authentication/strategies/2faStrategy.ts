import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../auth/auth.service';
import { Request } from 'express';



const extractCookie = (req: Request): string | null => {
    if (req.cookies && req.cookies._2fa) {
        return req.cookies._2fa;
        }
    return null;
};

@Injectable()
export class _2faStrategy extends PassportStrategy(Strategy, '2fa') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
    secretOrKey: process.env.S_2FA,
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