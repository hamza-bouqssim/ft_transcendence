"use client"
import { ToastContainer, toast } from 'react-toastify';
import CoversationSideBar from "../../components/CoversationSideBar/ConversationSideBar";
import { ConversationChannelStyle, Page} from "../../utils/styles";
import { useContext, useEffect, useState , PropsWithChildren} from "react";
import { ConversationTypes, User, messageEventPayload, messageTypes } from "../../utils/types";
import { getAuthUser, getConversation, getConversationMessage } from "../../utils/api";
import { useParams } from "next/navigation";
import MessagePanel from "../../components/messages/MessagePanel";
import TopRightBar from "../../components/TopRightBar";
import SideBar from "../../components/SideBar";
import { socket, socketContext } from "../../utils/context/socketContext";
import { Socket } from "socket.io-client";
import { AppDispatch, RootState, store } from "../../store";
import {Provider as ReduxProvider, useDispatch, useSelector} from 'react-redux'
import { fetchMessagesThunk } from "../../store/messageSlice";
import { fetchConversationThunk } from "../../store/conversationSlice";
import { getAllRooms } from "../../store/roomsSlice";
import { getAllMembers } from "../../store/memberSlice";
import AuthCheck from '@/app/utils/AuthCheck';


const ConversationChannelPage = () => {
  const {channel ,updateChannel} = useContext<any>(socketContext);
  const socket = useContext<any>(socketContext).socket
  const dispatch= useDispatch<AppDispatch>();
  const {Userdata} = useContext<any>(socketContext)

	useEffect(()=>{
    

		socket.on("notification",() =>{
			dispatch(getAllRooms())
		})
    socket.on("update",() =>{
			dispatch(getAllRooms())
      updateChannel(null)
		})
    socket.on("updateMember",(payload:any) =>{
			dispatch(getAllMembers(payload.roomId))
      // if(Userdata?.id === payload.idUserleave)
      // {  
      //   socket.emit("leaveToRoom", {id: payload.roomId});
        dispatch(getAllRooms());
      // }
		})
    return () => {
      socket.off("notification");
      socket.off("update");
      socket.off("updateMember");
    };
  

	},[socket,Userdata])
    return ( 
      <AuthCheck>
            <div className=" flex h-screen  xl:container xl:mx-auto">
              <div className={`h-full  xl:p-10 xl"pl-5 xl:pr-2 ${!channel ? 'block w-full xl:w-[35%]  ' : 'hidden xl:block  xl:w-[35%] '}`}>
                <CoversationSideBar />
              </div> 
              {channel ? 
                 <div className="bg-white xl:m-10  xl:mr-10 xl:ml-2 w-full xl:w-[65%]  xl:rounded-[20px] xl:mt-32">
                    <MessagePanel></MessagePanel> 
                </div>
:
<div className="xl:my-10 xl:mr-10  w-full xl:ml-2 xl:w-[65%]   xl:mt-32 hidden xl:flex items-center justify-center">Invite friend to new channel room</div>
              }
              </div>
              
              </AuthCheck>

     );
}
 
export default ConversationChannelPage;