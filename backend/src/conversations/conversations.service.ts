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

    async createConversations(user : User  ,display_name : string, message : string) {
     let conversation;
      const recipient = await this.userService.findByDisplayName(display_name)
      if(!recipient)
            throw new HttpException('User not found so cannot create a Conversation' , HttpStatus.BAD_REQUEST)
      const isSenderBlocked = await this.checkIfBlocked(user.id, recipient.id);

      const isRecipientBlocked = await this.checkIfBlocked(recipient.id, user.id);
                        
      if (isSenderBlocked || isRecipientBlocked) {
            throw new HttpException('"Interaction not allowed. Users are blocked."' , HttpStatus.BAD_REQUEST)
      }
      if(user.display_name === display_name)
      {
        throw new HttpException('You cant create a conversation with your self ......' , HttpStatus.BAD_REQUEST)
      }
      const Participent = await this.findParticipent(display_name, user);
      if(!Participent)
      {
         conversation = await this.CreateParticipent(display_name, user);

      }else{
        throw new HttpException('This conversation alrighdy exist' , HttpStatus.BAD_REQUEST)

      }
      const messageCreate = await this.prisma.message.create({
        data: {
          content : message,
          sender: {
            connect: { id: user.id },
          },
          participents: {
            connect: { id: conversation.id },
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
        where: { id: conversation.id },
        data: {
          lastMessageId: messageCreate.id,
        },
      });
      this.eventEmitter.emit('createConversation.created', {
        conversation
      });

      return {message : 'Conversation create succefully....', conversation}

  }

  async checkIfBlocked(userId : string, blockedUserId : string) {
    const blockListEntry = await this.prisma.blockList.findFirst({
      where: {
        userOneId: userId,
        userTwoId: blockedUserId,
      },
    });
  
    return !!blockListEntry;
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
          
        },
        include :{
          sender : true,
          recipient : true,
        }
       
      });


        return newParticipent
    }
 


    async findParticipentChat(user: any) {
   
      const chatParticipents = await this.prisma.chatParticipents.findMany({
        where: {
          OR: [
            { 
              senderId: user.id, 
              NOT: { deletedBy: { some: { id: user.id } } },
            },
            { 
              recipientId: user.id, 
              NOT: { deletedBy: { some: { id: user.id } } },
            },
          ],
        },
        include: {
          sender: true,
          recipient: true,
          lastMessage: true,
        },
        orderBy: {
          lastMessage: {
            createdAt: 'desc',
          },
        },
      });
      if(!chatParticipents)
        throw new HttpException('This conversation not found...!' , HttpStatus.BAD_REQUEST)


      return chatParticipents;
    }

async createMessags(user : any, params: CreateMessageParams) {
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

        const blockListEntry = await this.prisma.blockList.findFirst({
          where: {
            OR: [
              {
                userOneId: chat.recipient.id,
                userTwoId: chat.sender.id,
              },
              {
                userOneId: chat.sender.id,
                userTwoId: chat.recipient.id,
              },
            ],
          },
        });
      
        if (blockListEntry) {
          throw new HttpException('Users have blocked each other', HttpStatus.BAD_REQUEST);
        }
      
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
     await this.prisma.chatParticipents.update({
        where: { id: chat.id },
        data: {
          deletedBy: {
            disconnect: [{ id: chat.recipient.id }, { id: chat.sender.id }],
          },
          vue: true,
        },
        include :{
          deletedBy : true,
        }
      });
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

async findConversationUsers(user : any, _display_name : string, message : string)
{
  const findRecipient = await this.prisma.user.findFirst({
    where : {
      display_name : _display_name,
    }
  });
  if(!findRecipient)
    throw new HttpException('There is no user with this name!!' , HttpStatus.BAD_REQUEST);

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
  if(!chat)
    throw new HttpException('There is no conversation between this two users!!' , HttpStatus.BAD_REQUEST)


  const isSenderBlocked = await this.checkIfBlocked(user.id, findRecipient.id);

  const isRecipientBlocked = await this.checkIfBlocked(findRecipient.id, user.id);
                  
    if (isSenderBlocked || isRecipientBlocked) {
      throw new HttpException('"Interaction not allowed. Users are blocked."' , HttpStatus.BAD_REQUEST)
    }
  const messageCreate= await this.prisma.message.create({
    data: {
      content : message,
      sender: {
        connect: { id: user.id },
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


  this.eventEmitter.emit('createConversationMessage.created', {
    chat
  });
  return chat;
}

async getMessageByConversationId(conversationId : string){
  const chatParticipents = await this.prisma.chatParticipents.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        include: {
          sender: true,
          participents: {
            include: {
              sender: true,
              recipient: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      recipient: true,
      sender: true,
    },
  });
  if (!chatParticipents) 
  {
    throw new HttpException('Conversation not found.....', HttpStatus.BAD_REQUEST)
  }
  const isSenderBlocked = await this.userService.isBlockedByUser(chatParticipents.sender.id, chatParticipents.recipient.id);
  const isRecipientBlocked = await this.userService.isBlockedByUser(chatParticipents.recipient.id, chatParticipents.sender.id);

  return { messages: chatParticipents.messages, isSenderBlocked, isRecipientBlocked};

}





async deleteConversation(conversationId: string, userId : string) {
  const chatParticipent = await this.prisma.chatParticipents.findUnique({
    where: {
      id: conversationId,
      OR: [
        { senderId: userId },
        { recipientId: userId },
      ],
    },
    include: { sender: true, recipient: true, deletedBy: true, messages: true },
  });

  
  if(!chatParticipent )
    throw new HttpException('Conversation not found.....', HttpStatus.BAD_REQUEST)




  await this.prisma.chatParticipents.update({
    where: { id: conversationId },
    data: {
      deletedBy: {
        connect: { id: userId },
      },
    },
   
  });
  const updatedChatParticipent = await this.prisma.chatParticipents.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      deletedBy: true,
      messages: true,
    },
  });

  if (Array.isArray(updatedChatParticipent.deletedBy) &&updatedChatParticipent.deletedBy.length === 2) {
    for (const message of updatedChatParticipent.messages) {
      await this.prisma.message.delete({
        where: {
          id: message.id,
        },
      });
    }
  
    await this.prisma.chatParticipents.delete({
      where: { id: conversationId },
    });
  }
  

  this.eventEmitter.emit('deleteConversation.created', {
    chatParticipent , userId
  });

  return { message: 'Delete conversation successfully' };
}


  

}

  
