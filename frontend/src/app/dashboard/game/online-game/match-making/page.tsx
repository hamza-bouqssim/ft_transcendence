"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import InviteField from "../../../../components/InviteField";
import PlayerCard from "../../../../components/PlayerCard";
import { ChangeContext } from "../../../layout";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { SocketContext } from "../../SocketContext";
import { socketContext } from "@/app/utils/context/socketContext";
import { useSearchParams } from "next/navigation";

const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const MatchMaking = () => {
	const searchParams = useSearchParams();
	const mapIndex: number = searchParams.get("mapIndex") as any;
	const { change, setChange } = useContext(ChangeContext);
	const router = useRouter();
	const socket = useContext(SocketContext);
	const [opponentPlayer, setOpponentPlayer] = useState<{
		username: string;
		display_name: string;
		avatar_url: string;
	}>({
		username: "",
		display_name: "",
		avatar_url: "/assets/unknown.png",
	});
	const { Userdata } = useContext<any>(socketContext);

	useEffect(() => {
		const listener = (payload: any) => {
			setOpponentPlayer(payload.opponent);
			sleep(3000);
			router.push(`./online-game/maps/${mapIndex}/${payload.idGame}`);
		};

		socket.on("startGame", listener);
		// return () => {
		// 	socket.off("startGame", listener);
		// };
	}, [socket]);

	return (
		<section className="relative mx-auto h-[100vh] py-4 text-white xl:container">
			{/* Match Box */}
			<div className="mt-[70px] h-[85%] w-full gap-10 lg:flex lg:items-center  lg:justify-evenly   ">
				<div className="relative m-auto h-full w-full lg:mx-0 lg:w-[70%]">
					<div className="relative h-[70%] w-full px-2">
						<PlayerCard
							username={Userdata?.username}
							display_name={Userdata?.display_name}
							img={Userdata?.avatar_url}
							additionalStyle="left-7 top-2"
						/>
						<h3 className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] font-['Whitney_BlackSc'] text-5xl font-bold sm:text-7xl lg:text-8xl min-[1750px]:text-9xl">
							Vs
						</h3>
						<PlayerCard
							username={opponentPlayer.username}
							display_name={opponentPlayer.display_name}
							img={opponentPlayer.avatar_url}
							additionalStyle={`right-7 bottom-2 ${
								opponentPlayer.username === "" ? "animate-pulse" : ""
							} `}
						/>
					</div>
				</div>

				{/* Bottom Invite Box */}
				<div className="fixed bottom-4 right-4 flex w-fit flex-col-reverse items-end gap-4 overflow-hidden lg:relative lg:bottom-0 lg:right-0 lg:h-full lg:w-72 min-[1750px]:w-96">
					<FontAwesomeIcon
						icon={faUserGroup}
						className={`h-[20px] w-[20px] cursor-pointer rounded-[50%] bg-[#ffffff38] p-3 hover:bg-[--pink-color] lg:hidden`}
						onClick={() =>
							setChange({
								...change,
								menu: false,
								sideBar: false,
								chatBox: !change.chatBox,
							})
						}
					/>
					<div
						className={`relative h-64 max-h-80 w-64 overflow-hidden rounded-2xl bg-white lg:absolute lg:block lg:h-full lg:max-h-full lg:w-full ${
							change.chatBox ? "block" : "hidden"
						}`}
					>
						<div className="h-16 rounded-t-xl py-3 min-[1750px]:h-20">
							<h5 className="m-auto w-[80%] rounded-[40px] bg-[#5B8CD4] p-1 text-center font-['Whitney_BlackSC'] text-[22px] min-[1750px]:p-2 min-[1750px]:text-3xl">
								invite a friend
							</h5>
						</div>
						<div className=" h-full w-full overflow-y-auto">
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MatchMaking;
