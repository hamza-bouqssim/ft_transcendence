import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [FriendRequestService, JwtService],
  controllers: [FriendRequestController],
  imports: [PrismaModule]
})
export class FriendRequestModule {}
