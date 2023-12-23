"use client";

import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { Socket, io } from "socket.io-client";

const gameSocketContext = createContext<Socket | null>(null);

const GameSocketProvider = ({ children }: { children: ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const s = io("http://10.12.2.12:8000/game", {
			// transports: ["websocket", "polling", "flashsocket"],
			// autoConnect: false,
			withCredentials: true,
		});
		setSocket(s);
	}, []);

	useEffect(() => {
		if (!socket) return;

		// socket.connect();
		console.log("connect!");

		return () => {
			socket.disconnect();
			console.log("disconnect!");
		};
	}, [socket]);

	return (
		<gameSocketContext.Provider value={socket}>
			{socket && children}
		</gameSocketContext.Provider>
	);
};

const useGameSocket = () => {
	const socket = useContext(gameSocketContext);
	if (!socket)
		throw new Error("You must use useGameSocket Whithin GameSocketProvider");
	return socket;
};

export { GameSocketProvider, useGameSocket };
