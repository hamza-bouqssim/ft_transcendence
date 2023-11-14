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

	const changeValues = { change, setChange };

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
        display_name  = friends.friends.display_name;
        return display_name;

      }
      const dispatch = useDispatch<AppDispatch>();

    return (
        <Conversation>

				<ConversationSideBarContainer>
					{Friends.map(function(elem){
						// const clickFunction = async  (data : CreateConversationParams) => {
                        //     console.log(data);
                        //     // dispatch(createConversationThunk(data));
                          
                        //       dispatch(createConversationThunk(data)).then(()=>{
                        //         console.log("done");
                        //       }).catch((err)=>{
                        //        console.log(err); 
                        //       })
                  
                  
                        //   }
						return(
							<ConversationSideBarItem key={elem.id}>
								<div className="avatar"></div>
								<div>
					 				<span  className="ConversationName">{handleFunction(elem)}</span>
					 			</div>
                  <FontAwesomeIcon icon={faChevronDown} className="menu-icon text-black" />
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )

}

export default ListFriends;