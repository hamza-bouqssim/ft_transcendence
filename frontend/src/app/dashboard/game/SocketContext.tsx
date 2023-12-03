"use client";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { createContext } from "react";

export const socket = io("http://localhost:8000/game", {
	withCredentials: true,
});
export const SocketContext = createContext(socket);

const StartGame = async () => {
	let res = 0;

	socket.on("startGame", async (data: any) => {
		const gameId = data.idGame;
		console.log("Game ID: ", gameId);
		// router.push(`./online-game/${data.idGame}`);
		res = 1;
	});
	return res;
};

export default StartGame;
