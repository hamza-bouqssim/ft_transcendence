"use client"

import SideBar from "../../components/SideBar"
import { deflate } from "zlib";
import EmptyState from "../../components/CoversationSideBar/page"
import styles from "./page.module.css"
import React, {FC, PropsWithChildren, useEffect, useLayoutEffect, useState} from "react"
import { Page } from "@/app/utils/styles"
import CoversationSideBar from "../../components/CoversationSideBar/page";
import ConversationPanel from "@/app/components/ConversationPanel/page";
import { redirect, useParams } from "next/navigation";
import { getAuthUser, getConversation } from "@/app/utils/api";
import { ConversationTypes, User} from "@/app/utils/types";
import TopRightBar from "@/app/components/TopRightBar";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { socket, socketContext } from "@/app/utils/context/socketContext";
import { Socket } from "socket.io-client";
import {Provider ,  useDispatch} from 'react-redux'
import { AppDispatch, store } from "@/app/store";
import { fetchConversationThunk } from "@/app/store/conversationSlice";


// type Props = {
// 	user?: User;
// 	setUser : React.Dispatch<React.SetStateAction<User | undefined>>;
// 	socket : Socket;
// }

// function AppWithProviders({children, user, setUser,} : PropsWithChildren & Props){

// 	return (
// 		<Provider store={store}>
// 			<socketContext.Provider value={socket}>
// 				{children}
// 			</socketContext.Provider>
// 		</Provider>
// 	)

// }
	

const CoversationPage = () =>
{
	
	const {id} = useParams();
	const [conversation , setConversation] = useState<ConversationTypes[]>([]);
	const dispatch = useDispatch<AppDispatch>();

	// useEffect(() => {
	// 	getConversation().then(({data}) =>{
	// 		setConversation(data)
	// 	}).catch((err)=> console.log(err))
	// }, [conversation])

	useEffect(() => {
		dispatch(fetchConversationThunk())
		.unwrap()
		.then(({data}) => {
			setConversation(data);
		}).catch((err)=>{
			console.log(err);
		}
		);
	})
	const [user, setUser] = useState<User>();
	
		return (
			// <AppWithProviders user={user} setUser={setUser} socket={socket}> 
			<div className="flex  w-full h-screen xl:container xl:mx-auto">
				<div className ="w-full  h-full xl:w-[35%] xl:p-10 xl:pl-5  xl:pr-2 ">
					<CoversationSideBar conversations={conversation}/>
				</div>
				{/* <ConversationPanel/>  */}
				<div className="xl:my-10 xl:mr-10  w-full xl:ml-2 xl:w-[65%]  xl:rounded-[20px] xl:mt-32 hidden xl:flex items-center justify-center">Invit friend to new chat rome</div>
			</div>
			// </AppWithProviders>
)


			

}

export default CoversationPage