import { Body, Controller, Get, Param, Post, UseGuards, Request, Response } from '@nestjs/common';
// import { Routes } from '../utils/constants';
// import { Services } from 'src/utils/constants';
// import { IConversationService } from './conversation';
// import { createConversationDto } from './dtos/CreateConversation.dto';
import { ConversationsService } from './conversations.service';
import { AuthUser } from 'src/utils/decorator';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { CreateConversationParams } from 'src/utils/types';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';


@Controller('chat')
@UseGuards(AuthenticatedGuard)
export class ConversationsController {
constructor(private  conversationService : ConversationsService , private userService : UserService )
{}


@Get('status')
@UseGuards(AuthenticatedGuard)
    status(@Request() req, @Response() res){
            // console.log(req.user)
            res.send(req.user)
}

@Post('conversation')
 async CreateConversations(@AuthUser() user:User, @Body() dto : CreateConversationParams){
    const userDb = await this.userService.findById(user.id)
    console.log(userDb)
    return this.conversationService.createConversations(userDb, dto);
}

@Get('findconversation')
async  findConversation(@AuthUser() user:User){
    const find = await this.conversationService.find(user);
    // console.log('findConversation')
    // console.log(find);
    return find;
}
@Get(':id')
async getconversationById(@Param('id') id: string){
    // return this.conversationService.find();
    const conversation = await this.conversationService.findConversationById(id);
    // console.log(conversation)
    return conversation;
}
}
