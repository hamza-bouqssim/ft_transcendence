import { AppDispatch } from "@/app/store";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem, HeaderOnlineUsers, OnlineStyling } from "@/app/utils/styles";
import { useDispatch } from "react-redux";
import {useContext, useEffect, useState} from "react"
import { UsersTypes } from "@/app/utils/types";
import { fetchUsersThunk } from "@/app/store/usersSlice";
import {  socketContext } from "@/app/utils/context/socketContext";

const OnlineFriends = () =>{
    const [users, setUsers] = useState<UsersTypes[]>([]);
    const [Onlineusers, setOnlineUsers] = useState<UsersTypes[]>([]);


    const dispatch = useDispatch<AppDispatch>();

    useEffect (() => {
      dispatch(fetchUsersThunk())
      .unwrap()
      .then(({data}) => {
        setUsers(data);
      }).catch((err)=>{
        console.log(err);
      }
      );
    },)

   
    const socket = useContext(socketContext)

    useEffect(() => {
        socket.emit('getOnlineUsers');
        socket.on('getOnlineUsers', (onlineUsers) => {
            console.log("online friend-->", onlineUsers);
            setOnlineUsers(onlineUsers);
        });
    
        return () => {
            socket.off('getOnlineUsers');
        };
    }, [socket]);
    const isUserOnline = (userId: string) => {
        return Onlineusers.some((user : any) => user.id === userId);
      };
    return (
        <div className="text-black  my-10 h-[calc(100%-200px)] overflow-auto ">
        <Conversation>

				<ConversationSideBarContainer>
					{users.map(function(elem){
						return(
							<ConversationSideBarItem key={elem.id}>
								<div className="avatar"></div>
								<div className="flex">
					 				<span  className="ConversationName">{elem.username} {elem.display_name}</span>
                                     {isUserOnline(elem.id) && (
                                        <OnlineStyling></OnlineStyling>)}
					 			</div>
                            {/* <FontAwesomeIcon icon={faChevronDown} className="menu-icon text-black" /> */}
                   
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
        </div>
           
    )
}

export default OnlineFriends;