"use client"
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles"
import { ConversationTypes, User } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import { FC, useState, useEffect } from "react";
import "./style.css"
import { getAuthUser, getConversation } from "@/app/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchConversationThunk } from "@/app/store/conversationSlice";
import { formatRelative } from "date-fns";
import {IoMdAdd} from 'react-icons/io'
import { CreateConversationModal } from "../modals/CreateConversationModal";
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
	const [show, setShow] = useState<any>(false);

	// const conversations = useSelector((state: RootState) => state.conversation.conversations
	//   );

	  const [conversation , setConversation] = useState<ConversationTypes[]>([]);

  
	  useEffect(() => {
		getConversation().then(({data}) =>{
			setConversation(data);
		}).catch((err)=> console.log(err))
	}, [conversation])

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
			const userId = user?.display_name;
			
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
        <div className="text-black  my-10 h-[calc(100%-200px)] overflow-auto ">
			{show &&  <CreateConversationModal   setShow={setShow} />   }

		<div className="flex p-2 gap-px px-20  border-solid border-2 ">
			<h1 className=" text-lg p-2 font-bold  text-blue-500">Private Messages</h1>
			<button onClick={() => {setShow(!show)}} className=" absolute right-5 p-4 bg-[#fc7785] rounded-full" ><IoMdAdd /></button>
		</div>
			<div className="p-2">
				{conversation.map(function(elem){
						function handleClick()
						{
							router.push(`/dashboard/chat/${elem.id}`)
						}
						return(
							<div key={elem.id}  className="cursor-pointer rounded-lg hover:bg-[#F2F3FD] flex items-start justify-between px-2 py-3">
								<div className="flex items-center justify-start" key={elem.id}>
									<div className="avatar"></div>
									<div className="ml-4">
					 					<span onClick={handleClick} className="ConversationName">{getDisplayUser(elem)?.username} {getDisplayUser(elem)?.display_name}</span>
					 					<span className="lastName">{getDisplayLastMessage(elem)}</span>
					 				</div>
								</div>
								<div className="text-black">
									{formatRelative(new Date(elem.createdAt), new Date())}
								</div>
							</div>
							
								
						)
					}) }
			</div>
					
			</div>
    )
}

export default ChatComponnent;