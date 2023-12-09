/* eslint-disable prettier/prettier */
import { SubscribeMessage,WebSocketGateway,WebSocketServer,OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Server ,Socket} from 'socket.io';
import { AuthenticatedSocket } from "src/utils/interfaces";
import { IGateWaySession } from './gateway.session';
import { Services } from 'src/utils/constants';
import {Inject} from '@nestjs/common'
import {EventEmitter2, OnEvent} from  '@nestjs/event-emitter';
import { PrismaService } from 'prisma/prisma.service';
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
    constructor(@Inject(Services.GATEWAY_SESSION_MANAGER)private readonly sessions : IGateWaySession,  private readonly eventEmitter: EventEmitter2,
    private readonly prisma :PrismaService,
    private readonly roomsService:RoomsService,private  conversationService : ConversationsService ){}
    @WebSocketServer() 
    server: Server;
    
    private NsessionOfuser: Map<string, number> = new Map();

    async handleConnection(socket : AuthenticatedSocket) {
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
            this.eventEmitter.emit('online.created', { userId });
        }  
        socket.join(socket.user.sub.toString());     
    }
    @SubscribeMessage("message.create")
    async handleMessageCreateEvent(socket : AuthenticatedSocket,payload : any){
        const messages = await this.conversationService.createMessags(socket.user, payload);
        this.server.to(payload.participentsId.toString()).emit ('onMessage', messages);
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
                    this.eventEmitter.emit('offline.created', { userId });
                }
            }
            // console.log("leave Notification-->", socket.user.sub)
            socket.leave(socket.user.sub);
            
        }

        @OnEvent("order.created")
        onNotification(data:any) {
            console.log(data)
             const userAdmin = data.members.find((userAdmin) => userAdmin.isAdmin)
            data.members.map((member) => {
                if(!member.isAdmin)
                    this.server.to(member.user_id).emit('notification', `${userAdmin.user.display_name } Join ${member.user.display_name} to ${data.name}`);
                          
            })
        }
        @OnEvent("request.created")
        sendFriendRequestNotification(userId: string, data: any) {
            console.log("user here-->", userId);
            this.server.emit('newFriendRequest', data);
        }

        @OnEvent('requestAccept.created')
        AcceptFriendRequestNotification(AccepteruserId : string){
            this.server.emit('AcceptNotification', `${AccepteruserId} Accept your request`);

        }
        @OnEvent('requestRefuse.created')
        RefuserFriendRequestNotification(RefuseruserId : string){
            this.server.emit('RefuseNotification', `${RefuseruserId} refuse your request`);

        }
        @OnEvent('requestBlock.created')
        blockListNotification(data : string){
            
            this.server.emit('blockNotification', data);
        }
        @OnEvent('requestDebloque.created')
        debloqueNotification(data: string){
            this.server.emit('debloqueNotification', data);
        }
        @OnEvent('online.created')
        handleOnlineEvent(payload: { userId: string }) {
          this.server.emit('online', `This user ${payload} is online`);
        }
        @OnEvent('offline.created')
        handleOfflineEvent(payload: { userId: string }) {
            this.server.emit('offline', `This user ${payload} is offline`);
        }

    
        
        
        
        
    }
    
