import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { Authenticated_Request } from "./types"



export const    AuthUser = createParamDecorator(( data : unknown, ctx : ExecutionContext) => 
{
    const request = <Authenticated_Request>ctx.switchToHttp().getRequest();
    return request.user;
}

);