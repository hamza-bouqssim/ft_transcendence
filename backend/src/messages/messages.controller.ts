import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthUser } from 'src/utils/decorator';
import { User } from '@prisma/client';
import { createMessageDto } from './dto/CreateMessage.dto';

@Controller('messages')
export class MessagesController {
constructor(private  messageService : MessagesService)
{}

@Post('create_messages')
async createConversation(@AuthUser() user : User , @Body() dto : createMessageDto)
{
    const messages = await this.messageService.createMessags(user, dto);
    return messages;
}
@Get(':conversationId')
async getMessagesFromConversatin(@Param('conversationId') conversationId : string){
    const getMessages = await this.messageService.getMessageByConversationId(conversationId);
    console.log('here');
    console.log(getMessages);
    return getMessages;
}

}
