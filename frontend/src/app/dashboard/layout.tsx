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
import { ConversationTypes,  User } from "../utils/types";
import { Group } from "three";
import ProviderOnSocket from "./ProviderOnSocket.tsx";
import { ToastContainer, toast } from 'react-toastify';
import { ChangeContext } from "./game/utils/data";

// export const SideBarContext: any = createContext<any>(null);
// export const ChangeContext: React.Context<any> = createContext(null);
// type Props = {
// 	// user?: User;
// 	// setUser : React.Dispatch<React.SetStateAction<User | undefined>>;
// 	socket: Socket;
// };

type Props = {
	// user?: User;
	// setUser : React.Dispatch<React.SetStateAction<User | undefined>>;
	socket: Socket;
};

function AppWithProviders({ children }: PropsWithChildren & Props) {
	const [channel, setChannel] = useState<ConversationTypes |null>(null); // Initial value
	const[oldId,setOldId] = useState<string>("");
	const[Userdata,setUserdata] = useState<User |  null>(null);
	const updateChannel = (newAddress: ConversationTypes| null) => {
	  setChannel(newAddress);
	};
	return (
		<Provider store={store} >
			<socketContext.Provider 
				value={{socket,
						updateChannel,
						channel,
						oldId,
						setOldId,
						Userdata,
						setUserdata
					}}>{children}</socketContext.Provider>
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
			<div className="flex h-screen w-full text-white">
					<AppWithProviders socket={socket}>
					{(pathName.endsWith("/online_game") || pathName.endsWith("/bot_game")) ? null : (
						<SideBar
							sideBar={change.sideBar}
							onClick={() =>
								setChange({
									...change,
									sideBar: !change.sideBar,
									chatBox: false,
									menu: false,
								})
							}
						/>
					)}

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

					{/* <div className="mt-[70px] h-[85%] w-full lg:flex lg:items-center lg:justify-evenly min-[1750px]:ml-72 min-[1750px]:mt-[90px] min-[1750px]:w-[86%]">
						{children}
					</div> */}

						<ChangeContext.Provider value={changeValues}>
							<ProviderOnSocket></ProviderOnSocket>
							<div className="h-full w-full">{children}</div>
						</ChangeContext.Provider>
					</AppWithProviders>
				</div>
			</body>
		</html>
	);
}
