import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { PrismaService } from 'prisma/prisma.service';


@Module({
  imports: [],
  controllers: [RoomsController],
  providers: [RoomsService,PrismaService],
  
})
export class RoomsModule {}