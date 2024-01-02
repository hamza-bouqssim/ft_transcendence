import Image from "next/image";
import { HistoryMatchesType } from "../dashboard/Imports";

const HistoryMatches = (props: HistoryMatchesType) => {
	return (
		<div className="history-results mt-[20px]  flex h-[40px] w-full justify-between rounded-[40px] bg-[#79a9f28d]  px-1   py-1 shadow-lg hover:bg-[#95c0ff8d]">
			<div className="res flex  w-[23%] justify-between text-center">
				<div>
					<Image
						src={props.playerOne}
						alt=""
						className="w-[30px] h-[30px] rounded-full"
						width={30}
						height={30}
						priority
					/>
				</div>

				<h1>
					{props.resultOne} - {props.resultTwo}
				</h1>
				<div>
					<Image
						src={props.playerTwo}
						alt=""
						className="w-[30px] h-[30px] rounded-full"
						width={30}
						priority
						height={30}
					/>
				</div>
			</div>

			<div className="res w-[23%]  text-center">
				<h1>{props.duration}</h1>
			</div>

			<div className="res w-[23%]  text-center">
				<h1>{props.date}</h1>
			</div>

			<div className="res w-[23%]  text-center">
				<h1>{props.totalMatch}</h1>
			</div>
		</div>
	);
};

export default HistoryMatches;
