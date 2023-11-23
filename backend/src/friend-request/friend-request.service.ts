/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException,HttpStatus,HttpException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ParticipentService } from 'src/Participent/Participent.service';

@Injectable()
export class FriendRequestService {
    constructor(private readonly prisma: PrismaService , private readonly participentService : ParticipentService){}
    
    async sendRequest(friendDisplay_name: string, _Display_name:string){

        const user = await this.prisma.user.findFirst({where: {display_name: _Display_name}});
        const _friendDisplay_name = await this.prisma.user.findFirst({where: {display_name: friendDisplay_name}});
        
        if(!user || !_friendDisplay_name)
        {
            throw new HttpException('User Not Found !', HttpStatus.BAD_REQUEST)

        }


        const requestAlreadySent = await this.prisma.friend.findFirst(
            {
                where: {
                    OR: [
                        { user_id: user.id, friend_id: _friendDisplay_name.id},
                        {user_id: _friendDisplay_name.id, friend_id: user.id  },
                      ],
            }});

        if(requestAlreadySent)
        {
            throw new HttpException('Request Already Sent !', HttpStatus.BAD_REQUEST)
        }

         await this.prisma.friend.create({
            data: {
                user_id: user.id,
                friend_id: _friendDisplay_name.id,
                status: 'PENDING',
                created_at: new Date()
            }
        });

        return {message: 'Friend request sent successfully'};
    }

    async acceptFriendRequest(requestId: string, user : User){
        const req = await this.prisma.friend.findUnique({where: {id: requestId}})
        if(!req)
            throw new UnauthorizedException ("the request doesn't exist");

        if(req.friend_id !== user.id)
            throw new UnauthorizedException("have you ever seeing someone is accepting friend request the he send hhhhhh");

        await this.prisma.friend.update({where: {id: requestId}, data: {status: 'ACCEPTED'}});
        

        
        return {message: 'Friend request accepted'};
    }

    async refuseFriendRequest(requestId: string, user: User)
    {
        const req = await this.prisma.friend.findUnique({where : {id : requestId}})
        if(!req)
            throw new UnauthorizedException ("the request doesn't exist");


    }

    async block(friendId: string, userId: string){

        const friendship = await this.prisma.friend.findFirst({
            where: {
                OR: [
                    { user_id: userId, friend_id: friendId, status: 'ACCEPTED' },
                    { user_id: friendId, friend_id: userId, status: 'ACCEPTED' },
                ]
            }
        });

        if(!friendship)
            throw new UnauthorizedException("Friendship doesn't exist");

        await this.prisma.friend.update({where: {id: friendship.id}, data: {status: 'BLOCKED'}});
        return {message: "Blocked"}
    }

    async unblock(friendId: string, userId: string){

        const friendship = await this.prisma.friend.findFirst({
            where: {
                OR: [
                    { user_id: userId, friend_id: friendId, status: 'BLOCKED' },
                    { user_id: friendId, friend_id: userId, status: 'BLOCKED' },
                ]
            }
        });
    
        if(!friendship)
            throw new UnauthorizedException("Friendship doesn't exist or is not blocked by the user.");
    
        
        if (friendship.user_id !== userId) {
            throw new UnauthorizedException("You don't have permission to unblock this user.");
        }
    
        await this.prisma.friend.update({where: {id: friendship.id}, data: {status: 'ACCEPTED'}});
        return {message: "Unblocked"}
    }
    
}
