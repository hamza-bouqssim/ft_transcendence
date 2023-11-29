import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserService, JwtService],
  controllers:[UserController],
  imports: [PrismaModule, PassportModule, JwtModule.register({ secret: 'my-secret' })],
})
export class UserModule {}
