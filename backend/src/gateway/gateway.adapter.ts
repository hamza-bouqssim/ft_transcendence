/* eslint-disable prettier/prettier */
import { IoAdapter } from "@nestjs/platform-socket.io";
import { AuthenticatedSocket } from "src/utils/interfaces";
import * as cookie from 'cookie'
import * as cookieParser from "cookie-parser";
import { plainToInstance } from "class-transformer";

import * as jwt from 'jsonwebtoken'; // Import JWT library
import { User } from "./User";


export class WebSocketAdapter extends IoAdapter {
    createIOServer(port: number, options: any) {
        const server = super.createIOServer(port, options);

        server.use(async (socket: AuthenticatedSocket, next) => {

            const { cookie: clientCookie } = socket.handshake.headers;

            if (!clientCookie) {
                return next(new Error('Not authenticated'));
            }

            // const specificCookieName = 'token';

            const { token } = cookie.parse(clientCookie);

            if (!token) {
                return next(new Error('Not authenticated'));
            }
            const COOKIE_SECRET : string = "my-secret"
      
                const signedCookies = cookieParser.signedCookie(token, COOKIE_SECRET);

        try {
            // Verify the JWT and decode the payload
            const decodedToken = jwt.verify(token, COOKIE_SECRET) as Record<string, any>;
         
            // You can access user information directly from the decoded token
            const userDb = plainToInstance(User, decodedToken);
            socket.user = userDb;
            next();
        } catch (error) {
            return next(new Error('Not authenticated'));
        }
    });
        return server;
    }
}
