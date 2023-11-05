"use client"

import CoversationSideBar from "@/app/components/CoversationSideBar/page";
import { ConversationChannelStyle, Page} from "@/app/utils/styles";
import { useContext, useEffect, useState } from "react";
import { ConversationTypes, User, messageEventPayload, messageTypes } from "@/app/utils/types";
import { getAuthUser, getConversation, getConversationMessage } from "@/app/utils/api";
import { useParams } from "next/navigation";
import MessagePanel from "@/app/components/messages/MessagePanel";
import TopRightBar from "@/app/components/TopRightBar";
import SideBar from "@/app/components/SideBar";
import { socket, socketContext } from "@/app/utils/context/socketContext";

const ConversationChannelPage = () => {
  const socket = useContext(socketContext)
  const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
	});
    const [ user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
            setLoading(true);
            getAuthUser().then(({data}) => {
                setUser(data);
                setLoading(false)})
            .catch((err)=> {console.log(err); setLoading(false);});
    },[])
	const [conversation , setConversation] = useState<ConversationTypes[]>([])
	useEffect(() => {
		getConversation().then(({data}) =>{
			setConversation(data)
		}).catch((err)=> console.log(err))
	}, [conversation])



    const {id} = useParams();
    const [message , setMessage] = useState<messageTypes[]>([])

    useEffect(() => {
        if (typeof id === 'string') {
          const conversationId = id;
          getConversationMessage(conversationId)
            .then(({ data }) => {
              setMessage(data);
            })
            .catch((err) => console.log(err));
        }
      }, [id]);

      // for sockets
      useEffect(()=>{
          socket.on('connected', () => console.log("socket here connected"));
          socket.on('onMessage', (payload : messageEventPayload) => {
            console.log("message received");
            //get the conversation
            // const {conversation, ...msg} = payload;
            console.log(payload);
            setMessage((prev) => [payload, ...prev]);
          });
          return () =>{
            socket.off('connected');
            socket.off('onMessage');
          }
      })
    return ( 
      // <socketContext.Provider value={socket}>
          
            <Page display="flex">
                <CoversationSideBar conversations={conversation}/>
                <ConversationChannelStyle>
                    <MessagePanel messages={message}></MessagePanel> 
                </ConversationChannelStyle>
            </Page>
      // </socketContext.Provider >

            
      
        
     );
}
 
export default ConversationChannelPage;