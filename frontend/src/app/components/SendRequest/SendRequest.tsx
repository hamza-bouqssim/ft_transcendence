import { getRequest } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles";
import { RequestTypes } from "@/app/utils/types";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const SendRequest  = () => {
    const [request, setrequest] = useState<RequestTypes[]>([]);
   


    useEffect(() => {
          getRequest()
            .then(({ data }) => {
                // console.log("all friends"); 
                // console.log(data);
              setrequest(data);
            })
            .catch((err) => console.log(err));
        
      }, []);

      const handleFunction = (request : RequestTypes) => {
        console.log("pending");
            let ourRequest;

            ourRequest = request.user.display_name;
            return ourRequest;

      }

      return (
        <Conversation>

				<ConversationSideBarContainer>
					{request.map(function(elem){
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

export default SendRequest;