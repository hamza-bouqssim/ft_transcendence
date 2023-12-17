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
import { UserService } from 'src/user/user.service';

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
    private readonly roomsService:RoomsService,private  conversationService : ConversationsService, private readonly userService : UserService ){}
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
                await this.prisma.user.update({
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
        console.log("participent id -->", messages.participentsId)
        this.server.to(messages.participents.recipient.id).to(messages.participents.sender.id).to(messages.participentsId.toString()).emit('onMessage', messages, socket.user);
        // this.userService.notificationMessage( messages.participents.senderId, messages.participents.recipientId);

    }
    
    @SubscribeMessage('joinToRoom')
    handleJoinRome(client: Socket, roomId: RoomId){
        console.log("joinToRoom" ,roomId.id )
         client.join(roomId.id.toString());
    }
    
    @SubscribeMessage('leaveToRoom')
    handleLeaveRome (client: Socket, roomId: RoomId) {
        console.log("leaveToRoom" ,roomId.id )
        client.leave (roomId.id);
    }

 
    @SubscribeMessage('messageRome')
    async handleMessage(client: AuthenticatedSocket, createMessageRoom: CreateMessageRoom){
        const messageRome = await this.roomsService.createMessage(createMessageRoom,client.user.sub);
        this.server.to(createMessageRoom.chatRoomId.toString()).emit ('messageRome', messageRome);
    }
    @SubscribeMessage('Typing')
    handleTyping(client: Socket, {id,userId}){
        console.log("Typing")
        this.server.to(id.toString()).emit ('Typing', {status: true,userId:userId});
    }


    
    @SubscribeMessage('leaveTyping')
    handleLeaveTyoing (client: Socket, { id,userId}) {
        console.log("leaveTyping")
        this.server.to(id.toString()).emit ('Typing',{status: false,userId:userId});
    }
    

        async handleDisconnect(socket: AuthenticatedSocket) {
            const userId = socket.user.sub;
            if (this.NsessionOfuser.has(userId)) {
                const sessionNumber = this.NsessionOfuser.get(userId) - 1;
    
                if (sessionNumber > 0) {
                    this.NsessionOfuser.set(userId, sessionNumber);
                } else {
                    
                    this.NsessionOfuser.delete(userId);
                    await this.prisma.user.update({
                        where: { id: socket.user.sub},
                        data: { status: "offline"},
                        
                    });
                    this.eventEmitter.emit('offline.created', { userId });
                }
            }
            socket.leave(socket.user.sub);
            
        }

        @OnEvent("order.created")
         async onNotificationCreate(data:any) {
             const userAdmin = data.members.find((userAdmin) => userAdmin.isAdmin)
            data.members.map((member) => {
                if(!member.isAdmin)
                {
                    const message = `${userAdmin.user.display_name } Join you to ${data.name}`;
                    this.server.to(member.user_id).emit('notification', message);
                    this.userService.createNotification( userAdmin.user,member.user, message);

                }             
            })
        }
        @OnEvent("order.update")
         async onNotificationupdate(data:any) {
            console.log(data)
            const update = await this.prisma.chatRoom.findUnique({
                where: { id: data.id },
                include:{
                  members:{
                    include:{
                      user:true
                    }
                  }
                }
            })
            update.members.map((member) => {
            if(!member.isAdmin)
            {
                this.server.to(member.user_id).emit('update', "");
            }             
            })
        }
        @OnEvent("order.delete")
         async onNotificationdelete(data:any) {
            data.members.map((member) => {
                this.server.to(member.user_id).emit('delete', "");         
            })
        }
        @OnEvent("request.created")
        sendFriendRequestNotification(data : any) {
            const message = `${data.friendData.user.display_name} send you request to be friends`;
            this.server.to(data.friendData.friends.id).emit('newFriendRequest', data);
            this.userService.createNotification( data.friendData.user,data.friendData.friends, message);

            
        }

        @OnEvent('requestAccept.created')
        AcceptFriendRequestNotification(data : any){
            const message = `${data.req.friends.display_name} accept your request`;
            this.server.emit('AcceptNotification', data);
            this.userService.createNotification( data.req.friends,data.req.user, message);


        }
        @OnEvent('requestRefuse.created')
        RefuserFriendRequestNotification(RefuseruserId : string){
            this.server.emit('RefuseNotification', `${RefuseruserId} refuse your request`);

        }
        @OnEvent('requestBlock.created')
        blockListNotification(data : any){
            this.server.emit('blockNotification', data.chatParticipents);
        }
        @OnEvent('requestDebloque.created')
        debloqueNotification(data: any){
            this.server.emit('debloqueNotification', data.chatParticipents);
        }
        @OnEvent('online.created')
        handleOnlineEvent(payload: { userId: string }) {
          this.server.emit('online', `This user ${payload} is online`);
        }
        @OnEvent('offline.created')
        handleOfflineEvent(payload: { userId: string }) {
            this.server.emit('offline', `This user ${payload} is offline`);
        }

        @OnEvent('createConversation.created')
        createConversation(data : any)
        {            
            this.server.emit('createConversation', data);
        }

        @OnEvent('deleteConversation.created')

        deleteConversation(data : any){
            this.server.emit('deleteConversation', data.conversation);

        }
    
        
        
        
        
    }
    
