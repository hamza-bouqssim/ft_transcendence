"use client";
import PlayModeCard from "@/app/components/PlayModeCard";
<<<<<<< HEAD
// import { SocketContext, socket } from "./SocketContext";
=======
>>>>>>> origin/Samer_V1

const PlayMode = () => {
	return (
		<div className="relative h-[100vh] min-h-[780px] w-full">
			<div className="glassmorphism absolute left-[50%] top-[50%] m-auto flex w-full max-w-[800px] -translate-x-[50%] -translate-y-[50%] flex-col flex-wrap items-center justify-evenly gap-4 p-6 min-[580px]:flex-row md:justify-center md:gap-7 min-[940px]:gap-9">
				<PlayModeCard flag="bot" />
				<div className="font-['Whitney_Bold'] text-xl min-[580px]:text-2xl min-[940px]:text-3xl">
					OR
				</div>
<<<<<<< HEAD
				{/* <SocketContext.Provider value={socket}> */}
				<PlayModeCard flag="online" />
				{/* </SocketContext.Provider> */}
=======
				<PlayModeCard flag="online" />
>>>>>>> origin/Samer_V1
			</div>
		</div>
	);
};

export default PlayMode;
