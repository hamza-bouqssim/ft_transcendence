/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param,  Post, Put, Req,  UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/GlobalGuard';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { whichWithAuthenticated } from './utils/auth-utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Controller('user')
export class UserController {

    constructor(private readonly userService:UserService, 
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        ){}

    @Get('info')
    @UseGuards(AuthenticatedGuard)
    async grabMyInfos(@Req()req) {
      
      const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);

      return {
        id: user.id,
        username: user.username,
        email : user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
      };
    }

    @Get('finduser/:username')
    @UseGuards(AuthenticatedGuard)
    findUser(@Param('username')username:string)
    {
        return this.userService.findUser(username);
    }

    @Post('changedisplayname')
    @UseGuards(AuthenticatedGuard)
    async displayedName(@Body() request:{newDisplayName: string}, @Req() req ){

      try {

        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        // console.log(user.email)
        const updated = this.userService.changeDisplayedName(user.email, request.newDisplayName);
        return updated;
      }catch(error){
        throw new Error('Failed to update the displayed name');
      }
    }

    @Put('changeusername')
    @UseGuards(AuthenticatedGuard)
    async changeUserName(@Body() request: {newUserName : string}, @Req() req){

      try {

        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);

        const updated = this.userService.changeUserName(user.email, req.newUserName);
        return updated;
      }catch(error){
        throw new Error('Failed to update the username');
      }
    }


    @Post('changeAvatar')
    @UseGuards(AuthenticatedGuard)
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/uploads',
        filename: (req, file, callback) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          callback(null, `${filename}${extension}`);
        },
      }),
      fileFilter: (req, file, _callback) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          _callback(null, true);//accept that type
        }
        else {
          _callback(new UnauthorizedException('Only JPEG and PNG files are allowed'), false); // refuse somthing else like .pdf ...etc
        }
      },
      limits: {
        fileSize: 1024 * 1024, // still don't know why this don't work !!!!!!!!! figure it out !
      },
    }))
    async changeAvatar(@Req() req, @UploadedFile() file: Express.Multer.File)
    {
      try {
        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        const imagePath = file.path;
        // console.log("here is the image path :   " + imagePath);
        const updatedAvatar = this.userService._changeAvatar(user.email, imagePath);
        return updatedAvatar;
      } catch (error) {
        throw new Error('Failed to update the Avatar');
      }
    }

    @Get('my-friends')
    @UseGuards(AuthenticatedGuard)
    async listFriends(@Req() req)
    {
      const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
      return await this.userService.listFriends(user.id);
    }

    @Get('pending-requests')
    @UseGuards(AuthenticatedGuard)
    async pendingRequests(@Req() req)
    {
      const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
      return await this.userService.pendingRequests(user.id);
    }

    @Get('blocked-friends')
    @UseGuards(AuthenticatedGuard)
    async blockedFriends(@Req() req)
    {     
      const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
      return await this.userService.blockedFriends(user.id);
    }
    @Get('All-users')
    @UseGuards(AuthenticatedGuard)
    async allUsers(@Req() req)
    {
      const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
      return await this.userService.allUsers(user.id);
    }
    
}

