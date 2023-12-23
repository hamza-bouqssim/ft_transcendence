"use client";

import { getMatchHistory, getStates, getUserInfos} from '@/app/utils/api';
import { useState, useEffect } from 'react';
import Boxes from '@/app/components/Boxes';
import HistoryMatches from '@/app/components/HistoryMatches';
import Image from 'next/image';
import "./page.css"
import RankingUserSwitch from '@/app/components/RankingUserSwitch';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { fetchBlockFriendThunk, fetchBlocksThunk, fetchDebloqueUserThunk } from '@/app/store/blockSlice';
import { toast } from 'react-toastify';
import { fetchRequestThunk } from '@/app/store/requestSlice';
import AchievementsList from '@/app/components/AchievementsList';

const Dashboard = ({ params }: { params: { id: string } }) => {
	
	
	const { friendsBlock , fstatus, ferror } = useSelector((state:any) => state.friendsBlock);
	const { request, status, error } = useSelector((state:any) => state.request);
	const dispatch = useDispatch<AppDispatch>();

	const [results, setResults] = useState({});
	const [history_match, setHistoryMatch] = useState([]);
	const [userinfo, setUserInfo] = useState("");
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

	//========>  REQUEST:
	const onSubmit = async () => {
		try {
		const response = await dispatch(fetchRequestThunk(userinfo.display_name));
	
		if (response.payload && response.payload.message) {
			const errorMessage = response.payload.message;
			ToastError(`Error: ${errorMessage}`);
		} else {
			ToastSuccess("Friend request sent successfully");
			dispatch(fetchRequestThunk(userinfo.display_name));
			setSendReq(false);
		}
		} catch (err: any) {
		const errorMessage = err.payload ? err.payload.message : "An unexpected error occurred";
		ToastError(`Error: ${errorMessage}`);
		}
	};
	
	//========> UNBLOCK:
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

		//========> DISPATCH SEND REQUEST
		useEffect(()=> {
			dispatch(fetchRequestThunk());
		}, [dispatch]);

		//========> DISPATCH BLOCK
		useEffect(() => {
			dispatch(fetchBlocksThunk());
		}, [dispatch]);

		//========> IF THE REQUEST CREATED CHANGE BUTTON  [SEND REQUEST] TO [PENDING REQUEST]
		useEffect(() => {
			const friendRequestExists = request.some((friend: any) => friend.friendId === params.id);
			setSendReq(!friendRequestExists);
		}, [request, params.id]);

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

	  

	return (
		<div>
			<div className="container">

				<div className="row">

					<div className="col-1">
						<div className="play relative rounded-[54px] relative">
						<Image
  							src="/assets/hand.png"
  							className="thehand absolute  -top-[41px] -right-[9px] rounded-r-full w-[490px] animate-bounce"
  							alt=""
  							width="500"
  							height="500"
							priority={true}
						/>
							<div className="flex justify-center items-center gap-4 align-center bottom-5 absolute left-10">
								{_switch ? <>
								{
									sendReq ? <>

											<button className="px-4 h-12 bg-[--purple-color] rounded-2xl shadow-xl hover:scale-105 hover:duration-300 ease-in-out hover:bg-[--purple-hover]" onClick={() => onSubmit()}>Send Request</button>
									</>: <>
											<button className="px-4 h-12 bg-[--purple-color] rounded-2xl shadow-xl hover:scale-105 hover:duration-300 ease-in-out hover:bg-[--purple-hover]">Pending Request</button>

									</>
								}
									<button className="px-4 h-12 bg-[--purple-color] rounded-2xl shadow-xl hover:scale-105 hover:duration- ease-in-out hover:bg-[--purple-hover]" onClick={() => setShowMessageBlock(true)}>Send Message</button>
								</>

								
								: null}
								
								{friendsBlock.some((friend: any) => friend.id === params.id) ? (
  									<button className="px-4 h-12 bg-[--pink-color] rounded-2xl shadow-xl hover:scale-105 hover:duration-175 ease-in-out hover:bg-[--pink-hover]" onClick={() => handleUnblockButtonClick()}>Unblock</button>
									) : (
 									 <button className="px-4 h-12 bg-[--purple-color] rounded-2xl shadow-xl hover:scale-105 hover:duration-175 ease-in-out hover:bg-[--purple-hover]" onClick={() => handleBlockButtonClick()}>Block</button>
								)}
							</div>
							{showMessageBlock && 
							<>
								<div className="fixed left-0 z-10 top-0 bottom-0 right-0  p-10 rounded-[60px] w-full h-full bg-[#00000095] backdrop-blur-md opacity-100">
								<div className="w-[380px] h-[280px] z-30 bg-white absolute top-0 left-0 bottom-0 right-0 m-auto rounded-[20px] overflow-hidden">
									<h2 className="text-black">Send Message to {userinfo.display_name}</h2>
								</div>
								
								</div>
							</>
							}

						</div>
						
						{ _switch ? (
						<div>
							<div className="boxes">
							<Boxes title="WINS" value={results?.win} color="#6A67F3"/>
							<Boxes title="RANK" value={results?.level} color="#498CDA"/>
							<Boxes title="LOSSES" value={results?.lose} color="#FC7785"/>
							</div>
							<h1 className="mt-[20px]">History</h1>
							<div className="history-header mt-[20px] shadow-lg w-full h-[40px] bg-[#79a9f28d] rounded-[40px] flex justify-between px-1 py-1 ">
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
							<div className="his overflow-y-auto  h-[120px] scrollbar-hide">
							{history_match.map((_history, index) => (
								<HistoryMatches
								key={index}
								playerOne={_history.playerOne}
								resultOne={_history.resultOne} 
								resultTwo={_history.resultTwo} 
								playerTwo={_history.playerTwo} 
								duration={_history.duration} 
								date={_history.date} 
								totalMatches={_history.totalMatch}
								/>
							))}
							</div>
						</div>
						) : null}


					</div>
					
					<div className="col-2">

						<div className="rank-container overflow-hidden p-2">
							   <RankingUserSwitch userId={params.id} userInfo={userinfo} _switch={_switch}/>
						</div>

						{_switch ? 

						<div className="achievements-container">
							<div className="achievements">
								<h1>Achievements</h1>
								<AchievementsList results={results} />
							</div>
						</div>
						: null}

					</div>
				</div>

			</div>
    	</div>
	);
};
export default Dashboard;
