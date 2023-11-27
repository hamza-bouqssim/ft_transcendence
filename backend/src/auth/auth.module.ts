import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { GoogleStrategy } from './strategies/googleStrategy';
import { FortyTwoStrategy } from './strategies/42Strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService, GoogleStrategy, FortyTwoStrategy,JwtStrategy],
  controllers: [AuthController],
  imports: [PrismaModule,JwtModule.register({ secret: 'my-secret' })],
})
export class AuthModule {}
