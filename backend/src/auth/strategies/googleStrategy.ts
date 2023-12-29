import {
	ForbiddenException,
	Injectable,
	Res,
	UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { AuthDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { VerifiedCallback } from 'passport-jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
	) {
		super({
			clientID:
				'733824333433-o5h97tg504iukbekbfg6bgntrcqlomfd.apps.googleusercontent.com', //this SHIT is hard coded, go put you SHIT in ENV file !!!!!!!!!!!!!!!!!!!!!!
			clientSecret: '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', //this SHIT is hard coded, go put your SHIT in ENV file !!!!!!!!!!!!!!!!!!!!!!
			callbackURL: 'http://10.13.10.3:8000/auth/google/redirect',
			scope: ['profile', 'email'],
		});
	}
	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		const authDto: AuthDto = {
			email: profile.emails[0]?.value,
			username: profile.displayName,
			display_name: await this.authService.generateNickname(
				profile.emails[0]?.value,
			),
			avatar_url:
				profile._json.picture ||
				'api_backend/src/uploads/default-profile-photo.jpg',
		};
		const user = await this.authService.validateUser(authDto);
		if (!user) {
			throw new UnauthorizedException('Google Authentication Failed');
		}
		return user;
	}
}
