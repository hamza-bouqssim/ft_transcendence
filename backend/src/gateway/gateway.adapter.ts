/* eslint-disable prettier/prettier */
import { IoAdapter } from "@nestjs/platform-socket.io";
import { AuthenticatedSocket } from "src/utils/interfaces";
import * as cookie from 'cookie';
import * as cookieParser from "cookie-parser";
import { plainToInstance } from "class-transformer";
import * as jwt from 'jsonwebtoken'; // Import JWT library
import { User } from "./dtos/User";

export class WebSocketAdapter extends IoAdapter {
  private authenticateSocket(socket: AuthenticatedSocket, next: (err?: any) => void) {
		const { cookie: clientCookie } = socket.handshake.headers;
		if (!clientCookie) {
			return next(new Error('Not authenticated'));
		}

		const { token } = cookie.parse(clientCookie);

		if (!token) {
			return next(new Error('Not authenticated'));
		}

		const COOKIE_SECRET: string = process.env.COOKIE_SECRET;
		cookieParser.signedCookie(token, process.env.COOKIE_SECRET);

		try {
			const decodedToken = jwt.verify(token, COOKIE_SECRET) as Record<
				string,
				any
			>;

			const userDb = plainToInstance(User, decodedToken);
			socket.user = userDb;
			next();
		} catch (error) {
			return next(new Error('Not authenticated'));
		}
	}

  createIOServer(port: number, options: any) {
    const server = super.createIOServer(port, options);
    const game = server.of('/game');
    const chat = server.of('/chat');

    game.use((socket, next) => {
      this.authenticateSocket(socket, next);
    });

    chat.use(async (socket: AuthenticatedSocket, next) => {

      this.authenticateSocket(socket, next);
    });

    return server;
  }
}
