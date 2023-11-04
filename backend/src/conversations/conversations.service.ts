/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {  User } from '@prisma/client';
import { ParticipentService } from 'src/Participent/Participent.service';
import { CreateConversationParams } from 'src/utils/types';
import { UserService } from 'src/user/user.service';
// import { IConversationService } from './conversation';

@Injectable()
export class ConversationsService  {

    constructor(private prisma : PrismaService, private participentService : ParticipentService, private userService : UserService)
    {

    }


    async createConversations(user : User  ,params : CreateConversationParams) {
     
      const recipient = await this.userService.findById(params.recipientId)
      if(!recipient)
            throw new HttpException('User not found so cannot create Conversation' , HttpStatus.BAD_REQUEST)
      
      // const userDb = await this.userService.checkIfParticipent(user.id);
      const Participent = await this.participentService.findParticipent(params, user);
      if(!Participent)
      {

          const newParticipant = this.participentService.CreateParticipent(params, user);

          return newParticipant;
      }
        
      
      console.log(Participent);
     
   
  }




      async findConversationById(id : string)
    {
        return await this.prisma.chatParticipents.findUnique({
          where: {
            id: id
          },
          include: {
            // messages: true,
            sender: true,
            recipient: true,
          }
        }
           
        );
    }

    async find(user : User){
      return this.participentService.findParticipentChat(user);
    }

  
}
