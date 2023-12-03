import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { PrismaModule } from 'prisma/prisma.module';

import { PrismaService } from 'prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports:
  [
    PrismaModule,
    JwtModule.register({
      secret: 'my-secret',
      signOptions: { expiresIn: '6000000000s' },
    }),
  ],
  providers: [FriendRequestService,PrismaService],
  controllers: [FriendRequestController],
})
export class FriendRequestModule {}
