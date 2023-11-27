/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Request } from 'src/user/interfaces/request.interface';
import { createMessageDto } from './dto/CreateMessage.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { whichWithAuthenticated } from 'src/user/utils/auth-utils';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Controller('messages')
export class MessagesController {
constructor(private  messageService : MessagesService, private eventEmitter : EventEmitter2, private jwtservice : JwtService, private prisma : PrismaService)
{}

@Post('create_messages')
async createConversation(@Req() req: Request , @Body() dto : createMessageDto)
{    
    const user = await whichWithAuthenticated(req, this.jwtservice, this.prisma);
    const messages = await this.messageService.createMessags(user, dto);
    return this.eventEmitter.emit('message.create', messages);
    
}
@Get(':conversationId')
async getMessagesFromConversatin(@Param('conversationId') conversationId : string){
    const getMessages = await this.messageService.getMessageByConversationId(conversationId);
    return getMessages;
}

}
