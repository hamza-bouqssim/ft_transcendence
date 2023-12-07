/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards, Req, Res } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Request } from 'src/user/interfaces/request.interface';
import { AuthGuard } from '@nestjs/passport';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createMessageDto } from './dtos/CreateMessage.dto';



@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
constructor(private  conversationService : ConversationsService , private eventEmitter : EventEmitter2)
{}



@Post('conversation')
 async CreateConversations(@Body() request: {display_name : string}, @Req() req, @Res() res){
    try {
        const user =req.user
        const returnValue = await this.conversationService.createConversations(user,  request.display_name);
        return res.status(200).json({ success: true, response: returnValue });
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message || 'An unexpected error occurred' });
    }

}

@Get('findconversation')
async  findConversation(@Req() req: Request){
    const user = req.user
    const find = await this.conversationService.find(user);
    return find;
}

@Post('findConversationUser')
async findConversationUser(@Body() request: {display_name : string}, @Req() req: Request){
    const user = req.user
    const find = await this.conversationService.findConversationUsers(user, request.display_name);
    return find;

}
@Get(':id')
async getconversationById(@Param('id') id: string){
    // return this.conversationService.find();
    const conversation = await this.conversationService.findConversationById(id);
    return conversation;
}
// @Post('create_messages')
// async createConversation(@Req() req: Request , @Body() dto : createMessageDto)
// {    
//     const user =req.user
//     const messages = await this.conversationService.createMessags(user, dto);
//     return this.eventEmitter.emit('message.create', messages);
    
// }

@Get('messages/:conversationId')
async getMessagesFromConversatin(@Param('conversationId') conversationId : string){
    const getMessages = await this.conversationService.getMessageByConversationId(conversationId);
   return getMessages;
}

}
