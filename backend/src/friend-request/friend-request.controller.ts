/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
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
    async sendRequest(@Body() request: {display_name: string}, @Req() req, @Res() res){
            try{
                console.log("thissss===== : " + request.display_name);
                const user = await whichWithAuthenticated(req, this.jwtService, this.prisma)
                const returnvalue = await this.friendshipService.sendRequest(request.display_name, user.display_name);
                return  res.status(200).json({Response:returnvalue});
            }catch(err)
            {
                console.log(err)
                return  res.status(401).json({error:err});
            }
    }

    @Post('accept-request')
    @UseGuards(AuthenticatedGuard)
    async acceptRequest(@Body() request: {requestId: string}, @Req() req)
    {
        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        return this.friendshipService.acceptFriendRequest(request.requestId, user);
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