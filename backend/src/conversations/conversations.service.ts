import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {  User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { CreateMessageParams } from 'src/utils/types';
// import { IConversationService } from './conversation';

@Injectable()
export class ConversationsService  {

    constructor(private prisma : PrismaService, private userService : UserService)
    {

    }

    async createConversations(user : User  ,display_name : string) {
     
      const recipient = await this.userService.findByDisplayName(display_name)
      if(!recipient)
            throw new HttpException('User not found so cannot create Conversation' , HttpStatus.BAD_REQUEST)
      
      const Participent = await this.findParticipent(display_name, user);
      if(!Participent)
      {
         this.CreateParticipent(display_name, user);

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
            sender: true,
            recipient: true,
            lastMessage: true,
          }
        }
           
        );
    }

    async find(user : any){
      return this.findParticipentChat(user);
    }

    async findParticipent(_display_name : string, user : any)
    {
        // const chatroom = this.prisma.chatRoom.findUnique()
        const chat = await this.prisma.chatParticipents.findFirst({
          where: {
            OR: [
              { sender: { display_name: _display_name }, recipientId: user.id },
              { senderId: user.id, recipient: { display_name: _display_name } },
            ],
          },
        });
        return chat;
    }
 

    async CreateParticipent(_display_name : string, user : any)
    {
      const newParticipent = await this.prisma.chatParticipents.create({
        data: {
          sender: {
            connect: { id: user.id }
          },
          recipient: {
            connect: { display_name: _display_name}
          }
        }
      });

        return newParticipent
    }
 


  async  findParticipentChat(user :any) {
    const chatParticipents = await this.prisma.chatParticipents.findMany({
      where: {
        OR: [
          { senderId: user.id },
          { recipientId: user.id },
        ],
      },
      include: {
        sender: true,
        recipient: true,
        lastMessage: true,
      },
      orderBy: {
        lastMessage: {
          createdAt: 'desc', // Order by createdAt of the lastMessage in descending order
        },
      },
  
   });

  return chatParticipents;
}


async createMessags(user : any, params: CreateMessageParams) {
   
    const chat = await this.prisma.chatParticipents.findUnique({
        where: {
          id: params.participentsId,
        },
      });
    if(!chat)
        throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST)

    
    if((chat.senderId !== user.sub) && (chat.recipientId !== user.sub))
    {
        throw new HttpException('Cannot create message in this conversation', HttpStatus.BAD_REQUEST)
    }

    const messageCreate = await this.prisma.message.create({
      data: {
        content:params.content,
        sender: {
          connect: { id: user.sub },
        },
        participents: {
          connect: { id: chat.id }, 
        },     
      },
      include: {
        sender: true,
       
      },
      
    });

    await this.prisma.chatParticipents.update({
      where: { id: chat.id },
      data: {
        lastMessageId: messageCreate.id,
      },
    });   
    return messageCreate;
  }

async findConversationUsers(user : any, _display_name : string)
{
  const chat = await this.prisma.chatParticipents.findFirst({
    where: {
      OR: [
        { sender: { display_name: _display_name }, recipientId: user.id },
        { senderId: user.id, recipient: { display_name: _display_name } },
      ],
    },
  });
  return chat;
}

async getMessageByConversationId(conversationId : string){
  const chatParticipents = await this.prisma.chatParticipents.findUnique({
    where: { id: conversationId},
    include: {
      messages: {
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return chatParticipents.messages;
}


  











}

  
