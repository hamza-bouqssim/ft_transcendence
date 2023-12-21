import React, { useContext, useEffect } from 'react'
import { fetchGetRequestThunk, fetchNumberPending } from '../store/requestSlice';
import { fetchGetAllFriendsThunk } from '../store/friendsSlice';
import { fetchCountNotification, fetchNotificationThunk } from '../store/notificationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { socketContext } from '../utils/context/socketContext';
import { useRouter } from 'next/navigation';
import { Link } from 'next/link';

const ProviderOnSocket = () => {
    const { updateChannel, channel } = useContext(socketContext);
    const route = useRouter()
    
    const socket = useContext(socketContext).socket

	const dispatch= useDispatch<AppDispatch>();

    useEffect(() => {
        socket.on('AcceptNotification', (data : any) => {
          dispatch(fetchGetRequestThunk());
          dispatch(fetchGetAllFriendsThunk());
          dispatch(fetchCountNotification());
          dispatch(fetchNumberPending());
          dispatch(fetchNotificationThunk());
          dispatch(fetchCountNotification());
    
    
        });
        socket.on("AcceptPLayNotification",(payload:any) =>{
            console.log("aaaaaaaaa",payload)
            if(payload.accept)
            {
                // <Link href={{
                //     pathname: "/dashboard/game/online-game/match-making",
                //     query: {
                //         mapIndex: 0
                //     }
                // }}>
                // </Link>
                route.push("/dashboard/game/online-game/match-making")

            }
            dispatch(fetchCountNotification());
            dispatch(fetchNotificationThunk());
        })
        socket.on('newFriendRequest', (data : any) => {
                dispatch(fetchGetRequestThunk());
          dispatch(fetchNumberPending());
          dispatch(fetchCountNotification());
          dispatch(fetchNotificationThunk());
    
    
              });
        socket.on('newRequestToPlay', (data : any)=>{
          dispatch(fetchCountNotification());
          dispatch(fetchNotificationThunk());
        })
        socket.on('AcceptPLayNotification', (data : any)=>{
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
    
        })
        socket.on('deleteNOtification', (data : any)=>{
          dispatch(fetchNotificationThunk());
          dispatch(fetchCountNotification());
        })
       
          return () => {
            socket.off('AcceptNotification');
            socket.off('newFriendRequest');
            socket.off('RefuseNotification');     
            socket.off('newRequestToPlay');
            socket.off('AcceptPLayNotification');
            socket.off('RefusePLayNotification');
            socket.off('deleteNOtification');
    
    
          };
            
          }, [socket, dispatch]);
        
  return (
    <div>
      
    </div>
  )
}

export default  ProviderOnSocket
