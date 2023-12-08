/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
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


    async changeDisplayedName(_email: string, newDisplayedName: string){
        const find = await this.prisma.user.findUnique({where: {email:_email}});        
            if(!find)
                throw new HttpException("User Not Found!", HttpStatus.BAD_REQUEST); 
            if (find.display_name === newDisplayedName)
                throw new HttpException("This Display Name already in use, Choose another one !!!", HttpStatus.BAD_REQUEST);

        const search = await this.prisma.user.findUnique({
            where : {
            display_name: newDisplayedName
        }
        })

        if(search)
        {
            throw new HttpException("Display_name alrighdy in use", HttpStatus.BAD_REQUEST);
        }

        const updatedDipslayName = await this.prisma.user.update({
            where: {email: _email},
            data: {display_name: newDisplayedName}
        })

        if(!updatedDipslayName)
            throw new HttpException("Error", HttpStatus.BAD_REQUEST);
        
        return {message : 'Update display_name  succefully'}    }

    async changeUserName(_email: string, newUserName: string){
        const find = await this.prisma.user.findUnique({where: {email:_email}});

        if(!find)
            throw new HttpException("User Not Found!", HttpStatus.BAD_REQUEST)
        if (find.username === newUserName)
            throw new HttpException("This UserName already in use, Choose another one !!!", HttpStatus.BAD_REQUEST);
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

        // console.log("old: " + (find?.avatar_url || 'null') + "\n new:  " + avatarPath);
        
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

    async blockedFriends(userId: string)
    {
        return await this.prisma.friend.findMany({where: {friend_id: userId, status: 'BLOCKED'}, select: {user: {select: {id: true, username: true, display_name: true, avatar_url:true}}}});
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

    async findByDisplayNameSearching(displayName: string) {
        return await this.prisma.user.findMany({
            where: {
                display_name: {
                    contains: displayName,
                },
            },
        });
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

      async userInfo(user_id : string){

        const user = await this.prisma.user.findUnique({
            where: { id: user_id},
            
            
          });
          if (!user) {
            throw new NotFoundException('User not found');
          }
          return user;
      


      }
  
}
