/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { UserService } from 'src/user/user.service';
import { CreateConversationParams } from 'src/utils/types';
import { Request } from 'src/user/interfaces/request.interface';
import { whichWithAuthenticated } from 'src/user/utils/auth-utils';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
@UseGuards(AuthGuard('42'))
export class ConversationsController {
constructor(private  conversationService : ConversationsService , private userService : UserService, private jwtservice : JwtService, private prisma : PrismaService )
{}



@Post('conversation')
 async CreateConversations(@Req() req: Request, @Body() dto : CreateConversationParams){
    console.log("in here");
    const user = await whichWithAuthenticated(req, this.jwtservice, this.prisma);
    const userDb = await this.userService.findById(user.id);
   
    return this.conversationService.createConversations(userDb, dto);
}

@Get('findconversation')
async  findConversation(@Req() req: Request){
    const user =  await whichWithAuthenticated(req, this.jwtservice, this.prisma);
    const find = await this.conversationService.find(user);
    return find;
}
@Get(':id')
async getconversationById(@Param('id') id: string){
    // return this.conversationService.find();
    const conversation = await this.conversationService.findConversationById(id);
    return conversation;
}
}
