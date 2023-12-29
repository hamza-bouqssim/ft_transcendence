"use client";
import {
	AvatarStyle,
	IngameStyling,
	MessageItemAvatar,
	MessagePannelHeaderStyle,
	OflineStyling,
	OnlineStyling,
} from "../../utils/styles";
import { IoMdSettings } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { FC, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useContext, useEffect } from "react";
import { socketContext } from "../../utils/context/socketContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllMembers } from "../../store/memberSlice";
import { HiOutlineLogout } from "react-icons/hi";
import Image from "next/image";
import { User, Members, ConversationTypes } from "../../utils/types";
import { updateRooms } from "../../store/roomsSlice";
import { ToastContainer, toast } from "react-toastify";
import { AppDispatch } from "../../store";
import { fetchUsersThunk } from "../../store/usersSlice";

interface MessagePanelHeaderProps {
	setUpdateRome: (value: boolean) => void;
	updateRome: boolean;
	setOldData:(value: ConversationTypes  | null) => void;
	olddata :ConversationTypes | null;
}

interface Member {
	isAdmin: boolean;
	user_id: string;
}
const MessagePanelHeader: FC<MessagePanelHeaderProps> = ({
	setUpdateRome,
	updateRome,
	setOldData,
	olddata,
}) => {
	const pathname = usePathname();
	const { members, status, error } = useSelector((state: any) => state.member);
	const dispatch = useDispatch<AppDispatch>();
	const [isTyping, setIsTyping] = useState(false);
	const socket = useContext(socketContext).socket;
	const { updateChannel, channel } = useContext(socketContext);
	const { Userdata } = useContext(socketContext);
	const goBack = () => {
		updateChannel(null);
	};
	const { users, Userstatus, Usererror } = useSelector(
		(state: any) => state.users,
	);

	useEffect(() => {
		dispatch(fetchUsersThunk());
	}, [dispatch]);

	
	useEffect(() => {
		
		
		const handleTyping = (typing: any) => {
			if (typing.userId !== Userdata?.id) {
				setIsTyping(typing.status);
			}
		};

		socket.on("Typing", handleTyping);
		socket.on("leaveTyping", handleTyping);

		return () => {
			socket.off("Typing", handleTyping);
			socket.off("leaveTyping", handleTyping);
		};
	}, [Userdata?.id, socket]);

	useEffect(() => {
		

		setUpdateRome(false);
	}, [channel, setUpdateRome]);

	useEffect(() => {
		

		if(channel?.id)
			dispatch(getAllMembers(channel?.id));
	}, [dispatch, channel]);
	// Image src

	const InfoRecipient = () => {
		let test: User | undefined;
		if (channel?.recipient.id === Userdata?.id) {
			test = channel?.sender;
		} else 
			test = channel?.recipient;
		
		return test;
	};
	const checkTheStatus = () =>{
		let test: User | undefined;

		if (channel?.recipient.id === Userdata?.id) {
			test = channel?.sender;
		} else 
			test = channel?.recipient;
		const user = users.find((user: User) => user.id === test?.id);
		if(user)
			return user && user?.status;
		else
			return ""
	}

	const handleUpdate = () => {
    if(olddata)
    {
      dispatch(updateRooms(olddata)).then((res:any) => {
        if (res.error) {
          toast.error(res.payload);
        }
		else
		{
			updateChannel(res.payload)
			toast.success("Update Room Successfully! 🎉");
		}
			
      });
    }
	};


	return (
		
		<div className="flex items-center justify-between rounded-full  bg-[#F2F3FD] p-5  text-black font-['Whitney_Semibold']">
			<div className="flex items-center">
				<FaArrowLeft
					onClick={goBack}
					className="mr-4 block xl:hidden"
					size={26}
				></FaArrowLeft>
				{channel?.picture && (
					<Image
						src={channel.picture}
						className="w-[50px] rounded-full"
						alt=""
						width={30}
						height={30}
					/>
				)}
				{!channel?.picture && InfoRecipient()?.avatar_url && (
					<div className="flex">
						<Image
						src={InfoRecipient()?.avatar_url as string}
						className="w-[50px] rounded-full"
						alt=""
						width={30}
						height={30}
						/>
						{checkTheStatus() === 'online' ? (<OnlineStyling/>) :  checkTheStatus() === 'offline' ? (<OflineStyling/>) :( <IngameStyling/>)}
					</div>					
				)}
				{channel?.name && (
					<div>
						<h1 className="ml-2">{channel.name}</h1>
						{isTyping ? (
							<h1 className="ml-2 text-[12px]">Someone is typing...</h1>
						) : (
							<h1 className="ml-2 text-[12px]">{members.length} Members</h1>
						)}
					</div>
				)}
				{!channel?.name && channel?.recipient.display_name && (
					<h1 className="ml-2">{InfoRecipient()?.display_name}</h1>
				)}
			</div>
			{pathname.includes("groups") &&
			members?.some(
				(member:Members) =>
					(member.Status === "Owner" || member.Status === "Admin") &&
					member.user_id === Userdata?.id,
			) ? (
				!updateRome ? (
					<IoMdSettings
						size={30}
						onClick={() => {
							setUpdateRome(true);
						}}
						className="text-[#4D4D4D]"
					></IoMdSettings>
				) : (
					<div className="flex items-center justify-center ">
						<button
							className="mr-3 w-fit rounded-full border border-[--pink-color] px-4  py-2 text-[14px] text-[--pink-color] "
							onClick={() => {
								setUpdateRome(false);
							}}
						>
							close
						</button>
						{channel !== olddata && 
							<button
								onClick={handleUpdate}
								className={`${
									olddata === channel
										? "   "
										: "flex items-center justify-center  "
								} w-fit rounded-full bg-[#EA7F87] px-5  py-2 text-[14px] text-white`}
							>
								Update
								{status.update === "loading" ? (
									<div className="ml-3 flex items-center justify-center ">
										<div
											className=" h-5   w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-[white] motion-reduce:animate-[spin_1.5s_linear_infinite]"
											role="status"
										>
											<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
												Loading...
											</span>
										</div>
									</div>
								) : null}
							</button>
						} 
					</div>
				)
			) : null}
		</div>
	);
};

export default MessagePanelHeader;