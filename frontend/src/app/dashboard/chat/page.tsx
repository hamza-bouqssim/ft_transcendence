"use client";

import CoversationSideBar from "@/app/components/CoversationSideBar/ConversationSideBar";
import { useContext, useEffect, useState , PropsWithChildren} from "react";
import MessagePanel from "@/app/components/messages/MessagePanel";
import {socketContext } from "@/app/utils/context/socketContext";





const ConversationChannelPagechat = () => { 
    const { channel } = useContext(socketContext);

    // const [message , setMessage] = useState<messageTypes[]>([])
    // const socket = useContext(socketContext).socket
    // const [change, setChange] = useState<{
    //   sideBar: boolean;
    //   chatBox: boolean;
    //   menu: boolean;
    // }>({
    //   sideBar: false,
    //   chatBox: false,
    //   menu: false,
    // });
    // const [conversation , setConversation] = useState<ConversationTypes[]>([]);
    // const dispatch = useDispatch<AppDispatch>();
    // const [ user, setUser] = useState<User | undefined>();
    // const [loading, setLoading] = useState<boolean>(false);

    
    // useEffect(() => {
    //         setLoading(true);
    //         getAuthUser().then(({data}) => {
    //             setUser(data);
    //             setLoading(false)})
    //         .catch((err)=> {console.log(err); setLoading(false);});
    // },[])
    // useEffect(() => {
    // 	dispatch(fetchConversationThunk())
    // 	.unwrap()
    // 	.then(({data}) => {
    // 		setConversation(data);
    // 	}).catch((err)=>{
    // 		console.log(err);
    // 	}
    // 	);
    // })

    // useEffect(() => {
    //   getConversation().then(({data}) =>{
    //     setConversation(data)
    //   }).catch((err)=> console.log(err))
    // }, [])


    // useEffect (() => {
    //   const conversationId = id;
    //   dispatch(fetchMessagesThunk(conversationId))
    //   .unwrap()
    //   .then(({data}) => {
    //     setMessage(data);
    //   }).catch((err)=>{
    //     console.log(err);
    //   }
    //   );
    // },[])

    //   // for sockets
    // useEffect(()=>{
    //   console.log("socket" ,socket)
    //     socket.on('connected', () => console.log("socket here connected"));
    //     socket.on('onMessage', (payload : messageEventPayload) => {
    //       console.log("message received");
    //       console.log(payload);
    //       setMessage((prev) => [payload, ...prev]);
    //     });
    //     return () =>{
    //       socket.off('connected');
    //       socket.off('onMessage');
    //     }
    // },[socket])
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
