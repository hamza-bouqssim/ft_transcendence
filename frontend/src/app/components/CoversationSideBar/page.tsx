"use client"
import {  useEffect, useState } from "react"
import {useRouter} from "next/navigation"
import { usePathname } from 'next/navigation'
import ConversationSearch from "../ConversationSearch/page"
import ChatComponnent from "../ChatComponent/ChatComponent"
import GroupsManagement from "../GroupsManagment/GroupsManagment"
import CreatGroups from "../CreateGroups/CreateGroups"
import {IoMdAdd} from 'react-icons/io'
import {FaCheck} from 'react-icons/fa'

const CoversationSideBar = () => {
	const [newRooms , setNewRooms]  = useState<boolean>(false)
	const router = useRouter();
	const pathname = usePathname()

    return (
		<div className="w-full h-full relative p-2  xl:rounded-[20px] pt-4 bg-white">
			{/* {show &&  <CreateConversationModal   setShow={setShow} />   } */}
			<div className="flex items-center rounded-full justify-between w-3/4 mb-4  mx-auto  bg-[#DFDFDF]">
				<button
					onClick={()=>{router.push("/dashboard/chat")}}
					className={`${(pathname.includes('chat')) ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}>Chats
				</button>
				<button 
					onClick={()=>{router.push("/dashboard/groups")}}
					className={`${(pathname.includes('groups')) ? 'bg-[#5B8CD3]' : ''} rounded-full p-4 w-1/2`}>Group
				</button>
			</div>
			<hr className="bg-[#DFDFDF] w-1/2 mx-auto mt-5"/>
			{!newRooms && <ConversationSearch  ></ConversationSearch>}
			{!newRooms && (pathname.includes('chat') ? <ChatComponnent/> : <GroupsManagement />)}
			{newRooms && (pathname.includes('chat')? <div className="text-black">Addchat</div> : <CreatGroups ></CreatGroups> )}
			{!newRooms ?
				<button onClick={()=>{setNewRooms(true)}} className="absolute right-5 p-4 bottom-5 bg-[#5B8CD3] rounded-full "><IoMdAdd />
				</button>
				:
				<div className="absolute right-5  bottom-5 flex items-center">
					<button onClick={()=>{setNewRooms(false)}} className="text-[#5B8CD3] mr-4">Cancel</button>
					<button onClick={()=>{setNewRooms(false)}} className=" bg-[#5B8CD3] p-4 rounded-full "><FaCheck />
					</button>
				</div>
			
			}
		</div>
     );
}
 
export default CoversationSideBar;