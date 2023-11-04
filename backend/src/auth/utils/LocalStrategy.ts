/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportStrategy} from '@nestjs/passport'
// eslint-disable-next-line prettier/prettier
import {Strategy} from 'passport-local'
// eslint-disable-next-line prettier/prettier
import { AuthService } from "../auth.service";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
    constructor(private readonly authService : AuthService){
        super({usernameField : 'email'})
    }

    async validate(email : string, password : string)
   {
        console.log(password, email);
        const result = this.authService.validateUser2({email, password})
        return result;
   }

}