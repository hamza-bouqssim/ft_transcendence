import { getBloques } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles";
import { BloquesTypes } from "@/app/utils/types";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";


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
    return (
        <Conversation>

				<ConversationSideBarContainer>
					{bloques.map(function(elem){
						return(
							<ConversationSideBarItem key={elem.id}>
								<div className="avatar"></div>
								<div>
					 				<span  className="ConversationName">{handleFunction(elem)}</span>
					 			</div>
                            <FontAwesomeIcon icon={faChevronDown} className="menu-icon text-black" />
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )
}

export default FriendsBloque;