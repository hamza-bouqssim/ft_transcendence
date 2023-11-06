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
import {Provider as ReduxProvider} from 'react-redux'
import { store } from "@/app/store";


type Props = {
	user?: User;
	setUser : React.Dispatch<React.SetStateAction<User | undefined>>;
	socket : Socket;
}

function AppWithProviders({children, user, setUser,} : PropsWithChildren & Props){
	return (
		<ReduxProvider store={store}>
			<socketContext.Provider value={socket}>
				{children}
			</socketContext.Provider>
		</ReduxProvider>
	)
	
	

}
	

const CoversationPage = () =>
{
	
	const {id} = useParams();
	const [conversation , setConversation] = useState<ConversationTypes[]>([])

	useEffect(() => {
		getConversation().then(({data}) =>{
			setConversation(data)
		}).catch((err)=> console.log(err))
	}, [conversation])

	
	const [user, setUser] = useState<User>();
	
		return (
			<AppWithProviders user={user} setUser={setUser} socket={socket}> 
				<Page display="flex">
					<CoversationSideBar conversations={conversation}/>
					<ConversationPanel/> 
				</Page>
			</AppWithProviders>
)


			

}

export default CoversationPage