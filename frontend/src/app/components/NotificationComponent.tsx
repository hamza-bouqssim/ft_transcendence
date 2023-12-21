import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchNotificationThunk } from "../store/notificationSlice";
import { NotificationTypes } from "../utils/types";
import {
	Conversation,
	ConversationSideBarContainer,
	ConversationSideBarItem,
} from "../utils/styles";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
	fetchAcceptFriendRequestThunk,
	fetchAcceptRequestPlay,
	fetchREfuseFriendRquestThunk,
	fetchRefuseRequestPlay,
} from "../store/requestSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { request } from "https";

const NotificationComponent = () => {
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

	const dispatch = useDispatch<AppDispatch>();
	const { notification, status, error } = useSelector(
		(state: any) => state.notification,
	);
	useEffect(() => {
		dispatch(fetchNotificationThunk());
	}, [dispatch]);
	const handleAcceptRequestPlay = (requestId: string) => {
		try {
			dispatch(fetchAcceptRequestPlay(requestId));
			ToastSuccess("You are Accepting the request To Play succefully");
		} catch (err: any) {
			ToastError("Error while accepting the request to PLay");
		}
	};
	const handleClickAcceptRequest = async (id: string) => {
		try {
			await dispatch(fetchAcceptFriendRequestThunk(id));
			ToastSuccess("You are accepting the request !");
		} catch (error) {
			ToastError(`Error accepting friend request: ${error}`);
		}
	};

	const handleClickRefuseRequest = async (id: string) => {
		try {
			await dispatch(fetchREfuseFriendRquestThunk(id));
			ToastSuccess("You are refusing the request");
		} catch (error) {
			ToastError(`Error refusing friend request, ${error}`);
		}
	};

	const handleClickAcceptPLay = async (id: string) => {
		try {
			await dispatch(fetchAcceptRequestPlay(id));
			ToastSuccess("You are accepting the request to play!");
		} catch (error) {
			ToastError(`Error accepting friend request to play: ${error}`);
		}
	};

	const handleClickRefusePLay = async (id: string) => {
		try {
			await dispatch(fetchRefuseRequestPlay(id));
			ToastSuccess("You are refusing the request to play !");
		} catch (error) {
			ToastError(`Error refusing friend request to play: ${error}`);
		}
	};
	return (
		<div className="top-15  no-scrollbar absolute right-5 z-50 h-[500px] w-[500px] overflow-auto rounded-2xl border-2 border-white bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] p-3 pt-12">
			<ToastContainer />

			<div className="  my-3  items-center justify-between gap-1 py-1">
				<h1 className="fixed z-10 -ml-[12px] -mt-[64px] flex w-[497px] items-center rounded-t-2xl bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] py-3 pl-4 text-2xl  text-white">
					Notifications
				</h1>
				{notification.map(function (elem: NotificationTypes) {
					return (
						<div
							className=" my-2 flex items-center gap-3 rounded-[20px] border border-[--pink-color] px-2 py-2 hover:bg-[#6967f36c]"
							key={elem.id}
						>
							{/* <div className='bg-yellow-200'> */}
							<div className="relative h-16 w-16 rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 hover:bg-red-700 ">
								<div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-white bg-gray-200">
									<Image
										src={elem.image_content} // You need to provide a valid source for the Image component
										className="h-14 w-14 rounded-[50%] bg-black"
										alt="Description of the image"
										width={60}
										height={60}
									/>
								</div>
							</div>
							<span className="inline-block w-[58%] font-mono text-white">
								{elem.content}
							</span>
							<div className="relative flex h-[60px] w-[70px] items-center justify-center">
								{elem.type == "requestPLay" && (
									<div className="absolute flex gap-3">
										<FontAwesomeIcon
											icon={faCheck}
											className=" h-4 w-4 cursor-pointer rounded-full bg-[#5B8CD3] p-1  duration-500  hover:text-[--pink-color] "
										/>
										<FontAwesomeIcon
											icon={faTimes}
											className=" h-4 w-4 cursor-pointer rounded-full  bg-[#5B8CD3] p-1  duration-500  hover:text-[--pink-color] "
										/>
									</div>
								)}
								{elem.type === "requestFriend" && (
									<div className="absolute flex gap-3">
										<FontAwesomeIcon
											icon={faCheck}
											className=" h-4 w-4 cursor-pointer rounded-full bg-[#5B8CD3] p-1  duration-500  hover:text-[--pink-color] "
											onClick={() => handleClickAcceptRequest(elem.requestId)}
										/>
										<FontAwesomeIcon
											icon={faTimes}
											className=" h-4 w-4 cursor-pointer rounded-full  bg-[#5B8CD3] p-1  duration-500  hover:text-[--pink-color] "
											onClick={() => handleClickRefuseRequest(elem.requestId)}
										/>
									</div>
								)}
							</div>
							<FontAwesomeIcon
								icon={faTimes}
								className="mb-auto mt-[8px] h-4 w-4 cursor-pointer rounded-full p-1 font-bold text-[--pink-color] duration-500  hover:scale-150  hover:text-[--purple-color] "
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default NotificationComponent;
