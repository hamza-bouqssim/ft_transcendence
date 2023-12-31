"use client";
import {ConversationTypes,} from "../../utils/types";
import { useState, useEffect } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {fetchConversationThunk,} from "../../store/conversationSlice";
import { IoMdAdd } from "react-icons/io";
import CreateConversationModal from "../modals/CreateConversationModal";
import "react-toastify/dist/ReactToastify.css";
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

							<ListChat key={elem.id} elem={elem}></ListChat>

						))}
					</div>
				</div>
			)}
		</>
	);
};

export default ChatComponnent;
