"use client";

import React, { useEffect, useState, useContext } from "react";
import { getMatchHistory, getStates } from "../utils/api";
import "./page.css";
import Boxes from "../components/Boxes";
import RankingFriendsSwitch from "../components/RankingFriendsSwitch";
import HistoryMatches from "../components/HistoryMatches";
import Image from "next/image";
import { socketContext } from "../utils/context/socketContext";
import { HistoryMatchesType } from "./Imports";
import { ResultsType } from "./Imports";
import { useRouter } from "next/navigation";
import AuthCheck from "../utils/AuthCheck";
import { toast } from "react-toastify";

const Dashboard = () => {

	const ToastError = (message: any) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const ToastSuccess = (message: any) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
	const { Userdata } = useContext(socketContext);
	const router = useRouter();

	const [results, setResults] = useState<ResultsType>({
		win: 0,
		level: 0,
		lose: 0,
	});

	const [history_match, setHistoryMatch] = useState<HistoryMatchesType[]>([]);
	useEffect(() => {
		

		const fetchMatchHistory = async () => {
			try {
				if (Userdata?.id) {
					const response = await getMatchHistory(Userdata.id);
					setHistoryMatch(response.data);
				}
			} catch (error) {
				ToastError(`Error Fetching History Matches ${error}`);
			}
		};

		fetchMatchHistory();
	}, [Userdata?.id]);

	useEffect(() => {
		

		const fetchGameStates = async () => {
			try {
				if (Userdata?.id) {
					const response = await getStates(Userdata.id);
					setResults(response.data);
				}
			} catch (error) {
				ToastError(`"Error fetching match history: ${error}`);
			}
		};

		fetchGameStates();
	}, [Userdata?.id]);

	return (
		<AuthCheck>
			<div className="container">
				<div className="row">
					<div className="col-1">
						<div className="play relative rounded-[54px]">
							<Image
								src="/assets/hand.png"
								className=" pointer-events-none select-none thehand absolute  -right-[9px] -top-[41px] w-[490px] animate-bounce rounded-r-full "
								alt=""
								width="500"
								height="500"
								priority={true}
							/>
							<button
								type="button"
								className="play-button duration-100 ease-in hover:scale-105"
								onClick={() => router.push("/dashboard/game")}
							>
								Play Now!
							</button>
						</div>
						{
							(results.win && results.level && results.lose) &&
							<div className="boxes">
								<Boxes title="WINS" value={results?.win} color="#6A67F3" />
								<Boxes title="LEVEL" value={results?.level} color="#498CDA" />
								<Boxes title="LOSSES" value={results?.lose} color="#FC7785" />
							</div>
						}
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
							{history_match.map((_history: HistoryMatchesType, index) => (
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
							<RankingFriendsSwitch userId={Userdata?.id} />
						</div>

						<div className="achievements-container">
							<div className="achievements">
								<h1>Achievements</h1>
								<div className="my-achv">
									<div className="my">
										<Image
											className={`pointer-events-none my ${
												results.win < 0 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/first.jpg"
											width="200"
											height="200"
											alt=""
											// placeholder="blur"
                							// blurDataURL="/assets/first.jpg"
										/>
									</div>
									<div className="my">
										<Image
											className={`pointer-events-none my ${
												results.win < 2 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/second.jpg"
											width="200"
											height="200"
											alt=""
											// placeholder="blur"
                							// blurDataURL="/assets/second.jpg"
										/>
									</div>
									<div className="my">
										<Image
											className={`pointer-events-none my ${
												results.win < 4 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/third.jpg"
											width="200"
											height="200"
											alt=""
											// placeholder="blur"
                							// blurDataURL="/assets/third.jpg"
										/>
									</div>
									<div className="my">
										<Image
											className={`pointer-events-none my ${
												results.win < 6 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/fourth.jpg"
											width="200"
											height="200"
											alt=""
											// placeholder="blur"
                							// blurDataURL="/assets/fourth.jpg"
										/>
									</div>
									<div className="my">
										<Image
											className={`pointer-events-none my ${
												results.win < 8 ? "blur-[3px] grayscale" : "grayscale-0"
											}`}
											src="/assets/fifth.jpg"
											width="200"
											height="200"
											alt=""
											// placeholder="blur"
                							// blurDataURL="/assets/fifth.jpg"
										/>
									</div>
									<div className="my">
										<Image
											className={`pointer-events-none my ${
												results.win < 12
													? "blur-[3px] grayscale"
													: "grayscale-0"
											}`}
											src="/assets/sixth.jpg"
											width="200"
											height="200"
											alt=""
											// placeholder="blur"
                							// blurDataURL="/assets/sixth.jpg"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AuthCheck>
	);
};
export default Dashboard;