/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {  User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { CreateMessageParams } from 'src/utils/types';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ConversationsService  {

    constructor(private prisma : PrismaService, private userService : UserService, private readonly eventEmitter: EventEmitter2)
    {

    }

    async createConversations(user : User  ,display_name : string) {
     let conversation;
      const recipient = await this.userService.findByDisplayName(display_name)
      if(!recipient)
            throw new HttpException('User not found so cannot create Conversation' , HttpStatus.BAD_REQUEST)
      
      const Participent = await this.findParticipent(display_name, user);
      if(!Participent)
      {
         conversation = await this.CreateParticipent(display_name, user);

      }else{
        throw new HttpException('This conversation alrighdy exist' , HttpStatus.BAD_REQUEST)

      }
      this.eventEmitter.emit('createConversation.created', {
        conversation
      });
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
   console.log("creating message*****");
    const chat = await this.prisma.chatParticipents.findUnique({
        where: {
          id: params.participentsId,
        },
        include: {
          sender: true,
          recipient: true,
          
        }
      });
    if(!chat)
        throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST)

    
    if((chat.senderId !== user.sub) && (chat.recipientId !== user.sub))
    {
        throw new HttpException('Cannot create message in this conversation', HttpStatus.BAD_REQUEST)
    }
    if(user.sub === chat.recipient.id)
    {
        await  this.prisma.chatParticipents.update({
              where: { id: chat.id},
              data: { senderId: user.sub, recipientId: chat.sender.id },
            });
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
        participents: {
          include: {
              sender: true,
              recipient: true,
          },
      },
       
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
    include: {
      sender: true,
      recipient: true,
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
  if (!chatParticipents) {
    return [];
  }

  return chatParticipents.messages;
}


async markConversationAsRead(conversationId: string) {
  const conversation = await this.prisma.chatParticipents.findUnique({
    where : {
      id : conversationId
    }

  });
  if (!conversation) {
    throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST)

  }

  // Update the vue property for messages in this conversation


 
  await this.prisma.message.updateMany({
    where: {
      participentsId: conversationId,
      // Add additional conditions if necessary
    },
    data: {
      vue: true,
    },
  });
  
}


async findUnreadMessages(conversationId: string) {
  // const conversation = await this.prisma.chatParticipents.findUnique({
  //   where : {
  //     id : conversationId
  //   }

  // });
  // if (!conversation) {
  //   throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST)

  // }
  const unreadMessageCount = await this.prisma.message.count({
    where: {
      participentsId:conversationId,
      vue: false,
    },
  });
  console.log("here unreadMessage-->",unreadMessageCount)
  return unreadMessageCount;
}

async deleteConversation(conversationId: string) {
  const conversation = await this.prisma.chatParticipents.findFirst({
    where: {
      id: conversationId,
    },
    include: {
      messages: true, // Include related messages
      sender: true,
      recipient: true,
    },
  });

  if (!conversation) {
    throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);
  }

  // Delete related messages first
  for (const message of conversation.messages) {
    await this.prisma.message.delete({
      where: {
        id: message.id,
      },
    });
  }

  // Now, you can safely delete the conversation
  await this.prisma.chatParticipents.delete({
    where: {
      id: conversationId,
    },
  });

  this.eventEmitter.emit('deleteConversation.created', {
    conversation,
  });

  return { message: 'Delete conversation successfully' };
}
  











}

  
