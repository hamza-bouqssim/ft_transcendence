/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";



@Injectable()
export class SessionSerializer extends PassportSerializer
{
    constructor(private userservice :UserService){
        super();
    }


    serializeUser(user: User, done: Function) {
        done(null, user)
        
    }
    async  deserializeUser(user: User, done : Function) {
        const userDb = await this.userservice.findById(user.id);
        return userDb ? done(null, userDb) : done(null,null);
        
    }
}