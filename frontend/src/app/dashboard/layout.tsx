"use client";
import { useState, createContext, PropsWithChildren } from "react";
import SideBar from "../components/SideBar";
import TopRightBar from "../components/TopRightBar";
import { Provider } from "react-redux";
import { socket, socketContext } from "@/app/utils/context/socketContext";
import { store } from "../store";
import { Socket } from "socket.io-client";

export const ChangeContext: React.Context<any> = createContext(null);

type Props = {
	// user?: User;
	// setUser : React.Dispatch<React.SetStateAction<User | undefined>>;
	socket : Socket;
}
function AppWithProviders({children} : PropsWithChildren & Props){

	return (
		<Provider store={store}>
			<socketContext.Provider value={socket}>
				{children}
			</socketContext.Provider>
		</Provider>
	)

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

	return (
		<html lang="en">
			<body>
				<div className="relative h-[100vh] min-h-[850px] py-4 text-white">
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

				
					<ChangeContext.Provider value={changeValues}>
						{children}
					</ChangeContext.Provider>
				</div>
			</body>
		</html>
	);
}
