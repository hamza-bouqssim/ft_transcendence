/* eslint-disable prettier/prettier */
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

    async find(user : User){
      return this.findParticipentChat(user);
    }

    async findParticipent(_display_name : string, user : User)
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
 

    async CreateParticipent(_display_name : string, user : User)
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
 


  async  findParticipentChat(user :User) {
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


async createMessags(user : User, params: CreateMessageParams) {
    let recipientUser;
    let senderUser;
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
    if((chat.sender.id !== user.id) && (chat.recipient.id !== user.id))
    {
        throw new HttpException('Cannot create message in this conversation', HttpStatus.BAD_REQUEST)
    }
  
  

    if(user.id === chat.recipient.id)
    {

        const newChat = await  this.prisma.chatParticipents.update({
          where: { id: chat.id},
          data: { senderId: user.id, recipientId: chat.sender.id },
        });
        console.log(newChat);
    }
    if(chat.sender.id === user.id)
    {
        senderUser = user;
        recipientUser = chat.recipient;
    }else if (chat.sender.id !== user.id)
    {
      senderUser = user;
      recipientUser = chat.sender;
    }

    const content = params.content;
    const messageCreate = await this.prisma.message.create({
      data: {
        content,
        sender: {
          connect: { id: senderUser.id }, // Replace with the actual sender's user ID
        },
        recipient: {
          connect: { id: recipientUser.id }, // Replace with the actual recipient's user ID
        },
        participents: {
          connect: { id: chat.id }, // Replace with the actual ChatParticipents ID
        },
        
        
       
      },
      include: {
        sender: true,
        recipient: true,
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

async findConversationUsers(user : User, _display_name : string)
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
          recipient: true,
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

  



