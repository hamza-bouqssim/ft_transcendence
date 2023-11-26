/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {  User } from '@prisma/client';
import { ParticipentService } from 'src/Participent/Participent.service';
import { UserService } from 'src/user/user.service';
// import { IConversationService } from './conversation';

@Injectable()
export class ConversationsService  {

    constructor(private prisma : PrismaService, private participentService : ParticipentService, private userService : UserService)
    {

    }


    async createConversations(user : User  ,display_name : string) {
     
      const recipient = await this.userService.findByDisplayName(display_name)
      if(!recipient)
            throw new HttpException('User not found so cannot create Conversation' , HttpStatus.BAD_REQUEST)
      
      // const userDb = await this.userService.checkIfParticipent(user.id);
      const Participent = await this.participentService.findParticipent(display_name, user);
      if(!Participent)
      {

         this.participentService.CreateParticipent(display_name, user);

          // return newParticipant;
      }else{
        throw new HttpException('This conversation alrighdy exist' , HttpStatus.BAD_REQUEST)

      }

      return {message : 'Conversation create succefully'}
        
      
     
   
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
            lastMessage: true,
          }
        }
           
        );
    }

    async find(user : User){
      return this.participentService.findParticipentChat(user);
    }

  
}
