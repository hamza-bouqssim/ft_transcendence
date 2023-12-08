import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
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
        const {uri, secret} = await this.tfaService.generateOtp(req.email);
        await this.tfaService.enableTwoFactor(req.user.email, secret);
        res.contentType('image/png'); 
        return toFileStream(res, uri);
    }
}
