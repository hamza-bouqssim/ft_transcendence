import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TwoFactorAuthenticationService {
    constructor(private readonly prisma:PrismaService){}

    async generateOtp(_email: string)
    {
        const secret = authenticator.generateSecret();
        await this.prisma.user.update({where: {email: _email}, data: {two_factor_secret_key:secret}});
        console.log("generated secret:  " + secret);
        // const appName = this.configService.getOrThrow('TFA_APP_NAME');
        const uri = authenticator.keyuri('APP', _email, secret);
        console.log("uri:       " + uri);
        return{uri, secret};
    }

    async verifyCode(code:string, secret: string)
    {
        return authenticator.verify({
            token: code,
             secret
            });
    }
    
    async enableTwoFactor(_email: string)
    {
        
        const id = this.prisma.user.findUnique({where: {email: _email}});
        await this.prisma.user.update({where: {email: _email}, data: {tfa_enabled: true}});
    }

    async disable2fa(email: string)
    {
        await this.prisma.user.update({where: {email: email}, data: {tfa_enabled:false}});
    }
}
