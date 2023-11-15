"use client";

import CoversationSideBar from "@/app/components/CoversationSideBar/page";
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
import { AppDispatch, store } from "@/app/store";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import {
	fetchConversationThunk,
	fetchMessagesThunk,
} from "@/app/store/conversationSlice";

type Props = {
	user?: User;
	setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
	socket: Socket;
};

function AppWithProviders({
	children,
	user,
	setUser,
}: PropsWithChildren & Props) {
	return (
		<ReduxProvider store={store}>
			<socketContext.Provider value={socket}>{children}</socketContext.Provider>
		</ReduxProvider>
	);
}

const ConversationChannelPage = () => {
	const socket = useContext(socketContext);
	const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
	});
	const [user, setUser] = useState<User | undefined>();
	const [loading, setLoading] = useState<boolean>(false);
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
	}, []);
	const [conversation, setConversation] = useState<ConversationTypes[]>([]);
	const dispatch = useDispatch<AppDispatch>();
	// useEffect(() => {
	// 	dispatch(fetchConversationThunk())
	// 	.unwrap()
	// 	.then(({data}) => {
	// 		setConversation(data);
	// 	}).catch((err)=>{
	// 		console.log(err);
	// 	}
	// 	);
	// })

	useEffect(() => {
		getConversation()
			.then(({ data }) => {
				setConversation(data);
			})
			.catch((err) => console.log(err));
	}, [conversation]);

	const { id } = useParams();
	const [message, setMessage] = useState<messageTypes[]>([]);

	useEffect(() => {
		if (typeof id === "string") {
			const conversationId = id;
			getConversationMessage(conversationId)
				.then(({ data }) => {
					setMessage(data);
				})
				.catch((err) => console.log(err));
		}
	}, [id]);

	useEffect(() => {
		const conversationId = id;
		dispatch(fetchMessagesThunk(conversationId))
			.unwrap()
			.then(({ data }) => {
				setMessage(data);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	// for sockets
	useEffect(() => {
		socket.on("connected", () => console.log("socket here connected"));
		socket.on("onMessage", (payload: messageEventPayload) => {
			console.log("message received");

			console.log(payload);
			setMessage((prev) => [payload, ...prev]);
		});
		return () => {
			socket.off("connected");
			socket.off("onMessage");
		};
	});
	return (
		<div className=" flex h-screen  xl:container xl:mx-auto">
			<div className="hidden h-full w-[35%] p-10 pl-5 pr-2 xl:block ">
				<CoversationSideBar conversations={conversation} />
			</div>
			<div className="w-full bg-white  xl:m-10 xl:ml-2 xl:mr-10 xl:mt-32  xl:w-[65%] xl:rounded-[20px]">
				<MessagePanel messages={message}></MessagePanel>
			</div>
		</div>
	);
};

export default ConversationChannelPage;
