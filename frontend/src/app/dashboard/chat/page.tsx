"use client"

import SideBar from "../../components/SideBar"
import { deflate } from "zlib";
import EmptyState from "../../components/CoversationSideBar/ConversationSideBar"
import styles from "./page.module.css"
import React, {FC, PropsWithChildren, useEffect, useLayoutEffect, useState} from "react"
import { Page } from "@/app/utils/styles"
import CoversationSideBar from "../../components/CoversationSideBar/ConversationSideBar";
import ConversationPanel from "@/app/components/ConversationPanel/ConversationPanel";
import { redirect, useParams } from "next/navigation";
import { getAuthUser, getConversation } from "@/app/utils/api";
import { ConversationTypes, User} from "@/app/utils/types";
import TopRightBar from "@/app/components/TopRightBar";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { socket, socketContext } from "@/app/utils/context/socketContext";
import { Socket } from "socket.io-client";
import {Provider ,  useDispatch, useSelector} from 'react-redux'
import { AppDispatch, RootState, store } from "@/app/store";
import { fetchConversationThunk } from "@/app/store/conversationSlice";



	

const CoversationPage = () =>
{
	
	const {id} = useParams();
	const [conversation , setConversation] = useState<ConversationTypes[]>([]);
	const dispatch = useDispatch<AppDispatch>();
	const conversations = useSelector(
	  (state: RootState) => state.conversation.conversations
	);
	

	useEffect(() => {
		console.log('Fetching Conversations in ConversationPage');
		dispatch(fetchConversationThunk());
	  }, []);
	const [user, setUser] = useState<User>();
	
		return (
			<div className="flex  w-full h-screen xl:container xl:mx-auto">
				<div className ="w-full  h-full xl:w-[35%] xl:p-10 xl:pl-5  xl:pr-2 ">
					<CoversationSideBar conversations={conversations}/>
				</div>
				<div className="xl:my-10 xl:mr-10  w-full xl:ml-2 xl:w-[65%]  xl:rounded-[20px] xl:mt-32 hidden xl:flex items-center justify-center">INITIATE A CONVERSATION WITH A FRIEND YOU WANT TO PLAY WITH</div>
			</div>
)


			

}

export default CoversationPage