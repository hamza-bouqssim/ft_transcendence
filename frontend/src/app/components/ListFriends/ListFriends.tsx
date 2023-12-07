import { AppDispatch } from "@/app/store";
import { createConversationThunk } from "@/app/store/conversationSlice";
import { getAllFriends } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles";
import { CreateConversationParams, FriendsTypes } from "@/app/utils/types";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MenuButton, MenuButton2 } from "../Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars } from "@fortawesome/free-solid-svg-icons";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faChevronDown, faEllipsis} from "@fortawesome/free-solid-svg-icons";
import RightBarUsers from "../RightBarUsers";
import Image from "next/image";
import { fetchBlockFriendThunk, fetchGetAllFriends } from "@/app/store/requestSlice";


const ListFriends = () => {


  const [change, setChange] = useState<{
    sideBar: boolean;
    chatBox: boolean;
    menu: boolean;
  }>({
    sideBar: false,
    chatBox: false,
    menu: false,
  });
  
  
  const [Friends, setFriends] = useState<FriendsTypes[]>([]);
  
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

      const router = useRouter();
    // console.log("friends here", Friends);
      const handleFunction = (friends : FriendsTypes) =>{

        let display_name ;
        display_name  = friends.display_name;
        return display_name;

      }
      const dispatch = useDispatch<AppDispatch>();
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
        <Conversation>

				<ConversationSideBarContainer>
					{Friends.map(function(elem){
						return(
							<ConversationSideBarItem key={elem.id}>
                <Image src={elem.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />

								<div>
					 				<span  className="ConversationName">{elem.username} {elem.display_name}</span>
					 			</div>
                   
  
                 <div className="absolute right-5 p-4">
				          <FontAwesomeIcon icon={faEllipsis} className={`text-black transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl }`}
					          onClick={() => handleMenuClick(elem.id)}
				          />
      
                {openMenuId === elem.id &&
                <div className={`absolute  top-10 left-2 h-[120px]  w-[200px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#000000] bg-white font-['Whitney_Semibold'] `}>
					        <button className={`bg-[#d9d9d9] text-black h-[35px] w-[197px] rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}>see profile</button>
					        <button className={` bg-[#d9d9d9] text-black h-[35px] w-[197px] rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}>send message</button>
                  <button className={` bg-[#EA7F87] text-black h-[35px] w-[197px] rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`} value="Bloque" onClick={()=> handlleBloque(elem.id)}>Bloque</button>

				        </div>}
            </div> 
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )

}

export default ListFriends;