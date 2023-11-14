/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req,  UseGuards } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { AuthenticatedGuard } from 'src/auth/guards/GlobalGuard';
import { whichWithAuthenticated } from 'src/user/utils/auth-utils';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Controller('friend-request')
export class FriendRequestController {
    constructor(private readonly friendshipService: FriendRequestService,
                private readonly jwtService: JwtService,
                private readonly prisma: PrismaService,){}

    @Post('send-request')
    @UseGuards(AuthenticatedGuard)
    async sendRequest(@Body() request: {friendUserName: string}, @Req() req){

            console.log("thissss===== : " + request.friendUserName);
            const user = await whichWithAuthenticated(req, this.jwtService, this.prisma)
            return this.friendshipService.sendRequest(request.friendUserName, user.username);
    }

    @Post('accept-request')
    @UseGuards(AuthenticatedGuard)
    async acceptRequest(@Body() request: {requestId: string}, @Req() req)
    {
        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        return this.friendshipService.acceptFriendRequest(request.requestId, user.id);
    }
    
    @Post('block-friend')
    @UseGuards(AuthenticatedGuard)
    async blockFriend(@Body() request: {friendIdToBlock: string}, @Req() req)
    {
        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        return this.friendshipService.block(request.friendIdToBlock, user.id);
    }

    @Post('unblock-friend')
    @UseGuards(AuthenticatedGuard)
    async unblockFriend(@Body() request: {friendIdToUnblock: string}, @Req() req)
    {
        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        return this.friendshipService.unblock(request.friendIdToUnblock, user.id);
    }
}