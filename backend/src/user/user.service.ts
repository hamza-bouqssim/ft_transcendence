/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { findUserParams } from 'src/utils/types';

@Injectable()
export class UserService {
    constructor(private readonly prisma:PrismaService){}


    async findUser( username: string)
    {
        const data = await this.prisma.user.findFirst({where: {
            username,
        }})


        if(!data)
        {
            throw new NotFoundException('User with this name : '+ username + ' not found !')
        }
       
            const {id, display_name, avatar_url} = data;
            return {id, username, display_name, avatar_url};
        
    }

    async changeDisplayedName(_email: string, newDisplayedName: string){
        const find = await this.prisma.user.findUnique({where: {email:_email}});

        // console.log("old: " + (find?.display_name || 'null') + "\n new:  " + newDisplayedName);
        
        if(!find)
            throw new UnauthorizedException("User Not Found!")
        if (find.display_name === newDisplayedName)
            throw new UnauthorizedException("This Display Name already in use, Choose another one !!!");

        const updatedDipslayName = await this.prisma.user.update({
            where: {email: _email},
            data: {display_name: newDisplayedName}
        })

        if(!updatedDipslayName)
            throw new UnauthorizedException("Error");
        
            return updatedDipslayName;
    }

    async changeUserName(_email: string, newUserName: string){
        const find = await this.prisma.user.findUnique({where: {email:_email}});

        console.log("old: " + (find?.username || 'null') + "\n new:  " + newUserName);
        
        if(!find)
            throw new UnauthorizedException("User Not Found!")
        if (find.username === newUserName)
            throw new UnauthorizedException("This UserName already in use, Choose another one !!!");

        const updatedUserName = await this.prisma.user.update({
            where: {email: _email},
            data: {username: newUserName}
        })

        if (!updatedUserName)
            throw new UnauthorizedException("Error");
        
            return updatedUserName;
    }

    async _changeAvatar(_email: string, avatarPath: any)
    {
        const find = await this.prisma.user.findUnique({where: {email:_email}});

        // console.log("old: " + (find?.avatar_url || 'null') + "\n new:  " + avatarPath);
        
        if(!find)
            throw new UnauthorizedException("User Not Found!")

        const updatedAvatar = await this.prisma.user.update({
            where: {email: _email},
            data: {avatar_url: avatarPath}
        })

        if (!updatedAvatar)
            throw new UnauthorizedException("Error");
        
            return updatedAvatar;
    }

    async listFriends()
    {
        return await this.prisma.friend.findMany({where: {status: 'ACCEPTED'}, select: {user: {select: {id: true, username: true, display_name: true, avatar_url:true}}}});
    }

    async pendingRequests()
    {
        return await this.prisma.friend.findMany({where: {status: 'PENDING'}, select: {user: {select: {id: true, username: true, display_name: true, avatar_url:true}}}});
    }

    async blockedFriends()
    {
        return await this.prisma.friend.findMany({where: {status: 'BLOCKED'}, select: {user: {select: {id: true, username: true, display_name: true, avatar_url:true}}}});
    }
    
    //------------SOUKAINA PART 
    async findByEmail(email : string)
    {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        })

    }

    async findById(id : string)
    {
        return await this.prisma.user.findUnique({
            where: {
               id: id,
            }
        })

    }

    async findByDisplayName(display_name : string)
    {
        return await this.prisma.user.findUnique({
            where: {
               display_name: display_name,
            }
        })
    }
    
    async findUserById(finduserParams : findUserParams)
    {
        return this.prisma.user.findUnique({
            where: {
               id: finduserParams.id,
               
            }
        }) 
    }
}
