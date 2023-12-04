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
import { fetchGetAllFriends } from "@/app/store/requestSlice";

const OnlineFriends = () =>{
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
    },);

    useEffect (() => {
      dispatch(fetchGetAllFriends())
      .unwrap()
      .then(({data}) => {
        setFriends(data);
      }).catch((err)=>{
        console.log(err);
      }
      );
    },)


   
    const isUserOnline = (friend: UsersTypes) => {
      const user = users.find(user => user.id === friend.id);
    
      return user && user.status === 'online';
    };
    return (
        <div className="text-black  my-10 h-[calc(100%-200px)] overflow-auto ">
        <Conversation>

				<ConversationSideBarContainer>
					{friends.map(function(elem){
						return(
							<ConversationSideBarItem key={elem.id}>
              <div className="flex">
								<Image src={elem.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
                {isUserOnline(elem)  ? <OnlineStyling/> : <OflineStyling/>}
              </div>
					 			<span  className="ConversationName">{elem.username} {elem.display_name}</span>
                 <div className=" relative ">
				          <FontAwesomeIcon icon={faEllipsis} className={`text-black transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl }`}
					          onClick={() => handleMenuClick(elem.id)}
				          />
      
                {openMenuId === elem.id &&
                <div className={`absolute  top-10 left-2 h-[120px]  w-[200px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#000000] bg-white font-['Whitney_Semibold'] `}>
					        <MenuButton2 background={"bg-[#d9d9d9]"} value="View Profile" />
					        <MenuButton2 background={"bg-[#BBBBBB]"} value="Send Message" />
                  <MenuButton2 background={"bg-[#EA7F87]"} value="Bloque" />

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