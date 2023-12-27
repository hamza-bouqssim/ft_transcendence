/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards, Req, Res } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Request } from 'src/user/interfaces/request.interface';
import { AuthGuard } from '@nestjs/passport';
import { EventEmitter2 } from '@nestjs/event-emitter';



@Controller('/chat')
export class ConversationsController {
constructor(private  conversationService : ConversationsService , private eventEmitter : EventEmitter2)
{}



@Post('/conversation')
@UseGuards(AuthGuard("jwt"))
 async CreateConversations(@Body() request: {display_name : string, message : string}, @Req() req, @Res() res){
    try {
        const user =req.user
        
        const returnValue = await this.conversationService.createConversations(user,  request.display_name, request.message);
        return res.status(200).json({ success: true, response: returnValue });
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message || 'An unexpected error occurred' });
    }

}

@Post('/Create_conversation')
@UseGuards(AuthGuard("jwt"))
 async Create_conversations(@Body() request: {display_name : string}, @Req() req, @Res() res){
    try {
        const user =req.user
        const returnValue = await this.conversationService.create_conversations(user,  request.display_name);
        return res.status(200).json({ success: true, response: returnValue });
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message || 'An unexpected error occurred' });
    }

}

@Get('/findconversation')
@UseGuards(AuthGuard("jwt"))
async  findConversation(@Req() req: any, @Res() res){
    try{
        const user = req.user
    const find = await this.conversationService.find(user);
    return res.status(200).json({data : find});

    }catch(error){
        return res.status(401).json(error.response);
    }
    
}

@Post('/findConversationUser')
@UseGuards(AuthGuard("jwt"))
async findConversationUser(@Body() request: {display_name : string, message : string}, @Req() req: Request){
    const user = req.user
    const find = await this.conversationService.findConversationUsers(user, request.display_name, request.message);
    return find;
}
@Get(':id')
async getconversationById(@Param('id') id: string){
    const conversation = await this.conversationService.findConversationById(id);
    return conversation;
}


@Get('/messages/:conversationId')
@UseGuards(AuthGuard("jwt"))

async getMessagesFromConversatin(@Param('conversationId') conversationId : string){
    const getMessages = await this.conversationService.getMessageByConversationId(conversationId);
   return getMessages;
}

@Get('/:id/mark-as-read')
@UseGuards(AuthGuard("jwt"))

async markConversationAsRead(@Param('id') id: string) {
  await this.conversationService.markConversationAsRead(id);
}

@Post('/unread-messages')
@UseGuards(AuthGuard("jwt"))

async getUnreadMessages(@Body() request: {conversationId : string}) {
  const unreadMessages = await this.conversationService.findUnreadMessages(request.conversationId);
  return unreadMessages;
}

// delete conversation

@Post('/delete-conversation')
@UseGuards(AuthGuard("jwt"))

  async deleteConversation(@Body() request: {conversationId : string}, @Req() req: Request) {
    const user = req.user

      const deleteConversation = await this.conversationService.deleteConversation(request.conversationId, user.id);
      return deleteConversation;
     
  }


}
