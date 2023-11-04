import { Injectable } from "@nestjs/common";
import { PassportStrategy} from '@nestjs/passport'
import {Strategy} from 'passport-local'
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