"use client";

import CoversationSideBar from "@/app/components/CoversationSideBar/ConversationSideBar";
import { ConversationChannelStyle, Page } from "@/app/utils/styles";
import { useContext, useEffect, useState, PropsWithChildren } from "react";
import {
	ConversationTypes,
	User,
	messageEventPayload,
	messageTypes,
} from "@/app/utils/types";
import {
	getAuthUser,
	getConversation,
	getConversationMessage,
} from "@/app/utils/api";
import { useParams } from "next/navigation";
import MessagePanel from "@/app/components/messages/MessagePanel";
import TopRightBar from "@/app/components/TopRightBar";
import SideBar from "@/app/components/SideBar";
import { socket, socketContext } from "@/app/utils/context/socketContext";
import { Socket } from "socket.io-client";
import { AppDispatch, RootState, store } from "@/app/store";
import {
	Provider as ReduxProvider,
	useDispatch,
	useSelector,
} from "react-redux";
import { fetchMessagesThunk } from "@/app/store/messageSlice";
import { fetchConversationThunk } from "@/app/store/conversationSlice";
import { getAllRooms } from "@/app/store/roomsSlice";

const ConversationChannelPage = () => {
	const { channel, updateChannel } = useContext(socketContext);
	const socket = useContext(socketContext).socket;
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		socket.on("notification", (payload: any) => {
			dispatch(getAllRooms());
		});
		socket.on("delete", (payload: any) => {
			dispatch(getAllRooms());
			updateChannel("");
		});
		socket.on("update", (payload: any) => {
			dispatch(getAllRooms());
			updateChannel("");
		});
		return () => {
			socket.off("notification");
			socket.off("delete");
			socket.off("update");
		};
	}, [socket]);
	return (
		<div className=" flex h-screen  xl:container xl:mx-auto">
			<div
				className={`xl"pl-5  h-full xl:p-10 xl:pr-2 ${
					!channel
						? "block w-full xl:w-[35%]  "
						: "hidden xl:block  xl:w-[35%] "
				}`}
			>
				<CoversationSideBar />
			</div>
			{channel ? (
				<div className="w-full bg-white  xl:m-10 xl:ml-2 xl:mr-10 xl:mt-32  xl:w-[65%] xl:rounded-[20px]">
					<MessagePanel></MessagePanel>
				</div>
			) : (
				<div className="hidden w-full  items-center justify-center xl:my-10   xl:ml-2 xl:mr-10 xl:mt-32 xl:flex xl:w-[65%]">
					Invit friend to new chat rome
				</div>
			)}
		</div>
	);
};

export default ConversationChannelPage;
