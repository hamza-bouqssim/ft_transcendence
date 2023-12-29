/* eslint-disable prettier/prettier */
import { Injectable,HttpStatus,HttpException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RoomId,Member,JoinRooms ,DeleteChatRoom,UpdateChatRoom,CreateChatRoom,getAllRooms ,CreateMessageRoom} from "src/Rooms/dto/rooms.dto";
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
            Status: true,
          },
        },
        messageRome:{
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
          take: 1, 
          orderBy: {
            createdAt: 'desc',
          },
        },
        }
      
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
              Status: "Owner",
            },
            ...data.idUserAdd.map(userId => ({
              user: {
                connect: { id: userId },
              },
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
            OR: [
              {
                user_id: id,
                Status: "Owner",
              },
              {
                user_id: id,
                Status: "Admin",
              },
            ],
          },
        },
      },
    });
    if (!existingChatRoom) {
      throw new HttpException(`Chat room with ID ${data.id} not found.`, HttpStatus.BAD_REQUEST);
    }

    if (!existingChatRoom.members.length) {
      throw new HttpException(`User  is not an admin for the chat room.`, HttpStatus.BAD_REQUEST);
    }

    const ChatRoomName = await this.prisma.chatRoom.findFirst({
      where: {
        name: data.name,
        NOT: {
          id: existingChatRoom.id,
        },
      },
    });
    
    if (ChatRoomName) {
      throw new HttpException(`Room with name ${data.name} already exists`, HttpStatus.BAD_REQUEST);
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
            Status:true
          },
        },
      },
    });
    return updatedChatRoom;

  }


  
  
  
  
  async allMember(id:string, roomId:RoomId) 
  {
    const userRole = await this.prisma.member.findFirst({
      where: {
          user_id: id,
          chatRoomId: roomId.id,
        },
        select: {
          Status: true,
        },
      });
      let members;
      
      if (userRole?.Status === "Owner" || userRole?.Status === "Admin") {
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
          Status: { not: 'Ban'  },
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
    
    if ( userRole?.Status !== 'Owner' && userRole?.Status !== 'Admin') {
      throw new HttpException("User is not an admin in the room", HttpStatus.BAD_REQUEST);
    }
    const userRole1 = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
    if (userRole1?.Status === 'Owner' || (userRole?.Status === 'Admin' &&  userRole1?.Status === 'Admin' )) {
      throw new HttpException("can t ban owner or Admin ban admin in the room", HttpStatus.BAD_REQUEST);
    }
    const updatedMember = await this.prisma.member.update({
      where: {
        id: userRole1.id,
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
    if ( userRole?.Status !== 'Owner' && userRole?.Status !== 'Admin') {
        throw new HttpException("User is not an admin in the room", HttpStatus.BAD_REQUEST);
    }
    const userRole1 = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
    if (userRole1?.Status === 'Owner'|| (userRole?.Status === 'Admin' &&  userRole1?.Status === 'Admin' )) {
      throw new HttpException("can t Mut owner in the room", HttpStatus.BAD_REQUEST);
    }
  
    const updatedMember = await this.prisma.member.update({
      where: {
        id: userRole1.id,
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
    
    if ( userRole?.Status !== 'Owner' && userRole?.Status !== 'Admin') {
      throw new HttpException("User is not an admin in the room", HttpStatus.BAD_REQUEST);
    }
    const userRole1 = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
    if (userRole1?.Status === 'Owner'|| (userRole?.Status === 'Admin' &&  userRole1?.Status === 'Admin' )) {
      throw new HttpException("can t kick owner in the room", HttpStatus.BAD_REQUEST);
    }

    const updatedMember = await this.prisma.member.update({
      where: {
        id: userRole1.id,
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
    
    if ( userRole?.Status !== 'Owner' && userRole?.Status !== 'Admin') {
      throw new HttpException("User is not an admin in the room", HttpStatus.BAD_REQUEST);
    }
    
    const userRole1 = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
    if (userRole1?.Status === 'Owner'|| (userRole?.Status === 'Admin' &&  userRole1?.Status === 'Admin' )) {
      throw new HttpException("can t kick owner in the room", HttpStatus.BAD_REQUEST);
    }
    const updatedMember = await this.prisma.member.update({
      where: {
        id: userRole1.id,
      },
      data: {
        Status: "Member",
      },
    });
    
    return updatedMember;
    
  }
  
  async makeAdmin(id: string, memberUpdate: Member) {
    const userRole = await this.prisma.member.findFirst({
      where: {
        user_id: id,
        chatRoomId: memberUpdate.id,
      },
    });
  
    if (userRole?.Status !== 'Owner') {
      throw new HttpException("User is not an Owner in the room", HttpStatus.BAD_REQUEST);
    }
  
    const userToUpdate = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
  
    if (!userToUpdate) {
      throw new HttpException("The specified user is not a member in the room", HttpStatus.BAD_REQUEST);
    }
  
    if (userToUpdate.Status === "Admin") {
      throw new HttpException("The specified user is already an admin in the room", HttpStatus.BAD_REQUEST);
    }
  
    const updatedUser = await this.prisma.member.update({
      where: {
        id: userToUpdate.id,
      },
      data: {
        Status: "Admin",
      },
    });
  
    return updatedUser;
  }


  async quitRoom(iduser: string, roomId: RoomId) {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: roomId.id,
      },
    });
  
    const user = await this.prisma.member.findFirst({
      where: {
        user_id: iduser,
        chatRoomId: roomId.id,
      },
    });
  
    if (!room || !user) {
      throw new HttpException("Room or user not found", HttpStatus.NOT_FOUND);
    }
  
    if (user?.Status === 'Owner') {
      let oldOwner = await this.prisma.member.findFirst({
        where: {
          chatRoomId: roomId.id,
          user_id: { not: user.id },
          Status: { in: ["Admin", "Member","Ban","Mut"] },
        },
      });
  
      if (oldOwner) {
        await this.prisma.member.update({
          where: {
            id: oldOwner.id,
          },
          data: {
            Status: "Owner",
          },
        });
      }
    }
    if(user?.Status !== 'Ban')
    {
        await this.prisma.member.delete({
          where: {
            id: user.id,
          },
        });
    }
  
    const remainingMembers = await this.prisma.member.count({
      where: {
        chatRoomId: roomId.id,
      },
    });
  
    if (remainingMembers === 0) {
      await this.prisma.messageRome.deleteMany({
        where: { chatRoomId: roomId.id },
      });
      await this.prisma.chatRoom.delete({
        where: {
          id: roomId.id,
        },
      });
    }
  
    return user.id;
  }
  
  

  async addMemberToRooms(iduser: string, memberUpdate: Member) {

    const owner = await this.prisma.member.findFirst({
      where: {
        user_id: iduser,
        OR: [
          { Status: "Owner" },
          { Status: "Admin" },
        ],
      },
    });
    if (!owner) {
      throw new HttpException('User is not an owner or admin', HttpStatus.UNAUTHORIZED);
    }
  
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: memberUpdate.id,
      },
    });
  
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }
  
    const existingMember = await this.prisma.member.findFirst({
      where: {
        user_id: memberUpdate.userId,
        chatRoomId: memberUpdate.id,
      },
    });
  
    if (existingMember) {
      throw new HttpException('User is already a member of the room', HttpStatus.CONFLICT);
    }

    await this.prisma.member.create({
      data: {
        user: {
          connect: {
            id: memberUpdate.userId,
          },
        },
        chatRoom: {
          connect: {
            id: memberUpdate.id,
          },
        },
      },
    });

    return 'Member added to the room successfully';
  }
  
  
  async joinRooms(id: string, joinRooms: JoinRooms) {


    const isRoom = await this.prisma.chatRoom.findFirst({
      where: {
        id: joinRooms.id,
      },
        select: {
          password: true,
        },
    });


    if (!isRoom) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    const isMember = await this.prisma.member.findFirst({
      where: {
        user_id: id,
        chatRoomId: joinRooms.id,
      },
    });


    if (isMember) {
      if (isMember.Status !== 'kick') {
        throw new HttpException('User is already a member of the room', HttpStatus.CONFLICT);
      } else {
        if (joinRooms.Privacy === 'Protected' && !(await bcrypt.compare(joinRooms.password, isRoom.password))) {
          throw new HttpException('Incorrect password for the protected room', HttpStatus.UNAUTHORIZED);
        }
        await this.prisma.member.update({
          where: {
            id: isMember.id,
          },
          data: {
            Status: 'Member',
          },
        });
      }
    } else {
      if (joinRooms.Privacy === 'Protected'  && !(await bcrypt.compare(joinRooms.password, isRoom.password))) {
        throw new HttpException('Incorrect password for the protected room', HttpStatus.UNAUTHORIZED);
      }
      await this.prisma.member.create({
        data: {
          user: {
            connect: {
              id: id,
            },
          },
          chatRoom: {
            connect: {
              id: joinRooms.id,
            },
          },
        },
      });
    }

    return 'Join to room success';
  }


 async findRoom(id: string, val :string) {
  if(!val)
    return null;
  const allRooms = await this.prisma.chatRoom.findMany({
    where: {
      name: {
        contains: val,
      },
      Privacy: {
        in: ['Public', 'Protected'],
      },
      members: {
        every: {
          OR: [
            {
              user_id: {
                not: id,
              },
            },
            {
              user_id: id,
              Status: 'kick',
            },
          ],
        },
      },
    },
    select: {
      id: true,
      name: true,
      Privacy: true,
      picture: true,
      members:{
        select: {
          user: true,
        },
      }
    },
  });

  return allRooms;
}



  async getAllFreind(id: string) {
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
      include: {
        user: {
          select: {
            email: true,
            avatar_url:true,
            display_name:true,
            id:true,
          },
        },
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
      include: {
        user: {
          select: {
            email: true,
            avatar_url:true,
            display_name:true,
            id:true,
          },
        },
      },
    });

    return chatRoomMessages;
  }

  async notificationRoom(roomId:string,userId:string,number:number)
  {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!existingUser) {
        return null;
      }
  
      const notificationRoom = await this.prisma.notificationMessage.create({
        data: {
          roomId: roomId,
          userId: userId,
          number: number,
        },
      });
      return notificationRoom;
  } 

  async notificationRoomUpdate(senderId: string, chatRoomId: string) {

      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: {
          id: chatRoomId,
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
  
      if (!chatRoom) {
        return null;
      }
  
      for (const member of chatRoom.members) {
        if(member.user_id !== senderId)
        {
            const existingNotification = await this.prisma.notificationMessage.findFirst({
              where: {
                roomId: chatRoomId,
                userId: member.user_id,
              },
            });
      
            if (!existingNotification) {
              await this.prisma.notificationMessage.create({
                data: {
                  roomId: chatRoomId,
                  userId: member.user_id,
                  number: 1, 
                },
              });
            } else {
              const updatedNotification = await this.prisma.notificationMessage.update({
                where: {
                  id: existingNotification.id,
                },
                data: {
                  number: existingNotification.number + 1,
                },
              });
      
            }
        }
      }
      return 'Notification messages updated successfully.';
  }

  async cleanNotification(userId:string,roomId:string)
  {
    const existingNotification = await this.prisma.notificationMessage.findFirst({
      where: {
        roomId: roomId,
        userId: userId,
      },
    });
    if(!existingNotification)
      return
    const cleanNotification = await this.prisma.notificationMessage.update({
      where: {
        id: existingNotification.id,
      },
      data: {
        number:0,
      },
    });
    return 'Notification messages clean successfully.';

  }

  async DeleteNotification(userId:string,roomId:string)
  {
    const existingNotification = await this.prisma.notificationMessage.findFirst({
      where: {
        roomId: roomId,
        userId: userId,
      },
    });
    if(!existingNotification)
      return
    const cleanNotification = await this.prisma.notificationMessage.delete({
      where: {
        id: existingNotification.id,
      },
    });
    return 'Notification messages deleted successfully.';

  }
}