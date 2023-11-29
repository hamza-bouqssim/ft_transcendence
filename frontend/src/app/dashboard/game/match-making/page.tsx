"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import InviteField from "../../../components/InviteField";
import PlayerCard from "../../../components/PlayerCard";
import { ChangeContext } from "../../layout";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { SocketContext } from "../SocketContext";

const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const MatchMaking = () => {
	const { change, setChange } = useContext(ChangeContext);
	const router = useRouter();
	const socket = useContext(SocketContext);

	useEffect(() => {
		const listner = (data: any) => {
			router.push(`./online-game/${data.idGame}`);
		};
		socket.on("startGame", listner);
		return () => {
			socket.off("startGame", listner);
		};
	}, [socket]);

	return (
		<section className="relative mx-auto h-[100vh] py-4 text-white xl:container">
			{/* Match Box */}
			<div className="mt-[70px] h-[85%] w-full gap-10 lg:flex lg:items-center  lg:justify-evenly   ">
				<div className="relative m-auto h-full w-full lg:mx-0 lg:w-[70%]">
					<div className="relative h-[70%] w-full px-2">
						<PlayerCard
							name="Hamza BouQssim"
							username="@hbouqssi"
							img="/assets/hamza.png"
							additionalStyle="left-7 top-2"
						/>
						<h3 className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] font-['Whitney_BlackSc'] text-5xl font-bold sm:text-7xl lg:text-8xl min-[1750px]:text-9xl">
							Vs
						</h3>
						<PlayerCard
							name=""
							username=""
							img="/assets/unknown.png"
							additionalStyle="right-7 bottom-2 animate-pulse"
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
