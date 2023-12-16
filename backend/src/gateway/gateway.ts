/* eslint-disable prettier/prettier */
import { SubscribeMessage, MessageBody,WebSocketGateway,WebSocketServer,OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { PrismaModule } from 'prisma/prisma.module';
import { Server ,Socket} from 'socket.io';
import { AuthenticatedSocket } from "src/utils/interfaces";
import { IGateWaySession } from './gateway.session';
import { Services } from 'src/utils/constants';
import {Inject} from '@nestjs/common'
import {OnEvent} from  '@nestjs/event-emitter';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMessageRoom, RoomId ,CreateChatRoom} from 'src/Rooms/dto/rooms.dto';
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
        }  
        console.log("join Notification-->", socket.user.sub);
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

    @OnEvent("order.created")
    onNotification(data:any) {
        console.log(data)
         const userAdmin = data.members.find((userAdmin) => userAdmin.isAdmin)
         console.log("-------------------------------------------------------------",userAdmin)
        data.members.map((member) => {
            if(!member.isAdmin)
                this.server.to(member.user_id).emit('notification', `${userAdmin.user.display_name } Join ${member.user.display_name} to ${data.name}`);
                      
        })
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


    // id: 'c7ba970b-986f-44a1-9052-6d3c67eb1926',
    // name: 'ksjdlkbf gcOUCVuvc',
    // Privacy: 'Public',
    // password: null,
    // picture: 'https://images.squarespace-cdn.com/content/v1/5f60d7057b9b7d7609ef628f/1603219780222-V253F1WLHBH8HNHXIFUX/group.png',
    // createdAt: 2023-12-07T16:23:29.570Z,
    // updatedAt: 2023-12-07T16:23:29.570Z,
    // members: [
    //   {
    //     id: '6d769743-6796-4564-b158-09ad876dc17c',
    //     user_id: '6a171716-6e2a-45c8-a9c6-66f3d3fd1908',
    //     chatRoomId: 'c7ba970b-986f-44a1-9052-6d3c67eb1926',
    //     isAdmin: false,
    //     user: [Object]
    //   },
    //   {
    //     id: '9354e02c-b556-4d24-bb1b-38f39ba634df',
    //     user_id: '33366b70-335f-4df4-9180-aafe95c6fbbf',
    //     chatRoomId: 'c7ba970b-986f-44a1-9052-6d3c67eb1926',
    //     isAdmin: true,
    //     user: [Object]
    //   }
    // ]
    //  }
    //  {
    // id: '33366b70-335f-4df4-9180-aafe95c6fbbf',
    // username: 'mohamed jalloul',
    // status: 'online',
    // email: 'medjalal1998@gmail.com',
    // password: '',
    // display_name: 'medjalal1998',
    // avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocIwCklBFlWssSoKHjf77t2vHRNQFP3X_kMXwGCRMwC8=s96-c',
    // two_factor_auth: '',
    // two_factor_secret_key: ''
    //  }
    
    
    @SubscribeMessage('leaveTyping')
    handleLeaveTyoing (client: Socket, roomId: RoomId) {
        this.server.to(roomId.id.toString()).emit ('Typing', false);
    }
    

        // async handleDisconnect(socket: AuthenticatedSocket) {
        //     const userId = socket.user.sub;
        //     if (this.NsessionOfuser.has(userId)) {
        //         const sessionNumber = this.NsessionOfuser.get(userId) - 1;
    
        //         if (sessionNumber > 0) {
        //             this.NsessionOfuser.set(userId, sessionNumber);
        //         } else {
        //             this.NsessionOfuser.delete(userId);
        //             const newStatus = await this.prisma.user.update({
        //                 where: { id: socket.user.sub},
        //                 data: { status: "offline"},
                        
        //             });
        //         }
        //     }
        //     console.log("leave Notification-->", socket.user.sub)
        //     socket.leave(socket.user.sub);
            
        // }
        async handleDisconnect(socket: AuthenticatedSocket) {
            const userId = socket.user.sub;
          
            if (this.NsessionOfuser.has(userId)) {
              const sessionNumber = this.NsessionOfuser.get(userId) - 1;
          
              if (sessionNumber > 0) {
                this.NsessionOfuser.set(userId, sessionNumber);
              } else {
                this.NsessionOfuser.delete(userId);
          
                // Check if the user exists before updating the status
                const existingUser = await this.prisma.user.findUnique({
                  where: { id: userId },
                });
          
                if (existingUser) {
                  const newStatus = await this.prisma.user.update({
                    where: { id: userId },
                    data: { status: "offline" },
                  });
                } else {
                  console.error('User not found for update:', userId);
                  // Handle the case where the user doesn't exist
                }
              }
            }
          
            console.log("leave Notification-->", userId);
            socket.leave(userId);
          }
          
        
        
        
        
    }
    