/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-42";
import { AuthDto } from "../dto/auth.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly authService: AuthService,
	) {
		super({
			clientID: configService.get<string>('INTRA_CLIENT_ID'),
			clientSecret: configService.get<string>('INTRA_CLIENT_SECRET'),
			callbackURL: configService.get<string>('INTRA_CALL_BACK_URL'),
		});
		console.log( configService.get<string>('INTRA_CLIENT_ID'))
	}
	async validate(accessToken: string, refreshToken: string, profile: any) {
		const dto: AuthDto = {
			email: profile.emails[0]?.value,
			username: profile._json.usual_full_name,
			display_name: await this.authService.generateNickname(
				profile.emails[0]?.value,
			),
			avatar_url:
				profile._json.image?.link ||
				'api_backend/src/uploads/default-profile-photo.jpg',
		};
		const user = await this.authService.validateUser(dto);
		if (!user) {
			throw new UnauthorizedException('Google Authentication Failed');
		}
		return user;
	}
}
