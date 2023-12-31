import { AppDispatch } from "@/app/store";
import { fetchBlockFriendThunk, fetchDebloqueUserThunk } from "@/app/store/blockSlice";
import { fetchConversationThunk, fetchDeleteConversation } from "@/app/store/conversationSlice";
import { fetchMessagesThunk } from "@/app/store/messageSlice";
import { socketContext } from "@/app/utils/context/socketContext";
import { IngameStyling, OflineStyling, OnlineStyling } from "@/app/utils/styles";
import { ConversationTypes, User } from "@/app/utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, FC, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faChevronDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { fetchUsersThunk } from "@/app/store/usersSlice";
import { fetchAuthUser } from "@/app/store/AuthSlice";
import { getNottificatiofromchat } from "@/app/utils/api";


interface props  {
    elem : ConversationTypes;
 };

export const ListChat:FC<props> = ({elem} ) => {
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


    const { Userdata} = useContext(socketContext);
    const { updateChannel, channel } = useContext(socketContext);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { UsersAuth, statusUsers, errorUsers } = useSelector(
		(state: any) => state.UsersAuth,
	);
    const { users, Userstatus, Usererror } = useSelector(
		(state: any) => state.users,
	);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const handleMenuClick = (conversationId: string) => {
		setOpenMenuId(openMenuId === conversationId ? null : conversationId);
	};


  useEffect(() => {
    dispatch(fetchUsersThunk());
    dispatch(fetchAuthUser());
}, [dispatch]);


    const  handleClick = () => {
        updateChannel(elem);
        dispatch(fetchMessagesThunk(elem.id));
    }

    function handleClickUser() 
    {
        let user : User;
        if(elem.recipientId === Userdata?.id)
            user = elem.sender;
        else
            user = elem.recipient;

        router.push(`/dashboard/${user.id}`);
    }
    const handleDebloque = async (conversation: ConversationTypes) => {
		const user = getDisplayUser(conversation);

		try {
			await dispatch(fetchDebloqueUserThunk(user.id));
			ToastSuccess("You have Deblocked this friend successfully");
		} catch (error) {
			ToastError("Failed to Deblock the friend. Please try again.");
		}
	};

	const getDisplayUser = (conversation: ConversationTypes) => {
		let user;
		const userId = UsersAuth?.display_name;

		if (conversation.sender.display_name !== userId) {
			user = conversation.sender;
		} else {
			user = conversation.recipient;
		}

		const truncatedDisplayName =
			user.display_name.length > 10
				? `${user.display_name.substring(0, 10)}...`
				: user.display_name;

		return {
			...user,
			display_name: truncatedDisplayName,
		};
	};

	const checkTheStatus = (conversation: ConversationTypes) =>{
		let test : User;
		const userId = UsersAuth?.display_name;

		if (conversation.sender.display_name !== userId) {
			test = conversation.sender;
		} else {
			test = conversation.recipient;
		}
		const user = users.find((user: User) => user.id === test?.id);
		if(user)
			return user && user?.status;
		else
			return ""
	}

	const getDisplayLastMessage = (conversation: ConversationTypes) => {
		let lastMessage = conversation.lastMessage;

		if (lastMessage == null) {
			return null;
		} else {
			// Limit the displayed characters to 10
			const truncatedContent =
				lastMessage.content.length > 10
					? `${lastMessage.content.substring(0, 10)}...`
					: lastMessage.content;

			return truncatedContent;
		}
	};

    

    const handlleBloque = async (conversation: ConversationTypes) => {
		const user = getDisplayUser(conversation);
		try {
			const res = await dispatch(fetchBlockFriendThunk(user.id));
			if (res.payload && typeof res.payload === "object") {
				const responseData = res.payload as {
					response?: { message?: string } | undefined;
				  };
				const message = responseData.response?.message;
				if (message) {
					ToastSuccess(message);
				} else {
					const responseData = res.payload as { message?: string };
					const message = responseData.message;
					if (message) ToastError(message);
				}
			}
		} catch (error) {
			ToastError("Failed to block this friend. Please try again.");
		}
	};

	
	const deleteConversation = async (conversation: ConversationTypes) => {
		try {
			await dispatch(fetchDeleteConversation(conversation.id));
			ToastSuccess("You are deleting this conversation successfully");
		} catch (error) {
			ToastError("Failed to delete the conversation. Please try again.");
		}
	};
    const [number , setNumber] = useState<number>(0);
    const {socket} =  useContext(socketContext)
   
    useEffect(() => {
      
        socket.on("updateNotification",(payload:any)=>{
            if(payload.RoomId === elem.id && payload.RoomId !== channel?.id)
                setNumber(payload.number);
        })
        
    }, [socket]);
   
            return (
								<div
									key={elem.id}
									className={`flex crsor-pointer items-start justify-between rounded-lg px-2 py-3 hover:bg-[#F2F3FD]`}
								>
									<div
										onClick={handleClick}
										className="flex items-center justify-start"
										key={elem.id}
									>
                                        
                                        <div className="relative">
                                        <Image
												src={getDisplayUser(elem)?.avatar_url}
												className="w-[50px] rounded-full"
												alt="Description of the image"
												width={30}
												height={30}
											/>
                                            
                                            { number !== 0 && <div className="absolute top-[-5px] right-0 bg-[red] px-1 rounded-full">
                                            
                                                {number}
                                           
                                            </div>  }


                                        </div>
											  
									
										
										<div className="ml-4">
                                                
											    <span className="ConversationName font-['Whitney_Semibold']">
												    {getDisplayUser(elem)?.display_name}
											    </span>
                                               
                                                

                                            
											<span className="h-5 overflow-hidden text-sm font-light text-gray-400 font-['Whitney_Semibold']">
												{getDisplayLastMessage(elem)}
											</span>
										</div>
									</div>

									{/* Dropdown Menu Section */}
									<div className="absolute right-5 p-4">
										<FontAwesomeIcon
											icon={faEllipsis}
											className={`text-1xl transform cursor-pointer text-black duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl`}
											onClick={() => handleMenuClick(elem.id)}
										/>

										{openMenuId === elem.id && (
											<div
												className={`absolute -top-[115px] right-3 z-10 w-[200px] flex-col items-center justify-evenly rounded-[15px] border-2 border-solid border-[#000000] bg-white p-2 font-['Whitney_Semibold'] `}
											>
												<button
													className={`my-1 h-[30px] w-full rounded-[15px] bg-[#d9d9d9] text-black hover:bg-[rgba(0,0,0,.2)]`}
													onClick={() => handleClickUser()}
												>
													View profile
												</button>
												<button
													className={`my-1 h-[30px] w-full rounded-[15px] bg-[#d9d9d9] text-black hover:bg-[rgba(0,0,0,.2)]`}
													onClick={() => deleteConversation(elem)}
												>
													Delete Chat
												</button>
												<button
													className={`my-1 h-[30px] w-full rounded-[15px] bg-[#EA7F87] text-black hover:bg-[rgba(0,0,0,.2)]`}
													value="Bloque"
													onClick={() => handlleBloque(elem)}
												>
													Bloque
												</button>
											</div>
										)}
									</div>

									<div className="text-gray-600 font-['Whitney_Semibold']">
									{new Date(elem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
									</div>
								</div>
							);
 }

