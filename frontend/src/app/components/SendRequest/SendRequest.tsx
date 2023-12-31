import { AppDispatch } from "../../store";
import { fetchAcceptFriendRequestThunk, fetchGetRequestThunk, fetchREfuseFriendRquestThunk } from "../../store/requestSlice";
import { getRequest } from "../../utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "../../utils/styles";
import { AcceptRequestParams, RequestTypes, UsersTypes } from "../../utils/types";
import { faCheck, faChevronDown, faTimesCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightBarUsers from "../RightBarUsers";
import Image from "next/image";
import { socket, socketContext } from "../../utils/context/socketContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SendRequest  = () => {
  
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
           
    const dispatch = useDispatch<AppDispatch>();
   
    const { request, status, error } = useSelector((state:any) => state.request);
  
    useEffect(() => {
      

      dispatch(fetchGetRequestThunk());
    }, [dispatch]);
 
   

      const handleFunction = (request : RequestTypes) => {
            let ourRequest;
            ourRequest = request.user.display_name;
            return ourRequest;

      }

      const handleClickAcceptRequest = async (id : string) => {
        try {
         
          await dispatch(fetchAcceptFriendRequestThunk(id));
          ToastSuccess("You are accepting the request !");

        } catch (error) {
          ToastError(`Error accepting friend request: ${error}`);

        }
      };

      const handleClickRefuseRequest = async (id : string) =>{
        
        try{
          await dispatch(fetchREfuseFriendRquestThunk(id));
          ToastSuccess("You are refusing the request");

        }catch(error){
          ToastError(`Error refusing friend request, ${error}`);
        }
      }
      const getDisplayUser = (friend : UsersTypes) => {
		
        const truncatedDisplayName =
          friend.display_name.length > 10
            ? `${friend.display_name.substring(0, 10)}...`
            : friend.display_name;
    
        return {
          ...friend,
          display_name: truncatedDisplayName,
        };
      };
      return (

        <Conversation>
         
				<ConversationSideBarContainer>
					{request.map(function(elem : RequestTypes){
						return(
							<ConversationSideBarItem key={elem.id}>
                <Image src={elem.user.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
								<div>
					 				<span  className="ConversationName">{getDisplayUser(elem.user).display_name}</span>
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