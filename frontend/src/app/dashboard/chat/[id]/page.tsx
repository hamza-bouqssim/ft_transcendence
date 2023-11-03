"use client"

import CoversationSideBar from "@/app/components/CoversationSideBar/page";
import { ConversationChannelStyle, Page} from "@/app/utils/styles";
import { useEffect, useState } from "react";
import { ConversationTypes, User, messageTypes } from "@/app/utils/types";
import { getAuthUser, getConversation, getConversationMessage } from "@/app/utils/api";
import { useParams } from "next/navigation";
import MessagePanel from "@/app/components/messages/MessagePanel";
import TopRightBar from "@/app/components/TopRightBar";
import SideBar from "@/app/components/SideBar";

const ConversationChannelPage = () => {
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
    const controller = new AbortController();
    useEffect(() => {
            setLoading(true);
            console.log(loading);
            getAuthUser().then(({data}) => {
                // console.log("hello")
                // console.log(data);
                setUser(data);
                // console.log("user here");
                setLoading(false)})
            .catch((err)=> {console.log(err); setLoading(false);});
            return controller.abort();
    }, [])
	const [conversation , setConversation] = useState<ConversationTypes[]>([])
	useEffect(() => {
		getConversation().then(({data}) =>{
			setConversation(data),
			console.log(data)
			setConversation(data)
		}).catch((err)=> console.log(err))
	}, [conversation])



    const {id} = useParams();
    const [message , setMessage] = useState<messageTypes[]>([])

    useEffect(() => {
        if (typeof id === 'string') {
          console.log(id);
          const conversationId = id;
          getConversationMessage(conversationId)
            .then(({ data }) => {
              console.log(data);
              setMessage(data);
            })
            .catch((err) => console.log(err));
        }
      }, [id]);
    return ( 
     <div>
            <Page display="flex">
            <SideBar
				sideBar={change.sideBar}
				onClick={() =>
					setChange({
						...change,
						sideBar: !change.sideBar,
						chatBox: false,
						menu: false,
					})
				}
			/>

			{/* Top Right Menu */}
			<TopRightBar
				menu={change.menu}
				onClick={() =>
					setChange({
						...change,
						sideBar: false,
						chatBox: false,
						menu: !change.menu,
					})
				}
			/>

                <CoversationSideBar conversations={conversation}/>
                <ConversationChannelStyle>
                {/* <h1>{user?.firstName}  {user?.lastName}</h1>
                {message.map((m) =><div>{m.content}</div>  )} */}
                    <MessagePanel messages={message}></MessagePanel> 
                </ConversationChannelStyle>
            </Page>
            

		
        
           
     </div>
        
            
      
        
     );
}
 
export default ConversationChannelPage;