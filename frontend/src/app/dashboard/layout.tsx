"use client";
import {
	useState,
	createContext,
	PropsWithChildren,
	useRef,
	useEffect,
} from "react";
import SideBar from "../components/SideBar";
import TopRightBar from "../components/TopRightBar";
import { Provider } from "react-redux";
import { socket, socketContext } from "../utils/context/socketContext";
import { store } from "../store";
import { Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import { ConversationTypes, GroupChannel, User } from "../utils/types";

export const SideBarContext: any = createContext<any>(null);
export const ChangeContext: React.Context<any> = createContext(null);
type Props = {
	// user?: User;
	// setUser : React.Dispatch<React.SetStateAction<User | undefined>>;
	socket: Socket;
};
interface Room {
	id: string;
	name: string;
	Privacy: string;
	password: string;
	picture: string;
	createdAt: string;
	updatedAt: string;
	members: {
		isAdmin: boolean;
	};
}

function AppWithProviders({ children }: PropsWithChildren & Props) {
	const [channel, setChannel] = useState<
		GroupChannel | ConversationTypes | null
	>(null); // Initial value
	const [oldId, setOldId] = useState(null);
	const [Userdata, setUserdata] = useState<User | null>(null);
	const updateChannel = (
		newAddress: GroupChannel | ConversationTypes | null,
	) => {
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

	const getChildrenSize = useRef<any>(null);

	const [minHeight, setMinHeight] = useState<any>(1320);

	useEffect(() => {
		setMinHeight(getChildrenSize.current?.children[0]?.clientHeight);
		const handleResizeWindow = () =>
			setMinHeight(getChildrenSize.current?.children[0]?.clientHeight);

		window.addEventListener("resize", handleResizeWindow);

		return () => window.removeEventListener("resize", handleResizeWindow);
	}, [getChildrenSize.current?.children[0]?.clientHeight, pathName]);

	return (
		<html lang="en">
			<body>
				<div
					className={`flex h-screen w-full text-white`}
					style={{ minHeight: `${minHeight + 170}px` }}
				>
					<AppWithProviders socket={socket}>
						{shouldHide() ? null : <SideBar />}
						{shouldHide() ? null : (
							<TopRightBar
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
						)}

						<ChangeContext.Provider value={changeValues}>
							<div
								ref={getChildrenSize}
								className={`min-h-[${minHeight + 170}px] h-full w-full`}
							>
								{children}
							</div>
						</ChangeContext.Provider>
					</AppWithProviders>
				</div>
			</body>
		</html>
	);
}
