import { getBloques } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles";
import { BloquesTypes, User } from "@/app/utils/types";
import { faChevronDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MenuButton2 } from "../Buttons";
import { fetchBlocksThunk } from "@/app/store/requestSlice";
import { useDispatch } from "react-redux";
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


      useEffect (() => {
        dispatch(fetchBlocksThunk())
        .unwrap()
        .then(({data}) => {
          // console.log("data here-->",data);
          setBloques(data);
        }).catch((err)=>{
          console.log(err);
        }
        );
      },)

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
					{bloques.map(function(elem){
						return(
							<ConversationSideBarItem key={elem.user.id}>
              <Image src={elem.user.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />

							
					 				<span  className="ConversationName">{handleFunction(elem)}</span>
					 			
                 <div className=" relative ">
				          <FontAwesomeIcon icon={faEllipsis} className={`text-black transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl }`}
					          onClick={() => handleMenuClick(elem.user.id)}
				          />
      
                
            </div> 
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )
}

export default FriendsBloque;