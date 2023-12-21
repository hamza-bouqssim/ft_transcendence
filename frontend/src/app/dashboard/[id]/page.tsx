"use client";

import { getMatchHistory, getStates, getUserInfos } from "@/app/utils/api";
import { useState, useEffect } from "react";
import Boxes from "@/app/components/Boxes";
import HistoryMatches from "@/app/components/HistoryMatches";
import Image from "next/image";
import "./page.css";
import RankingUserSwitch from "@/app/components/RankingUserSwitch";
import { ResultsType, UserInfoType } from "../Imports";
import { HistoryMatchesType } from "../Imports";
const Dashboard = ({ params }: { params: { id: string } }) => {
	const [results, setResults] = useState<ResultsType>({
		win: 0,
		level: 0,
		lose: 0,
	});
	const [history_match, setHistoryMatch] = useState<HistoryMatchesType[]>([]);
	const [userinfo, setUserInfo] = useState<UserInfoType | undefined>();
	const [showMessageBlock, setShowMessageBlock] = useState(false);

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				if (params.id) {
					const response = await getUserInfos(params.id);
					setUserInfo(response.data);
				}
			} catch (error) {
				console.log("Error fetching user information:", error);
			}
		};

		fetchUserInfo();
	}, [params.id]);

	useEffect(() => {
		const fetchMatchHistory = async () => {
			try {
				if (params.id) {
					const response = await getMatchHistory(params.id);
					setHistoryMatch(response.data);
				}
			} catch (error) {
				console.log("Error fetching match history:", error);
			}
		};

		fetchMatchHistory();
	}, [params.id]);

	useEffect(() => {
		const fetchGameStates = async () => {
			try {
				if (params.id) {
					const response = await getStates(params.id);
					setResults(response.data);
				}
			} catch (error) {
				console.log("Error fetching match history:", error);
			}
		};

		fetchGameStates();
	}, [params.id]);

	return (
		<div>
			<div className="container">
				<div className="row">
					<div className="col-1">
						<div className="play relative rounded-[54px]">
							<Image
								src="/assets/hand.png"
								className="thehand absolute  -right-[9px] -top-[41px] w-[490px] animate-bounce rounded-r-full"
								alt=""
								width="500"
								height="500"
								priority={true}
							/>
							<div className="align-center absolute left-10 top-[50%] flex -translate-y-[50%] items-center justify-center gap-4">
								<button className="hover:duration-175 h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--blue-color]">
									Send Request
								</button>
								<button
									className="hover:duration-175 h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--blue-color]"
									onClick={() => setShowMessageBlock(true)}
								>
									Send Message
								</button>
								<button className="hover:duration-175 h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--pink-color]">
									Block
								</button>
							</div>
							{showMessageBlock && (
								<>
									<div className="fixed bottom-0 left-0 right-0 top-0 z-10  h-full w-full rounded-[60px] bg-[#00000095] p-10 opacity-100 backdrop-blur-md">
										<div className="absolute bottom-0 left-0 right-0 top-0 z-30 m-auto h-[280px] w-[380px] overflow-hidden rounded-[20px] bg-white">
											<h2 className="text-black">
												Send Message to {userinfo?.display_name}
											</h2>
										</div>
										{/* Content of the div */}
									</div>
								</>
							)}
						</div>
						<div className="boxes">
							<Boxes title="WINS" value={results?.win} color="#6A67F3" />
							<Boxes title="RANK" value={results?.level} color="#498CDA" />
							<Boxes title="LOSSES" value={results?.lose} color="#FC7785" />
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
									totalMatch={_history.totalMatch}
								/>
							))}
						</div>
					</div>

					<div className="col-2">
						<div className="rank-container overflow-hidden p-2">
							<RankingUserSwitch userinfo={userinfo} />
						</div>

						<div className="achievements-container">
							<div className="achievements">
								<h1>Achievements</h1>
								<div className="my-achv">
									<div className="my">
										<Image
											className={`my duration-100 ease-in hover:scale-105 ${
												results.win < 0 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/first.jpg"
											width="200"
											height="200"
											alt=""
										/>
									</div>
									<div className="my">
										<Image
											className={`my duration-100 ease-in hover:scale-105 ${
												results.win < 2 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/second.jpg"
											width="200"
											height="200"
											alt=""
										/>
									</div>
									<div className="my">
										<Image
											className={`my duration-100 ease-in hover:scale-105 ${
												results.win < 4 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/third.jpg"
											width="200"
											height="200"
											alt=""
										/>
									</div>
									<div className="my">
										<Image
											className={`my duration-100 ease-in hover:scale-105 ${
												results.win < 6 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/fourth.jpg"
											width="200"
											height="200"
											alt=""
										/>
									</div>
									<div className="my">
										<Image
											className={`my duration-100 ease-in hover:scale-105 ${
												results.win < 8 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/fifth.jpg"
											width="200"
											height="200"
											alt=""
										/>
									</div>
									<div className="my">
										<Image
											className={`my duration-100 ease-in hover:scale-105 ${
												results.win < 12
													? "blur-[3px] grayscale"
													: "grayscale-0"
											}`}
											src="/assets/sixth.jpg"
											width="200"
											height="200"
											alt=""
										/>
									</div>
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
