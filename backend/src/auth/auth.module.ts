import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

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

@Module({
  providers: [AuthService, GoogleStrategy, FortyTwoStrategy, LocalAuthStrategy, UserService, LocalStrategy,SessionSerializer],
  controllers: [AuthController],
  imports: [PrismaModule, JwtModule.register({ secret: 'my-secret', signOptions: { expiresIn: '1h' } })],
})
export class AuthModule {}
