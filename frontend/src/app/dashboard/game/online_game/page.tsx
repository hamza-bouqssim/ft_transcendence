"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import InviteField from "../../../components/InviteField";
import PlayerCard from "../../../components/PlayerCard";
import { ChangeContext } from "../../layout";
import React, { useContext, useEffect, useState } from "react";
import { getAuthUser } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { User } from "@/app/utils/types";

const DashBoard = () => {
	const { change, setChange } = useContext(ChangeContext);

	return (
		<section className="relative h-[100vh] xl:container   mx-auto py-4 text-white">
			{/* Match Box */}
			<div className="mt-[70px] h-[85%] w-full lg:flex lg:items-center lg:justify-evenly  gap-10   ">
				<div className="relative m-auto h-full w-full lg:mx-0 lg:w-[70%]">
					<div className="relative h-[70%] w-full px-2">
						<PlayerCard
							name="Hamza BouQssim"
							username="@hbouqssi"
							img="/assets/hamza.png"
							direction="left-7 top-2"
						/>
						<h3 className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] font-['Whitney_BlackSc'] text-5xl font-bold sm:text-7xl lg:text-8xl min-[1750px]:text-9xl">
							Vs
						</h3>
						<PlayerCard
							name=""
							username=""
							img="/assets/unknown.png"
							direction="right-7 bottom-2"
						/>
					</div>
					{/* <div className="absolute bottom-4 left-[50%] flex h-[25%] w-[200px] translate-x-[-50%] flex-col items-center justify-end gap-4 border-t-2 border-solid border-white py-2">
						<h2 className="w-[280px] text-center font-['Whitney_SemiBold'] text-[20px] min-[1750px]:w-[400px] min-[1750px]:text-2xl">
							Select Bot Opponent or Await Player Joining
						</h2>
						<button className="h-[50px] w-[215px] rounded-[40px] bg-white font-['Whitney_SemiBold'] text-lg font-bold text-black duration-[30ms] ease-in-out hover:bg-[--pink-color] min-[1750px]:text-xl">
							<FontAwesomeIcon icon={faRobot} />
							<Link href={"/dashboard/game/pong"} className="ml-2">
								Play With Bot
							</Link>
						</button>
					</div> */}
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

export default DashBoard;
