import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { FriendsTypes } from "../utils/types";
import { fetchGetAllFriends } from "../store/requestSlice";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { fetchUsersThunk } from "../store/usersSlice";

const InviteField = () => {
	// display all users without my friends 

	const [friends, setFriends] = useState<FriendsTypes[]>([]);
	const [Users, setUsers] = useState<FriendsTypes[]>([]);
	const [others, setOthers] = useState<FriendsTypes[]>([]);
	const dispatch = useDispatch<AppDispatch>();



	// fetch all users

	useEffect (() => {
        dispatch(fetchGetAllFriends())
        .unwrap()
        .then(({data}) => {
          setFriends(data);
        }).catch((err)=>{
        }
        );
      },)


	  useEffect (() => {
		dispatch(fetchUsersThunk())
		.unwrap()
		.then(({data}) => {
		  setUsers(data);
		}).catch((err)=>{
		}
		);
	  },);
  




	return (
		<div className="flex h-[65px] w-full items-center justify-between rounded-[15px] p-2 min-[1750px]:p-3 hover:bg-[#E4E4E4] min-[1750px]:h-[80px]">
			<div className="ml-[.2rem] h-[50px] w-[50px] shrink-0 overflow-hidden rounded-[50%] bg-black min-[1750px]:h-[65px] min-[1750px]:w-[65px]">
				<Image
					className="h-full w-full"
					key={0}
					src={"/assets/hamza.png"}
					width={50}
					height={50}
					alt="42logo"
				/>
			</div>
			<div className="w-[50%] font-['Whitney_Bold'] text-black">
				<h3 className="text-sm min-[1750px]:text-xl">Redouan Gatnaou</h3>
				<span className="text-xs min-[1750px]:text-lg">@rgatnaou</span>
			</div>
			{/* <button className="w-[80px] h-[36px] bg-[#5B8CD4] rounded-[20px] font-['Whitney_Bold'] hover:bg-[--pink-color]">invite</button> */}
			<FontAwesomeIcon
				icon={faUserPlus}
				className="h-5 w-5 rounded-[50%] bg-[#5B8CD4] p-3 hover:cursor-pointer hover:bg-[--pink-color] min-[1750px]:h-6 min-[1750px]:w-6"
			/>
		</div>
	);
};

export default InviteField;
