import React, { useContext, useState, useEffect } from "react";
import InviteField from "./InviteField";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RankedFriends from "./RankedFriends";
import Image from "next/image";
import { socketContext } from "../utils/context/socketContext";
import { getRanking, getUserInfos } from "../utils/api";
import { PlayerType, UserInfoType } from "../dashboard/Imports";



const RankingUserSwitch = ({
	userId,
	userInfo,
	_switch,
}: {
	userId: string;
	userInfo?: UserInfoType;
	_switch: boolean;
}) => {
	const [showRank, setShowRank] = useState(false);
	const [showFriends, setShowFriends] = useState(false);
	const [showSendReqCompo, setShowSendReqCompo] = useState(false);
	const [clickedButton, setClickedButton] = useState("user");
	const [showuser, setShowUser] = useState(true);
	console.log("useState")
	const _showRank = () => {
		setShowRank(true);
		setShowFriends(false);
		setShowSendReqCompo(false);
		setShowUser(false);
		setClickedButton("rank");
	};

	const _showUser = () => {
		setShowUser(true);
		setShowRank(false);
		setShowFriends(false);
		setShowSendReqCompo(false);
		setClickedButton("user");
	};
	const [players, setPlayers] = useState<PlayerType[]>([]);

	const { Userdata } = useContext(socketContext);

	useEffect(() => {
		
		const fetchGameStates = async () => {
			try {
				const response = await getRanking();
				setPlayers(response.data);
			} catch (error) {
			}
		};

		fetchGameStates();
	}, [Userdata?.id]);

	return (
		<div className="flex h-full w-full flex-col items-center gap-2 overflow-hidden rounded-[70px] bg-white pb-10 pt-5">
			<div className="flex h-[22%] w-[80%] items-center gap-1 rounded-[50px] bg-gray-100 p-2 ">
				<button
					onClick={_showUser}
					className={`w-1/2 ${
						clickedButton === "user"
							? "bg-[#498CDA] text-white"
							: "bg-gray-300 text-gray-600"
					} h-full rounded-3xl duration-300 hover:scale-105`}
				>
					User
				</button>
				{_switch ? (
					<>
						<button
							onClick={_showRank}
							className={`w-1/2 bg-[#498CDA] ${
								clickedButton === "rank"
									? "bg-[#498CDA] text-white"
									: "bg-gray-300 text-gray-600"
							} h-full rounded-3xl duration-300 hover:scale-105`}
						>
							Rank
						</button>
					</>
				) : null}
			</div>

			{showuser && (
				<div className="relative  flex h-[75%] w-full animate-bounce flex-col items-center justify-center rounded-[50px] pt-[10px] text-black">
					{userInfo?.avatar_url && (
						<Image
							src={_switch ? userInfo?.avatar_url : "/assets/unknown.png"}
							className="h-[130px] w-[130px] rounded-full shadow-lg "
							alt="Description of the image"
							width="250"
							height="250"
							priority={true}
						/>
					)}
					<h1>{_switch ? userInfo?.username : "-"}</h1>
					<h5>@{_switch ? userInfo?.display_name : "-"}</h5>
				</div>
			)}

			{showRank && (
				<div className=" scrollbar-hide relative  flex h-[75%] w-full items-center justify-center gap-10 overflow-auto rounded-[50px]">
					<div className="h-[110px] w-[110px] overflow-hidden rounded-full border-4 border-solid border-amber-900 bg-gray-100">
						<Image
							src={players[1]?.picture}
							className="h-[110px] w-[110px] rounded-full "
							alt="Description of the image"
							width={250}
							height={250}
						/>
					</div>

					<div className="absolute top-0 h-[140px] w-[140px] overflow-hidden rounded-full border-4 border-solid border-amber-500 bg-gray-100 hover:bg-black">
						<Image
							src={players[0]?.picture}
							className="h-[140px] w-[140px] rounded-full "
							alt="Description of the image"
							width={250}
							height={250}
						/>
					</div>

					<div className="h-[110px] w-[110px] overflow-hidden rounded-full border-4 border-solid border-gray-700 bg-gray-100">
						<Image
							src={players[2]?.picture}
							className="h-[110px] w-[110px] rounded-full "
							alt="Description of the image"
							width={250}
							height={250}
						/>
					</div>

					<div className="absolute  top-2 mt-[150px] w-[50%] text-black">
						{players.slice(3).map((player, index) => (
							<RankedFriends
								key={index}
								rank={player.rank}
								picture={player.picture}
								username={player.username}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default RankingUserSwitch;
