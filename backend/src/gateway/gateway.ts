/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from "socket.io"
import { OnEvent } from "@nestjs/event-emitter";
import { AuthenticatedSocket } from "src/utils/interfaces";
import { IGateWaySession } from "./gateway.session";
import { Services } from "src/utils/constants";
import { Inject } from "@nestjs/common";
import { Message, User } from "@prisma/client";
import { Client } from "socket.io/dist/client";
import {RoomsService} from "./../Rooms/rooms.service"
import {RoomId ,CreateMessageRoom} from "./../Rooms/dto/rooms.dto"
@WebSocketGateway({
    cors:{
        origin:['http://localhost:3000'],
        credentials : true,
    }
} 
)

export class MessagingGateWay implements OnGatewayConnection{
    constructor(@Inject(Services.GATEWAY_SESSION_MANAGER)private readonly sessions : IGateWaySession,private roomsService:RoomsService){}
    @WebSocketServer()
    server: Server;
    handleConnection(socket : AuthenticatedSocket, ...args: any[]) {
        this.sessions.setUserSocket(socket.user.id,socket);
        // socket.emit('connected', {status : 'good'});
        const onlineUsers = this.getOnlineUsers();
            this.server.emit('updateOnlineUsers', onlineUsers);
       
      
    
       
    }
    handleDisconnect(socket: AuthenticatedSocket) {
        // ... other code
        this.sessions.removeUserSocket(socket.user.id);
    
        // Update online status
        const onlineUsers = this.getOnlineUsers();
        this.server.emit('updateOnlineUsers', onlineUsers);
    }
    
    private getOnlineUsers(): User[] {
        // Implement your logic to get online users
        const onlineUsers: User[] = [];
        for (const [roomId, roomSet] of this.server.sockets.adapter.rooms) {
            const roomSockets = Array.from(roomSet);    
            for (const socketId of roomSockets) {
                const user = this.sessions.getUserBySocketId(socketId);
    
                if (user) {
                    onlineUsers.push(user);
                }
            }
        }
        return onlineUsers;
    }
    
    
    @SubscribeMessage('createMessage')
    handleCreateMessage(@MessageBody() data: any){
    }

   

//     @SubscribeMessage('getOnlineUsers')
//     handleGetOnlineUsers(socket: AuthenticatedSocket) {
//         console.log("get online users*****************");
//         console.log(this.server.sockets.adapter.rooms);
//         const onlineUsers: User[] = [];
//         for (const [roomId, roomSet] of this.server.sockets.adapter.rooms) {
//             const roomSockets = Array.from(roomSet);    
//             for (const socketId of roomSockets) {
//                 const user = this.sessions.getUserBySocketId(socketId);
    
//                 if (user) {
//                     onlineUsers.push(user);
//                 }
//             }
//         }

//         socket.emit('getOnlineUsers', onlineUsers);

//     return onlineUsers;
// }

    @SubscribeMessage('getOnlineUsers')
         handleGetOnlineUsers(socket: AuthenticatedSocket) {
            console.log("get online users*****************");
            const onlineUsers = this.getOnlineUsers();
            socket.emit('getOnlineUsers', onlineUsers);

            return onlineUsers;
        }   

   
    @SubscribeMessage('onClientConnect')
    onClientConnect(@MessageBody() data : any, @ConnectedSocket() Client : AuthenticatedSocket){

    }
   
    @OnEvent("message.create")
    handleMessageCreateEvent(payload : Message){

        const { senderId, recipientId } = payload;
        const senderSocket = this.sessions.getUserSocket(senderId);
        const recipientSocket = this.sessions.getUserSocket(recipientId);
        if (senderSocket && recipientSocket) {
            senderSocket.emit('onMessage', payload);
            recipientSocket.emit('onMessage', payload);
        }
    }

    @SubscribeMessage('joinToRoom')
    handleJoinRome(client: Socket, roomId: RoomId){
         client.join(roomId.id.toString());
    }

    @SubscribeMessage('leaveToRoom')
    handleLeaveRome (client: Socket, roomId: RoomId) {
        client.leave (roomId.id);
    }

    @SubscribeMessage('messageRome')
    async handleMessage(client: Socket, createMessageRoom: CreateMessageRoom){
        const messageRome = await this.roomsService.createMessage(createMessageRoom,"123123");
        this.server.to(createMessageRoom.chatRoomId.toString()).emit ('messageRome', messageRome);
    }
    @SubscribeMessage('Typing')
    handleTyping(client: Socket, roomId: RoomId){
        this.server.to(roomId.id.toString()).emit ('Typing', true);
    }

    @SubscribeMessage('leaveTyping')
    handleLeaveTyoing (client: Socket, roomId: RoomId) {
        this.server.to(roomId.id.toString()).emit ('Typing', false);
    }
}
/****Whenever we created a message an event was emitted */
