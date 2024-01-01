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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
		super({
			clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
			clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
			callbackURL: configService.get<string>('GOOGLE_CALL_BACK_URL'),
			scope: ['profile', 'email'],
		});
		console.log(configService.get<string>('GOOGLE_CLIENT_ID'))
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
