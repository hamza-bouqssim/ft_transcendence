/* eslint-disable prettier/prettier */
import { Injectable,HttpStatus,HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RoomId ,DeleteChatRoom,UpdateChatRoom,CreateChatRoom,CreateMessageRoom} from "src/Rooms/dto/rooms.dto";
import * as bcrypt from 'bcrypt';


@Injectable()
export class RoomsService {

  //rooms management 
  constructor(private prisma : PrismaService)
  {

  }

  async getAllRooms(id:string) {
    const memberInfo = await this.prisma.member.findMany({
      where: {
        user_id: id,
      },
    });
    if (!memberInfo || memberInfo.length === 0) {
      console.log("sdfdsfdsf")
      throw new HttpException("No members found for the given user in any chat room.", HttpStatus.BAD_REQUEST);
    }
  
    const roomIds = memberInfo.map((member) => member.chatRoomId);

    const chatRooms = await this.prisma.chatRoom.findMany({
      where: {
        id: {
          in: roomIds,
        },
      },
      select: {
        id: true,
        name: true,
        Privacy: true,
        picture: true,
        createdAt: true,
        updatedAt: true,
        members: {
          where: {
            user_id: id,
          },
          select: {
            isAdmin: true,
          },
        },
      },
    });
  
  
    if (!chatRooms || chatRooms.length === 0) {
      throw new HttpException("No chat rooms found for the given user.", HttpStatus.BAD_REQUEST );
    }
  
    return chatRooms;
  }
  
// name: 'sacsadadsad',
// Privacy: 'Public',
// password: '',
// picture: null,
// idUserAdd: [ '6a171716-6e2a-45c8-a9c6-66f3d3fd1908' ]
  
  
  async creatRooms(data:CreateChatRoom,id:string)
  {
    const userExists = await this.prisma.user.findUnique({
      where: { id:id },
    });

    if (!userExists) {
      throw new HttpException('User', HttpStatus.BAD_REQUEST)
    }
    const chatRomeExists = await this.prisma.chatRoom.findUnique({
      where: { name: data.name },
    });

    if (chatRomeExists) {
      throw new HttpException('Chat room already exists', HttpStatus.BAD_REQUEST)
    }
    let hashedPassword;
    
    if(data.Privacy ==='Protected')
    {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }
    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        name: data.name,
        Privacy: data.Privacy,
        password: hashedPassword,
        picture: data.picture || 'https://images.squarespace-cdn.com/content/v1/5f60d7057b9b7d7609ef628f/1603219780222-V253F1WLHBH8HNHXIFUX/group.png',
        members: {
          create: [
            {
              user: {
                connect: { id: id },
              },
              isAdmin: true,
            },
            ...data.idUserAdd.map(userId => ({
              user: {
                connect: { id: userId },
              },
              isAdmin: false,
            })),
          ],
        },
      },
      include:{
        members:{
          include:{
            user:true
          }
        }
      }
    });
    return chatRoom;
  }


  async updateRooms(data:UpdateChatRoom,id:string)
  {
    const existingChatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: data.id },
      include: {
        members: {
          where: {
            user_id: id,
            isAdmin: true,
          },
        },
      },
    });
    
    if (!existingChatRoom) {
      throw new Error(`Chat room with ID ${data.id} not found.`);
    }

    if (!existingChatRoom.members.length) {
      throw new Error(`User  is not an admin for the chat room.`);
    }
    let hashedPassword;
    if(data.Privacy ==='Protected' && data.password)
    {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const updatedChatRoom = await this.prisma.chatRoom.update({
      where: { id: data.id },
      data: {
        name: data.name || existingChatRoom.name,
        Privacy: data.Privacy || existingChatRoom.Privacy,
        password: hashedPassword || existingChatRoom.password,
        picture: data.picture || existingChatRoom.picture,
      },
      select: {
        id: true,
        name: true,
        Privacy: true,
        picture: true,
        createdAt: true,
        updatedAt: true,
        members: {
          where: {
            user_id: id,
          },
          select: {
            isAdmin: true,
          },
        },
      },
    });
    return updatedChatRoom;

  }


  async deleteRooms(deleteChatRoom:DeleteChatRoom,id:string)
  {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: deleteChatRoom.id },
      include: {
        members: {
          where: {
            user_id: id,
            isAdmin: true,
          },
        },
        messageRome: true,
      },
    });
    if (!chatRoom) {
      throw new Error(`Chat room with ID ${deleteChatRoom.id} not found.`);
    }

    if (!chatRoom.members.length) {
      throw new Error(`User  is not an admin for the chat room.`);
    }

    await this.prisma.member.deleteMany({
      where: { chatRoomId: deleteChatRoom.id },
    });
    await this.prisma.messageRome.deleteMany({
      where: { chatRoomId: deleteChatRoom.id },
    });
    const deletedChatRoom = await this.prisma.chatRoom.delete({
      where: { id: deleteChatRoom.id },
    });

    return deletedChatRoom;
  }


  //member mangment 

  async isOwner(id: string, roomId: RoomId): Promise<boolean> {
    const member = await this.prisma.member.findFirst({
      where: {
        user_id:id,
        chatRoomId: roomId.id,
        isAdmin: true,
      },
    });
    return !!member;
  }

  async addMemberToRooms()
  {

  }

  async makeOwner()
  {

  }

 
  async deleteOwner()
  {

  }


  async allMember()
  {

  }


  async banMember()
  {

  }


  async mutMember()
  {

  }

  //modifier 

  async kekMember()
  {

  }


  async isMember()
  {

  }

  
  async joinRooms()
  {

  }
  


  async getAllFreind(id: string) {
    console.log(id)
      const friends = await this.prisma.friend.findMany({
        where: {
          OR: [
          {
            user_id: id,
            status: "ACCEPTED", 
          },
          {
            friend_id: id,
            status: "ACCEPTED", 
          },
          ]
        },
      });
      if (!friends || friends.length === 0) {
        throw new Error('No friends found for the given user.');
      }
      return friends;
  }

  async createMessage(createMessageRoom: CreateMessageRoom,id:string)
  {
    const message = await this.prisma.messageRome.create({
      data: {
        content : createMessageRoom.content,
        chatRoomId : createMessageRoom.chatRoomId,
        senderId: id,

      },
    });
    if (!message) {
      throw new Error("Message failed to create in the database.");
    }
    return message;
  }

}

