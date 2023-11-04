/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CanActivate } from "@nestjs/common";

@Injectable()

export class LocalAuthGuards extends AuthGuard('local')
{
    async canActivate(context: ExecutionContext)
    {
        const result = ( await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    }
}



@Injectable()

export class AuthenticatedGuard implements CanActivate{
    async canActivate(context: ExecutionContext) : Promise<any> {
        const req = context.switchToHttp().getRequest();
        // console.log('Guards');
        // console.log(req.isAuthenticated())
        return req.isAuthenticated();
    }
}