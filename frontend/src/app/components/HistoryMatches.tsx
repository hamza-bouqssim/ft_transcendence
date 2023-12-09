import React from "react";

const HistoryMatches = ({
	playerOne,
	resultOne,
	playerTwo,
	resultTwo,
	duration,
	date,
	totalMatches,
}: any) => {
	return (
		<div className="history-results mt-[20px]  flex h-[40px] w-full justify-between rounded-[40px]  bg-[#79a9f28d]   px-1 py-1 hover:bg-[#95c0ff8d]">
			<div className="res flex  w-[23%] justify-between text-center">
				<img src={playerOne} alt="" className="rounded-full" />
				<h1>
					{resultOne} - {resultTwo}
				</h1>
				<img src={playerTwo} alt="" className="rounded-full" />
			</div>

			<div className="res w-[23%]  text-center">
				<h1>{duration}</h1>
			</div>

			<div className="res w-[23%]  text-center">
				<h1>{date}</h1>
			</div>

			<div className="res w-[23%]  text-center">
				<h1>{totalMatches}</h1>
			</div>
		</div>
	);
};

export default HistoryMatches;
