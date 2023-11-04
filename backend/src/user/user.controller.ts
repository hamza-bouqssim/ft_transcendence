import { Controller, Get, Param, Patch, Post, Put, Req, Request, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    async grabMyInfos(@Req() req) {
      
      const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);

      return {
        username: user.username,
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

    @Put('changedisplayname/:display_name')
    @UseGuards(AuthenticatedGuard)
    async displayedName(@Req() req, @Param('display_name') newDisplayName: string){

      try {

        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);
        // console.log(user.email)
        const updated = this.userService.changeDisplayedName(user.email, newDisplayName);
        return updated;
      }catch(error){
        throw new Error('Failed to update the displayed name');
      }
    }

    @Put('changeusername/:username')
    @UseGuards(AuthenticatedGuard)
    async changeUserName(@Req() req, @Param('username') newUserName: string){

      try {

        const user = await whichWithAuthenticated(req, this.jwtService, this.prisma);

        const updated = this.userService.changeUserName(user.email, newUserName);
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
    async listFriends()
    {
      return await this.userService.listFriends();
    }

    @Get('pending-requests')
    @UseGuards(AuthenticatedGuard)
    async pendingRequests()
    {
      return await this.userService.pendingRequests();
    }

    @Get('blocked-friends')
    @UseGuards(AuthenticatedGuard)
    async blockedFriends()
    {
      return await this.userService.blockedFriends();
    }
    
}

