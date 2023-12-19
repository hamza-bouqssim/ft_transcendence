"use client"
import {  useEffect, useState } from "react"
import {useRouter} from "next/navigation"
import { usePathname } from 'next/navigation'
import ConversationSearch from "../ConversationSearch/page"
import ChatComponnent from "../ChatComponent/ChatComponent"
import GroupsManagement from "../GroupsManagment/GroupsManagment"
import CreatGroups from "../CreateGroups/CreateGroups"
import {IoMdAdd} from 'react-icons/io'
import OnlineFriends from "../OnlineFriends/OnlineFriends"
import ListFriends from "../ListFriends/ListFriends"
import SendRequest from "../SendRequest/SendRequest"
import FriendsBloque from "../FriendsBloque/FriendsBloque"
import { useContext } from "react";
import {socketContext } from "@/app/utils/context/socketContext";
import { SendRequestForm } from "../forms/SendRequestForm"
import { FaCheck } from "react-icons/fa"
const CoversationSideBar = () => {
	const [newRooms , setNewRooms]  = useState<boolean>(false)
	const router = useRouter();
	const pathname = usePathname()
 	const [selectUsers, setSelectUsers] = useState<string>("online");     
	const {channel ,updateChannel} = useContext(socketContext);
	
    return (
		<div className="w-full h-full relative p-2  xl:rounded-[20px] pt-4 bg-white">
			<div className="flex items-center rounded-full justify-between w-3/4 mb-4  mx-auto  bg-[#DFDFDF]">
				<button
					onClick={()=>{
						router.push("/dashboard/chat")
						updateChannel("")
					}
				}
					className={`${(pathname.includes('chat')) ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}>Chats
				</button>
				<button 
					onClick={() =>{
						router.push("/dashboard/groups")
						updateChannel("")
					}
				}
					className={`${(pathname.includes('groups')) ? 'bg-[#5B8CD3]' : ''} rounded-full p-4 w-1/2`}>Group
				</button>
			</div>
			<hr className="bg-[#DFDFDF] w-1/2 mx-auto mt-5"/>
			{!newRooms && <ConversationSearch  ></ConversationSearch>}

			{newRooms && pathname.includes('chat')  && <div className="flex items-center rounded-full justify-between w-3/ mb-4  mx-auto  bg-[#423d3d]">
 				
 				<button 
 					onClick={()=>{setSelectUsers("online")}}
 					className={`${(selectUsers ==='online') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}>Online
 				</button>
 				<button
 					onClick={()=>{setSelectUsers("allFriends")}} className={`${(selectUsers ==='allFriends') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}>Friends
 				</button>
 				<button
 					onClick={()=>{setSelectUsers("EnAttent")}} className={`${(selectUsers ==='EnAttent') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}>Pending
 				</button>
 				<button
 					onClick={()=>{setSelectUsers("Bloques")}} className={`${(selectUsers ==='Bloques') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}>Bloques
 				</button>
				 <button
 					onClick={()=>{setSelectUsers("Add")}} className={`${(selectUsers ==='Add') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}> Add
 				</button>
 			</div>}
			
			{newRooms &&  ((pathname.includes('chat')  && selectUsers === 'online')  ? <OnlineFriends/> :  (pathname.includes('chat') && selectUsers === 'allFriends') ? <ListFriends/> : ( pathname.includes('chat') && selectUsers === 'EnAttent') ? <SendRequest/> :( pathname.includes('chat') && selectUsers === 'Bloques') ? <FriendsBloque/> : ( pathname.includes('chat') && selectUsers === 'Add') ? <SendRequestForm/> : <></> )}

			{!newRooms 
				&&  pathname.includes('chat') 
				&& <ChatComponnent/>
			}
			{!newRooms 
				&&  pathname.includes('groups') 
				&& <GroupsManagement/>
			}
			{newRooms 
				&& (pathname.includes('chat')
				? <div className="text-black">
					<div className="absolute right-5  bottom-5 flex items-center">
						<button onClick={()=>{setNewRooms(false)}} className="text-[#5B8CD3] mr-4">Cancel</button>
						<button onClick={()=>{setNewRooms(false)}} className=" bg-[#5B8CD3] p-4 rounded-full "><FaCheck />
						</button>
					</div>
				</div> 
				: <CreatGroups setNewRooms={setNewRooms} ></CreatGroups> )
			}
			{!newRooms  ?
				<button onClick={()=>{setNewRooms(true)}} className="absolute right-5 p-4 bottom-20 md:bottom-4 bg-[#5B8CD3] rounded-full "><IoMdAdd />
				</button>
				: 			
				null
			
			}
		</div>
     );
}
 
export default CoversationSideBar;