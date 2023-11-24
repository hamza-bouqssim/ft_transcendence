"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import ConversationSearch from "../ConversationSearch/page";
import ChatComponnent from "../ChatComponent/ChatComponent";
import GroupsManagement from "../GroupsManagment/GroupsManagment";
import CreatGroups from "../CreateGroups/CreateGroups";
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import OnlineFriends from "../OnlineFriends/OnlineFriends";
import ListFriends from "../ListFriends/ListFriends";
import SendRequest from "../SendRequest/SendRequest";
import FriendsBloque from "../FriendsBloque/FriendsBloque";
import { CreateConversationModal } from "../modals/CreateConversationModal";
import { SendRequestForm } from "../forms/SendRequestForm";

const CoversationSideBar = () => {
	const [newRooms, setNewRooms] = useState<boolean>(false);
	const router = useRouter();
	const pathname = usePathname();
	const [selectUsers, setSelectUsers] = useState<string>("online");

	return (
		<div className="relative h-full w-full bg-white  p-2 pt-4 xl:rounded-[20px]">
			<div className="mx-auto mb-4 flex w-3/4 items-center justify-between  rounded-full  bg-[#DFDFDF]">
				<button
					onClick={() => {
						router.push("/dashboard/chat");
					}}
					className={`${
						pathname.includes("chat") ? "bg-[#5B8CD3]" : ""
					} w-1/2 rounded-full p-4`}
				>
					Chats
				</button>
				<button
					onClick={() => {
						router.push("/dashboard/groups");
					}}
					className={`${
						pathname.includes("groups") ? "bg-[#5B8CD3]" : ""
					} w-1/2 rounded-full p-4`}
				>
					Group
				</button>
			</div>
			<hr className="mx-auto mt-5 w-1/2 bg-[#DFDFDF]" />
			{!newRooms && <ConversationSearch></ConversationSearch>}
			{newRooms && pathname.includes("chat") && (
				<div className="w-3/ mx-auto mb-4 flex items-center justify-between  rounded-full  bg-[#423d3d]">
					<button
						onClick={() => {
							setSelectUsers("online");
						}}
						className={`${
							selectUsers === "online" ? "bg-[#5B8CD3]" : ""
						} w-1/2 rounded-full p-4`}
					>
						Online
					</button>
					<button
						onClick={() => {
							setSelectUsers("allFriends");
						}}
						className={`${
							selectUsers === "allFriends" ? "bg-[#5B8CD3]" : ""
						} w-1/2 rounded-full p-4`}
					>
						Friends
					</button>
					<button
						onClick={() => {
							setSelectUsers("EnAttent");
						}}
						className={`${
							selectUsers === "EnAttent" ? "bg-[#5B8CD3]" : ""
						} w-1/2 rounded-full p-4`}
					>
						Pending
					</button>
					<button
						onClick={() => {
							setSelectUsers("Bloques");
						}}
						className={`${
							selectUsers === "Bloques" ? "bg-[#5B8CD3]" : ""
						} w-1/2 rounded-full p-4`}
					>
						Bloques
					</button>
					<button
						onClick={() => {
							setSelectUsers("Add");
						}}
						className={`${
							selectUsers === "Add" ? "bg-[#5B8CD3]" : ""
						} w-1/2 rounded-full p-4`}
					>
						{" "}
						Add
					</button>
				</div>
			)}
			{/* {newRooms &&  pathname.includes('chat')  && selectUsers === 'online'  ? <OnlineFriends  /> :  (pathname.includes('chat') && selectUsers === 'allFriends') ? <ListFriends/> : ( pathname.includes('chat') && selectUsers === 'EnAttent') ? <SendRequest/> :( pathname.includes('chat') && selectUsers === 'Bloques') ? <FriendsBloque/> } */}
			{!newRooms && pathname.includes("chat") && <ChatComponnent />}
			{!newRooms && pathname.includes("groups") && <GroupsManagement />}
			{newRooms && pathname.includes("chat") && selectUsers === "online" ? (
				<OnlineFriends />
			) : pathname.includes("chat") && selectUsers === "allFriends" ? (
				<ListFriends />
			) : pathname.includes("chat") && selectUsers === "EnAttent" ? (
				<SendRequest />
			) : pathname.includes("chat") && selectUsers === "Bloques" ? (
				<FriendsBloque />
			) : pathname.includes("chat") && selectUsers === "Add" ? (
				<SendRequestForm />
			) : (
				<></>
			)}
			{!newRooms ? (
				<button
					onClick={() => {
						setNewRooms(true);
					}}
					className="absolute bottom-20 right-5 rounded-full bg-[#5B8CD3] p-4 md:bottom-5 "
				>
					<IoMdAdd />
				</button>
			) : (
				<div className="absolute bottom-20 right-5 flex  items-center md:bottom-5">
					<button
						onClick={() => {
							setNewRooms(false);
						}}
						className="mr-4 text-[#5B8CD3]"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							setNewRooms(false);
						}}
						className=" rounded-full bg-[#5B8CD3] p-4 "
					>
						<FaCheck />
					</button>
				</div>
			)}
		</div>
	);
};

export default CoversationSideBar;
