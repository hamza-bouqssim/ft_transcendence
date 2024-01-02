import Image from 'next/image'
import React from 'react'

interface RankedFriendsProps {
  rank: number;
  picture: string;
  username: string;
}

const RankedFriends: React.FC<RankedFriendsProps> = ({
	rank,
	picture,
	username,
}) => {
	return (
		<div className="mt-[5px]  flex h-[40px] w-[98%]  justify-between rounded-[40px]  bg-gray-100 py-[2px] hover:bg-gray-200">
			<div className="mx-[5px] flex h-full w-[29%]  items-center justify-start gap-2">
				<h1>{rank}</h1>
				<Image
					src={picture}
					alt=""
					className=" pointer-events-none select-none h-[30px] w-[30px] rounded-full"
					height={30}
					width={30}
					priority
				/>
			</div>

			<div className="flex h-full w-[69%] items-center justify-between">
				<h1 className="select-none">@{username}</h1>
			</div>
		</div>
	);
};

export default RankedFriends;
