/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards, Req, Res } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { UserService } from 'src/user/user.service';
import { Request } from 'src/user/interfaces/request.interface';
import { whichWithAuthenticated } from 'src/user/utils/auth-utils';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticatedGuard } from 'src/auth/guards/GlobalGuard';


@Controller('chat')
@UseGuards(AuthenticatedGuard)
export class ConversationsController {
constructor(private  conversationService : ConversationsService , private userService : UserService, private jwtservice : JwtService, private prisma : PrismaService )
{}



@Post('conversation')
 async CreateConversations(@Body() request: {display_name : string}, @Req() req, @Res() res){
    console.log("in here");
    try {
        const user = await whichWithAuthenticated(req, this.jwtservice, this.prisma);
        const returnValue = await this.conversationService.createConversations(user,  request.display_name);
        return res.status(200).json({ success: true, response: returnValue });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: err.message || 'An unexpected error occurred' });
    }

}

@Get('findconversation')
async  findConversation(@Req() req: Request){
    const user =  await whichWithAuthenticated(req, this.jwtservice, this.prisma);
    const find = await this.conversationService.find(user);
    return find;
}

// @Get('findConversationUser')
// async findConversationUser(@Req() req: Request){
//     const user =  await whichWithAuthenticated(req, this.jwtservice, this.prisma);
//     const find 

// }
@Get(':id')
async getconversationById(@Param('id') id: string){
    // return this.conversationService.find();
    const conversation = await this.conversationService.findConversationById(id);
    console.log(conversation)
    return conversation;
}

}
