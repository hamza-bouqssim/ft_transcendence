"use client";

import {  getMatchHistory, getStates, getUserInfos} from '../../utils/api';
import { useState, useEffect, useContext } from 'react';
import Boxes from '../../components/Boxes';
import HistoryMatches from '../../components/HistoryMatches';
import Image from 'next/image';
import "./page.css"
import RankingUserSwitch from '../../components/RankingUserSwitch';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { fetchBlockFriendThunk, fetchBlockedUsers, fetchBlocksThunk, fetchDebloqueUserThunk } from '../../store/blockSlice';
import { toast } from 'react-toastify';
import { fetchAcceptFriendRequestThunk, fetchGetRequestThunk, fetchRequestThunk } from '../../store/requestSlice';
import AchievementsList from '../../components/AchievementsList';
import { HistoryMatchesType, ResultsType, UserInfoType } from '../Imports';
import { fetchUsersThunk } from '../../store/usersSlice';
import { BloqueList, CreateConversationParams, User } from '../../utils/types';
import { fetchGetAllFriendsThunk } from '../../store/friendsSlice';
import { socketContext } from '../../utils/context/socketContext';
import { fetchGetRequestsThunk } from '../../store/requestsSlice';
import { createConversationThunk, fetchConversationUserThunk } from '../../store/conversationSlice';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AuthCheck from '@/app/utils/AuthCheck';

const Dashboard = ({ params }: { params: { id: string } }) => {
	
	
	const { friendsBlock , blocked, fstatus, ferror } = useSelector((state:any) => state.friendsBlock);
	const dispatch = useDispatch<AppDispatch>();

	const [results, setResults] = useState<ResultsType>();
	const [history_match, setHistoryMatch] = useState([]);
	const [userinfo, setUserInfo] = useState<UserInfoType>();
	const [showMessageBlock, setShowMessageBlock] = useState(false);
	const [ _switch, setSwitch ] = useState(true);
	const [sendReq, setSendReq] = useState(true);
	const { requests, statusReq, errorReq } = useSelector((state:any) => state.requests);
	const { friends, status, error } = useSelector((state: any) => state.friends);
	const {Userdata} = useContext(socketContext);
	const { updateChannel, channel } = useContext(socketContext);
	const {register, handleSubmit, formState: { errors }} = useForm<CreateConversationParams>();
	const [buttonType, setButtonType] = useState('');
		const [IsBloqued, setIsBloqued] = useState(false);

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

	const handleEnter = (event: any) => {
		if (event.key === 'Enter') {
		  event.preventDefault();
		  const formData = {
			display_name: userinfo?.display_name || '', 
			message: event.target.value,
		  };
		  onSubmit(formData);
		}
	  };
	  const router = useRouter();

	 
	const onSubmit = async  (data : CreateConversationParams) => {
		if (!data.message.trim()) {
			return;
		  }
	  try{
		const res = await dispatch(createConversationThunk({
			display_name: userinfo?.display_name, 
			message: data.message, 
		  }));

		  if (res.payload && typeof res.payload === 'object') {
			
			const message = res.payload.response.message;
			
			if (message) {
				ToastSuccess(message);
				const elem = res.payload.response.conversation
				router.push("/dashboard/chat")
				updateChannel(elem);
			}
		}
	  }catch(err : any){
		const userIdToFind = params.id;
		const foundUser = users.find((user : User) => user.id === userIdToFind);
			try{
				const res = await dispatch(fetchConversationUserThunk(
				{
							display_name : userinfo?.display_name,
							message: data.message,
				}
				));
				
				if(res.payload.response)
				{
					
					router.push("/dashboard/chat");
					const elem = res.payload.response;
					updateChannel(elem); 

				}
				

			}catch(err : any){
				ToastError(`Interaction not allowed. Users are blocked`);

			}
			
	  }
	

	}
	useEffect(() => {
		dispatch(fetchBlocksThunk());
		dispatch(fetchBlockedUsers());
		dispatch(fetchUsersThunk());
		dispatch(fetchGetRequestsThunk())
		dispatch(fetchGetAllFriendsThunk());
	}, [dispatch, Userdata?.id]);

	const handleUnblockButtonClick = async () => {
		try {
			const res = await dispatch(fetchDebloqueUserThunk(params.id));
			dispatch(fetchBlockedUsers());
			dispatch(fetchBlocksThunk());
			dispatch(fetchGetRequestsThunk())
			dispatch(fetchGetAllFriendsThunk());
			if (res.payload && typeof res.payload === 'object') {
				if(!res.payload.success)
				{
					ToastError(`${res.payload.message}`);

				}
				const responseData = res.payload as { data?: { response?: { message?: string } } };
				const message = responseData.data?.response?.message;
				if (message) {
					ToastSuccess(message);
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
	
	const handleBlockButtonClick = async () => {
		try {
			const res = await dispatch(fetchBlockFriendThunk(params.id));
			dispatch(fetchBlockedUsers());
			dispatch(fetchBlocksThunk());
			dispatch(fetchGetRequestsThunk())
			dispatch(fetchGetAllFriendsThunk());
			
			if (res.payload  && typeof res.payload === 'object') {
				if(!res.payload.success)
				{
					ToastError(`${res.payload.message}`);

				}
			const responseData = res.payload as { data?: { response?: { message?: string } } };
			const message = responseData.data?.response?.message;
			if (message) {
				ToastSuccess(message);
			
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


		

		useEffect(() => {
		  const isPendingRequest = requests.some(
			(request : any) => request.user_id === Userdata?.id && request.friend_id === params.id
		  );
		  const isRespondToRequest = requests.some(
			(request : any) => request.user_id === params.id && request.friend_id === Userdata?.id
		  );
		  const isFriend = friends.some((friend : any) => friend.id === params.id);
	  
		  if (isPendingRequest && Userdata?.id !== params.id ) {
			setButtonType('pendingRequest');
		  } else if (isRespondToRequest && Userdata?.id !== params.id) {
			setButtonType('respondToRequest');
		  } else if (isFriend && Userdata?.id !== params.id) {
			setButtonType('friends');
		  } else {
			setButtonType('sendRequest');
		  }
		  const isUserBlocked = blocked.some(
			(elem : any) => 
			  (elem.userOne.id === Userdata?.id && elem.userTwo.id === params.id) ||
			  (elem.userOne.id === params.id && elem.userTwo.id === Userdata?.id)
		  );
		  setIsBloqued(isUserBlocked);
		}, [requests, friends, blocked, Userdata?.id, params.id]);
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

		const { users, Userstatus, Usererror } = useSelector(
			(state: any) => state.users,
		);
	



		const sendRequest_handle = async () => {
			const userIdToFind = params.id;
			const foundUser = users.find((user: User) => user.id === userIdToFind);
		  
			if (foundUser) {
		  
			 try{
				const response = await dispatch(fetchRequestThunk({
					display_name: foundUser.display_name,
				  }));
			
			
				dispatch(fetchGetRequestsThunk());

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
		  };
		
		  const handleClickAcceptRequest = async () => {
			const matchingRequest = requests.find(
				(request: any) =>
				  request.user_id === params.id && request.friend_id === Userdata?.id
			  );
			  try{
				if(matchingRequest){
					dispatch(fetchGetRequestsThunk());
					dispatch(fetchGetAllFriendsThunk());

						const res = await dispatch(fetchAcceptFriendRequestThunk(matchingRequest.id));
						const payloadData = res.payload.response as {  message: string  };
						if(!res.payload.success){
							ToastError(`there is no request to accept it `)
						}
						else{

							ToastSuccess(`${payloadData.message}`);

						}
					 
	
				  }else {
					ToastError(`there is no request to accept it `)
				  }		

			  }catch(err : any){

			  }
			  
			
		  };

	  

		  return (
			<AuthCheck>
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
								{!IsBloqued
									 ? 
									<>
									{
									buttonType === 'pendingRequest' ? (
										<button className="h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--purple-hover] hover:duration-300">
											Pending Request
										</button>
									) : buttonType === 'respondToRequest' ? (
											<button onClick={() => handleClickAcceptRequest()} className="h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--purple-hover] hover:duration-300">
												Respond to Request
											</button>
									) : buttonType === 'friends' ? (
										<button className="h-12 rounded-2xl bg-[--pink-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--gray-hover] hover:duration-300 hover:bg-[--pink-hover]" disabled>
											Friends
										</button>
									) : (
										<button className="h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--purple-hover] hover:duration-300" onClick={() => sendRequest_handle()}> 
											Send Request
										</button>
									)}
									{ Userdata?.id !== params.id &&
									<button onKeyPress={handleEnter}
										className="hover:duration- h-12 rounded-2xl bg-[--purple-color] px-4 shadow-xl ease-in-out hover:scale-105 hover:bg-[--purple-hover]"
										onClick={() => setShowMessageBlock(true)}
									>
										Send Message
									</button>}
									</>
								: null}
								
	
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
													 {...register('message', {required: 'message is required'})}
													type="text"
													className="w-full rounded-xl border-2 border-[--purple-color]  p-4 text-black outline-[--purple-color]"
													placeholder="Send Message"
													onKeyPress={handleEnter}
												/>
											</div>
										</div>
									</>
								)}
							</div>
	
							{!blocked.some((elem: BloqueList) =>((elem.userOne.id === Userdata?.id && elem.userTwo.id === params.id) ||(elem.userOne.id === params.id && elem.userTwo.id === Userdata?.id))
							)? (
								<div>
									<div className="boxes">
										<Boxes title="WINS" value={results?.win} color="#6A67F3" />
										<Boxes title="LEVEL" value={results?.level} color="#498CDA" />
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
									_switch={!blocked.some((elem: BloqueList) =>((elem.userOne.id === Userdata?.id && elem.userTwo.id === params.id) ||(elem.userOne.id === params.id && elem.userTwo.id === Userdata?.id))
										)}
								/>
							</div>
	
							{!blocked.some((elem: BloqueList) =>((elem.userOne.id === Userdata?.id && elem.userTwo.id === params.id) ||(elem.userOne.id === params.id && elem.userTwo.id === Userdata?.id))
							)? (
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
			</AuthCheck>
		);
	};
	export default Dashboard;