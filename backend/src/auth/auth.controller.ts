/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, Post, Req,    Res,  UnauthorizedException,  UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthDto } from './dto/local.auth.dto';
import { Request,  Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { SignAuthDto } from './dto/signIn.dto';
import { TwoFactorAuthenticationService } from 'src/two-factor-authentication/two-factor-authentication.service';


@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
        private jwtService: JwtService,
        private readonly twofactorAuth:TwoFactorAuthenticationService
        ){}

    @Post('signin')
    async signIn(@Body() dto: SignAuthDto, @Req() req: Request, @Res() res: Response)
    {
        const user = await this.authService.signIn(dto);
        const payload = {sub: user.id, email: user.email};
        
        if(user.tfa_enabled)
        {
            const token = this.jwtService.sign(payload);
            res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
            return res.redirect("http://localhost:3000/signIn/verify-two-factor");
        }

        const token = this.jwtService.sign(payload)
        res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });

        return res.status(200).json("signIn succefully")
        
    }

    @Post('signup')
    signUp(@Body() dto: LocalAuthDto){
        return this.authService.signUp(dto); 
    }

    @Get('google/login')
    @UseGuards(AuthGuard('google'))
    async googleLogin(@Res() res: Response, @Req() req)
    {}

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    googleRedirect(@Res() res: Response, @Req() req){

        const user = req.user;
        const payload = {sub: user.id, email: user.email};
        
        if(user.first_time)
        {
            const token = this.jwtService.sign(payload);
            res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
            return res.redirect("http://localhost:3000/dashboard/settings");
        }

        if(user.tfa_enabled)
        {
            const token = this.jwtService.sign(payload);
            res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
            return res.redirect("http://localhost:3000/signIn/verify-two-factor");
        }

        const token = this.jwtService.sign(payload)
        res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
        return res.redirect("http://localhost:3000/dashboard")
    }

    @Get('42/login')
    @UseGuards(AuthGuard('42'))
    ftLogin(@Res() res: Response, @Req() req){
    }


    @Get('42/redirect')
    @UseGuards(AuthGuard('42'))
    ftRedirect(@Res() res: Response, @Req() req)
    {
        const user = req.user;
        const payload = { sub: user.id, email: user.email };

        if(user.first_time)
        {
            const token = this.jwtService.sign(payload);
            res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
            return res.redirect("http://localhost:3000/dashboard/settings");
        }
        
        if(user.tfa_enabled)
        {
            const token = this.jwtService.sign(payload);
            res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
            return res.redirect("http://localhost:3000/signIn/verify-two-factor");
        }

        const token = this.jwtService.sign(payload);
        res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
        return res.redirect("http://localhost:3000/dashboard"); 
    }

    @Get('logout')
    logout(@Req() req, @Res() res) {
      res.clearCookie('token');
      return res.redirect('http://localhost:3000/signIn');
    }



    // @Post('isAuth')
    // @UseGuards(AuthGuard('jwt'))
    // async isAuthentication( @Req() request, @Res() res,@Body() body) {
    //   try {
    //     let user = await this.authService.findUser(request.user.auth_id) 
    //     return res.json({ isAuth: true , user :user});
    //   } catch (error) {
    //     return res.json({ isAuth: false });
    //   }
    // }

}