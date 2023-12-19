"use client";

import React, { useEffect, useState, useContext } from "react";
import { getAuthUser } from "../utils/api";
import { redirect, useRouter } from "next/navigation";
import { User } from "../utils/types";
import { getSession } from "next-auth/react";
import "./page.css";
import Boxes from "../components/Boxes";
import RankingFriendsSwitch from "../components/RankingFriendsSwitch";
import HistoryMatches from "../components/HistoryMatches";
import { socketContext } from "../utils/context/socketContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { fetchGetRequestThunk } from "../store/requestSlice";
import Image from "next/image";

const Dashboard = () => {
	const [results, setResults] = useState({
		WINS: 3,
		LEVEL: 4,
		LOSSES: 1,
	});

	const [history_match, setHistoryMatch] = useState([
		{
			playerOne:
				"https://cdn.landesa.org/wp-content/uploads/default-user-image.png",
			resultOne: "1",
			playerTwo:
				"https://cdn.landesa.org/wp-content/uploads/default-user-image.png",
			resultTwo: "0",
			duration: "00:00:35",
			date: "2023-05-10",
			totalMatches: "33",
		},
		{
			playerOne:
				"https://cdn.landesa.org/wp-content/uploads/default-user-image.png",
			resultOne: "1",
			playerTwo:
				"https://cdn.landesa.org/wp-content/uploads/default-user-image.png",
			resultTwo: "1",
			duration: "00:01:01",
			date: "2023-05-11",
			totalMatches: "1",
		},
		{
			playerOne:
				"https://cdn.landesa.org/wp-content/uploads/default-user-image.png",
			resultOne: "1",
			playerTwo:
				"https://cdn.landesa.org/wp-content/uploads/default-user-image.png",
			resultTwo: "2",
			duration: "00:00:10",
			date: "2023-05-08",
			totalMatches: "4",
		},
	]);

	return (
		<div>
			<div className="container">
				<div className="row">
					<div className="col-1">
						<div className="play relative rounded-[54px]">
							<Image
								src="/assets/hand.png"
								className="thehand absolute -right-[9px] -top-[41px] animate-bounce rounded-r-full"
								alt=""
								width={490}
								height={490}
								priority
							/>
							<button
								type="button"
								className="play-button duration-100 ease-in hover:scale-105"
							>
								Play Now!
							</button>
						</div>
						<div className="boxes">
							<Boxes title="WINS" value={results.WINS} color="#6A67F3" />
							<Boxes title="RANK" value={results.LEVEL} color="#498CDA" />
							<Boxes title="LOSSES" value={results.LOSSES} color="#FC7785" />
						</div>
						<h1 className="mt-[20px]">History</h1>
						<div className=" history-header mt-[20px] flex h-[40px] w-full justify-between rounded-[40px] bg-[#79a9f28d] px-1 py-1 shadow-lg ">
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
						<div className="his scrollbar-hide  h-[120px] overflow-y-auto">
							{history_match.map((_history, index) => (
								<HistoryMatches
									key={index}
									playerOne={_history.playerOne}
									resultOne={_history.resultOne}
									resultTwo={_history.resultTwo}
									playerTwo={_history.playerTwo}
									duration={_history.duration}
									date={_history.date}
									totalMatches={_history.totalMatches}
								/>
							))}
						</div>
					</div>

					<div className="col-2">
						<div className="rank-container overflow-hidden p-2">
							<RankingFriendsSwitch />
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
export default Dashboard;
