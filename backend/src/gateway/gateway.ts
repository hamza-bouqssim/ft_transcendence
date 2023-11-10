/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from "socket.io"
import { OnEvent } from "@nestjs/event-emitter";
@WebSocketGateway({
    cors:{
        origin:['http://localhost:3000'],
        credentials : true,
    }
} 
)
/******any user that will be connected it will send to it that event son this wrong 
 * we need to send it only to a correct user that i choose to send it the message how i can do that ? 
 * 
 * we need to bassicaly map the user session to there socket (the id of our socket is client.id in tha how we know 
 * who actually emit the event to ) 
 * 
 * firstly we need to go aheadand figure out who the user is and we need bassicaly map the user to the correct 
 * socket id so this how we can know who we can emit the event to */



/****We can use an adapter to apply middleWare on the socket */
export class MessagingGateWay implements OnGatewayConnection{
    handleConnection(client: Socket, ...args: any[]) {
        console.log("new Incoming connection");
        client.emit('connected', {status : 'good'})
        console.log(client.id);
        console.log(client.rooms)
    }
    @WebSocketServer()
    server: Server;
    @SubscribeMessage('createMessage')
    handleCreateMessage(@MessageBody() data: any){
        console.log("create message")

    }
    @OnEvent("message.create")
    handleMessageCreateEvent(payload : any){
        console.log("create message");
        console.log(payload);
        // we are going to emit this onMessage event
        this.server.emit('onMessage', payload);
    }

}
/****Whenever we created a message an event was emitted */
