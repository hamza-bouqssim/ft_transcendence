"use client"

import SideBar from "../../components/SideBar"
import { deflate } from "zlib";
import EmptyState from "../../components/CoversationSideBar/page"
import styles from "./page.module.css"
import React, {FC, useEffect, useLayoutEffect, useState} from "react"
import { Page } from "@/app/utils/styles"
import CoversationSideBar from "../../components/CoversationSideBar/page";
import ConversationPanel from "@/app/components/ConversationPanel/page";
import { redirect, useParams } from "next/navigation";
import { getAuthUser, getConversation } from "@/app/utils/api";
import { ConversationTypes, User} from "@/app/utils/types";
import TopRightBar from "@/app/components/TopRightBar";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";




const CoversationPage = () =>
{
	
	const {id} = useParams();
	const [conversation , setConversation] = useState<ConversationTypes[]>([])

	useEffect(() => {
		getConversation().then(({data}) =>{
			setConversation(data)
		}).catch((err)=> console.log(err))
	}, [conversation])
	
		return (
			<Page display="flex">
			
				<CoversationSideBar conversations={conversation}/>
				<ConversationPanel/> 
			
			</Page>)
	
			

}

export default CoversationPage