"use client"
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles"
import { ConversationTypes, User } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { FC, useState, useEffect ,useContext} from "react";
import "./style.css"
import { getAuthUser, getConversation } from "@/app/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchConversationThunk } from "@/app/store/conversationSlice";
import { formatRelative } from "date-fns";
import {IoMdAdd} from 'react-icons/io'
import CreateConversationModal  from "../modals/CreateConversationModal";
import {socketContext } from "@/app/utils/context/socketContext";
import { fetchMessagesThunk } from "@/app/store/messageSlice";



const ChatComponnent  = () =>{
	const socket = useContext(socketContext).socket
    const router = useRouter();
	const [show, setShow] = useState<any>(false);
    const { updateChannel, channel } = useContext(socketContext);
	const [oldId,setOldId] = useState(null); 
	const dispatch = useDispatch<AppDispatch>();
	const [unreadConversations, setUnreadConversations] = useState<Set<string>>(new Set());
	const { conversations, status, error } = useSelector((state:any) => state.conversations);
	console.log("conversation -->", conversations);
    useEffect(() => {
      dispatch(fetchConversationThunk());
    }, [dispatch]);
	
	const {Userdata} = useContext(socketContext);
	console.log("userdata here-->", Userdata);

	useEffect(()=>{
		socket.on('onMessage', (messages : any)=>{
			dispatch(fetchConversationThunk());
			setUnreadConversations((prevUnread) => new Set(prevUnread.add(`${messages.participentsId}_${messages.participents.recipientId}`)));		})

		return () =>{
			socket.off('onMessage');
		}
	},[socket, dispatch])

    const getDisplayUser = (conversation : ConversationTypes) => {
		let test; 
			const userId = Userdata?.display_name;
			
			if(conversation.sender.display_name !== userId)
			{
				test = conversation.sender
			}else
				test = conversation.recipient;
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
	
	// const isUnread = (conversationId: string, recipient: User) => {
	// 	// Check if the logged-in user is the recipient

	// 	const isRecipient = Userdata?.display_name === recipient.display_name;
	// 	console.log("is recipient here-->", isRecipient);
	// 	// Check if the conversation is unread and the user is the recipient
	// 	return unreadConversations.has(`${conversationId}_${recipient.id}`);
	//   };
	const isUnread = (conversationId: string, recipient: User) => {
		return unreadConversations.has(`${conversationId}_${recipient.id}`);
	  };
	
	  const markConversationAsRead = (conversationId: string, recipient: User) => {
		const updatedUnreadConversations = new Set(unreadConversations);
		updatedUnreadConversations.delete(`${conversationId}_${recipient.id}`);
		setUnreadConversations(updatedUnreadConversations);
	  };
	
    return (
        <div className="text-black  my-10 h-[calc(100%-200px)] overflow-auto ">
			{show &&  <CreateConversationModal   setShow={setShow} />   }

		<div className="flex p-2 gap-px px-20  border-solid border-2 ">
			<h1 className=" text-lg p-2 font-bold  text-blue-500">Private Messages</h1>
			<button onClick={() => {setShow(!show)}} className=" absolute right-5 p-4 bg-[#fc7785] rounded-full" ><IoMdAdd /></button>
		</div>
			<div className="p-2">
				{conversations.map(function(elem : ConversationTypes){
						function handleClick()
						{
							updateChannel(elem)
							markConversationAsRead(elem.id, elem.recipient);

						}
						return(
							<div onClick={handleClick}  key={elem.id}  className={`cursor-pointer rounded-lg hover:bg-[#F2F3FD] ${
								isUnread(elem.id, elem.recipient ) ? 'bg-yellow-200' : ''
							  } flex items-start justify-between px-2 py-3`}>
								<div className="flex items-center justify-start" key={elem.id}>
								<Image src={getDisplayUser(elem)?.avatar_url} className="h-10 w-10 rounded-[50%] bg-black min-[1750px]:h-12 min-[1750px]:w-12" alt="Description of the image" width={60}   height={50} />
									<div className="ml-4">
					 					<span className="ConversationName">{getDisplayUser(elem)?.username} {getDisplayUser(elem)?.display_name}</span>
					 					<span className="lastName">{getDisplayLastMessage(elem)}</span>
					 				</div>
								</div>
								<div className="text-black">
									{new Date(elem.createdAt).toLocaleTimeString()}
								</div>
							</div>
							
								
						)
					}) }
			</div>
					
			</div>
    )
}

export default ChatComponnent;