/* eslint-disable prettier/prettier */
import { Body, Controller,  Post, Req, Res, UseGuards, Get } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('friend-request')
@UseGuards(AuthGuard('jwt'))

export class FriendRequestController {
    constructor(private readonly friendshipService: FriendRequestService,
                private readonly jwtService: JwtService,
                private readonly prisma: PrismaService,){}


      @Post('send-request')
      
      async sendRequest(@Body() request: { display_name: string }, @Req() req, @Res() res) {
          try {
              const user = req.user;
              const returnvalue = await this.friendshipService.sendRequest(user.display_name, request.display_name);
              return res.status(200).json({ success: true, response: returnvalue });
          } catch (error) {
              return res.send({success: false, message: error.message});

          }
      }
                
      
      @Post('send-request-play')
      async sendRequestPlay(@Body() request: { display_name : string}, @Req() req, @Res() res){
        try{
          const user = req.user;
          const returnValue = await this.friendshipService.sendRequestPlay(user.display_name, request.display_name, );
          return res.status(200).json({success: true, response: returnValue});

        }catch(err){
          return res.send({success: false, message: err.message});

        }

      }

      
    @Post('accept-request')
    async acceptRequest(@Body() request: {requestId: string}, @Req() req, @Res() res)
    {
      try{
        const user = req.user;
        const returnValue = await this.friendshipService.acceptFriendRequest(request.requestId, user); 
        return res.status(200).json({success: true, response: returnValue});

      }catch(error : any){
        return res.send({success: false, message: error.message});


      }
       
    }
    @Post('accept_request_play')
    async acceptRequestToPlay(@Body() request: {requestId: string}, @Req() req, @Res() res){
      try{
        const user = req.user;
        const returnValue = await this.friendshipService.acceptRequestToPlay(request.requestId, user);
        return res.status(200).json({success: true, response: returnValue});

      }catch(error : any){
        return res.send({success: false, message: error.message});

      }
      
    }


    @Post('refuse-request')
    async refuseRequest(@Body() request: {requestId : string}, @Req() req, @Res() res)
    {
      try{
        const user = req.user;
        const returnValue = this.friendshipService.refuseFriendRequest(request.requestId, user);
        return res.status(200).json({success: true, response: returnValue});

      }catch(error : any){
        return res.send({success: false, message: error.message});



      }
         
    }

    @Post('refuse-request-play')
    async refuseRequestPlay(@Body() request: {requestId : string}, @Req() req, @Res() res){
      try{
        const user = req.user;
        const returnValue = this.friendshipService.refusePLayRequest(request.requestId, user); 
        return res.status(200).json({success: true, response: returnValue});

      }catch(error : any){
        return res.send({success: false, message: error.message});
      }
      

    }
    @Post('remove-friendship')
    async remove_friendship(@Body() request: {display_name : string}, @Req() req, @Res() res){
      try{
        const user = req.user;
        return this.friendshipService.remove_friends(user.display_name, request.display_name);

      }catch(error : any){
        return res.send({success: false, message: error.message});

      }
    }
    

    @Post('block-friend')
    async blockFriend(@Body() request: {friendIdToBlock: string}, @Req() req, @Res() res)
    {
      try{
        const user = req.user;
        const returnvalue =  await this.friendshipService.block(user.id, request.friendIdToBlock);
        return res.status(200).json({ success: true, response: returnvalue });

      }catch (err) {
        return res.send({success: false, message: err.message});
      }


    }


    @Post('unblock-friend')
    async unblockFriend(@Body() request: {friendIdToUnblock: string}, @Req() req, @Res() res)
    {
      try{
        const user = req.user;
        const returnUNbloque = await this.friendshipService.unblock( user.id, request.friendIdToUnblock);
        return res.status(200).json({ success: true, response: returnUNbloque });

      }catch(err)
      {
        return res.send({success: false, message: err.message});

      }

    }
        
    
    @Get('notification_count')
    async count_notification(@Req() req){
      const user = req.user;
      return this.friendshipService.count_notification(user.id);

    }

    @Post("delete-notification")
    async deleteNotification(@Body() request: {idNotif : string}, @Res() res){
      try{
        const result = await this.friendshipService.DeleteNotification(request.idNotif);
        return res.status(200).json({ success: true, response: result });
      }catch(error : any){
        return res.send({success: false, message: error.message});

      }

    }
    @Get("blocked")
    async blocked(@Req() req){
      const user = req.user;
      const result = await this.friendshipService.whichBlocked(user.id);
      return result;
      

    }
    

  

    
}