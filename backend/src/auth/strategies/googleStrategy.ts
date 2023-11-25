import { ForbiddenException, Injectable, Res, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { AuthDto } from "../dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { VerifiedCallback } from "passport-jwt";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService,
                private readonly jwtService: JwtService){
        super({
            clientID: '561394335528-056uem81bs6ql473v5q80cpun2cfb37t.apps.googleusercontent.com', //this SHIT is hard coded, go put you SHIT in ENV file !!!!!!!!!!!!!!!!!!!!!!
            clientSecret: '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', //this SHIT is hard coded, go put your SHIT in ENV file !!!!!!!!!!!!!!!!!!!!!!
            callbackURL: 'http://localhost:8000/auth/google/redirect',
            scope: ['profile', 'email'],
        });
    }
    async validate(accessToken:string ,refreshToken: string, profile: Profile){

        console.log("accessToken: " + accessToken);
        console.log(refreshToken);
        console.log(profile);
        const authDto: AuthDto = {
            email: profile.emails[0]?.value,
            username: profile.name?.givenName,
            display_name: profile.displayName,
            avatar_url: profile._json.picture || "api_backend/src/uploads/default-profile-photo.jpg",
        };
        const user = await this.authService.validateUser(authDto);
        if(!user)
        {
            throw new UnauthorizedException("Google Authentication Failed")
        }
        return user;
    }
}
