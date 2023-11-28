"use client"
import { AppDispatch } from "@/app/store";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem, HeaderOnlineUsers, OflineStyling, OnlineStyling } from "@/app/utils/styles";
import { useDispatch } from "react-redux";
import {FC, useContext, useEffect, useState} from "react"
import { UsersTypes } from "@/app/utils/types";
import { fetchUsersThunk } from "@/app/store/usersSlice";
import {  socketContext } from "@/app/utils/context/socketContext";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { MenuButton, MenuButton2 } from "../Buttons";
import { fetchBlockFriendThunk, fetchGetAllFriends } from "@/app/store/requestSlice";
import { createConversationThunk, fetchConversationUserThunk } from "@/app/store/conversationSlice";
import { useRouter } from "next/navigation";
 
type props = {   
  onlineUsers : UsersTypes[]
}

const OnlineFriends:  FC<props> = ({onlineUsers})=>{
    const [users, setUsers] = useState<UsersTypes[]>([]);
    const router = useRouter();

    // const [Onlineusers, setOnlineUsers] = useState<UsersTypes[]>([]);


    const dispatch = useDispatch<AppDispatch>();

    useEffect (() => {
      dispatch(fetchGetAllFriends())
      .unwrap()
      .then(({data}) => {
        setUsers(data);
      }).catch((err)=>{
        console.log(err);
      }
      );
    },)

   

   
    // const socket = useContext(socketContext)

    // useEffect(() => {
    //     // socket.emit('getOnlineUsers');
    //     socket.on('getOnlineUsers', (onlineUsers) => {
    //         console.log("online friend-->", onlineUsers);
    //         setOnlineUsers(onlineUsers);
    //     });
    // console.log("socket here", socket.id);
    //     return () => {
    //         socket.off('getOnlineUsers');
    //     };
    // }, [socket]);
    const isUserOnline = (userId: string) => {
        return onlineUsers.some((user : any) => user.id === userId);
      };
      const [openMenuId, setOpenMenuId] = useState<string | null>(null);

      const handleMenuClick = (friendId: string) => {
        setOpenMenuId(openMenuId === friendId ? null : friendId);
    };


    const handlleBloque = async (id: string) => {
      console.log("id friend is -->", id);
    
      try {
        await dispatch(fetchBlockFriendThunk(id));
          alert("You have blocked this friend successfully");
      } catch (error) {
        console.error("Error blocking friend:", error);
          alert("Failed to block the friend. Please try again."); // Show an alert for error handling
      }
    };
    
    return (
        <div className="text-black  my-10 h-[calc(100%-200px)] overflow-auto ">
        <Conversation>

				<ConversationSideBarContainer>
					{users.map(function(elem){
              const handleClickConversation = async () =>
              {
                let test;
              

                dispatch(fetchConversationUserThunk(elem.display_name))
                .unwrap()
                .then(({data}) => {
                  router.push(`/dashboard/chat/${data.id}`);
                  if(!data)
                  {
                    dispatch(createConversationThunk(elem.display_name));
                  }
                  
                }).catch((err)=>{
                console.log(err);
                }
                );

              }
						return(
							<ConversationSideBarItem key={elem.id}>
              <div className="flex">
								<Image src={elem.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
                {isUserOnline(elem.id) ? (<OnlineStyling/>) : <OflineStyling/>}   
              </div>
					 			<span  className="ConversationName">{elem.username} {elem.display_name}</span>
                 <div className=" absolute right-5 p-4 ">
				          <FontAwesomeIcon icon={faEllipsis} className={` text-black transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl`}
					          onClick={() => handleMenuClick(elem.id)}
				          />
      
                {openMenuId === elem.id &&

                <div className={`absolute  top-10 left-2 h-[120px]  w-[200px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#000000] bg-white font-['Whitney_Semibold'] `}>
					        <button className={`bg-[#d9d9d9] text-black h-[35px] w-[197px] rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}>see profile</button>
					        <button className={` bg-[#d9d9d9] text-black h-[35px] w-[197px] rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`} onClick={()=>handleClickConversation()}>send message</button>
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