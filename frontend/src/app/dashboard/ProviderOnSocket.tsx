import React, { useContext, useEffect } from 'react'
import { fetchGetRequestThunk, fetchNumberPending } from '../store/requestSlice';
import { fetchGetAllFriendsThunk } from '../store/friendsSlice';
import { fetchCountNotification, fetchNotificationThunk } from '../store/notificationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { socketContext } from '../utils/context/socketContext';
import { useRouter } from 'next/navigation';
import { fetchGetRequestsThunk } from '../store/requestsSlice';
import { fetchBlockedUsers, fetchBlocksThunk } from '../store/blockSlice';
import { fetchMessagesThunk } from '../store/messageSlice';
import { useSetAtom } from 'jotai';
import { OpponentData } from './game/utils/data';
import { fetchUsersThunk } from '../store/usersSlice';
import { fetchConversationThunk } from '../store/conversationSlice';
import { ConstructionOutlined } from '@mui/icons-material';
import { cleanNotification, getNotificationRoom } from '../store/NotificationChatSlice';
import { getAllRooms, updateRoomMessage } from '../store/roomsSlice';


const ProviderOnSocket = () => {
    const { updateChannel, channel } = useContext(socketContext);
    const route = useRouter()
    
    const socket = useContext(socketContext).socket

	const dispatch= useDispatch<AppDispatch>();

  const setMapIndex = useSetAtom(OpponentData);

    useEffect(() => {
      

        socket.on('AcceptNotification', (data : any) => {
          dispatch(fetchGetRequestThunk());
          dispatch(fetchGetAllFriendsThunk());
          dispatch(fetchCountNotification());
          dispatch(fetchNumberPending());
          dispatch(fetchNotificationThunk());
          dispatch(fetchGetRequestsThunk());
          dispatch(fetchBlocksThunk());
          dispatch(fetchBlockedUsers());
          dispatch(fetchUsersThunk());

        });
        socket.on("AcceptPLayNotification", (payload: any) => {
					if (payload.accept) {
            setMapIndex((prevData) => ({
              ...prevData,
              isRotate: true,
              mapIndex: 0,
            }));
						route.push("/dashboard/game/online-game/match-making?mapIndex=0");
					}
					dispatch(fetchCountNotification());
					dispatch(fetchNotificationThunk());
				});
        socket.on('newFriendRequest', (data : any) => {
          dispatch(fetchGetRequestThunk());
          dispatch(fetchNumberPending());
          dispatch(fetchCountNotification());
          dispatch(fetchNotificationThunk());
          dispatch(fetchGetRequestsThunk());
          dispatch(fetchBlocksThunk());
		      dispatch(fetchBlockedUsers());
		      dispatch(fetchUsersThunk());
		      dispatch(fetchGetAllFriendsThunk());

    
    
         });
         socket.on('blockNotification', (data : any) =>{
          console.log("chat here-->");
          dispatch(fetchBlocksThunk());
          dispatch(fetchBlockedUsers());
          dispatch(fetchNotificationThunk());
          dispatch(fetchCountNotification());
          dispatch(fetchGetAllFriendsThunk());
          dispatch(fetchGetRequestThunk());
          dispatch(fetchNumberPending());

          

    
    
          if(data?.id === channel?.id)
              dispatch(fetchMessagesThunk(data?.id));
          
        })
        socket.on('debloqueNotification', (data : any)=>{
        
          dispatch(fetchBlocksThunk());
          dispatch(fetchGetAllFriendsThunk());
          dispatch(fetchGetRequestThunk());
          dispatch(fetchNotificationThunk());
          dispatch(fetchCountNotification());
          dispatch(fetchBlockedUsers());
          dispatch(fetchUsersThunk());
          dispatch(fetchNumberPending());



          if(data?.id === channel?.id)
            dispatch(fetchMessagesThunk(data?.id));
    
        })
        socket.on('newRequestToPlay', (data : any)=>{
          dispatch(fetchCountNotification());
          dispatch(fetchNotificationThunk());
        })
        socket.on('RefusePLayNotification', (data : any)=>{
          dispatch(fetchCountNotification());
          dispatch(fetchNotificationThunk());
        })
        socket.on('RefuseNotification', (data : any) => {
          dispatch(fetchGetRequestThunk());
          dispatch(fetchNumberPending());
          dispatch(fetchNotificationThunk());
          dispatch(fetchCountNotification());
          dispatch(fetchGetRequestsThunk());
          dispatch(fetchBlocksThunk());
          dispatch(fetchBlockedUsers());
          dispatch(fetchUsersThunk());
          dispatch(fetchGetAllFriendsThunk());

    
        })
        socket.on('deleteNOtification', (data : any)=>{
          dispatch(fetchNotificationThunk());
          dispatch(fetchCountNotification());
        })
        socket.on('deleteFriendship', (data : any)=>{
          dispatch(fetchGetAllFriendsThunk());
        })
        socket.on('createConversation', (data : any)=>{
          dispatch(fetchConversationThunk());


          if( channel?.id === data?.conversation.id)
          {
              dispatch(fetchMessagesThunk(data?.conversation.id));
    
          }
          
    
    
        });

        socket.on('createConversationMessage', (data : any)=>{
          dispatch(fetchConversationThunk());
          if( channel?.id === data?.chat.id)
          {
              dispatch(fetchMessagesThunk(data?.chat.id));
    
          }
          

        })
        socket.on('setNotification',(payload:any) =>{
          if(payload.id !== channel?.id)
          {
            dispatch(getNotificationRoom());
            dispatch(updateRoomMessage(({ roomId: payload.id , updatedMessage: { content: payload.content, createdAt: new Date() } })))
          }
          
        })
       
          return () => {
            socket.off('AcceptNotification');
            socket.off('newFriendRequest');
            socket.off('RefuseNotification');     
            socket.off('newRequestToPlay');
            socket.off('blockNotification');
            socket.off('debloqueNotification');
            socket.off('AcceptPLayNotification');
            socket.off('RefusePLayNotification');
            socket.off('deleteNOtification');
            socket.off('deleteFriendship');
            socket.off('createConversationMessage');
            socket.off('createConversation');
            socket.off('setNotification');

    
    
          };
            
          }, [socket, dispatch, channel?.id, channel, updateChannel]);
        
  return (
    <div>
      
    </div>
  )
}

export default  ProviderOnSocket