"use client"

import CoversationSideBar from "@/app/components/CoversationSideBar/ConversationSideBar";
import { ConversationChannelStyle, Page} from "@/app/utils/styles";
import { useContext, useEffect, useState , PropsWithChildren} from "react";
import { ConversationTypes, User, UsersTypes, messageEventPayload, messageTypes } from "@/app/utils/types";
import { getAuthUser, getConversation, getConversationMessage } from "@/app/utils/api";
import { useParams } from "next/navigation";
import MessagePanel from "@/app/components/messages/MessagePanel";
import TopRightBar from "@/app/components/TopRightBar";
import SideBar from "@/app/components/SideBar";
import { socketContext } from "@/app/utils/context/socketContext";
import { AppDispatch, RootState, store } from "@/app/store";
import {Provider as ReduxProvider, useDispatch, useSelector} from 'react-redux'
import { fetchMessagesThunk } from "@/app/store/messageSlice";
import { fetchConversationThunk } from "@/app/store/conversationSlice";
import { io } from "socket.io-client";



const ConversationChannelPage = () => {

    const [ user, setUser] = useState<User | undefined>();
    useEffect(() => {
            getAuthUser().then(({data}) => {
                setUser(data);
               })
            .catch((err)=> { console.log(err)});
    },[])

    return ( 

            <div className=" flex h-screen  xl:container xl:mx-auto">
              <div className ="hidden xl:block h-full w-[35%] p-10 pl-5 pr-2 ">
                <CoversationSideBar />
              </div>
                <div className="bg-white xl:m-10  xl:mr-10 xl:ml-2 w-full xl:w-[65%]  xl:rounded-[20px]">
                    <MessagePanel ></MessagePanel> 
                </div>
            </div>


            
      
        
     );
}
 
export default ConversationChannelPage;