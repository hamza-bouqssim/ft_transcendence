/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req,  UseGuards } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { whichWithAuthenticated } from 'src/user/utils/auth-utils';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('friend-request')
export class FriendRequestController {
    constructor(private readonly friendshipService: FriendRequestService,
                private readonly jwtService: JwtService,
                private readonly prisma: PrismaService,){}

    @Post('send-request')
    @UseGuards(AuthGuard('jwt'))
    async sendRequest(@Body() request: {friendDisplay_name: string}, @Req() req){

            console.log("thissss===== : " + request.display_name);
            const user = await whichWithAuthenticated(req, this.jwtService, this.prisma)
            return this.friendshipService.sendRequest(request.display_name, user.display_name);
    }

    @Post('accept-request')
    @UseGuards(AuthGuard('jwt'))
    async acceptRequest(@Body() request: {requestId: string}, @Req() req)
    {
        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        return this.friendshipService.acceptFriendRequest(request.requestId, user);
    }
    
    @Post('block-friend')
    @UseGuards(AuthGuard('jwt'))
    async blockFriend(@Body() request: {friendIdToBlock: string}, @Req() req)
    {
        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        return this.friendshipService.block(request.friendIdToBlock, user.id);
    }

    @Post('unblock-friend')
    @UseGuards(AuthGuard('jwt'))
    async unblockFriend(@Body() request: {friendIdToUnblock: string}, @Req() req)
    {
        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        return this.friendshipService.unblock(request.friendIdToUnblock, user.id);
    }
}