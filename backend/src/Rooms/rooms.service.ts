/* eslint-disable prettier/prettier */
import { Injectable,HttpStatus,HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RoomId,Member ,DeleteChatRoom,UpdateChatRoom,CreateChatRoom,getAllRooms ,CreateMessageRoom} from "src/Rooms/dto/rooms.dto";
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
        Status: {
          not: {
            in: ["Ban", "kick"],
          },
        },
      },
    });
    if (!memberInfo || memberInfo.length === 0) {
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
            user_id:true,
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
            user_id:true,
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
      },
    });
    if (!chatRoom) {
      throw new Error(`Chat room with ID ${deleteChatRoom.id} not found.`);
    }

    if (!chatRoom.members.length) {
      throw new Error(`User  is not an admin for the chat room.`);
    }
    const ChatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: deleteChatRoom.id },
      include:{
        members:{
          include:{
            user:true
          }
        }
      }
    });

    await this.prisma.member.deleteMany({
      where: { chatRoomId: deleteChatRoom.id },
    });
    await this.prisma.messageRome.deleteMany({
      where: { chatRoomId: deleteChatRoom.id },
    });
    const deletedChatRoom = await this.prisma.chatRoom.delete({
      where: { id: deleteChatRoom.id },
    });

    return ChatRoom;
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


  async allMember(id:string, roomId:RoomId) 
  {
    const userRole = await this.prisma.member.findFirst({
      where: {
          user_id: id,
          chatRoomId: roomId.id,
      },
      select: {
        isAdmin: true,
      },
    });

    let members;

    if (userRole?.isAdmin) {
      members = await this.prisma.member.findMany({
        where: {
          chatRoomId: roomId.id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              status: true,
              email: true,
              display_name: true,
              avatar_url: true,
            },
          },
        },
      });
    } else {
      members = await this.prisma.member.findMany({
        where: {
          chatRoomId: roomId.id,
          Status: { not: 'Ban' },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              status: true,
              email: true,
              display_name: true,
              avatar_url: true,
            },
          },
        },
      });
    }
    return members;
  }

  async banMember(id: string, memberUpdate: Member) {
    const userRole = await this.prisma.member.findFirst({
      where: {
        user_id: id,
        chatRoomId: memberUpdate.id,
      },
    });

    if (!userRole?.isAdmin) {
      throw new HttpException("User is not an admin in the room", HttpStatus.BAD_REQUEST);
    }
    const userRole1 = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.id,
        chatRoomId: memberUpdate.id,
      },
    });
    if (userRole1?.isAdmin) {
      throw new HttpException("can t ban owner in the room", HttpStatus.BAD_REQUEST);
    }
    const userBan = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
    const updatedMember = await this.prisma.member.update({
      where: {
        id: userBan.id,
      },
      data: {
        Status: "Ban",
      },
    });

    return updatedMember;
  }



  async mutMember(id: string, memberUpdate: Member)
  {
    const userRole = await this.prisma.member.findFirst({
      where: {
        user_id: id,
        chatRoomId: memberUpdate.id,
      },
    });

    if (!userRole?.isAdmin) {
      throw new HttpException("User is not an admin in the room", HttpStatus.BAD_REQUEST);
    }
    const userRole1 = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.id,
        chatRoomId: memberUpdate.id,
      },
    });
    if (userRole1?.isAdmin) {
      throw new HttpException("can t Mut owner in the room", HttpStatus.BAD_REQUEST);
    }

    const userMut = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
    const updatedMember = await this.prisma.member.update({
      where: {
        id: userMut.id,
      },
      data: {
        Status: "Mut",
      },
    });

    return updatedMember;

  }

  //modifier 

  async kickMember(id: string, memberUpdate: Member)
  {
    const userRole = await this.prisma.member.findFirst({
      where: {
        user_id: id,
        chatRoomId: memberUpdate.id,
      },
    });

    if (!userRole?.isAdmin) {
      throw new HttpException("User is not an admin in the room", HttpStatus.BAD_REQUEST);
    }
    const userRole1 = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.id,
        chatRoomId: memberUpdate.id,
      },
    });
    if (userRole1?.isAdmin) {
      throw new HttpException("can t kick owner in the room", HttpStatus.BAD_REQUEST);
    }

    const userkick = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
    const updatedMember = await this.prisma.member.update({
      where: {
        id: userkick.id,
      },
      data: {
        Status: "kick",
      },
    });

    return updatedMember;

  }
  async Member(id: string, memberUpdate: Member)
  {
    const userRole = await this.prisma.member.findFirst({
      where: {
        user_id: id,
        chatRoomId: memberUpdate.id,
      },
    });

    if (!userRole?.isAdmin) {
      throw new HttpException("User is not an admin in the room", HttpStatus.BAD_REQUEST);
    }

    const userkick = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
    const updatedMember = await this.prisma.member.update({
      where: {
        id: userkick.id,
      },
      data: {
        Status: "Member",
      },
    });

    return updatedMember;

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


  async getConversation(roomId: RoomId,id: string)
  {
    const isMember = await this.prisma.chatRoom.findFirst({
      where: {
        id: roomId.id
      },
      include: {
        members: {
          where: {
            user_id: id,
          },
        },
      },
    });

    if (!isMember) {
      throw new HttpException("User is not a member in this room", HttpStatus.BAD_REQUEST );
    }

    const chatRoomMessages = await this.prisma.messageRome.findMany({
      where: {
        chatRoomId: roomId.id,
      },
    });

    return chatRoomMessages;
  }


}

