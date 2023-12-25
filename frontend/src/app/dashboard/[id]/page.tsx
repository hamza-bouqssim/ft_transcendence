"use client";

import { SendRequest, getMatchHistory, getStates, getUserInfos} from '@/app/utils/api';
import { useState, useEffect, useContext } from 'react';
import Boxes from '@/app/components/Boxes';
import HistoryMatches from '@/app/components/HistoryMatches';
import Image from 'next/image';
import "./page.css"
import RankingUserSwitch from '@/app/components/RankingUserSwitch';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { fetchBlockFriendThunk, fetchBlocksThunk, fetchDebloqueUserThunk } from '@/app/store/blockSlice';
import { toast } from 'react-toastify';
import { fetchGetRequestThunk, fetchRequestThunk } from '@/app/store/requestSlice';
import AchievementsList from '@/app/components/AchievementsList';
import { HistoryMatchesType, ResultsType, UserInfoType } from '../Imports';
import { fetchUsersThunk } from '@/app/store/usersSlice';
import { User } from '@/app/utils/types';
import { fetchGetAllFriendsThunk } from '@/app/store/friendsSlice';
import { socketContext } from '@/app/utils/context/socketContext';
import { fetchGetRequestsThunk } from '@/app/store/requestsSlice';

const Dashboard = ({ params }: { params: { id: string } }) => {
	
	
	const { friendsBlock , fstatus, ferror } = useSelector((state:any) => state.friendsBlock);
	const dispatch = useDispatch<AppDispatch>();

	const [results, setResults] = useState<ResultsType>();
	const [history_match, setHistoryMatch] = useState([]);
	const [userinfo, setUserInfo] = useState<UserInfoType>();
	const [showMessageBlock, setShowMessageBlock] = useState(false);
	const [ _switch, setSwitch ] = useState(true);
	const [sendReq, setSendReq] = useState(true);

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
	console.log("dashboard");
	const handleUnblockButtonClick = async () => {
		try {
			const res = await dispatch(fetchDebloqueUserThunk(params.id));
			if (res.payload && typeof res.payload === 'object') {
				const responseData = res.payload as { data?: { response?: { message?: string } } };
				const message = responseData.data?.response?.message;
				if (message) {
					ToastSuccess(message);
					dispatch(fetchBlocksThunk())
					setSwitch(true);
					
					
					
				}else {
				const responseData = res.payload as {message?: string};
				const message = responseData.message;
				if(message)
				ToastError(message);
				}}
			} catch (error) {
				
				ToastError("Failed to block this friend. Please try again.");
			}
		};
	
	//========> BLOCK
	const handleBlockButtonClick = async () => {
		try {
			const res = await dispatch(fetchBlockFriendThunk(params.id));
			if (res.payload && typeof res.payload === 'object') {
			const responseData = res.payload as { data?: { response?: { message?: string } } };
			const message = responseData.data?.response?.message;
			if (message) {
				ToastSuccess(message);
				dispatch(fetchBlocksThunk())
				setSwitch(false);
			} else {
				const responseData = res.payload as {message?: string};
				const message = responseData.message;
				if(message)
					ToastError(message);
			}
		}} catch (error) {
			ToastError("Failed to block this friend. Please try again.");
		}
		};

		//========> USE EFFECTS

		// //========> DISPATCH SEND REQUEST
		// useEffect(()=> {
		// 	dispatch(fetchRequestThunk());
		// }, [dispatch]);

		//========> DISPATCH BLOCK
		useEffect(() => {
			dispatch(fetchBlocksThunk());
		}, [dispatch]);

		

		////========> IF THE USER EXIST IN THE BLOCK LIST DISPLAY [UNBLOCK] BUTTON, IF NOT EXIST DISPLAY [BLOCK]
		useEffect(() => {
		friendsBlock.some((friend: any) => friend.id === params.id) ? setSwitch(false): setSwitch(true);
		}, [friendsBlock, params.id, dispatch]);

		//========> FETCHING ANOTHER INFORMATIONS OF ANOTHER USER BY IT'S ID, AND THE ID I TOOKEN FROM THE QUERY.
		useEffect(() => {
			const fetchUserInfo = async () => {
			try {
				if (params.id) {
				const response = await getUserInfos(params.id);
				setUserInfo(response.data);
				}
			} catch (error) {
				console.log('Error fetching user information:', error);
			}
			};

			fetchUserInfo();
		}, [params.id]);

		//========> FETCHING MATCH HISTORY DATA
		useEffect(() => {
			const fetchMatchHistory = async () => {
			try {
				if (params.id) {
				const response = await getMatchHistory(params.id);
				setHistoryMatch(response.data);
				}
			} catch (error) {
				console.log('Error fetching match history:', error);
			}
			};

			fetchMatchHistory();
		}, [params.id]);

		//========> FETCHING STATE OF THE USER RESULTS
		useEffect(() => {
			const fetchGameStates = async () => { 
			try {
				if (params.id) {
				const response = await getStates(params.id);
				setResults(response.data);
				}
			} catch (error) {
				console.log('Error fetching match history:', error);
			}
			};

			fetchGameStates();
		}, [params.id]);

		//send request 
		const { users, Userstatus, Usererror } = useSelector(
			(state: any) => state.users,
		);
		useEffect(() => {
			dispatch(fetchUsersThunk());
		}, [dispatch]);

		const { requests, statusReq, errorReq } = useSelector((state:any) => state.requests);
		const { friends, status, error } = useSelector((state: any) => state.friends);
		const {Userdata} = useContext(socketContext);

		console.log("request here-->", requests);
		console.log("friends--<", friends);
   
		useEffect(() => {
		  dispatch(fetchGetRequestsThunk())
		  dispatch(fetchGetAllFriendsThunk());

		}, [dispatch]);
	 
		const sendRequest_handle =  async () =>{
			const userIdToFind = params.id;

    			const foundUser = users.find((user : User) => user.id === userIdToFind);
				if(foundUser){
					try{

						const response = await SendRequest(foundUser.display_name);
						
						if (response.data.success) {
							const SuccessMessage = response.data.response.message;
							ToastSuccess(`${SuccessMessage}`);
						  } else {
							ToastError(`Error:.... `);
						
						  }
					
					} catch (err: any) {
					  ToastError(`Error: Request alrighdy sent..!`);
		  
					}
				}
		}
		const isRequestPending = requests.some((request: any) => {
			return (
			  (request.user_id === params.id && request.friend_id === Userdata?.id) ||
			  (request.user_id === Userdata?.id && request.friend_id === params.id)
			);
		  });

	  

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
							<div className="align-center absolute bottom-5 left-10 flex items-center justify-center gap-4">
							{isRequestPending ? (
                    			<button className="h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--purple-hover] hover:duration-300"
                      				>
										Pending Request
								</button>
                  				) : (
                      			<button className="h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--purple-hover] hover:duration-300" onClick={() => sendRequest_handle()}> 
										Send Request
        						</button>
                  					)}
										<button
											className="hover:duration- h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--purple-hover]"
											onClick={() => setShowMessageBlock(true)}
										>
											Send Message
										</button>

								{friendsBlock.some((friend: any) => friend.id === params.id) ? (
									<button
										className="hover:duration-175 h-12 rounded-2xl bg-[--pink-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--pink-hover]"
										onClick={() => handleUnblockButtonClick()}
									>
										Unblock
									</button>
								) : (
									<button
										className="hover:duration-175 h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--purple-hover]"
										onClick={() => handleBlockButtonClick()}
									>
										Block
									</button>
								)}
							</div>
							{showMessageBlock && (
								<>
									<div className="fixed bottom-0 left-0 right-0 top-0 z-10  h-full w-full rounded-[60px] bg-[#00000095] p-10 opacity-100 backdrop-blur-md">
										<div className="absolute bottom-0 left-0 right-0 top-0 z-30 m-auto flex h-[280px] w-[380px] flex-col items-center justify-center gap-3 overflow-hidden rounded-[20px] bg-white px-5 shadow-xl">
											<h2 className="text-[20px] text-gray-800">
												Send Message to{" "}
												<span className="text-[25px] text-[--purple-color]">
													{userinfo?.display_name}
												</span>
											</h2>
											<Image
												src={userinfo?.avatar_url || ""}
												className="h-auto w-auto rounded-full"
												alt=""
												width={120}
												height={120}
												priority={true}
											/>
											<input
												type="text"
												className="w-full rounded-xl border-2 border-[--purple-color]  p-4 text-black outline-[--purple-color]"
												placeholder="Send Message"
											/>
										</div>
									</div>
								</>
							)}
						</div>

						{_switch ? (
							<div>
								<div className="boxes">
									<Boxes title="WINS" value={results?.win} color="#6A67F3" />
									<Boxes title="RANK" value={results?.level} color="#498CDA" />
									<Boxes title="LOSSES" value={results?.lose} color="#FC7785" />
								</div>
								<h1 className="mt-[20px]">History</h1>
								<div className="history-header mt-[20px] flex h-[40px] w-full justify-between rounded-[40px] bg-[#79a9f28d] px-1 py-1 shadow-lg ">
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
						) : null}
					</div>

					<div className="col-2">
						<div className="rank-container overflow-hidden p-2">
							<RankingUserSwitch
								userId={params.id}
								userInfo={userinfo}
								_switch={_switch}
							/>
						</div>

						{_switch ? (
							<div className="achievements-container">
								<div className="achievements">
									<h1>Achievements</h1>
									<AchievementsList results={results} />
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};
export default Dashboard;
