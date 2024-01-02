/* eslint-disable prettier/prettier */
import {
	
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { LocalAuthDto } from './dto/local.auth.dto';
import { JwtService } from '@nestjs/jwt';
import { SignAuthDto } from './dto/signIn.dto';
import { TwoFactorAuthenticationService } from 'src/two-factor-authentication/two-factor-authentication.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly twofactorAuth: TwoFactorAuthenticationService,
	) {}

	async signIn(dto: SignAuthDto) {
		if (!dto.email || !dto.password) {
			throw new UnauthorizedException(
				'You Missed Entering some required fields!',
			);
		}
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});
		if (!user) {
			throw new UnauthorizedException('Incorrect user!');
		}

		const checkPass = await bcrypt.compare(dto.password, user.password);
		if (!checkPass) {
			throw new UnauthorizedException('Incorrect Password!');
		}

		return user;
	}

	async signUp(dto: LocalAuthDto) {
		const existingUser = await this.prisma.user.findFirst({
			where: {
				OR: [{ email: dto.email }, { display_name: dto.display_name }],
			},
		});

		if (existingUser) {
			throw new HttpException('Email or display_name is already taken.', HttpStatus.BAD_REQUEST);

		}
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(dto.password_hashed, salt);

		if (
			!dto.username ||
			!dto.email ||
			!dto.password_hashed ||
			!dto.display_name
		) {
			throw new HttpException('You missed entering a required fields !!!', HttpStatus.BAD_REQUEST);

		}
		const createNewUser = await this.prisma.user.create({
			data: {
				username: dto.username,
				email: dto.email,
				password: hashedPass,
				display_name: dto.display_name,
				avatar_url:
					'https://cdn.landesa.org/wp-content/uploads/default-user-image.png',
				two_factor_auth: '',
				two_factor_secret_key: '',
			},
		});

		return createNewUser;
	}

	

	async signOut(req: Request, res: Response) {
		res.clearCookie('token');

		return res.send({ msg: 'Logged out Succesfully !' });
	}

	

	async validateUser(dto: AuthDto) {
		try {
		  const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		  });
	  
		  if (user) {
			return user;
		  }
	  
		  const createNewUser = await this.prisma.user.create({
			data: {
			  username: dto.username,
			  email: dto.email,
			  password: '',
			  display_name: dto.display_name,
			  avatar_url: dto.avatar_url,
			  two_factor_auth: '',
			  two_factor_secret_key: '',
			},
		  });
	  
		  return createNewUser;
		} catch (error) {
			console.error('Error in validateUser:', error);
		
			if (error.code === 'P2021') {
			
			  throw new NotFoundException('User not found');
			} else {
			  throw new InternalServerErrorException('Internal server error');
			}
		  }
	  }

	
	async findUser(id: string) {
		const user = await this.prisma.user.findUnique({ where: { id: id } });
		if(!user)
			return null
		return user;
	}

	 async generateNickname(email: string) {
		const username = email.split('@')[0];
		const cleanedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
		
		const randomNumber = Math.floor(Math.random() * 10); 
		const usernameWithNumber = cleanedUsername + randomNumber;
	
		const nickname =usernameWithNumber.length > 0 ? usernameWithNumber : 'defaultNickname';
		
		return nickname;
	}
}
