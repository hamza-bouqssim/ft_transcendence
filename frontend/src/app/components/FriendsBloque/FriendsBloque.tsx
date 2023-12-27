import { getBloques } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles";
import { BloquesTypes, User } from "@/app/utils/types";
import { faChevronDown, faEllipsis, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MenuButton2 } from "../Buttons";
import { fetchBlocksThunk, fetchDebloqueUserThunk } from "@/app/store/blockSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FriendsBloque = () =>{
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

    const [bloques, setBloques] = useState<BloquesTypes[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const { friendsBlock , status, error } = useSelector((state:any) => state.friendsBlock);
   
    useEffect(() => {
      
      dispatch(fetchBlocksThunk())
    }, [dispatch]);
 

      const handleDebloque = async (id: string) => {
      
        try {
          await dispatch(fetchDebloqueUserThunk(id));
            ToastSuccess("You have Deblocked this friend successfully");

        } catch (error) {
          ToastError("Failed to Deblock the friend. Please try again.");

        }
      };

      const handleFunction = (Bloques :  BloquesTypes) => {
            let ourBloques;
            ourBloques = Bloques.display_name;
            return ourBloques;

      }
      const [openMenuId, setOpenMenuId] = useState<string | null>(null);

      const handleMenuClick = (friendId: string) => {
        setOpenMenuId(openMenuId === friendId ? null : friendId);
    };
    
    return (
        <Conversation>
         
				<ConversationSideBarContainer>
					{friendsBlock.map(function(elem : BloquesTypes){
						return(
							<ConversationSideBarItem key={elem.id}>
              <Image src={elem.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />

							
					 				<span  className="ConversationName">{handleFunction(elem)}</span>
					 			
                 

                  <FontAwesomeIcon icon={faUserMinus} onClick={()=>{handleDebloque(elem.id)}} className={`text-black  cursor-pointer text-xl duration-500 ease-in-out hover:text-[--pink-color] absolute right-5 p-4  rounded-full  `}/>      
                
         
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )
}

export default FriendsBloque;