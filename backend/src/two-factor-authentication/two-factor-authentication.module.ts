import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFactorAuthenticationService, PrismaService]
})
export class TwoFactorAuthenticationModule {}
