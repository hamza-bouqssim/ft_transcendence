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
		const userId = user?.username;
		
		
		let test;
		if(conversation.sender.username!= userId)
		{
		
			test = conversation.sender
		}else if(conversation.sender.username == userId)
		{
			test = conversation.recipient;
		}
   
		return test;
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
					 				<span onClick={handleClick} className="ConversationName">{getDisplayUser(elem)?.username}</span>
					 				<span className="lastName">{elem.lastMessage.content}</span>
					 			</div>
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
    )
}

export default ChatComponnent;