/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from "socket.io"
import { OnEvent } from "@nestjs/event-emitter";
import { RoomId  ,getAllRooms,CreateMessageRoom,CreateChatRoom} from "src/Rooms/dto/rooms.dto";
import { RoomsService } from "src/Rooms/rooms.service";
@WebSocketGateway({
    cors:{
        origin:['http://localhost:3000']
    }
} 
)
export class MessagingGateWay implements OnGatewayConnection{
    handleConnection(client: Socket, ...args: any[]) {
        console.log("new Incoming connection");
        client.emit('connected', {status : 'good'})
        console.log(client);
    }
    @WebSocketServer()
    server: Server;
    constructor(private roomsService:RoomsService){}
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


    //chat Rooms;

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
        const messageRome = await this.roomsService.createMessage(createMessageRoom);
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
    @SubscribeMessage('getAllRooms')
    async handleCreatRome (client: Socket, data: getAllRooms ) {
        try{

            const AllRome = await this.roomsService.getAllRooms(data);
            this.server.emit ('getAllRooms', AllRome);
        }catch(error)
        {
            this.server.emit ('getAllRooms', error);

        }
    }


}
/****Whenever we created a message an event was emitted */
