"use client"
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles"
import { ConversationTypes, User } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import { FC, useState, useEffect } from "react";
import "./style.css"
import { getAuthUser } from "@/app/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchConversationThunk } from "@/app/store/conversationSlice";
type Props = {
	conversations: ConversationTypes[];
	user : User;
}

const ChatComponnent  = () =>{
    const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
    const [ user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
	const controller = new AbortController();
	const conversations =[];

	
  
	  useEffect(() => {
		  console.log('Fetching Conversations in ConversationPage');
		  dispatch(fetchConversationThunk());
		}, []);

    useEffect(() => {
        setLoading(true);
        getAuthUser().then(({data}) => {
            setUser(data);
            setLoading(false)})
        .catch((err)=> {console.log(err); setLoading(false);});
    }, [user])

    const getDisplayUser = (conversation : ConversationTypes) => {
		let test;
		// if(user){
			const userId = "souka";
			
			if(conversation.sender?.display_name != userId)
			{
				test = conversation.sender
			}else if(conversation.sender?.display_name == userId)
			{
				test = conversation.recipient;
			}
		// }
		
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
					{ conversations && conversations?.map(function(elem){
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