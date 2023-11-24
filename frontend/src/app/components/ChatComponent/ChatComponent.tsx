"use client";
import {
	Conversation,
	ConversationSideBarContainer,
	ConversationSideBarItem,
} from "@/app/utils/styles";
import { ConversationTypes, User } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { FC, useState, useEffect } from "react";
import "./style.css";
import { getAuthUser, getConversation } from "@/app/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchConversationThunk } from "@/app/store/conversationSlice";
import { formatRelative } from "date-fns";
import { IoMdAdd } from "react-icons/io";
import { CreateConversationModal } from "../modals/CreateConversationModal";
type Props = {
	conversations: ConversationTypes[];
	user: User;
};

const ChatComponnent = () => {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const [user, setUser] = useState<User | undefined>();
	const [loading, setLoading] = useState<boolean>(false);
	const controller = new AbortController();
	const [show, setShow] = useState<any>(false);

	// const conversations = useSelector((state: RootState) => state.conversation.conversations
	//   );

	const [conversation, setConversation] = useState<ConversationTypes[]>([]);

	useEffect(() => {
		getConversation()
			.then(({ data }) => {
				setConversation(data);
			})
			.catch((err) => console.log(err));
	}, [conversation]);

	useEffect(() => {
		setLoading(true);
		getAuthUser()
			.then(({ data }) => {
				setUser(data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	}, [user]);

	const getDisplayUser = (conversation: ConversationTypes) => {
		let test;
		const userId = user?.display_name;

		if (conversation.sender?.display_name != userId) {
			test = conversation.sender;
		} else if (conversation.sender?.display_name == userId) {
			test = conversation.recipient;
		}

		return test;
	};

	const getDisplayLastMessage = (conversation: ConversationTypes) => {
		let lastMessage = null;
		lastMessage = conversation.lastMessage;
		if (lastMessage == null) return null;
		else return lastMessage.content;
	};

	return (
		<div className="my-10  h-[calc(100%-200px)] overflow-auto text-black ">
			{show && <CreateConversationModal setShow={setShow} />}

			<div className="flex gap-px border-2 border-solid  p-2 px-20 ">
				<h1 className=" p-2 text-lg font-bold  text-blue-500">
					Private Messages
				</h1>
				<button
					onClick={() => {
						setShow(!show);
					}}
					className=" absolute right-5 rounded-full bg-[#fc7785] p-4"
				>
					<IoMdAdd />
				</button>
			</div>
			<div className="p-2">
				{conversation.map(function (elem) {
					function handleClick() {
						router.push(`/dashboard/chat/${elem.id}`);
					}
					return (
						<div
							key={elem.id}
							className="flex cursor-pointer items-start justify-between rounded-lg px-2 py-3 hover:bg-[#F2F3FD]"
						>
							<div className="flex items-center justify-start" key={elem.id}>
								<Image
									src={elem.recipient.avatar_url}
									className="h-10 w-10 rounded-[50%] bg-black min-[1750px]:h-12 min-[1750px]:w-12"
									alt="Description of the image"
									width={60}
									height={50}
								/>
								<div className="ml-4">
									<span onClick={handleClick} className="ConversationName">
										{getDisplayUser(elem)?.username}{" "}
										{getDisplayUser(elem)?.display_name}
									</span>
									<span className="lastName">
										{getDisplayLastMessage(elem)}
									</span>
								</div>
							</div>
							<div className="text-black">
								{formatRelative(new Date(elem.createdAt), new Date())}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ChatComponnent;
