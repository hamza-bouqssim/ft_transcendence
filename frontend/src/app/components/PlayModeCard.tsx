"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useContext, useState } from "react";
import { SocketContext } from "../dashboard/game/SocketContext";

const PlayModeCard = ({ flag, onClick }: any) => {
	const socket = useContext<any>(SocketContext);

	// const handleClick = (
	// 	e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	// ): void => {
	// 	if (flag === "online") {
	// 		console.log(socket);
	// 		// e.preventDefault();
	// 		alert("prevented!");
	// 		socket.emit("join-game", {
	// 			socketId: socket.id,
	// 		});
	// 		socket.on("join-queue", (data: any) => {
	// 			alert(data.content);
	// 		});
	// 	}
	// };

	return (
		<div className="flex h-[80%] w-[200px] flex-col items-center justify-evenly gap-5 rounded-3xl  bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] py-5 min-[940px]:w-[300px] min-[940px]:gap-4">
			<div className={`h-full ${flag === "bot" ? "w-[75%]" : "w-[60%]"}`}>
				<FontAwesomeIcon
					icon={flag === "bot" ? faRobot : faEarthAmericas}
					className="h-full w-full"
				/>
			</div>
			<Link
				// href={
				// 	flag === "bot"
				// 		? "/dashboard/game/bot_game"
				// 		: "/dashboard/game/online_game"
				// 	"#"
				// }
				href={"/dashboard/game/choose_map"}
				className="w-[80%] rounded-3xl bg-[--pink-color] py-3 text-center font-['Whitney_Bold'] text-sm duration-100 ease-in-out hover:bg-[--purple-color] min-[940px]:py-4 min-[940px]:text-xl"
			>
				{flag === "bot" ? "Play With Bot" : "Online Game"}
			</Link>
		</div>
	);
};

export default PlayModeCard;
