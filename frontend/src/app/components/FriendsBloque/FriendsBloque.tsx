import { getBloques } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles";
import { BloquesTypes } from "@/app/utils/types";
import { faChevronDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MenuButton2 } from "../Buttons";


const FriendsBloque = () =>{
    const [bloques, setBloques] = useState<BloquesTypes[]>([]);
   


    useEffect(() => {
          getBloques()
            .then(({ data }) => {
                console.log(data);
              setBloques(data);
            })
            .catch((err) => console.log(err));
        
      }, []);

      const handleFunction = (bloques : BloquesTypes) => {
            let ourBloques;
            console.log("bloques");
            ourBloques = bloques.display_name;
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
							<ConversationSideBarItem key={elem.id}>
              <Image src={elem.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />

								<div>
					 				<span  className="ConversationName">{elem.username} {elem.display_name}</span>
					 			</div>
                 <div className=" relative ">
				          <FontAwesomeIcon icon={faEllipsis} className={`text-black transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl }`}
					          onClick={() => handleMenuClick(elem.id)}
				          />
      
                {openMenuId === elem.id &&
                <div className={`absolute  top-10 left-2 h-[120px]  w-[200px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#000000] bg-white font-['Whitney_Semibold'] `}>
					        <MenuButton2 background={"bg-[#d9d9d9]"} value="View Profile" />
					        <MenuButton2 background={"bg-[#BBBBBB]"} value="Send Message" />
                  <MenuButton2 background={"bg-[#EA7F87]"} value="Bloque" />

				        </div>}
            </div> 
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )
}

export default FriendsBloque;