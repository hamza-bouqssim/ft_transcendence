"use client"
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles"
import { ConversationTypes, User } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import { FC, useState, useEffect } from "react";
import "./style.css"
import { getAuthUser } from "@/app/utils/api";
type Props = {
	conversations: ConversationTypes[];
}

const ChatComponnent: FC <Props>  = ({conversations}) =>{
    const router = useRouter();
    const [ user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
	const controller = new AbortController();
    useEffect(() => {
        setLoading(true);
        getAuthUser().then(({data}) => {
            setUser(data);
            setLoading(false)})
        .catch((err)=> {console.log(err); setLoading(false);});
    }, [user])
    const getDisplayUser = (conversation : ConversationTypes) => {
		const userId = user?.display_name;
		
		
		let test;
		if(conversation.sender.display_name!= userId)
		{
		
			test = conversation.sender
		}else if(conversation.sender.display_name == userId)
		{
			test = conversation.recipient;
		}
   
		return test;
	}
	const getDisplayLastMessage = (conversation : ConversationTypes) =>{

		let lastMessage = null;
		lastMessage = conversation.lastMessage;
		if(lastMessage == null)
			return null;
		else
			return lastMessage.content;
		
	}

	
    return (
        <Conversation>

				<ConversationSideBarContainer>
					{conversations.map(function(elem){
						function handleClick()
						{
							router.push(`/dashboard/chat/${elem.id}`)
						}
						return(
							<ConversationSideBarItem key={elem.id}>
								<div className="avatar"></div>
								<div>
					 				<span onClick={handleClick} className="ConversationName">{getDisplayUser(elem)?.username} {getDisplayUser(elem)?.display_name}</span>
					 				<span className="lastName">{getDisplayLastMessage(elem)}</span>
					 			</div>
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
    )
}

export default ChatComponnent;