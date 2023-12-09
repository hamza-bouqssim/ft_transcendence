import { AppDispatch } from "@/app/store";
import { fetchAcceptFriendRequestThunk, fetchGetRequestThunk, fetchREfuseFriendRquestThunk } from "@/app/store/requestSlice";
import { getRequest } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles";
import { AcceptRequestParams, RequestTypes, UsersTypes } from "@/app/utils/types";
import { faCheck, faChevronDown, faTimesCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightBarUsers from "../RightBarUsers";
import Image from "next/image";
import { socket, socketContext } from "@/app/utils/context/socketContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SendRequest  = () => {
  
  const ToastFunction = (message : any) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000, 
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };
    const [change, setChange] = useState<{
      menu: boolean;
    }>({
      menu: false,
    });
           
    const dispatch = useDispatch<AppDispatch>();

   
    const { request, status, error } = useSelector((state:any) => state.request);
  
   
    useEffect(() => {
      dispatch(fetchGetRequestThunk())
    }, [dispatch]);
 
   

      const handleFunction = (request : RequestTypes) => {
            let ourRequest;
            ourRequest = request.user.display_name;
            return ourRequest;

      }

      const handleClickAcceptRequest = async (id : string) => {
        try {
         
          await dispatch(fetchAcceptFriendRequestThunk(id));
          ToastFunction("You are accepting the request !");

        } catch (error) {
          ToastFunction(`Error accepting friend request: ${error}`);

        }
      };

      const handleClickRefuseRequest = async (id : string) =>{
        try{
          await dispatch(fetchREfuseFriendRquestThunk(id));
          ToastFunction("You are refusing the request");


        }catch(error){
          ToastFunction(`Error refusing friend request, ${error}`);


        }
      }
      return (

        <Conversation>
        <ToastContainer />
				<ConversationSideBarContainer>
					{request.map(function(elem : RequestTypes){
						return(
							<ConversationSideBarItem key={elem.id}>
                <Image src={elem.user.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
								<div>
					 				<span  className="ConversationName">{elem.user.username} {elem.user.display_name}</span>
					 			</div>
                <div className=" absolute right-5 p-4 ">
                    <FontAwesomeIcon icon={faCheck}  className="text-black  transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl" onClick={() => handleClickAcceptRequest(elem.id)}/>
                    <FontAwesomeIcon icon={faXmark} className="text-black ml-4 transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl" onClick={()=> handleClickRefuseRequest(elem.id)}/>

                </div>
                    


							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )
}

export default SendRequest;