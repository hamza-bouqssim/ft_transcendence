import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { GoogleStrategy } from './strategies/googleStrategy';
import { FortyTwoStrategy } from './strategies/42Strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthService, GoogleStrategy, FortyTwoStrategy, UserService,JwtStrategy],
  controllers: [AuthController],
  imports: [PrismaModule, JwtModule.register({ secret: 'my-secret', signOptions: { expiresIn: '1h' } })],
})
export class AuthModule {}
