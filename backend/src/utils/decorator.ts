/* eslint-disable prettier/prettier */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Authenticated_Request } from './types';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = <Authenticated_Request>ctx.switchToHttp().getRequest();
    return request.user;
  },
);
// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';
// import { UnauthorizedException } from '@nestjs/common/exceptions';



// export const AuthUser = createParamDecorator(
//   (data: unknown, context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();
//     const token = request.headers.authorization?.split(' ')[1]; // Extract JWT token from header

//     if (token) {
//       try {
//         const decoded = jwt.verify(token, 'aEyQ1mvAsQv4LRG/Dc/vP/AI3VFzxKEPTwrTBl4RI6Jws3xTQIJTn5Zq50vvTrO6GauggJIoSd2CJtuI5rxz+w==');
//         console.log(decoded);
//         return decoded; // Return the authenticated user
//       } catch (error) {
//         console.error('JWT verification error:', error);
//         throw new UnauthorizedException('Unauthorized'); // Throw an exception for unauthorized access
//       }
//     }

//     return null; // Return null if no user is authenticated
//   },
// );
