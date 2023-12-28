/* eslint-disable prettier/prettier */
import { SubscribeMessage,WebSocketGateway,WebSocketServer,OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Server ,Socket} from 'socket.io';
import { AuthenticatedSocket } from "src/utils/interfaces";
import { IGateWaySession } from './gateway.session';
import { Services } from 'src/utils/constants';
import {Inject} from '@nestjs/common'
import {EventEmitter2, OnEvent} from  '@nestjs/event-emitter';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMessageRoom, RoomId} from 'src/Rooms/dto/rooms.dto';
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
        const userId = socket.user.sub;
        const userdb = await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        console.log(userdb)
        if (!socket.user || !userdb)
        {
            return;
        }
        if(socket.user && userdb)
        {  
            if (!this.NsessionOfuser.has(userId)) {
                
                this.NsessionOfuser.set(userId, 1);
                if (userId) {
                    await this.prisma.user.update({
                        where: { id: userId},
                        data: { status: "online"},
                        
                    });
                }
            } else {
                const sessionNumber = this.NsessionOfuser.get(userId) + 1;
                this.NsessionOfuser.set(userId, sessionNumber);
            }          
            this.eventEmitter.emit('online.created', { userId });
        }  
        socket.join(socket.user.sub.toString());     
    }



    // ##################################################################################################################
    //  room

    @SubscribeMessage('joinToRoom')
    handleJoinRome(client: Socket, roomId: RoomId){
         client.join(roomId.id.toString());
    }
    
    @SubscribeMessage('leaveToRoom')
    handleLeaveRome (client: Socket, roomId: RoomId) {
        client.leave (roomId.id);
    }

 
    @SubscribeMessage('messageRome')
    async handleMessage(client: AuthenticatedSocket, createMessageRoom: CreateMessageRoom){
        const messageRome = await this.roomsService.createMessage(createMessageRoom,client.user.sub);
        this.roomsService.notificationRoomUpdate(messageRome.senderId,messageRome.chatRoomId)
        this.server.to(createMessageRoom.chatRoomId.toString()).emit ('messageRome', messageRome);
    }
    @SubscribeMessage('Typing')
    handleTyping(client: Socket, {id,userId}){
        this.server.to(id.toString()).emit ('Typing', {status: true,userId:userId});
    }


    
    @SubscribeMessage('leaveTyping')
    handleLeaveTyoing (client: Socket, { id,userId}) {
        this.server.to(id.toString()).emit ('Typing',{status: false,userId:userId});
    }
    
    
    @OnEvent("order.created")
    async onNotificationCreate(data:any) {
        const userAdmin = data.members.find((userAdmin) => userAdmin.Status=== "Owner")
        data.members.map((member) => {
            if(member.Status !== "Owner")
            {
                this.roomsService.notificationRoom(data.id,member.user_id,1)
                const message = `${userAdmin.user.display_name } Join you to ${data.name}`;
                this.server.to(member.user_id).emit('notification', message);
                // const type = "Join";
                // const requestId = data.members.id;
                // this.userService.createNotification( userAdmin.user,member.user_id, message, type, requestId);
            }
            else
            {
                this.roomsService.notificationRoom(data.id,member.user_id,0)
            }             
        })
    }
    @OnEvent("order.update")
    async onNotificationupdate(data:any,id:string) {
        const member = await this.prisma.chatRoom.findUnique({
            where: { id: data.id },
            include:{
                members:{
                    include:{
                      user:true
                    }
                  }
                }
            })
            member.members.map((member) => {
                if(member.user_id !== id)
                    this.server.to(member.user_id).emit('update', "");         
            })
        }
    @OnEvent("order.updateMember")
    async onNotificationupdatemember(RoomId:string,id:string,types:string) {
        const member = await this.prisma.chatRoom.findUnique({
            where: { id: RoomId },
            include:{
                members:{
                    include:{
                        user:true
                    }
                }
            }
        })
        member?.members.map((member) => {
            this.server.to(member.user_id).emit('updateMember', {roomId:RoomId,idUserleave:id,types:types});         
        })
    }









    //chat room 




        @OnEvent("request.created")
        sendFriendRequestNotification(data : any) {
            const message = `${data.friendData.user.display_name} send you request to be friends`;
            this.server.to(data.friendData.friend_id).emit('newFriendRequest', data);
            const type = "requestFriend";
            const requestId = data.friendData.id;

            this.userService.createNotification( data.friendData.user,data.friendData.friends, message, type, requestId);

            
        }
        
        
        @OnEvent('requestAccept.created')
        AcceptFriendRequestNotification(data : any){
            const message = `${data.req.friends.display_name} accept your request`;
            this.server.emit('AcceptNotification', data);
            const type = "AcceptRequest";
            const requestId = data.req.id;
            this.userService.createNotification( data.req.friends,data.req.user, message, type, requestId);
            
            
        }
        @OnEvent('deleteNotification.created')
        deleteNOtification(data : any){
            this.server.emit('deleteNOtification', data);
            
            
        }
        @OnEvent("chat.invite")
        sendRequestToPLay(data : any){
          
            const message = `${data.requestToPlay.Sender.display_name} send you request to play`;
            const type = "requestPLay";
            const requestId = data.requestToPlay.id;
            this.server.to(data.requestToPlay.recipient.id).emit(`newRequestToPlay`,data);
            this.userService.createNotification(data.requestToPlay.Sender, data.requestToPlay.recipient, message, type, requestId);

        }

        @OnEvent('requestRefusePlay.created')
        REfuseRequestPLay(data : any){
            this.server.emit('RefusePLayNotification', data);


        }


        @OnEvent('requestRefuse.created')
        RefuserFriendRequestNotification(RefuseruserId : string){
            this.server.emit('RefuseNotification', `${RefuseruserId} refuse your request`);

        }
        @OnEvent('requestBlock.created')
        blockListNotification(data : any){
            console.log("data block  here-->", data);
            this.server.emit('blockNotification', data.chatParticipents);
        }
        @OnEvent('requestDebloque.created')
        debloqueNotification(data: any){
            console.log("debloque here-->", data);
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
        deleteConversation(payload: {chatParticipent : any , userId : string}){
            this.server.to(payload.userId).emit('deleteConversation', payload.chatParticipent);

        }

        @OnEvent('deleteFriendship.created')
        friendshipDelete(data : any){
            this.server.emit('deleteFriendship', data.frienbdship);

        }

        @OnEvent('Ingame.created')
	    handleIngameEvent(payload: { userId: string }) {
	        this.server.emit('Ingame', `This user ${payload} is InGame`);
    	}

        @OnEvent('Ingameoffline.created')
        handleIngameOffline(payload : {userId : string}){
            this.server.emit('IngameOffline', `This user ${payload} is InGame`);

        }
    
        

        @OnEvent('chat.newRequestToPlay')
        async handleInvitegame(data: any) {
            this.server.to(data.requestToPlay.recipientId).emit("newRequestToPlay",data);  
     
        }

        @OnEvent('chat.AcceptPLayNotification')
	    async handleAcceptPLayNotification(data: any) {
              await this.prisma.requestPlay.delete({
                    where : {
                        id : data.req_play.id

                    }
                })
		this.server.to(data.req_play.senderId).emit("AcceptPLayNotification",{accept:true});
        this.server.to(data.req_play.recipientId).emit("AcceptPLayNotification",{accept:true});
              
        }
        

   




    
    @SubscribeMessage("message.create")
    async handleMessageCreateEvent(socket : AuthenticatedSocket,payload : any){
        const messages = await this.conversationService.createMessags(socket.user, payload);
        this.server.to(messages.participents.recipient.id).to(messages.participents.sender.id).to(messages.participentsId.toString()).emit('onMessage', messages, socket.user);
        // this.userService.notificationMessage( messages.participentsId, messages.participents.recipientId);
        
    }
    

    
 
    
   
       
    async handleDisconnect(socket: AuthenticatedSocket) {
        const userId = socket.user.sub;
        if (this.NsessionOfuser.has(userId)) {
            const sessionNumber = this.NsessionOfuser.get(userId) - 1;

            if (sessionNumber > 0) {
                this.NsessionOfuser.set(userId, sessionNumber);
            } else {
                
                this.NsessionOfuser.delete(userId);
                if (userId) {
                    await this.prisma.user.update({
                        where: { id: userId},
                        data: { status: "offline"},
                        
                    });
                }
                this.eventEmitter.emit('offline.created', { userId });
            }
        }
        socket.leave(socket.user.sub); 
    }
      
}
    
