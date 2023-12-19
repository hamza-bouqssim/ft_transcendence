"use client";

import CoversationSideBar from "@/app/components/CoversationSideBar/ConversationSideBar";
import { useContext, useEffect, useState , PropsWithChildren} from "react";
import MessagePanel from "@/app/components/messages/MessagePanel";
import {socketContext } from "@/app/utils/context/socketContext";
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"
import { fetchGetRequestThunk } from "@/app/store/requestSlice";
import { fetchGetAllFriendsThunk } from "@/app/store/friendsSlice";
import { fetchBlocksThunk } from "@/app/store/blockSlice";
import { fetchUsersThunk } from "@/app/store/usersSlice";
import { fetchConversationThunk } from "@/app/store/conversationSlice";
import { fetchMessagesThunk } from "@/app/store/messageSlice";
import { ConversationTypes, messageTypes } from "@/app/utils/types";





const ConversationChannelPagechat = () => { 
  const { updateChannel, channel } = useContext(socketContext);

   
    const socket = useContext(socketContext).socket

	const dispatch= useDispatch<AppDispatch>();

  useEffect(() => {
    socket.on('AcceptNotification', (data : any) => {
      dispatch(fetchGetRequestThunk());
      dispatch(fetchGetAllFriendsThunk());

    });
		socket.on('newFriendRequest', (data : any) => {
			dispatch(fetchGetRequestThunk());
		  });
    socket.on('RefuseNotification', (data : any) => {
      dispatch(fetchGetRequestThunk());

    })
    socket.on('blockNotification', (data : any) =>{
      dispatch(fetchBlocksThunk());
      dispatch(fetchGetAllFriendsThunk());

      if (channel && channel.id) {
        dispatch(fetchMessagesThunk(channel.id));
      }
      
    })
    socket.on('debloqueNotification', (data : any)=>{
      dispatch(fetchBlocksThunk());
      dispatch(fetchGetAllFriendsThunk());
      
      if(channel != null)
      {
        dispatch(fetchMessagesThunk(channel.id));
      }

    })
    socket.on('online', (data : any)=>{
      dispatch(fetchUsersThunk())
      dispatch(fetchGetAllFriendsThunk());


    })
    socket.on('offline', (data : any)=>{
      dispatch(fetchUsersThunk())
      dispatch(fetchGetAllFriendsThunk());


    });
		socket.on('createConversation', (data : any)=>{
      dispatch(fetchConversationThunk());

    });
    socket.on('deleteConversation', (data : ConversationTypes)=>{
			updateChannel(data);
			dispatch(fetchConversationThunk());
      if (channel && channel.id) {
        dispatch(fetchMessagesThunk(channel.id));
      }
		  })
    socket.on('onMessage', (messages : messageTypes)=>{
			dispatch(fetchConversationThunk());
      if (channel && channel.id) {
        dispatch(fetchMessagesThunk(channel.id));
      }

		
		})
      return () => {
        socket.off('AcceptNotification');
        socket.off('newFriendRequest');
        socket.off('RefuseNotification');
        socket.off('blockNotification');
        socket.off('debloqueNotification');
        socket.off('online');
        socket.off('offline');
        socket.off('createConversation');
        socket.off('deleteConversation');
        socket.off('onMessage');

      };
		
	  }, [socket, dispatch, channel?.id, channel, updateChannel]);
    return ( 
        <div className=" flex h-screen  xl:container xl:mx-auto">  
          <div className={`h-full  xl:p-10 xl"pl-5 xl:pr-2 ${!channel ? 'block w-full xl:w-[35%]  ' : 'hidden xl:block  xl:w-[35%] '}`}>
            <CoversationSideBar />
          </div> 
          {channel ? 
            <div className="bg-white xl:m-10  xl:mr-10 xl:ml-2 w-full xl:w-[65%]  xl:rounded-[20px] xl:mt-32">
                <MessagePanel></MessagePanel> 
            </div>
:
          <div className="xl:my-10 xl:mr-10  w-full xl:ml-2 xl:w-[65%]   xl:mt-32 hidden xl:flex items-center justify-center">Invit friend to new chat rome</div>
          }
          </div>

    );
}
 
export default ConversationChannelPagechat;
