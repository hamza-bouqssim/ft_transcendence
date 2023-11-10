/* eslint-disable prettier/prettier */
import { IoAdapter } from "@nestjs/platform-socket.io";
import { AuthenticatedSocket } from "src/utils/interfaces";



export class WebSocketAdapter extends IoAdapter{
    createIOServer(port : number, options: any)
    {
        const server = super.createIOServer(port , options);
        server.use(async (socket: AuthenticatedSocket, next) =>{
            console.log("inside websocket adapter");
            console.log(socket.handshake.headers.cookie);
            const cookie = socket.handshake.headers;
            if(!cookie)
            {
                console.log("The user is logout");
                return next(new Error ('Not authenticated'));
            }
            next();
        });
        return server ;

    }

}