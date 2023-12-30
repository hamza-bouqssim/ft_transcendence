"use client";
import {
	Conversation,
	ConversationSideBarContainer,
	ConversationSideBarItem,
	IngameStyling,
	OflineStyling,
	OnlineStyling,
} from "../../utils/styles";
import {
	ConversationTypes,
	User,
	UsersType,
	UsersTypes,
	messageTypes,
} from "../../utils/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { FC, useState, useEffect, useContext } from "react";
import "./style.css";
import {
	getAuthUser,
	getConversation,
	getUnreadMessages,
} from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
	fetchConversationThunk,
	fetchDeleteConversation,
} from "../../store/conversationSlice";
import { formatRelative } from "date-fns";
import { IoMdAdd } from "react-icons/io";
import CreateConversationModal from "../modals/CreateConversationModal";
import { socketContext } from "../../utils/context/socketContext";
import { fetchMessagesThunk } from "../../store/messageSlice";
import { fetchAuthUser } from "../../store/AuthSlice";
import { fetchMessagesUnreadThunk } from "../../store/UnreadMessages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import {
	fetchBlockFriendThunk,
	fetchDebloqueUserThunk,
} from "../../store/blockSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUsersThunk } from "@/app/store/usersSlice";
import { LucideScatterChart } from "lucide-react";
import { ListChat } from "./ListChat";



const ChatComponnent = () => {


	const [show, setShow] = useState<any>(false);
    const dispatch = useDispatch<AppDispatch>();


	const { conversations, status, error } = useSelector(
		(state: any) => state.conversations,
	);
	useEffect(() => {
	
		dispatch(fetchConversationThunk());
	
	}, [dispatch]);

	console.log("conv -->", conversations);
	

	return (
		<>
			{show && <CreateConversationModal setShow={setShow} />}

			{!show && (
				<div className="my-10 h-[calc(100%-200px)] overflow-auto text-black ">
					<div className="flex gap-px border-2 border-solid p-2 px-20">
						<h1 className="p-2 text-lg font-bold text-blue-500">
							Private Messages
						</h1>
						<button
							onClick={() => setShow(!show)}
							className="absolute right-5 rounded-full bg-[#fc7785] p-4"
						>
							<IoMdAdd className="text-white" />
						</button>
					</div>

					<div className="p-2">
						{conversations && conversations.map((elem: ConversationTypes) => (

							<ListChat elem={elem}></ListChat>

						))}
					</div>
				</div>
			)}
		</>
	);
};

export default ChatComponnent;
