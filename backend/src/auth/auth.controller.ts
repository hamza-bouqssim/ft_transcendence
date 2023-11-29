/* eslint-disable prettier/prettier */
import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthDto } from './dto/local.auth.dto';
import { AuthenticatedGuard } from './guards/GlobalGuard';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
// import { LocalAuthGuards } from './utils/Guards';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private jwtService: JwtService,
	) {}

	@Post('signin')
	signIn(@Body() dto: LocalAuthDto, @Req() req: Request, @Res() res: Response) {
		return this.authService.signIn(dto, req, res);
	}

	@Post('signup')
	signUp(@Body() dto: LocalAuthDto) {
		return this.authService.signUp(dto);
	}

	@Get('test')
	@UseGuards(AuthenticatedGuard)
	testEndpoint() {
		return { message: 'this shit is working!' };
	}

	@Get('signout')
	signOut(@Req() req: Request, @Res() res: Response) {
		return this.authService.signOut(req, res);
	}

	@Get('google/login')
	@UseGuards(AuthGuard('google'))
	async googleLogin(@Res() res: Response, @Req() req) {
		const user = req.user;
		const payload = { sub: user.id, username: user.username };
		const token = this.jwtService.sign(payload);
		res.cookie('token', token);
		return res.send({ msg: 'Google logged success' });
	}

	@Get('google/redirect')
	@UseGuards(AuthGuard('google'))
	googleRedirect(@Res() res: Response, @Req() req) {
		const user = req.user;
		const payload = { sub: user.id, email: user.email };
		const token = this.jwtService.sign(payload);
		res.cookie('token', token);
		return res.send({ msg: 'Google redirect success' });
	}

	@Get('42/login')
	@UseGuards(AuthGuard('42'))
	ftLogin(@Res() res: Response, @Req() req) {
		const user = req.user;
		const payload = { sub: user.id, email: user.email };
		const token = this.jwtService.sign(payload);
		res.cookie('token', token);
		return res.send({ msg: '42 redirect success' });
	}

	@Get('42/redirect')
	@UseGuards(AuthGuard('42'))
	ftRedirect(@Res() res: Response, @Req() req) {
		const user = req.user;
		const payload = { sub: user.id, email: user.email };
		const token = this.jwtService.sign(payload);
		res.cookie('token', token);
		return res.send({ msg: '42 redirect success' });
	}
}
