import { AppDispatch } from "@/app/store";
import {
	fetchAcceptFriendRequestThunk,
	fetchGetRequestThunk,
} from "@/app/store/requestSlice";
import { getRequest } from "@/app/utils/api";
import {
	Conversation,
	ConversationSideBarContainer,
	ConversationSideBarItem,
} from "@/app/utils/styles";
import {
	AcceptRequestParams,
	RequestTypes,
	UsersTypes,
} from "@/app/utils/types";
import {
	faCheck,
	faChevronDown,
	faTimesCircle,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import RightBarUsers from "../RightBarUsers";
import Image from "next/image";

const SendRequest = () => {
	const [request, setrequest] = useState<RequestTypes[]>([]);
	const [change, setChange] = useState<{
		menu: boolean;
	}>({
		menu: false,
	});

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchGetRequestThunk())
			.unwrap()
			.then(({ data }) => {
				setrequest(data);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	const handleFunction = (request: RequestTypes) => {
		let ourRequest;

		ourRequest = request.user.display_name;
		return ourRequest;
	};

	const handleClickAcceptRequest = async (id: string) => {
		console.log("id request-->", id);
		try {
			await dispatch(fetchAcceptFriendRequestThunk(id));
			alert("You are accepting the request !");
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};
	return (
		<Conversation>
			<ConversationSideBarContainer>
				{request.map(function (elem) {
					return (
						<ConversationSideBarItem key={elem.id}>
							<Image
								src={elem.user.avatar_url}
								className="h-14 w-14 rounded-[50%] bg-black "
								alt="Description of the image"
								width={60}
								height={60}
							/>
							<div>
								<span className="ConversationName">
									{elem.user.username} {elem.user.display_name}
								</span>
							</div>
							<FontAwesomeIcon
								icon={faCheck}
								className="text-black"
								onClick={() => handleClickAcceptRequest(elem.id)}
							/>
							<FontAwesomeIcon icon={faXmark} className="text-black" />
						</ConversationSideBarItem>
					);
				})}
			</ConversationSideBarContainer>
		</Conversation>
	);
};

      const handleClickAcceptRequest = async (id : string) => {
        try {
          await dispatch(fetchAcceptFriendRequestThunk(id));
          alert("You are accepting the request !")
        } catch (error) {
          console.error("Error accepting friend request:", error);
        }
      };
      return (

        <Conversation>

				<ConversationSideBarContainer>
					{request.map(function(elem){
						return(
							<ConversationSideBarItem key={elem.id}>
                <Image src={elem.user.avatar_url} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
								<div>
					 				<span  className="ConversationName">{elem.user.username} {elem.user.display_name}</span>
					 			</div>
                    <FontAwesomeIcon icon={faCheck}  className="text-black" onClick={() => handleClickAcceptRequest(elem.id)}/>
                    <FontAwesomeIcon icon={faXmark} className="text-black"/>


							</ConversationSideBarItem>
								
						)
					}) }
				</ConversationSideBarContainer>
			</Conversation>
           
    )
}

export default SendRequest;
