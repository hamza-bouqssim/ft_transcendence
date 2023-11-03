"use client"

import SideBar from "../../components/SideBar"
import { deflate } from "zlib";
import EmptyState from "../../components/CoversationSideBar/page"
import styles from "./page.module.css"
import {FC, useEffect, useState} from "react"
import { Page } from "@/app/utils/styles"
import CoversationSideBar from "../../components/CoversationSideBar/page";
import ConversationPanel from "@/app/components/ConversationPanel/page";
import { useParams } from "next/navigation";
import { getAuthUser, getConversation } from "@/app/utils/api";
import { ConversationTypes, User} from "@/app/utils/types";
import TopRightBar from "@/app/components/TopRightBar";




const CoversationPage = () =>
{
	const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
	});
	const {id} = useParams();
	const [conversation , setConversation] = useState<ConversationTypes[]>([])
	// console.log("id here")
	// console.log(id);
	useEffect(() => {
		getConversation().then(({data}) =>{
			setConversation(data),
			// console.log("here data"),
			// console.log(data)
			setConversation(data)
		}).catch((err)=> console.log(err))
	}, [conversation])
	
		return (
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
				<ConversationPanel/> 
			
			</Page>)
	
			

}

export default CoversationPage