/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { GoogleStrategy } from './strategies/googleStrategy';
import { FortyTwoStrategy } from './strategies/42Strategy';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthenticationService } from 'src/two-factor-authentication/two-factor-authentication.service';
import { GameService } from 'src/game/game.service';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [PrismaModule,
    JwtModule.register({
      secret: process.env.COOKIE_SECRET,
      signOptions: { expiresIn: '6000000000s' },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    FortyTwoStrategy,
    GoogleStrategy,
    JwtStrategy,
    TwoFactorAuthenticationService,
    GameService
  ],
  controllers: [AuthController],

})
export class AuthModule {}
