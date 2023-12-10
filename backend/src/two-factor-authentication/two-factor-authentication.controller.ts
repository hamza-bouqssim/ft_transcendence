import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { toFileStream } from 'qrcode';

@Controller('two-factor-authentication')
export class TwoFactorAuthenticationController {
    constructor(private readonly tfaService:TwoFactorAuthenticationService){}
    
    @Post('2fa/generate')
    @UseGuards(AuthGuard('jwt'))
    async generateQrCode(@Req() req, @Res() res)
    {
        const {uri, secret} = await this.tfaService.generateOtp(req.user.email);
        console.log(req.user.email);
        res.contentType('image/png'); 
        return toFileStream(res, uri);
    }
    
    @Post('2fa/verify')
    @UseGuards(AuthGuard('jwt'))
    async verifyQr(@Body() request: {code: string}, @Req() req)
    {
        const isValid = await this.tfaService.verifyCode(request.code, req.user.two_factor_secret_key);
        if(!isValid)
            throw new UnauthorizedException("Invalid 2FA Code");
        await this.tfaService.enableTwoFactor(req.user.email);
        
    }

    @Post('2fa/disable')
    @UseGuards(AuthGuard('jwt'))
    async disable2Fa(@Req() req)
    {
        await this.tfaService.disable2fa(req.user.email);
    }

    // @Post('2fa/isEnable')
    // @UseGuards(AuthGuard('jwt'))
    // async isEnable(@Req() req)
    // {
    //     return this.isEnable();
    // }
}
