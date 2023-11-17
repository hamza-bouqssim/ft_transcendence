import { AppDispatch } from "@/app/store";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem, HeaderOnlineUsers } from "@/app/utils/styles";
import { useDispatch } from "react-redux";
import {useContext, useEffect, useState} from "react"
import { UsersTypes } from "@/app/utils/types";
import { fetchUsersThunk } from "@/app/store/usersSlice";
import {  socketContext } from "@/app/utils/context/socketContext";

const OnlineFriends = () =>{
    const [users, setUsers] = useState<UsersTypes[]>([]);

    // const dispatch = useDispatch<AppDispatch>();

    // useEffect (() => {
    //   dispatch(fetchUsersThunk())
    //   .unwrap()
    //   .then(({data}) => {
    //     setUsers(data);
    //   }).catch((err)=>{
    //     console.log(err);
    //   }
    //   );
    // },)

    // useEffect (()=>{
    //     const interval = setInterval(()=>{
    //         socket.emit('getOnlineUsers');

    //     }, 200002)
    //     return () =>{
    //         console.log("Clearing interval ")
    //         clearInterval(interval)
    //     }
    // }, [])
    const socket = useContext(socketContext)

    useEffect(() => {
        console.log("yes   yeaaa");
        socket.emit('getOnlineUsers');
        socket.on('getOnlineUsers', (onlineUsers) => {
            console.log("online user here-->", onlineUsers);
            setUsers(onlineUsers);
        });
    
        return () => {
            socket.off('getOnlineUsers');
        };
    }, [socket]);
    console.log("users online is -->", users);
    return (
        <Conversation>

				<ConversationSideBarContainer>
					{users.map(function(elem){
						return(
							<ConversationSideBarItem key={elem.id}>
								<div className="avatar"></div>
								<div>
					 				<span  className="ConversationName">{elem.email}</span>
					 			</div>
                            {/* <FontAwesomeIcon icon={faChevronDown} className="menu-icon text-black" /> */}
                   
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )
}

export default OnlineFriends;