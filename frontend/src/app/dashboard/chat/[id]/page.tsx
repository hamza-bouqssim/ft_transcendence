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
import { socket, socketContext } from "@/app/utils/context/socketContext";
import { Socket } from "socket.io-client";
import { AppDispatch, RootState, store } from "@/app/store";
import {Provider as ReduxProvider, useDispatch, useSelector} from 'react-redux'
import { fetchMessagesThunk } from "@/app/store/messageSlice";
import { fetchConversationThunk } from "@/app/store/conversationSlice";


type Props = {
	user?: User;
	setUser : React.Dispatch<React.SetStateAction<User | undefined>>;
	socket : Socket;
}

function AppWithProviders({children, user, setUser,} : PropsWithChildren & Props){
	return (
		<ReduxProvider store={store}>
			<socketContext.Provider value={socket}>
				{children}
			</socketContext.Provider>
		</ReduxProvider>
	)

}

const ConversationChannelPage = () => {
  const socket = useContext(socketContext)

    const [ user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
            setLoading(true);
            getAuthUser().then(({data}) => {
                setUser(data);
                setLoading(false)})
            .catch((err)=> {console.log(err); setLoading(false);});
    },[])
	const [conversation , setConversation] = useState<ConversationTypes[]>([]);
  const dispatch = useDispatch<AppDispatch>();
 


    const {id} = useParams();
    const [message , setMessage] = useState<messageTypes[]>([])

   
      const conversations = useSelector(
        (state: RootState) => state.conversation.conversations
      );
    
      useEffect(() => {
        console.log('Fetching Conversations in ConversationPage');
        dispatch(fetchConversationThunk());
      }, []);
    
      useEffect (() => {
        const conversationId = id;
        dispatch(fetchMessagesThunk(conversationId))
        .unwrap()
        .then(({data}) => {
          setMessage(data);
        }).catch((err)=>{
          console.log(err);
        }
        );
      },)

      // for sockets

      //whenever we enter to channel page we subscribe to connected and onMessage
      useEffect(()=>{
        socket.emit('onClientConnect', {conversationId : id});
        socket.on('connected', ()=> {
          console.log("connected");
        })
          // socket.on('connected', () => console.log("socket here connected"));
          //iam listenning to socket-io on onMessage and whenever an message receive we bussically update the state with setMessage
          socket.on('onMessage', (payload : messageEventPayload) => {
            console.log("message received"); 
            const {conversation} = payload;
            console.log(payload);
            setMessage((prev) => [payload, ...prev]);
          });
          return () =>{
            socket.off('connected');
            socket.off('onMessage');
          }
      }, [id])
      const sendTypingStatus = () =>{
        console.log("You are typing a message");
        socket.emit('onUserTyping', {conversationId : id})
      }
	    const [onlineUsers, setOnlineUsers] = useState<UsersTypes[]>([]);


	    // useEffect(() => {
      //   socket.emit('getOnlineUsers');
      //   socket.on('getOnlineUsers', (onlineUsers) => {
      //       console.log("online friend-->", onlineUsers);
      //       setOnlineUsers(onlineUsers);
      //   });
      //   console.log("socket here", socket.id);
      //   return () => {
      //       socket.off('getOnlineUsers');
      //   };
      // }, [socket]);
      useEffect(() => {
        socket.on('updateOnlineUsers', (onlineUsers) => {
          setOnlineUsers(onlineUsers);
        });
      
        return () => {
          socket.off('updateOnlineUsers');
        };
      }, [socket]);
    return ( 

            <div className=" flex h-screen  xl:container xl:mx-auto">
              <div className ="hidden xl:block h-full w-[35%] p-10 pl-5 pr-2 ">
                <CoversationSideBar onlineUsers={onlineUsers}/>
              </div>
                <div className="bg-white xl:m-10  xl:mr-10 xl:ml-2 w-full xl:w-[65%]  xl:rounded-[20px]">
                    <MessagePanel messages={message} ></MessagePanel> 
                </div>
            </div>


            
      
        
     );
}
 
export default ConversationChannelPage;