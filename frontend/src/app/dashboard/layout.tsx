"use client";
import {
	useState,
	
	PropsWithChildren,

} from "react";
import SideBar from "../components/SideBar";
import TopRightBar from "../components/TopRightBar";
import { Provider } from "react-redux";
import { socket, socketContext } from "../utils/context/socketContext";
import { store } from "../store";
import { Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import { ConversationTypes, User } from "../utils/types";
import { Group } from "three";
import ProviderOnSocket from "./ProviderOnSocket";
import { ToastContainer, toast } from "react-toastify";
import { ChangeContext } from "./game/utils/data";
import AuthCheck from "../utils/AuthCheck";


type Props = {

	socket: Socket;
};

function AppWithProviders({ children }: PropsWithChildren & Props) {
	const [channel, setChannel] = useState<ConversationTypes | null>(null); // Initial value
	const [oldId, setOldId] = useState<string>("");
	const [Userdata, setUserdata] = useState<User | null>(null);
	const [isMessage, setIsMessage] = useState<boolean>(false);
	const updateChannel = (newAddress: ConversationTypes | null) => {
		setChannel(newAddress);
	};
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



	return (
		<div lang="en">
			<AuthCheck>
				<div
					className={`flex h-screen w-full text-white`}
					// style={{ minHeight: `${minHeight}px` }}
					>
					<AppWithProviders socket={socket}>
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
