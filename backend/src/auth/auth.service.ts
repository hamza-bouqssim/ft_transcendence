/* eslint-disable prettier/prettier */
import { BadRequestException, Inject,ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { LocalAuthDto } from './dto/local.auth.dto';
import { JwtService } from '@nestjs/jwt';
import { SignAuthDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

    async signIn(dto: SignAuthDto) {

      if(!dto.email || !dto.password)
      {
        throw new UnauthorizedException('You Missed Entering some required fields !');
      }
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!user) {
        throw new UnauthorizedException('Incorrect user!');
      }
      
      
      const checkPass = await bcrypt.compare(dto.password, user.password);
      if (!checkPass) {
        throw new UnauthorizedException('Incorrect Password!');
      }
 
      const payload = {sub: user.id, email: user.email};
      const token = this.jwtService.sign(payload)
    if (!token) {
      throw new ForbiddenException();
    }
    return token;
 
  }        
   
    async signUp(dto: LocalAuthDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
              OR: [
                { email: dto.email },
                { username: dto.username },
              ],
            },
          });
        
          if (existingUser) {
            throw new ConflictException('Email or username is already taken.');
          }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(dto.password_hashed, salt);

        if (!dto.username || !dto.email || !dto.password_hashed || !dto.display_name) {
          throw new BadRequestException('You missed entering a required fields !!!');
        }
        const createNewUser = await this.prisma.user.create({
          data: {
            username: dto.username, 
            email: dto.email,
            password: hashedPass,
            display_name: dto.display_name, 
            avatar_url: "https://cdn.landesa.org/wp-content/uploads/default-user-image.png",
            two_factor_auth: "",
            two_factor_secret_key: "",
          },
        });
       
       return createNewUser;
    }
    
    // signUser(userId: string)
    // {
    //   return this.jwtService.sign({
    //       id: userId, 
    //       claim: "my-secret",
        
    //   });
    // }

    async signOut( req: Request, res: Response ){

      res.clearCookie('token');
      
      return res.send({msg: 'Logged out Succesfully !'});
    }

    async validateUser(dto: AuthDto) {
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (user) return user;
    
      const createNewUser = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: '',
          display_name: dto.display_name,
          avatar_url: dto.avatar_url,
          two_factor_auth: "",
          two_factor_secret_key: "",
        },
      });
    
      return createNewUser;
    }

    async findUser(id: string)
    {
      const user = await this.prisma.user.findUnique({where: {id: id}});
      return user;
    }

    async generateNickname(email: string) :Promise<string>{
      const username = email.split('@')[0];
      const cleanedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
      const nickname = cleanedUsername.length > 0 ? cleanedUsername : 'defaultNickname';
      return nickname;
    }



  


    
}
