import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FriendRequestService {
    constructor(private readonly prisma: PrismaService){}
    
    async sendRequest(friendUserName: string, _username:string){

        const user = await this.prisma.user.findFirst({where: {username: _username}});
        const _friendUserName = await this.prisma.user.findFirst({where: {username: friendUserName}});
        // const _friendUserName = await this.userService.findUser(friendUserName);
        
        if(!user || !_friendUserName)
        {
            throw new UnauthorizedException('User Not Found !');
        }

        console.log(user.username);
        console.log(_friendUserName.username);

        const requestAlreadySent = await this.prisma.friend.findFirst({where: {user_id: user.id, friend_id: _friendUserName.id}});

        if(requestAlreadySent)
        {
            throw new UnauthorizedException("Request Already Sent !");
        }

         await this.prisma.friend.create({
            data: {
                user_id: user.id,
                friend_id: _friendUserName.id,
                status: 'PENDING',
                created_at: new Date()
            }
        });

        return {message: 'Friend request sent successfully'};
    }

    async acceptFriendRequest(requestId: string, userId: string){
        const req = await this.prisma.friend.findUnique({where: {id: requestId}})
        if(!req)
            throw new UnauthorizedException ("the request doesn't exist");

        if(req.friend_id !== userId)
            throw new UnauthorizedException("have you ever seeing someone is accepting friend request the he send hhhhhh");

        await this.prisma.friend.update({where: {id: requestId}, data: {status: 'ACCEPTED'}});

        return {message: 'Friend request accepted'};
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
