import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { GoogleStrategy } from './strategies/googleStrategy';
import { FortyTwoStrategy } from './strategies/42Strategy';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule ,JwtService} from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthenticationService } from 'src/two-factor-authentication/two-factor-authentication.service';
import { TwoFactorAuthenticationModule } from 'src/two-factor-authentication/two-factor-authentication.module';


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
    JwtStrategy, TwoFactorAuthenticationService
  ],
  controllers: [AuthController],

})
export class AuthModule {}
