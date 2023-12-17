"use client";

import React, { useEffect, useState } from "react";
import { getAuthUser } from "@/app/utils/api";
import { redirect, useRouter } from "next/navigation";
import { User } from "@/app/utils/types";
import { getSession } from "next-auth/react";
import "./page.css"
import Boxes from "@/app/components/Boxes";
import RankingFriendsSwitch from "@/app/components/usersFiles/RankingFriendsSwitch";
import HistoryMatches from "@/app/components/HistoryMatches";
import Image from "next/image";


const ProfileUsers= () => {
	
	const [results, setResults] = useState({
		WINS: 3,
		LEVEL: 4,
		LOSSES: 1
	});

	const [history_match, setHistoryMatch] = useState([
		{
			playerOne: "assets/rgatnaou.jpeg",
			resultOne: "1",
			playerTwo: 'assets/mjalloul.jpeg',
			resultTwo: "0",
			duration: "00:00:35",
			date: "2023-05-10",
			totalMatches: "33"
		},
		{
			playerOne: "assets/rgatnaou.jpeg",
			resultOne: "1",
			playerTwo: 'assets/hamza.png',
			resultTwo: "1",
			duration: "00:01:01",
			date: "2023-05-11",
			totalMatches: "1"
		},
		{
			playerOne: "assets/rgatnaou.jpeg",
			resultOne: "1",
			playerTwo: 'assets/soukaina.png',
			resultTwo: "2",
			duration: "00:00:10",
			date: "2023-05-08",
			totalMatches: "4"
		},
	])

	return (
		<div>
			<div className="container">

				<div className="row">

					<div className="col-1">
						<div className="play relative rounded-[54px]">
							<Image src="/assets/hand.png" className="thehand absolute  -top-[41px] -right-[9px] rounded-r-full w-[490px] animate-bounce " alt="" width={30} height={30} />
							<button type="button" className="play-button ease-in duration-100 hover:scale-105">Play Now!</button>
						</div>
						<div className="boxes">
							<Boxes title="WINS" value={results.WINS} color="#6A67F3"/>
							<Boxes title="RANK" value={results.LEVEL} color="#498CDA"/>
							<Boxes title="LOSSES" value={results.LOSSES} color="#FC7785"/>
						</div>
						<h1 className="mt-[20px]">History</h1>
						<div className=" history-header mt-[20px]  w-full h-[40px] bg-[#79a9f28d] rounded-[40px] flex justify-between px-1 py-1 ">
								<div className="w-[23%] text-center ">
								<h1>Players</h1>
								</div>

								<div className="w-[23%] text-center ">
								<h1>Duration</h1>
								</div>

								<div className="w-[23%] text-center ">
								<h1>Date</h1>
								</div>

								<div className="w-[23%] text-center ">
								<h1>Total Matches</h1>
								</div>

						</div>
						<div className="his overflow-y-auto  h-[120px] scrollbar-hide">
							{
								history_match.map((_history, index) => (

									<HistoryMatches  
									key={index}
									playerOne={_history.playerOne}
									resultOne={_history.resultOne} 
									resultTwo={_history.resultTwo} 
									playerTwo={_history.playerTwo} 
									duration={_history.duration} 
									date={_history.date} 
									totalMatches={_history.totalMatches}/>
								))
							}

						</div>

					</div>
					
					<div className="col-2">

						<div className="rank-container overflow-hidden p-3">
							   <RankingFriendsSwitch/>
						</div>

						<div className="achievements-container">
							<div className="achievements">
								<h1>Achievements</h1>
								<div className="my-achv">
									<div className="my"></div>
									<div className="my"></div>
									<div className="my"></div>
									<div className="my"></div>
									<div className="my"></div>
									<div className="my"></div>
									
								</div>
							</div>
						</div>

					</div>
				</div>

			</div>
    	</div>
	);
};
export default ProfileUsers;
