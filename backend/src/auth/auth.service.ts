/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import { LocalAuthDto } from './dto/local.auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/user/dto/auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService, private userservice : UserService){}

    async signIn(dto: LocalAuthDto, req: Request, res: Response) {

      if(!dto.email || !dto.password_hashed)
      {
        throw new UnauthorizedException('You Missed Entering some required fields !');
      }
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!user) {
        throw new UnauthorizedException('Incorrect user!');
      }
      
      const checkPass = await bcrypt.compare(dto.password_hashed, user.password);
      if (!checkPass) {
        throw new UnauthorizedException('Incorrect Password!');
      }
      const infoDto: AuthDto = {
        email: dto.email,
        display_name: dto.display_name,
        username: dto.username,
        avatar_url: dto.avatar_url

      }
    const token = this.signUser(user.id, infoDto, 'user');
    if (!token) {
      throw new ForbiddenException();
    }
    res.cookie('token', token);
 
  
    return res.send({ msg: 'local succes' });
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
            rank: "",
          },
        });
       
       return createNewUser;
    }
    
    signUser(userId: string, dto: AuthDto, type:string)
    {
      return this.jwtService.sign({
          id: userId, 
          display_name: dto.display_name,
          email: dto.email,
          username: dto.username,
          avatar_url: dto.avatar_url,
          claim: type,
        
      });
    }

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
          rank: "",
        },
      });
    
      return createNewUser;
    }

    async findUser(id: string)
    {
      const user = await this.prisma.user.findFirst({where: {id: id}});
      return user;
    }

    async validateUser2(dto : LoginDto)
    {
        /* we need to check inside our database if a user with the provider user that is inside
        our dto is inside our user table or not 

        so first we need to go to the user service and create a function for retrieving the user based on the email from our user table,
        so lets go to the user service and create a function called fundByEmail
        */ 
       const user = await this.userservice.findByEmail(dto.email)
       if(!user)
        throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
       /* iam going to use the dto.password and pass the hashed version of the user password 
       which we can get from the user object */
       // so the compare function first hash the dto.password and then compare the hashed version of the dto.password with user.password which is already hashed inside the database
       if(user && (await bcrypt.compare(dto.password, user.password)))
       {
            const { password , ...result} = user;
            console.log(password)
            return result;
       }
       /*if this condition here is not correct which means that the email and the password are not correct 
       so we should throw an exeption */
       return null;


    }

    
}
