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
import CreateSearchModal from "../ConversationSearch/Modal/CreateSearchModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/app/store"
import { fetchNumberPending } from "@/app/store/requestSlice"
const CoversationSideBar = () => {
	const [newRooms , setNewRooms]  = useState<boolean>(false)
	const router = useRouter();
	const pathname = usePathname()
 	const [selectUsers, setSelectUsers] = useState<string>("online");     
	const {channel ,updateChannel} = useContext(socketContext);
	const [show, setShow] = useState<any>(false);
	const dispatch = useDispatch<AppDispatch>();
	const { request, status, error, countRequest  } = useSelector((state:any) => state.request);
	console.log("count pend here", countRequest);
	useEffect(()=>{
		dispatch(fetchNumberPending());
	},[dispatch]);
	
    return (
		<div className="w-full h-full relative p-2  xl:rounded-[20px] pt-4 bg-white">
			<div className="flex items-center rounded-full justify-between w-3/4 mb-4  mx-auto  bg-[#DFDFDF]">
				<button
					onClick={()=>{
						router.push("/dashboard/chat")
						updateChannel(null)
					}
				}
					className={`${(pathname.includes('chat')) ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}>Chats
				</button>
				<button 
					onClick={() =>{
						router.push("/dashboard/groups")
						updateChannel(null)
					}
				}
					className={`${(pathname.includes('groups')) ? 'bg-[#5B8CD3]' : ''} rounded-full p-4 w-1/2`}>Group
				</button>
			</div>
			<hr className="bg-[#DFDFDF] w-1/2 mx-auto mt-5"/>
			{!newRooms  && <div className={`search-container`}>
            {show  &&  <CreateSearchModal   setShow={setShow} />   }
		
			{!show && <div className="flex items-center bg-gray-200 rounded-md">
                <div className="pl-2">
                    <svg className="fill-current text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path className="heroicon-ui" d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                    </svg>
                </div>
                <input className="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2" id="search" type="text" placeholder="Search teams or members"  onClick={() => {setShow(!show)}}></input>
            </div>}
            
        	</div>}

			{newRooms && pathname.includes('chat') && !show  && <div className="flex items-center rounded-full justify-between w-3/ mb-4  mx-auto  bg-[#db808e8e]">
 				
 				<button 
 					onClick={()=>{setSelectUsers("online")}}
 					className={`${(selectUsers ==='online') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-1/2`}>Online
 				</button>
 				<button
 					onClick={()=>{setSelectUsers("allFriends")}} className={`${(selectUsers ==='allFriends') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-24`}>Friends
 				</button>
				<div >
 				<button
 					onClick={()=>{setSelectUsers("EnAttent")}} className={`${(selectUsers ==='EnAttent') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-24`}>Pending
 				</button>
				 <span className="absolute right-40  rounded-2xl bg-[--pink-color] px-2 font-['Whitney_Bold']">
					{countRequest}				
				</span>
				</div>
 				<button
 					onClick={()=>{setSelectUsers("Bloques")}} className={`${(selectUsers ==='Bloques') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-24`}>Bloques
 				</button>
				 <button
 					onClick={()=>{setSelectUsers("Add")}} className={`${(selectUsers ==='Add') ? 'bg-[#5B8CD3]' : ''} p-4 rounded-full w-24`}> Add
 				</button>
 			</div>}
			
			{newRooms &&  ((pathname.includes('chat')  && selectUsers === 'online')  ? <OnlineFriends/> :  (pathname.includes('chat') && selectUsers === 'allFriends') ? <ListFriends/> : ( pathname.includes('chat') && selectUsers === 'EnAttent') ? <SendRequest/> :( pathname.includes('chat') && selectUsers === 'Bloques') ? <FriendsBloque/> : ( pathname.includes('chat') && selectUsers === 'Add') ? <SendRequestForm/> : <></> )}

			{!newRooms 
				&&  pathname.includes('chat')  && !show
				&& <ChatComponnent />
			}
			{!newRooms 
				&&  pathname.includes('groups')  && !show
				&& <GroupsManagement/>
			}
			{newRooms 
				&& (pathname.includes('chat')
				? <div className="text-black"></div> 
				: <CreatGroups setNewRooms={setNewRooms} ></CreatGroups> )
			}
			{!newRooms  ?
				<button onClick={()=>{setNewRooms(true)}} className="absolute right-5 p-4 bottom-5 bg-[#5B8CD3] rounded-full "><IoMdAdd />
				</button>
				: null		
				// <div className="absolute right-5  bottom-5 flex items-center">
				// 	<button onClick={()=>{setNewRooms(false)}} className="text-[#5B8CD3] mr-4">Cancel</button>
				// 	<button onClick={()=>{setNewRooms(false)}} className=" bg-[#5B8CD3] p-4 rounded-full "><FaCheck />
				// 	</button>
				// </div>
			
			}
		</div>
     );
}
 
export default CoversationSideBar;