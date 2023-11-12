import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const PlayMode = () => {
	return (
		<div className="glassmorphism absolute left-[50%] top-[50%] flex h-[500px] w-[950px] -translate-x-[50%] -translate-y-[50%] items-center justify-around">
			<div className="flex h-[80%] w-[380px] flex-col items-center justify-evenly gap-7 rounded-3xl bg-red-700 bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] py-5">
				<div className="h-full w-[80%]">
					<FontAwesomeIcon icon={faRobot} className="h-full w-full" />
				</div>
				<Link
					href={"/dashboard/game/bot_game"}
					className="w-[80%] rounded-3xl bg-[--pink-color] px-5 py-4 text-center font-['Whitney_Bold'] text-2xl ease-in-out hover:bg-[--purple-color]"
				>
					Play With Bot
				</Link>
			</div>
			<div className="font-['Whitney_Bold'] text-5xl">OR</div>
			<div className="flex h-[80%] w-[380px] flex-col items-center justify-evenly gap-7 rounded-3xl bg-red-700 bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] py-5">
				<div className="h-full w-[68%]">
					<FontAwesomeIcon icon={faEarthAmericas} className="h-full w-full" />
				</div>
				<Link
					href={"/dashboard/game/online_game"}
					className="w-[80%] rounded-3xl bg-[--pink-color] px-5 py-4 text-center font-['Whitney_Bold'] text-2xl ease-in-out hover:bg-[--purple-color]"
				>
					Online Game
				</Link>
			</div>
		</div>
	);
};

export default PlayMode;
