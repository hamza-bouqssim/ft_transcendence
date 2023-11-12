import { Injectable,HttpStatus,HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RoomId ,DeleteChatRoom,UpdateChatRoom,CreateChatRoom,getAllRooms ,CreateMessageRoom} from "src/Rooms/dto/rooms.dto";
import * as bcrypt from 'bcrypt';
@Injectable()
export class RoomsService {

  //rooms management 
  constructor(private prisma : PrismaService)
  {

  }

  async getAllRooms(data: getAllRooms) {
    const memberInfo = await this.prisma.member.findMany({
      where: {
        user_id: data.id,
      },
    });
  
    if (!memberInfo || memberInfo.length === 0) {
      throw new HttpException("No members found for the given user in any chat room.", HttpStatus.BAD_REQUEST);
    }
  
    const roomIds = memberInfo.map((member) => member.chatRoomId);
    console.log("ok")
    const chatRooms = await this.prisma.chatRoom.findMany({
      where: {
        id: {
          in: roomIds,
        },
      },
    });
  
    if (!chatRooms || chatRooms.length === 0) {
      throw new HttpException("No chat rooms found for the given user.", HttpStatus.BAD_REQUEST );
    }
  
    return chatRooms;
  }
  
  
  
  async creatRooms(data:CreateChatRoom)
  {
    const userExists = await this.prisma.user.findUnique({
      where: { id: data.userId },
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
    
    if(data.Privacy ==='protected')
    {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }
    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        name: data.name,
        Privacy: data.Privacy,
        password: hashedPassword,
        picture: data.picture || "https://images.squarespace-cdn.com/content/v1/5f60d7057b9b7d7609ef628f/1603219780222-V253F1WLHBH8HNHXIFUX/group.png",
        members: {
          create: [
            {
              user: {
                connect: { id: data.userId },
              },
              isAdmin: true,
            },
          ],
        },
      },
    });

    return chatRoom;

  }


  async updateRooms(updateChatRoom:UpdateChatRoom)
  {
    const existingChatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: updateChatRoom.id },
      include: {
        members: {
          where: {
            user_id: updateChatRoom.userId,
            isAdmin: true,
          },
        },
      },
    });

    if (!existingChatRoom) {
      throw new Error(`Chat room with ID ${updateChatRoom.id} not found.`);
    }

    if (!existingChatRoom.members.length) {
      throw new Error(`User with ID ${updateChatRoom.userId} is not an admin for the chat room.`);
    }

    const updatedChatRoom = await this.prisma.chatRoom.update({
      where: { id: updateChatRoom.id },
      data: {
        name: updateChatRoom.name || existingChatRoom.name,
        Privacy: updateChatRoom.Privacy || existingChatRoom.Privacy,
        password: updateChatRoom.password || existingChatRoom.password,
        picture: updateChatRoom.picture || existingChatRoom.picture,
      },
    });
    return updatedChatRoom;

  }


  async deleteRooms(deleteChatRoom:DeleteChatRoom)
  {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: deleteChatRoom.id },
      include: {
        members: {
          where: {
            user_id: deleteChatRoom.userId,
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
      throw new Error(`User with ID ${deleteChatRoom.userId} is not an admin for the chat room.`);
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

  async createMessage(createMessageRoom: CreateMessageRoom)
  {
    const message = await this.prisma.messageRome.create({
      data: {
        content : createMessageRoom.content,
        chatRoomId : createMessageRoom.chatRoomId,
        senderId: createMessageRoom.senderId,
      },
    });
    if (!message) {
      throw new Error("Message failed to create in the database.");
    }
    return message;
  }

}
