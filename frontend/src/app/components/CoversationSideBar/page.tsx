"use client"
import styles from "./page.module.scss"
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem, Page } from "@/app/utils/styles"
import { ConversationTypes, User } from "@/app/utils/types"
import {MdPostAdd} from 'react-icons/md'
import { FC, useContext, useEffect, useState } from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import { userAgent } from "next/server"
import { Overlay } from "../Overlay"
import { CreateConversationModal } from "../modals/CreateConversationModal"
import { AuthContext } from "@/app/utils/context/AuthContext"
import { getAuthUser } from "@/app/utils/api"
import { RootState } from "@/app/store"
import { useDispatch, useSelector } from "react-redux"
import GroupsManagement from "../GroupsManagment/GroupsManagment"
import ChatComponnent from "../ChatComponent/ChatComponent"
import Search from "../ConversationSearch/ConversationSearch"
import ConversationSearch from "../ConversationSearch/ConversationSearch"

type Props = {
	conversations: ConversationTypes[];
}

const CoversationSideBar: FC <Props>  = ({conversations}) => {
	// we use useSelector to select state
	// const conversation = useSelector((state: RootState) => state.conversation.conversations);
	const [ user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
	const controller = new AbortController();
	const [newRooms, setnewRooms] = useState<boolean>(false);
	const [selectRome , setSelectRome]  = useState<string>("chats")

    useEffect(() => {
            setLoading(true);
            getAuthUser().then(({data}) => {
                setUser(data);
                setLoading(false)})
            .catch((err)=> {console.log(err); setLoading(false);});
    }, [user])
	const router = useRouter();

	const [show, setShow] = useState<any>(false);
	
	

    return (
		<div className="w-full h-full relative p-2  xl:rounded-[20px] pt-4 bg-white">
			{/* {show &&  <CreateConversationModal   setShow={setShow} />   } */}
			<div className="flex items-center rounded-full justify-between w-3/4 mb-4  mx-auto  bg-[#DFDFDF]">

				<button
					onClick={()=>{setSelectRome("chats")}}
					className={`${(selectRome ==='chats') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}>Chats
				</button>
				<button 
					onClick={()=>{setSelectRome("group")}}
					className={`${(selectRome ==='group') ? 'bg-[#5B8CD3]' : ''} rounded-full p-4 w-1/2`}>Group
				</button>
			</div>
			<hr  className="bg-[#DFDFDF] w-1/2 mx-auto mt-5"/>
			<div>
				<ConversationSearch/>
			</div>
			{!newRooms && (selectRome === 'chats' ? <ChatComponnent conversations={conversations}/> : <GroupsManagement />)}
			{newRooms && (selectRome === 'chats' ? <div className="text-black">Addchat</div> :<div className="text-black">AddGroup</div> )}
			
			{/* <button onClick={()=>{setnewRooms(true)}} className="absolute right-5 p-4 bottom-5 bg-[#5B8CD3] rounded-full ">add</button> */}
			{!newRooms ?
			
			<button onClick={()=>{setnewRooms(true)}} className="absolute right-5 p-4 bottom-5 bg-[#5B8CD3] rounded-full ">add</button>
			:
			<button onClick={()=>{setnewRooms(false)}} className="absolute right-5 p-4 bottom-5 bg-[#5B8CD3] rounded-full ">ok</button>
			
			}

		</div>
        
			
			
       
     );
}
 
export default CoversationSideBar;