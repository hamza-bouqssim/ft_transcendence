"use client"

import { AppDispatch } from "@/app/store";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem, HeaderOnlineUsers, OflineStyling, OnlineStyling } from "@/app/utils/styles";
import { useDispatch } from "react-redux";
import {useContext, useEffect, useState} from "react"
import { UsersTypes } from "@/app/utils/types";
import { fetchUsersThunk } from "@/app/store/usersSlice";
import {  socketContext } from "@/app/utils/context/socketContext";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { MenuButton, MenuButton2 } from "../Buttons";
import { fetchBlockFriendThunk, fetchGetAllFriends } from "@/app/store/requestSlice";
import { useRouter } from "next/navigation";

const OnlineFriends = () =>{
  const router = useRouter();
    const [users, setUsers] = useState<UsersTypes[]>([]);
    const [friends, setFriends] = useState<UsersTypes[]>([]);
    const [online, setOnlineFriends] = useState<UsersTypes[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

      const handleMenuClick = (friendId: string) => {
        setOpenMenuId(openMenuId === friendId ? null : friendId);
    };

    useEffect (() => {
      dispatch(fetchUsersThunk())
      .unwrap()
      .then(({data}) => {
        setUsers(data);
      }).catch((err)=>{
        console.log(err);
      }
      );
    },[]);

    useEffect (() => {
      dispatch(fetchGetAllFriends())
      .unwrap()
      .then(({data}) => {
        setFriends(data);
      }).catch((err)=>{
        console.log(err);
      }
      );
    },[]);

    const handlleBloque = async (id: string) => {
      
      try {
        await dispatch(fetchBlockFriendThunk(id));
          alert("You have blocked this friend successfully");
      } catch (error) {
        console.error("Error blocking friend:", error);
          alert("Failed to block the friend. Please try again."); // Show an alert for error handling
      }
    };

   
    const isUserOnline = (friend: UsersTypes) => {
      const user = users.find(user => user.id === friend.id);
    
      return user && user.status === 'online';
    };
    return (
        <div className="text-black  my-10 h-[calc(100%-200px)] overflow-auto ">
        <Conversation>

				<ConversationSideBarContainer>
					{friends.map(function(elem){
            function handleClick()
						{
							router.push(`/dashboard/${elem.id}`)
						}
						return(
							<ConversationSideBarItem key={elem.id}>
              <div className="flex">
								<Image src={elem.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
                {isUserOnline(elem)  ? <OnlineStyling/> : <OflineStyling/>}
              </div>
					 			<span  className="ConversationName">{elem.username} {elem.display_name}</span>
				         <div className="absolute right-5 p-4">
				          <FontAwesomeIcon icon={faEllipsis} className={`text-black transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl }`}
					          onClick={() => handleMenuClick(elem.id)}
				          />
      
                {openMenuId === elem.id &&
                <div className={`absolute  top-10 left-2 h-[120px]  w-[200px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#000000] bg-white font-['Whitney_Semibold'] `}>
					        <button className={`bg-[#d9d9d9] text-black h-[35px] w-[197px] rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`} onClick={()=> handleClick()}>see profile</button>
					        <button className={` bg-[#d9d9d9] text-black h-[35px] w-[197px] rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}>send message</button>
                  <button className={` bg-[#EA7F87] text-black h-[35px] w-[197px] rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`} value="Bloque" onClick={()=> handlleBloque(elem.id)}>Bloque</button>

				        </div>}
            </div>               
                   
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
        </div>
           
    )
}

export default OnlineFriends;