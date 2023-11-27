import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { ParticipentService } from 'src/Participent/Participent.service';

@Module({
  providers: [FriendRequestService, JwtService, ParticipentService],
  controllers: [FriendRequestController],
  imports: [PrismaModule]
})
export class FriendRequestModule {}
