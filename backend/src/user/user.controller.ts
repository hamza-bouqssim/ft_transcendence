/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param,  Post, Delete, Req,  Res,  UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from 'prisma/prisma.service';
// import { whichWithAuthenticated } from './utils/auth-utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';
@Controller('user')
export class UserController {

    constructor(private readonly userService:UserService,
      private readonly prisma:PrismaService){}

    @Get('info')
    @UseGuards(AuthGuard('jwt'))
    async grabMyInfos(@Req() req) {
      
     const user = req.user
      return {
        id:user.id,
        username: user.username,
        email : user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        tfa_enabled:user.tfa_enabled,
        first_time: user.first_time
      };
    }

    @Get('finduser/:username')
    @UseGuards(AuthGuard('jwt'))
    findUser(@Param('username')username:string)
    {
        return this.userService.findUser(username);
    }

    @Post('changedisplayname')
    @UseGuards(AuthGuard('jwt'))
    async displayedName(@Body() request:{newDisplayName: string}, @Req() req , @Res() res){
      try {
        const user = req.user;
        const updated = await this.userService.changeDisplayedName(user.email, request.newDisplayName);
        return res.status(200).json({ success: true, message: "Updated Successfully"});
      }catch(error){
        // throw new Error('Failed to update the displayed name');
        return res.send({ success: false, message: error.message || 'An unexpected error occurred' });

      }
    }

    @Post('changeusername')
    @UseGuards(AuthGuard('jwt'))
    async changeUserName(@Body() request: {newUserName : string}, @Req() req, @Res() res){
      try {
        const user = req.user
        const updated = await this.userService.changeUserName(user.email, request.newUserName);
        return res.status(200).json({ success: true, message: "Updated Successfully"});
      }catch(error){
        return res.status(401).json({ success: false, message: error.message});
      }
    }


    // @Post('changeAvatar')
    // @UseGuards(AuthGuard('jwt'))
    // @UseInterceptors(FileInterceptor('file', {
    //   storage: diskStorage({
    //     destination: 'src/uploads',
    //     filename: (req, file, callback) => {
    //       const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
    //       const extension: string = path.parse(file.originalname).ext;
    //       callback(null, `${filename}${extension}`);
    //     },
    //   }),
    //   fileFilter: (req, file, _callback) => {
    //     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    //       _callback(null, true);//accept that type
    //     }
    //     else {
    //       _callback(new UnauthorizedException('Only JPEG and PNG files are allowed'), false); // refuse somthing else like .pdf ...etc
    //     }
    //   },
    //   limits: {
    //     fileSize: 1024 * 1024, // still don't know why this don't work !!!!!!!!! figure it out !
    //   },
    // }))
    // async changeAvatar(@Req() req, @UploadedFile() file: Express.Multer.File)
    // {
    //   try {
    //    const user = req.user
    //     const imagePath = file.path;
    //     const updatedAvatar = this.userService._changeAvatar(user.email, imagePath);
    //     return updatedAvatar;
    //   } catch (error) {
    //     throw new Error('Failed to update the Avatar');
    //   }
    // }
    
    @Post('changePhoto')
    @UseGuards(AuthGuard('jwt'))
    async changePhoto(@Req() req, @Res() res, @Body() request: {avatar: string})
    {
      const user = req.user;
      await this.prisma.user.update({where:{email: user.email}, data: {avatar_url: request.avatar}});
      res.send({success:true, message:"avatar uploaded succesfully"});
    }
    @Post('first_time') 
    @UseGuards(AuthGuard('jwt'))
    async firstTime(@Req() req, @Res() res)
    {
      const user = req.user;
      await this.prisma.user.update({where: {email: user.email}, data:{first_time: false}});
      res.send({success: true, message:"first time setted to false"});
    }
    

    @Get('my-friends')
    @UseGuards(AuthGuard('jwt'))
    async listFriends(@Req() req)
    {
     const user = req.user
      return await this.userService.listFriends(user.id);
    }

    @Get('pending-requests')
    @UseGuards(AuthGuard('jwt'))
    async pendingRequests(@Req() req, @Res() res)
    {
      try{
        const user = req.user
        const request = await this.userService.pendingRequests(user.id);
          return res.status(200).json({success : true, data: request});
      }catch(error){
        return res.status(500).json({ message: error});

      }
    }

    @Get('pending-request-play')
    @UseGuards(AuthGuard('jwt'))
    async pending_request_play(@Req() req, @Res() res){
      try{
        const user = req.user
        const request = await this.userService.pendingPLayingRequest(user.id);
        return res.status(200).json({success : true, data: request});
      }catch(err){
        return res.status(500).json({message : err});

      }

    }

    @Get('blocked-friends')
    @UseGuards(AuthGuard('jwt'))
    async blockedFriends(@Req() req)
    {     
     const user = req.user
      return await this.userService.blockedFriends(user.id);
    }
    @Get('All-users')
    @UseGuards(AuthGuard('jwt'))
    async allUsers(@Req() req)
    {
     const user = req.user
      return await this.userService.allUsers(user.id);
    }
    @Post('search')
    async searchUsers(@Body() request: {displayName : string}) {
      const test = this.userService.findByDisplayNameSearching(request.displayName);
      return test;
  }
  @Get('table-friends')
  @UseGuards(AuthGuard('jwt'))
    async allFriend(@Req() req){
      const user = req.user;
      return await this.userService.allFriendsRequest(user.id);

    }
    @Post('table_friends_id')
    @UseGuards(AuthGuard('jwt'))

    async allFriendsId(@Body() request: {id_user : string}){
      return await this.userService.allFriendsId(request.id_user);

    }

    @Post('get_user')
    @UseGuards(AuthGuard('jwt'))
    async getUserId(@Body() request: {id_user : string}){
      const user =  await this.userService.userInfo(request.id_user);
      return user;

    }

    @Get('notification')
    @UseGuards(AuthGuard('jwt'))
    async getNotification(@Req() req){
      const user = req.user;
      const notifications = await this.userService.notificationCreate(user);
      return notifications;
    }

    @Delete('delete-account')
    @UseGuards(AuthGuard('jwt'))
    async delete_account(@Req() req, @Res() res)
    {
      const user = req.user;
      await this.userService.deleteAccount(user.id);
      res.clearCookie('token');
      return res.redirect('http://localhost:3000/signIn');
    }
     
    
}

