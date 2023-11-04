import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-42";
import { AuthDto } from "../dto/auth.dto";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) 
{
    constructor(private readonly authService: AuthService){
        super({
            clientID: 'u-s4t2ud-d3dbabb8ec01b95e35714505a4e9ecf45a5a9e1f322ec8bc0c7090ee79e0fbbb', //this SHIT is hard coded, go put you SHIT in ENV file !!!!!!!!!!!!!!!!!!!!!!
            clientSecret: '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', //this SHIT is hard coded, go put your SHIT in ENV file !!!!!!!!!!!!!!!!!!!!!!
            callbackURL: 'http://localhost:8000/auth/42/redirect',
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any){
        console.log(profile)
        const dto: AuthDto = {
            email: profile.emails[0]?.value,
            username: profile._json.login,
            display_name: profile._json.usual_full_name,
            avatar_url: profile._json.image.link || "api_backend/src/uploads/default-profile-photo.jpg",
        };
        const user = await this.authService.validateUser(dto);
        if(!user)
        {
            throw new UnauthorizedException("Google Authentication Failed");
        }
        return user;
    }
      
}
