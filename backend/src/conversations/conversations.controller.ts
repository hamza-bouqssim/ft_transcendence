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
async findConversationUser(@Body() request: {display_name : string, message : string}, @Req() req: Request, @Res() res){
   try{
        const user = req.user
        const find = await this.conversationService.findConversationUsers(user, request.display_name, request.message);
        return res.status(200).json({ success: true, response: find });

    }catch(error : any){
        return res.status(401).json({ success: false, message: error.message || 'An unexpected error occurred' });
    }
   
}


@Get('/messages/:conversationId')
@UseGuards(AuthGuard("jwt"))

async getMessagesFromConversation(@Param('conversationId') conversationId : string, @Res() res){
    try{
        const getMessages = await this.conversationService.getMessageByConversationId(conversationId);
        return res.status(200).json({ success: true, response: getMessages});


    }catch(error : any){
        return res.status(401).json({ success: false, message: error.message || 'An unexpected error occurred' });


    }
    
}





@Post('/delete-conversation')
@UseGuards(AuthGuard("jwt"))
  async deleteConversation(@Body() request: {conversationId : string}, @Req() req: Request, @Res() res) {
    try{
        const user = req.user
        const deleteConversation = await this.conversationService.deleteConversation(request.conversationId, user.id);
        return res.status(200).json({ success: true, response: deleteConversation });


    }catch(error : any){
             return res.status(401).json({ success: false, message: error.message || 'An unexpected error occurred' });

    }
    
     
  }


}
