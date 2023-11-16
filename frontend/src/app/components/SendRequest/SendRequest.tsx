import { AppDispatch } from "@/app/store";
import { fetchGetRequestThunk } from "@/app/store/requestSlice";
import { getRequest } from "@/app/utils/api";
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from "@/app/utils/styles";
import { RequestTypes } from "@/app/utils/types";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import RightBarUsers from "../RightBarUsers";

const SendRequest  = () => {
    const [request, setrequest] = useState<RequestTypes[]>([]);
    const [change, setChange] = useState<{
      sideBar: boolean;
      chatBox: boolean;
      menu: boolean;
    }>({
      sideBar: false,
      chatBox: false,
      menu: false,
    });
           
    const dispatch = useDispatch<AppDispatch>();

    useEffect (() => {
      dispatch(fetchGetRequestThunk())
      .unwrap()
      .then(({data}) => {
        setrequest(data);
      }).catch((err)=>{
        console.log(err);
      }
      );
    },)

    // useEffect(() => {
    //       getRequest()
    //         .then(({ data }) => {
    //           setrequest(data);
    //         })
    //         .catch((err) => console.log(err));
        
    //   }, []);

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
                            {/* <FontAwesomeIcon icon={faChevronDown} className="menu-icon text-black" /> */}
                    <RightBarUsers
						          menu={change.menu}
						          onClick={() =>
							        setChange({
								        ...change,
								        sideBar: false,
								        chatBox: false,
								        menu: !change.menu,
							})
						}
					/>
							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )
}

export default SendRequest;