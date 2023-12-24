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
import { TwoFactorAuthenticationModule } from 'src/two-factor-authentication/two-factor-authentication.module';
import { GameService } from 'src/game/game.service';


@Module({
  imports: [PrismaModule,
    JwtModule.register({
      secret: 'my-secret',
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
