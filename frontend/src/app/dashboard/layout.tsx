"use client";
import {
	useState,
	
	PropsWithChildren,
	useEffect
} from "react";
import { io, Socket } from "socket.io-client";
import SideBar from "../components/SideBar";
import TopRightBar from "../components/TopRightBar";
import { Provider } from "react-redux";
import { socketContext } from "../utils/context/socketContext";
import { store } from "../store";
import { usePathname } from "next/navigation";
import { ConversationTypes, User } from "../utils/types";
import ProviderOnSocket from "./ProviderOnSocket";
import { ChangeContext } from "./game/utils/data";
import AuthCheck from "../utils/AuthCheck";


function AppWithProviders({ children }: PropsWithChildren ) {
	const [channel, setChannel] = useState<ConversationTypes | null>(null); // Initial value
	const [oldId, setOldId] = useState<string>("");
	const [Userdata, setUserdata] = useState<User | null>(null);
	const [isMessage, setIsMessage] = useState<boolean>(false);
	const [socket, setSocket] = useState<Socket|null>(null)
	
	const updateChannel = (newAddress: ConversationTypes | null) => {
		setChannel(newAddress);
	};

	useEffect(() => {
		const _socket = io("http://localhost:8000/chat", {
			withCredentials: true,
		});
		setSocket(_socket);

		return () => { _socket.disconnect()}
	}, [])

	if (!socket) {
		return <></>
	}
	return (
		<Provider store={store}>
			<socketContext.Provider
				value={{
					socket,
					updateChannel,
					channel,
					oldId,
					setOldId,
					Userdata,
					setUserdata,
					isMessage,
					setIsMessage
				}}
			>
				{children}
			</socketContext.Provider>
		</Provider>
	);
}
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
	});

	const changeValues = { change, setChange };
	const pathName = usePathname();

	const shouldHide = (): boolean => {
		const validPaths = [
			`/bot-game/maps/0`,
			`/bot-game/maps/1`,
			`/bot-game/maps/2`,
			`online-game/match-making/0/`,
			`online-game/match-making/1/`,
			`online-game/match-making/2/`,
		];

		return validPaths.some((path) => pathName.includes(path));
	};


const socket = io("http://localhost:8000/chat", {
	withCredentials: true,
});

	return (
		<div >
			
			<AuthCheck>
				<div
					className={`flex h-screen w-full text-white`}
					// style={{ minHeight: `${minHeight}px` }}
					>
					<AppWithProviders>
						{shouldHide() ? null : <SideBar />}
						{shouldHide() ? null : <TopRightBar />}

						<ChangeContext.Provider value={changeValues}>
							<ProviderOnSocket></ProviderOnSocket>
							<div
								// ref={getChildrenSize}
								className={`h-full w-full`}
								// style={{ minHeight: `${minHeight}px` }}
							>
								{children}
							</div>
						</ChangeContext.Provider>
					</AppWithProviders>
				</div>
			</AuthCheck>
			
		</div>
	);
}
