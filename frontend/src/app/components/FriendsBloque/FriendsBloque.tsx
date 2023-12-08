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


const FriendsBloque = () =>{
    const [bloques, setBloques] = useState<BloquesTypes[]>([]);
   


    // useEffect(() => {
    //       getBloques()
    //         .then(({ data }) => {
    //             console.log(data);
    //           setBloques(data);
    //         })
    //         .catch((err) => console.log(err));
        
    //   }, []);
      const dispatch = useDispatch<AppDispatch>();


      // useEffect (() => {
      //   dispatch(fetchBlocksThunk())
      //   .unwrap()
      //   .then(({data}) => {
      //     setBloques(data);
      //   }).catch((err)=>{
      //     console.log(err);
      //   }
      //   );
      // },)

     

   
    const { friendsBlock , status, error } = useSelector((state:any) => state.friendsBlock);
    console.log("friends block-->", friendsBlock );
   
    useEffect(() => {
      dispatch(fetchBlocksThunk())
    }, [dispatch]);
 

      const handleDebloque = async (id: string) => {
      
        try {
          await dispatch(fetchDebloqueUserThunk(id));
            alert("You have Deblocked this friend successfully");
        } catch (error) {
          console.error("Error blocking friend:", error);
            alert("Failed to Deblock the friend. Please try again."); // Show an alert for error handling
        }
      };

      const handleFunction = (Bloques :  BloquesTypes) => {
            let ourBloques;
            ourBloques = Bloques.user.display_name;
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
							<ConversationSideBarItem key={elem.user.id}>
              <Image src={elem.user.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />

							
					 				<span  className="ConversationName">{handleFunction(elem)}</span>
					 			
                 

                  <FontAwesomeIcon icon={faUserMinus} onClick={()=>{handleDebloque(elem.user.id)}} className={`text-black  cursor-pointer text-xl duration-500 ease-in-out hover:text-[--pink-color] absolute right-5 p-4  rounded-full  `}/>      
                
         
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )
}

export default FriendsBloque;