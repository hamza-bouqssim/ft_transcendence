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
            console.log("inside websocket adapter");

            const { cookie: clientCookie } = socket.handshake.headers;
            // console.log(socket.handshake.headers.cookie);

            if (!clientCookie) {
                console.log("The user has no cookies");
                return next(new Error('Not authenticated'));
            }

            // const specificCookieName = 'token';

            const { token } = cookie.parse(clientCookie);
            console.log("Parsed Cookies:", token);

            if (!token) {
                console.log("token does not exist");
                return next(new Error('Not authenticated'));
            }
            const COOKIE_SECRET : string = "my-secret"
      
                // console.log("Attempting to verify signed cookie...");
                const signedCookies = cookieParser.signedCookie(token, COOKIE_SECRET);
                console.log("Signed Cookies:", signedCookies);

        try {
            // Verify the JWT and decode the payload
            const decodedToken = jwt.verify(token, COOKIE_SECRET) as Record<string, any>;
            console.log("Decoded Token:", decodedToken);

            // You can access user information directly from the decoded token
            const userDb = plainToInstance(User, decodedToken);
            socket.user = userDb;
            // console.log("socket here");
            // console.log(socket);
            // console.log("user here");
            // console.log(socket.user);
            next();
        } catch (error) {
            console.error("Error verifying JWT:", error);
            return next(new Error('Not authenticated'));
        }
    });
        return server;
    }
}
