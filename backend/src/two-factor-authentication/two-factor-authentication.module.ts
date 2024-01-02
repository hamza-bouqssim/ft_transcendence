import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaModule } from 'prisma/prisma.module';
import { _2faStrategy } from './strategies/2faStrategy';
import { PassportModule } from '@nestjs/passport';


@Module({

  imports: [PrismaModule,
    JwtModule.register({
      secret: process.env.S_2FA,
      signOptions: { expiresIn: '6000000000s' },
    }),
  ],
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFactorAuthenticationService, PrismaService, _2faStrategy,AuthService]
})
export class TwoFactorAuthenticationModule {}
