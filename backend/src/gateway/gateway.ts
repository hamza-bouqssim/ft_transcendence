import { SubscribeMessage, MessageBody,WebSocketGateway,WebSocketServer,OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { PrismaModule } from 'prisma/prisma.module';
import { Server ,Socket} from 'socket.io';
import { AuthenticatedSocket } from "src/utils/interfaces";
import { IGateWaySession } from './gateway.session';
import { Services } from 'src/utils/constants';
import { Message } from '@prisma/client';
import {Inject} from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service';
import { OnEvent } from "@nestjs/event-emitter";
import { CreateMessageRoom, RoomId } from 'src/Rooms/dto/rooms.dto';
import { RoomsService } from 'src/Rooms/rooms.service';
import { ConversationsService } from 'src/conversations/conversations.service';

@WebSocketGateway({
    cors:{
        origin:['http://localhost:3000'],
        credentials : true,
    },
    namespace: '/chat',
} )
export class WebSocketChatGateway implements OnGatewayConnection ,OnGatewayDisconnect {
    constructor(@Inject(Services.GATEWAY_SESSION_MANAGER)private readonly sessions : IGateWaySession,
    private readonly prisma :PrismaService,
    private readonly roomsService:RoomsService,private  conversationService : ConversationsService ){}
    @WebSocketServer() 
    server: Server;
    
    private NsessionOfuser: Map<string, number> = new Map();

    async handleConnection(socket : AuthenticatedSocket, ...args: any[]) {
        console.log("new Incoming connection");
        console.log(socket.user.sub);
        const userId = socket.user.sub;
        if(socket.user)
        {
            if (!this.NsessionOfuser.has(userId)) {
                this.NsessionOfuser.set(userId, 1);
                const newStatus = await this.prisma.user.update({
                    where: { id: userId},
                    data: { status: "online"},
    
                });
              } else {
                const sessionNumber = this.NsessionOfuser.get(userId) + 1;
                this.NsessionOfuser.set(userId, sessionNumber);
              }
          
        }       
    }
    @SubscribeMessage("message.create")
    async handleMessageCreateEvent(socket : AuthenticatedSocket,payload : any){
        // const { senderId, recipientId } = payload;
        console.log("payload",socket)
        const messages = await this.conversationService.createMessags(socket.user, payload);
        console.log(messages)
        this.server.to(payload.participentsId.toString()).emit ('onMessage', messages);

    
    }
    @SubscribeMessage('joinToRoom')
    handleJoinRome(client: Socket, roomId: RoomId){
        console.log("join room-->", roomId.id);
         client.join(roomId.id.toString());
    }

    @SubscribeMessage('leaveToRoom')
    handleLeaveRome (client: Socket, roomId: RoomId) {
        console.log("leaveToRoom-->", roomId.id)
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

    async handleDisconnect(socket: AuthenticatedSocket) {
        const userId = socket.user.sub;
        if (this.NsessionOfuser.has(userId)) {
          const sessionNumber = this.NsessionOfuser.get(userId) - 1;
    
          if (sessionNumber > 0) {
            this.NsessionOfuser.set(userId, sessionNumber);
          } else {
            this.NsessionOfuser.delete(userId);
            const newStatus = await this.prisma.user.update({
                where: { id: socket.user.sub},
                data: { status: "offline"},

            });
          }
        }
    }

	@SubscribeMessage('getOnlineUsers')
	handleGetOnlineUsers(socket: AuthenticatedSocket) {
		// console.log("get online users*****************");
		// console.log(this.server.sockets.adapter.rooms);
		const onlineUsers: User[] = [];
		for (const [roomId, roomSet] of this.server.sockets.adapter.rooms) {
			const roomSockets = Array.from(roomSet);
			// console.log("here******");

			for (const socketId of roomSockets) {
				const user = this.sessions.getUserBySocketId(socketId);
				// console.log("this user is -->", user);

				if (user) {
					onlineUsers.push(user);
				}
			}
		}
		socket.emit('getOnlineUsers', onlineUsers);

		return onlineUsers;
	}

	@SubscribeMessage('onClientConnect')
	onClientConnect(
		@MessageBody() data: any,
		@ConnectedSocket() Client: AuthenticatedSocket,
	) {
		// console.log("onClient connect*****************");
		// console.log(data);
		// console.log(Client.user);
	}

	@OnEvent('message.create')
	handleMessageCreateEvent(payload: Message) {
		// console.log("create message*************");
		// console.log(payload);
		// we are going to emit this onMessage event
		// this.server.emit('onMessage', payload);
		const { senderId, recipientId } = payload;
		const senderSocket = this.sessions.getUserSocket(senderId);
		const recipientSocket = this.sessions.getUserSocket(recipientId);
		// console.log("senderSocket", senderSocket);
		// console.log("recipientSocket", recipientSocket)
		// console.log("senderId", payload.senderId);
		if (senderSocket && recipientSocket) {
			senderSocket.emit('onMessage', payload);
			recipientSocket.emit('onMessage', payload);
		} // }else{
		//     console.log("The recipient is not authenticated:");
		// }
	}
}
