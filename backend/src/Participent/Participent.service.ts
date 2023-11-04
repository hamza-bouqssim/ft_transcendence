/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateConversationParams} from 'src/utils/types';

@Injectable()
export class ParticipentService {

    constructor(private prisma : PrismaService)
    {

    }

    async findParticipent(params : CreateConversationParams, user : User)
    {
        // const chatroom = this.prisma.chatRoom.findUnique()
        const chat = await this.prisma.chatParticipents.findFirst({
          where: {
            OR: [
              { senderId: params.recipientId, recipientId: user.id},
              { senderId: user.id, recipientId: params.recipientId },
            ],
          },
        });
        return chat;
    }
 

    async CreateParticipent(params : CreateConversationParams, user : User)
    {
      const newParticipent = await this.prisma.chatParticipents.create({
        data: {
          sender: {
            connect: { id: user.id }
          },
          recipient: {
            connect: { id: params.recipientId}
          }
        }
      });

        return newParticipent
    }
 

// async findParticipentChat(user : User) {
//   const checkuser = await this.prisma.user.findUnique({
//     where: { id: user.id},
//     include: {
//       senderOfChatParticipents: true, // Include the sender relationships
//       recipientOfChatParticipents: true, // Include the recipient relationships
//     },
//   });

//   // Combine the sender and recipient chat participents`
//   const chatParticipents = [
//     ...checkuser.senderOfChatParticipents,
//     ...checkuser.recipientOfChatParticipents,
//   ];

//   return chatParticipents;
// }

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
    },
  });

  return chatParticipents;
}










}