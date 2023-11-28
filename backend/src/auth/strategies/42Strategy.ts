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
            clientID: 'u-s4t2ud-262f8659d886410e3d6357f8530b81ad03e112f0c09b567eb0dd7db031482227', //this SHIT is hard coded, go put you SHIT in ENV file !!!!!!!!!!!!!!!!!!!!!!
            clientSecret: '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',
            callbackURL: 'http://localhost:8000/auth/42/redirect'
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any){
        const dto: AuthDto = {
            email: profile.emails[0]?.value,
            username: profile._json.usual_full_name,
            display_name: await this.authService.generateNickname(profile.emails[0]?.value),
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
