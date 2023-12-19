import { AppDispatch } from "@/app/store";
import { createConversationThunk, fetchConversationUserThunk } from "@/app/store/conversationSlice";
import { getAllFriends } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem, IngameStyling, OflineStyling, OnlineStyling } from "@/app/utils/styles";
import { CreateConversationParams, FriendsTypes } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MenuButton, MenuButton2 } from "../Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faChevronDown, faEllipsis} from "@fortawesome/free-solid-svg-icons";
import RightBarUsers from "../RightBarUsers";
import Image from "next/image";
import { fetchBlockFriendThunk } from "@/app/store/blockSlice";
import { fetchGetAllFriendsThunk } from "@/app/store/friendsSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { socketContext } from "@/app/utils/context/socketContext";
import { fetchMessagesThunk } from "@/app/store/messageSlice";
import { fetchSendRequestPLay } from "@/app/store/requestSlice";
import { fetchUsersThunk } from "@/app/store/usersSlice";


const ListFriends = () => {
  const ToastError = (message: any) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };
	
	  const ToastSuccess = (message: any) => {
		toast.success(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };


    const [Friends, setFriends] = useState<FriendsTypes[]>([]);
    const { updateChannel, channel } = useContext(socketContext);

    const dispatch = useDispatch<AppDispatch>();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [change, setChange] = useState<{
      sideBar: boolean;
      chatBox: boolean;
      menu: boolean;
    }>({
      sideBar: false,
      chatBox: false,
      menu: false,
    });


  
   
   
      const { friends, status, error } = useSelector((state:any) => state.friends);
      const { users, Userstatus, Usererror } = useSelector((state:any) => state.users);

      useEffect(() => {
        dispatch(fetchGetAllFriendsThunk());
        dispatch(fetchUsersThunk());

      }, [dispatch]);

      const router = useRouter();
       const handleFunction = (friends : FriendsTypes) =>{

        let display_name ;
        display_name  = friends.display_name;
        return display_name;

      }
     
      const handleMenuClick = (friendId: string) => {
          setOpenMenuId(openMenuId === friendId ? null : friendId);
      };

      const handlleBloque = async (id: string) => {
      
        try {
          const res = await dispatch(fetchBlockFriendThunk(id));
          if (res.payload && typeof res.payload === 'object') {
          const responseData = res.payload as { data?: { response?: { message?: string } } };
          const message = responseData.data?.response?.message;
          if (message) {
            ToastSuccess(message);
    
          }else {
            const responseData = res.payload as {message?: string};
            const message = responseData.message;
            if(message)
            ToastError(message);
          }
        }
      
        } catch (error) {
          
          ToastError("Failed to block this friend. Please try again.");
      
        }

      };
      
     
    return (
        <Conversation>
          <ToastContainer />
				<ConversationSideBarContainer>
					{friends.map(function(elem : FriendsTypes){
            const user = users.find((user: any) => user.id === elem.id);
            const getStatusColor = () => {
              if (user) {
                switch (user.status) {
                  case "online":
                    return "green"; // Online status color
                  case "offline":
                    return "red"; // Offline status color
                  case "inGame":
                    return "blue"; // In-game status color
                  default:
                    return "black"; // Default color or any other status
                }
              }
              return "black"; // Default color if user not found
            };
            const handleSendMessage = async () =>
            {

                  dispatch(fetchConversationUserThunk(elem.display_name))
                    .unwrap()
                    .then(({data}) => {
                      updateChannel(data);
                      dispatch(fetchMessagesThunk(data.id));

                  }).catch((err)=>{
                      console.log(err);
                  }
                );

            }
            const handlePLayingRequest = async(display_name : string) =>{
              try { 
                const response= await dispatch(fetchSendRequestPLay(display_name));
                if (response.payload && response.payload.message) {
                  const errorMessage = response.payload.message;
                  ToastError(`Error: ${errorMessage}`);
                } else {
                  ToastSuccess("Friend request sent successfully");
    
                }
              } catch (err: any) {
                ToastError(`Error: ${err.message || 'An unexpected error occurred'}!`);
    
              }
             

            }
            function handleClick()
            {
              router.push(`/dashboard/${elem.id}`)
            }
						return(
							<ConversationSideBarItem key={elem.id}>
                {/* <div
                  className="absolute top-40 left-10  rounded-full w-6 h-6"
                >                  {(getStatusColor() === "green") ? <OnlineStyling/>  : (getStatusColor() === "red") ? <OflineStyling/> : <IngameStyling/>}
                </div> */}
                <div className="flex">
                <Image src={elem.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
                  {(getStatusColor() === "green") ? <OnlineStyling/>  : (getStatusColor() === "red") ? <OflineStyling/> : <IngameStyling/>}

                </div>
               
								<div>
					 				<span  className="ConversationName">{elem.username} {elem.display_name}</span>
					 			</div>
                   
  
                 <div className="absolute right-5 p-4">
				          <FontAwesomeIcon icon={faEllipsis} className={`text-black transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl }`}
					          onClick={() => handleMenuClick(elem.id)}
				          />
      
                {openMenuId === elem.id &&
                <div className={`absolute  top-[-200px] right-2 p-2 w-[200px] flex-col items-center justify-evenly rounded-[15px] border-2 border-solid border-[#000000] bg-white font-['Whitney_Semibold'] `}>
                  <button className={`bg-[#d9d9d9] text-black h-[30px] w-full rounded-[15px] my-1 hover:bg-[rgba(0,0,0,.2)]`} onClick={()=> handleClick()}>see profile</button>
                  <button className={`bg-[#d9d9d9] text-black h-[30px] w-full rounded-[15px] my-1 hover:bg-[rgba(0,0,0,.2)]`} onClick={()=> handlePLayingRequest(elem.display_name)}>Invite to play</button>
                  <button className={` bg-[#d9d9d9] text-black h-[30px] w-full rounded-[15px] my-1 hover:bg-[rgba(0,0,0,.2)]`} onClick={()=> handleSendMessage() }>send message</button>
                  <button className={` bg-[#EA7F87] text-black h-[30px] w-full rounded-[15px] my-1 hover:bg-[rgba(0,0,0,.2)]`} value="Bloque" onClick={()=> handlleBloque(elem.id)}>Bloque</button>

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