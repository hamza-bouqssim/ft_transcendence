import React, { useContext, useEffect } from 'react'
import { fetchGetRequestThunk, fetchNumberPending } from '../store/requestSlice';
import { fetchGetAllFriendsThunk } from '../store/friendsSlice';
import { fetchCountNotification, fetchNotificationThunk } from '../store/notificationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { socketContext } from '../utils/context/socketContext';
import { useRouter } from 'next/navigation';
import { fetchGetRequestsThunk } from '../store/requestsSlice';
import { fetchBlocksThunk } from '../store/blockSlice';
import { fetchMessagesThunk } from '../store/messageSlice';
import { useSetAtom } from 'jotai';
import { OpponentData } from './game/utils/data';


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
          dispatch(fetchCountNotification());
          dispatch(fetchGetRequestsThunk())

        });
        socket.on("AcceptPLayNotification", (payload: any) => {
          console.log("accept notifff---------------------------------------------------------------");
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
          dispatch(fetchGetRequestsThunk())

    
    
         });
         socket.on('blockNotification', (data : any) =>{
          dispatch(fetchBlocksThunk());
          dispatch(fetchGetAllFriendsThunk());
          dispatch(fetchGetRequestsThunk());
    
    
          if (channel && channel.id) {
            dispatch(fetchMessagesThunk(channel.id));
          }
          
        })
        socket.on('debloqueNotification', (data : any)=>{
          dispatch(fetchBlocksThunk());
          dispatch(fetchGetAllFriendsThunk());
          dispatch(fetchGetRequestsThunk())
          if(channel != null)
          {
            dispatch(fetchMessagesThunk(channel.id));
          }
    
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
          dispatch(fetchGetRequestsThunk())

    
        })
        socket.on('deleteNOtification', (data : any)=>{
          dispatch(fetchNotificationThunk());
          dispatch(fetchCountNotification());
        })
        socket.on('deleteFriendship', (data : any)=>{
          dispatch(fetchGetAllFriendsThunk());
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
    
    
          };
            
          }, [socket]);
        
  return (
    <div>
      
    </div>
  )
}

export default  ProviderOnSocket