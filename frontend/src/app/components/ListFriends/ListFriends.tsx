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
import { faChevronDown} from "@fortawesome/free-solid-svg-icons";
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
                  {/* <FontAwesomeIcon icon={faChevronDown} className="menu-icon text-black" /> */}
                  <RightBarUsers
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
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )

}

export default ListFriends;