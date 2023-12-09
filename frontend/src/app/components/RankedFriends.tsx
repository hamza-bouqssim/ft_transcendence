import React from "react";

const RankedFriends = ({ rank, picture, username }: any) => {
	return (
		<div className="mt-[5px]  flex h-[40px] w-[98%]  justify-between rounded-[40px]  bg-gray-100 py-[2px] hover:bg-gray-200">
			<div className="mx-[5px] flex h-full w-[29%]  items-center justify-start gap-2">
				<h1>{rank}</h1>
				<img src={picture} alt="" className="h-[30px] w-[30px] rounded-full" />
			</div>

			<div className="flex h-full w-[69%] items-center justify-between">
				<h1>@{username}</h1>
			</div>
		</div>
	);
};

export default RankedFriends;
