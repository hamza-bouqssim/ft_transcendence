/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { GoogleStrategy } from './strategies/googleStrategy';
import { FortyTwoStrategy } from './strategies/42Strategy';
import { LocalAuthStrategy } from './strategies/localStrategy';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './utils/LocalStrategy';
import { SessionSerializer } from './utils/SessionSerializer';
import { jwtConstants } from './utils/constants';

@Module({
  providers: [AuthService, GoogleStrategy, FortyTwoStrategy, LocalAuthStrategy, UserService, LocalStrategy,SessionSerializer],
  controllers: [AuthController],
  imports: [PrismaModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  }),],
})
export class AuthModule {}
