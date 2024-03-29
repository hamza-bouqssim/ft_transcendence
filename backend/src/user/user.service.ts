/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'src/gateway/User';
import { findUserParams } from 'src/utils/types';

@Injectable()
export class UserService {
    constructor(private readonly prisma:PrismaService){}


    async findUser( username: string)
    {
        const data = await this.prisma.user.findFirst({where: {
            username,
        }})

        if(!data)
        {
            throw new NotFoundException('User with this name : '+ username + ' not found !')
        }
       
            const {id, display_name, avatar_url} = data;
            return {id, username, display_name, avatar_url};
        
    }

    async allFriendsRequest(userId : string)
    {
        const friendsAsUser = await this.prisma.friend.findMany({
            where: {
                OR: [
                    {user_id: userId},
                    {friend_id: userId}
                ]
            
            },
        
        });
        return friendsAsUser;

    }


    async changeDisplayedName(_email: string, newDisplayedName: string) {
      const find = await this.prisma.user.findUnique({ where: { email: _email } });
  
      if (!find) {
          throw new HttpException("User Not Found!", HttpStatus.BAD_REQUEST);
      }
      
      const search = await this.prisma.user.findUnique({
          where: {
              display_name: newDisplayedName //rgatnoui
          }
      });
  
      if ((search) && search.email != _email) {
          throw new Error("This Display Name already in use, Choose another one !!!");
      }
      
      if(!search){
        const updatedDisplayName = await this.prisma.user.update({
            where: { email: _email },
            data: { display_name: newDisplayedName }
        });

        if (!updatedDisplayName) {
            throw new Error("Error");
        }
      }
  
  
          return { message: 'Update display_name successfully' };
  }



    async changeUserName(_email: string, newUserName: string){
        const find = await this.prisma.user.findUnique({where: {email:_email}});

        if(!find)
            throw new HttpException("User Not Found!", HttpStatus.BAD_REQUEST);
        const updatedUserName = await this.prisma.user.update({
            where: {email: _email},
            data: {username: newUserName},
        })
        if (!updatedUserName)
            throw new HttpException("Error",  HttpStatus.BAD_REQUEST);
        return {message : 'Update username succefully'}

    }

    async _changeAvatar(_email: string, avatarPath: any)
    {
        const find = await this.prisma.user.findUnique({where: {email:_email}});

        
        if(!find)
            throw new HttpException("User Not Found!",  HttpStatus.BAD_REQUEST)

        const updatedAvatar = await this.prisma.user.update({
            where: {email: _email},
            data: {avatar_url: avatarPath}
        })

        if (!updatedAvatar)
            throw new HttpException("Error",  HttpStatus.BAD_REQUEST);
        
            return {message : 'Updating Image succefuly'};
    }

    async listFriends(userId: string) {
        const friendsAsUser = await this.prisma.friend.findMany({
            where: {
                user_id: userId,
                status: 'ACCEPTED',
            },
            select: {
                friends: { 
                    select: {
                        id: true,
                        username: true,
                        display_name: true,
                        avatar_url: true,
                    },
                },
            },
        });
    
        const friendsAsFriend = await this.prisma.friend.findMany({
            where: {
                friend_id: userId,
                status: 'ACCEPTED',
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        display_name: true,
                        avatar_url: true,
                        status : true,
                    },
                },
            },
        });

        const allFriends = [
            ...friendsAsUser.map(({ friends }) => friends),
            ...friendsAsFriend.map(({ user }) => user),
        ];
        const uniqueFriends = Array.from(new Set(allFriends.map((friend) => friend.id)))
            .map((id) => allFriends.find((friend) => friend.id === id));
    
        return uniqueFriends;
    }
    
    
    
    async pendingRequests(userId: string)
    {
        return await this.prisma.friend.findMany({where: { friend_id: userId, status: 'PENDING'}, select: {id : true , user: {select: {id: true, username: true, display_name: true, avatar_url:true}}, friends: true}});
    }

    async pendingPLayingRequest(userId : string){
        return await this.prisma.requestPlay.findMany({
            where : {
                recipientId: userId, status: 'PENDING'
            },
            select:{
                Sender : true,
                recipient : true,
            }
        })

    }
    async CountPendingRequests(userId: string): Promise<number> {
        const pendingRequests = await this.prisma.friend.count({
          where: { friend_id: userId, status: 'PENDING' },
        });
      
        return pendingRequests;
      }
      

    async blockedFriends(userId: string) {
        const blockedUsers = await this.prisma.blockList.findMany({
          where: {
            userOneId: userId,
          },
        });
      
        const blockedUserIds = blockedUsers.map(block => block.userTwoId);
      
        const blockedFriends = await this.prisma.user.findMany({
          where: {
            id: {
              in: blockedUserIds,
            },
          },
          select: {
            id: true,
            username: true,
            display_name: true,
            avatar_url: true,
          },
        });
      
        return blockedFriends;
      }
    
    async findByEmail(email : string)
    {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        })

    }

    async findById(id : string)
    {
        return await this.prisma.user.findUnique({
            where: {
               id: id,
            }
        })

    }

    async findByDisplayName(display_name : string)
    {
        return await this.prisma.user.findUnique({
            where: {
               display_name: display_name,
            }
        })
    }
    async findByNameSearching(name: string) {
      const users = await this.prisma.user.findMany({
        where: {
          display_name: {
            contains: name,
          },
        },
      });



      const result = [...users];

      return result;
    }
    
    async findUserById(finduserParams : findUserParams)
    {
        return this.prisma.user.findUnique({
            where: {
               id: finduserParams.id,
               
            }
        }) 
    }
    async allUsers(idUser : string)
    {
        return this.prisma.user.findMany({
            where: {
                id: {
                    not: idUser
                }
            }
        });
    }

    async allFriendsId(userId: string) {
        const friends = await this.prisma.friend.findMany({
          where: {
            OR: [
              { user_id: userId },
              { friend_id: userId },
            ],
          },
          include: {
            user: true,
            friends: true,
          },
        });
        const processedFriends = friends.map((friend) => {
            if (friend.user.id === userId) {
              return friend.friends; // Display friend data if the user initiated the request
            } else {
              return friend.user; // Display user data if the friend initiated the request
            }
          });
      
    
        return processedFriends;
      }

    async userInfo(user_id: string) {
      
        const user = await this.prisma.user.findUnique({
          where: { id: user_id },
        });
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        return user;
      }
      
      

      // create notification

      async createNotification(userSender: User, userRecipient: User, message: string, type: string, requestId : string) {
        const notification = await this.prisma.notificationGlobal.create({
            data: {
                Sender: { connect: { id: userSender.id } },
                recipient: { connect: { id: userRecipient.id } },
                content: message,
                image_content: userSender.avatar_url,
                type: type,
                requestId: requestId,
            },
        });
    
        return notification;
    }
    async notificationCreate(user : User){

        // await this.prisma.notificationGlobal.updateMany({
        //     where: {
        //         recipient_id: user.id,
        //     },
        //     data: {
        //         vue: true,
        //     },
        // });
        const notifications = await this.prisma.notificationGlobal.findMany({
            where: {
                recipient_id: user.id,
                vue: false,
            },
            include: {
                Sender: true, // Corrected syntax: remove the semicolon and use a comma
            },
        });

        return notifications;
    }

  

    async isBlockedByUser(senderId: string, recipientUserId: string): Promise<boolean> {
        const blockedFriends = await this.blockedFriends(senderId);
        return blockedFriends.some((friend) => friend.id === recipientUserId);
      }
 

    async all_pending_request(){
      const pendingRequests = await this.prisma.friend.findMany({
        where: {
          status: 'PENDING',
        },
        include: {
          user: true,
          friends: true,
        },
      });
      return pendingRequests;
    }
    async deleteAccount(userId: string) {
        try {
          // Delete related data
          await this.prisma.friend.deleteMany({
            where: {
              OR: [
                { user_id: userId },
                { friend_id: userId },
              ],
            },
          });
      
          await this.prisma.notificationGlobal.deleteMany({
            where: {
              OR: [
                { Sender_id: userId },
                { recipient_id: userId },
              ],
            },
          });
      
          await this.prisma.blockList.deleteMany({
            where: {
              OR: [
                { userOneId: userId },
                { userTwoId: userId },
              ],
            },
          });
      
          await this.prisma.chatParticipents.deleteMany({
            where: {
              OR: [
                { senderId: userId },
                { recipientId: userId },
              ],
            },
          });
      
          await this.prisma.message.deleteMany({
            where: {
              OR: [
                { senderId: userId },
                { participentsId: userId },
              ],
            },
          });
      
          await this.prisma.match_History.deleteMany({
            where: {
              OR: [
                { playerOne: userId },
                { playerTwo: userId },
              ],
            },
          });
          await this.prisma.stateGame.deleteMany({
            where: {
              user_id: userId,
            },
          });
      
          await this.prisma.user.delete({
            where: {
              id: userId,
            },
          });
        } catch (error) {
          console.error('Error deleting user account:', error);
          throw new Error('Failed to delete user account');
        }
      }    
}

