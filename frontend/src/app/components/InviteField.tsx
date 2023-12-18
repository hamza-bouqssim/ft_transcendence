import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { FriendsTypes } from "../utils/types";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { fetchUserTable, fetchUsersThunk } from "../store/usersSlice";

const InviteField = () => {
	// display all users without my friends

	const [friends, setFriends] = useState<FriendsTypes[]>([]);
	const [Users, setUsers] = useState<FriendsTypes[]>([]);
	const [others, setOthers] = useState<FriendsTypes[]>([]);
	const dispatch = useDispatch<AppDispatch>();

	// fetch all users

	useEffect(() => {
		dispatch(fetchUserTable())
			.unwrap()
			.then(({ data }) => {
				setFriends(data);
			})
			.catch((err) => {});
	});

	useEffect(() => {
		dispatch(fetchUsersThunk())
			.unwrap()
			.then(({ data }) => {
				setUsers(data);
			})
			.catch((err) => {});
	});

	useEffect(() => {
		const usersWithoutFriends = Users?.filter(
			(user) => !friends.some((friend) => friend?.id === user.id),
		);
		setOthers(usersWithoutFriends);
	}, [friends, Users]);

	return (
		<div>
			{others?.map((user) => (
				<div
					key={user.id}
					className="flex h-[65px] w-full items-center justify-between rounded-[15px] p-2 hover:bg-[#E4E4E4] min-[1750px]:h-[80px] min-[1750px]:p-3"
				>
					<div className="ml-[.2rem] h-[50px] w-[50px] shrink-0 overflow-hidden rounded-[50%] bg-black min-[1750px]:h-[65px] min-[1750px]:w-[65px]">
						<Image
							className="h-full w-full"
							key={0}
							src={user?.avatar_url}
							width={50}
							height={50}
							alt="42logo"
						/>
					</div>
					<div className="w-[50%] font-['Whitney_Bold'] text-black">
						<h3 className="text-sm min-[1750px]:text-xl">
							{user.display_name}
						</h3>
						<span className="text-xs min-[1750px]:text-lg">
							@{user.username}
						</span>
					</div>
					{/* <button className="w-[80px] h-[36px] bg-[#5B8CD4] rounded-[20px] font-['Whitney_Bold'] hover:bg-[--pink-color]">invite</button> */}
					<FontAwesomeIcon
						icon={faUserPlus}
						className="h-5 w-5 rounded-[50%] bg-[#5B8CD4] p-3 hover:cursor-pointer hover:bg-[--pink-color] min-[1750px]:h-6 min-[1750px]:w-6"
					/>
				</div>
			))}
		</div>
	);
};

export default InviteField;
