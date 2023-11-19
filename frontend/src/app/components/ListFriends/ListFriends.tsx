import { AppDispatch } from "@/app/store";
import { createConversationThunk } from "@/app/store/conversationSlice";
import { getAllFriends } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles";
import { CreateConversationParams, FriendsTypes } from "@/app/utils/types";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MenuButton } from "../Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars } from "@fortawesome/free-solid-svg-icons";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faChevronDown, faEllipsis} from "@fortawesome/free-solid-svg-icons";
import RightBarUsers from "../RightBarUsers";


const ListFriends = () => {


    const [Friends, setFriends] = useState<FriendsTypes[]>([]);
    const [change, setChange] = useState<{
      sideBar: boolean;
      chatBox: boolean;
      menu: boolean;
    }>({
      sideBar: false,
      chatBox: false,
      menu: false,
    });


    useEffect(() => {
          getAllFriends()
            .then(({ data }) => {
                // console.log("all friends"); 
                // console.log(data);
              setFriends(data);
            })
            .catch((err) => console.log(err));
        
      }, []);

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

    return (
        <Conversation>

				<ConversationSideBarContainer>
					{Friends.map(function(elem){
						return(
							<ConversationSideBarItem key={elem.id}>
								<div className="avatar"></div>
								<div>
					 				<span  className="ConversationName">{handleFunction(elem)}</span>
					 			</div>
                   
  
<div className=" relative ">
				<FontAwesomeIcon icon={faEllipsis} className={`text-black transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl }`}
					 onClick={() => handleMenuClick(elem.id)}
				/>
      
        {openMenuId === elem.id &&
        <div className={`absolute top-10 left-5 h-[120px] z-10 w-[226px] flex-col items-center justify-center gap-2 rounded-[15px] border-2 border-solid border-[#8E8E8E] bg-white font-['Whitney_Semibold']`}>
					<MenuButton background={"bg-[#d9d9d9]"} value="View Profile" />
					<MenuButton background={"bg-[#BBBBBB]"} value="Send Message" />
          <MenuButton background={"bg-[#BBBBBB]"} value="Bloque" />

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