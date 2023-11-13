/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
@WebSocketGateway({
	cors: {
		origin: ['http://localhost:3000'],
	},
})
export class MessagingGateWay implements OnGatewayConnection {
	handleConnection(client: Socket, ...args: any[]) {
		// console.log('new Incoming connection');
		// client.emit('connected', { status: 'good' });
		// console.log(client);
	}
	@WebSocketServer()
	server: Server;
	@SubscribeMessage('createMessage')
	handleCreateMessage(@MessageBody() data: any) {
		// console.log('create message');
	}
	@OnEvent('message.create')
	handleMessageCreateEvent(payload: any) {
		// console.log('create message');
		// console.log(payload);
		// we are going to emit this onMessage event
		this.server.emit('onMessage', payload);
	}
}
/****Whenever we created a message an event was emitted */
