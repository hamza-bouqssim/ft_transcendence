import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TwoFactorAuthenticationService {
    constructor(private readonly prisma:PrismaService){}

    async generateOtp(email: string)
    {
        const secret = authenticator.generateSecret();
        console.log("generated secret:  " + secret);
        // const appName = this.configService.getOrThrow('TFA_APP_NAME');
        const uri = authenticator.keyuri('APP', email, secret);
        console.log("uri:       " + uri);
        return{uri, secret};
    }

    async verifyCode(code:string, secret: string)
    {
        return authenticator.verify({token: code, secret});
    }
    
    async enableTwoFactor(_email: string, secret: string)
    {
        
        const id = this.prisma.user.findUnique({where: {email: _email}});
        await this.prisma.user.update({where: {email: _email}, data: {two_factor_secret_key: secret, tfa_enabled: true}});
    }
}
