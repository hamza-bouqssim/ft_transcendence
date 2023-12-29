import React, { useContext, useState, useEffect } from "react";
import InviteField from "./InviteField";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RankedFriends from "./RankedFriends";
import Image from "next/image";
import { socketContext } from "../utils/context/socketContext";
import { getRanking, getUserInfos } from "../utils/api";
import { PlayerType, UserInfoType } from "../dashboard/Imports";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchGetAllFriendsThunk } from "../store/friendsSlice";
import { fetchUsersThunk } from "../store/usersSlice";
import { ConversationSideBarContainer, ConversationSideBarItem, IngameStyling, OflineStyling, OnlineStyling } from "../utils/styles";
import { CreateRequestParams, FriendsTypes } from "../utils/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { fetchRequestThunk } from "../store/requestSlice";
import { ToastContainer, toast } from 'react-toastify';

const RankingFriendsSwitch = ({ userId }: { userId?: string }) => {
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
	const [showRank, setShowRank] = useState(false);
	const [showFriends, setShowFriends] = useState(false);
	const [showSendReqCompo, setShowSendReqCompo] = useState(false);
	const [clickedButton, setClickedButton] = useState("user");
	const [showuser, setShowUser] = useState(true);
	const { Userdata } = useContext(socketContext);
	const [userinfo, setUserInfo] = useState<UserInfoType>();
	const [players, setPlayers] = useState<PlayerType[]>([]);
	const {register, handleSubmit, formState: { errors }} = useForm<CreateRequestParams>();


	const _showRank = () => {
		setShowRank(true);
		setShowFriends(false);
		setShowSendReqCompo(false);
		setShowUser(false);
		setClickedButton("rank");
	};
	const _showFriends = () => {
		setShowFriends(true);
		setShowRank(false);
		setShowSendReqCompo(false);
		setShowUser(false);
		setClickedButton("friends");
	};
	const _sendreq = () => {
		setShowSendReqCompo(true);
		setShowFriends(false);
		setShowRank(false);
		setShowUser(false);
		setClickedButton("friends");
	};
	const _backTo = () => {
		setShowFriends(true);
		setShowRank(false);
		setShowSendReqCompo(false);
		setShowUser(false);
		setClickedButton("friends");
	};

	const _showUser = () => {
		setShowUser(true);
		setShowRank(false);
		setShowFriends(false);
		setShowSendReqCompo(false);
		setClickedButton("user");
	};

	useEffect(() => {
		
		const fetchUserInfo = async () => {
			try {
				if (userId) {
					const response = await getUserInfos(userId);
					setUserInfo(response.data);
				}
			} catch (error) {
			}
		};

		fetchUserInfo();
	}, [userId]);

	useEffect(() => {
		
		const fetchGameStates = async () => {
			try {
				const response = await getRanking();
				setPlayers(response.data);
			} catch (error) {
			}
		};

		fetchGameStates();
	}, [Userdata?.id]);
	const { friends, status, error } = useSelector((state: any) => state.friends);
	const { users, Userstatus, Usererror } = useSelector(
		(state: any) => state.users,
	);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();


	useEffect(() => {
		dispatch(fetchGetAllFriendsThunk());
		dispatch(fetchUsersThunk());
	}, [dispatch]);

	const onSubmit = async  (data : CreateRequestParams) => {
		try {
		  const response = await dispatch(fetchRequestThunk(data));
	
		  if (response.payload && response.payload.message) {
			const errorMessage = response.payload.message;
			ToastError(`Error: ${errorMessage}`);
		  } else {
			ToastSuccess("Friend request sent successfully");
			
		  }
		} catch (err: any) {
		  ToastError(`Error: ${err.message || 'An unexpected error occurred'}!`);

		}
		  
		 
	  }
	 
	return (
		<div className="flex h-full w-full flex-col items-center gap-2 overflow-hidden rounded-[70px] bg-white pb-10 pt-5">
			<div className="flex h-[22%] w-[80%] items-center gap-1 rounded-[50px] bg-gray-100 p-2 ">
				<button
					onClick={_showUser}
					className={`w-1/2 ${
						clickedButton === "user"
							? "bg-[#498CDA] text-white"
							: "bg-gray-300 text-gray-600"
					} h-full rounded-3xl duration-300 hover:scale-105`}
				>
					User
				</button>
				<button
					onClick={_showRank}
					className={`w-1/2 bg-[#498CDA] ${
						clickedButton === "rank"
							? "bg-[#498CDA] text-white"
							: "bg-gray-300 text-gray-600"
					} h-full rounded-3xl duration-300 hover:scale-105`}
				>
					Rank
				</button>
				<button
					onClick={_showFriends}
					className={`w-1/2 ${
						clickedButton === "friends"
							? "bg-[#498CDA] text-white"
							: "bg-gray-300 text-gray-600"
					} h-full rounded-3xl duration-300 hover:scale-105`}
				>
					Friends
				</button>
			</div>

			{showuser && (
				<div className="relative  flex h-[75%] w-full animate-bounce flex-col items-center justify-center rounded-[50px] pt-[10px] text-black">
					{userId ? (
						<>
							{userinfo?.avatar_url && (
								<Image
									src={userinfo?.avatar_url}
									className="h-[130px] w-[130px] rounded-full shadow-lg"
									alt="Description of the image"
									width="250"
									height="250"
									priority={true}
								/>
							)}
							<h1>{userinfo?.username}</h1>
							<h5>@{userinfo?.display_name}</h5>
						</>
					) : (
						// Render user information from Userdata
						<>
							{Userdata?.avatar_url && (
								<Image
									src={Userdata?.avatar_url}
									className="h-[130px] w-[130px] rounded-full shadow-lg"
									alt="Description of the image"
									width="250"
									height="250"
									priority={true}
								/>
							)}
							<h1>{Userdata?.username}</h1>
							<h5>@{Userdata?.display_name}</h5>
						</>
					)}
				</div>
			)}

			{showRank && (
				<div className=" scrollbar-hide relative  flex h-[75%] w-full items-center justify-center gap-10 overflow-auto rounded-[50px]">
					<div className="h-[110px] w-[110px] overflow-hidden rounded-full border-4 border-solid border-amber-900 bg-gray-100">
						<Image
							src={players[2]?.picture || "/assets/unknown.png"}
							className="h-[110px] w-[110px] rounded-full "
							alt=""
							width={250}
							height={250}
						/>
					</div>

					<div className="absolute top-0 h-[140px] w-[140px] overflow-hidden rounded-full border-4 border-solid border-amber-500 bg-gray-100 hover:bg-black">
						<Image
							src={players[0]?.picture || "/assets/unknown.png"}
							className="h-[140px] w-[140px] rounded-full "
							alt=""
							width={250}
							height={250}
						/>
					</div>

					<div className="h-[110px] w-[110px] overflow-hidden rounded-full border-4 border-solid border-gray-700 bg-gray-100">
						<Image
							src={players[1]?.picture || "/assets/unknown.png"}
							className="h-[110px] w-[110px] rounded-full "
							alt=""
							width={250}
							height={250}
						/>
					</div>

					<div className="absolute  top-2 mt-[150px] w-[50%] text-black">
						{players.slice(3).map((player, index) => (
							<RankedFriends
								key={index}
								rank={player.rank}
								picture={player.picture}
								username={player.username}
							/>
						))}
					</div>
				</div>
			)}

			{showFriends && (
				<div className="relative flex h-[75%] w-[90%] flex-col">
					<div className=" scrollbar-hide overflow-auto">
						<InviteField />
					</div>
					<div className="px-2.5">

					{friends.map(function (elem: FriendsTypes) {
					const user = users.find((user: any) => user.id === elem.id);
					const getStatusColor = () => {
						if (user) {
							switch (user.status) {
								case "online":
									return "green"; // Online status color
								case "offline":
									return "red"; // Offline status color
								case "inGame":
									return "blue"; // In-game status color
								default:
									return "black"; // Default color or any other status
							}
						}
						return "black"; // Default color if user not found
					};
					
					
					function handleClick() {
						router.push(`/dashboard/${elem.id}`);
					}
					return (
						<div className="flex gap-5 m-3" key={elem.id}>
							<div className="flex">
								<Image
									src={elem.avatar_url}
									className="h-14 w-14 rounded-[50%] bg-black "
									alt="Description of the image"
									width={60}
									height={60}
								/>
								{getStatusColor() === "green" ? (
									<OnlineStyling />
								) : getStatusColor() === "red" ? (
									<OflineStyling />
								) : (
									<IngameStyling />
								)}
							</div>

							<div>
								<span onClick={()=> handleClick()}className="text-black block font-bold text-sm cursor-pointer">{elem.display_name}</span>
							</div>

							
						</div>
						
					);
				})}
					</div>

					<button
						onClick={_sendreq}
						className="absolute bottom-0 right-0 mb-[-35px] mr-4 rounded-full"
					>
						<FontAwesomeIcon
							icon={faPlus}
							className="h-[25px] w-[25px] rounded-full bg-[#498CDA] p-1 duration-300 hover:scale-105"
						/>
					</button>
				</div>
			)}

			{showSendReqCompo && (
				<div className="relative flex h-[75%] w-[90%] flex-col">
					<form  onSubmit={handleSubmit(onSubmit)} className="flex h-[25%] w-full justify-between  p-1">
						<input
							{...register('display_name', {required: 'display_name is required'})} 
							type="text"
							className="rounded-[10px] bg-[#F2F3FD]  px-[4px] text-[#949494] placeholder-[#949494] outline-none"
							placeholder="Send Request"
						/>
						<button className="h-full w-[49%] rounded-[10px] bg-[#498CDA]">
							Send Request
						</button>
					</form>
					<button
						onClick={_backTo}
						className="absolute bottom-0 right-0 mb-[-35px] mr-4 rounded-full"
					>
						<FontAwesomeIcon
							icon={faCheck}
							className="h-[25px] w-[25px] rounded-full bg-[#498CDA] p-1 duration-300 hover:scale-105"
						/>
					</button>
				</div>
			)}
		</div>
	);
};

export default RankingFriendsSwitch;
