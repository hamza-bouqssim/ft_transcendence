"use client";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRooms } from "@/app/store/roomsSlice"; // Update with the correct path
import { BiImageAdd } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { socketContext } from "@/app/utils/context/socketContext";
import { MemberUser } from "../cardMemberUser/MemberUser";
import { FriendsTypes } from "@/app/utils/types";
import Image from "next/image";
import { AppDispatch } from "@/app/store";

interface CreateGroupsProps {
	setNewRooms: React.Dispatch<React.SetStateAction<boolean>>;
}

interface createRoom {
	name: string;
	Privacy: string;
	password: string | null;
	picture: string | null;
	idUserAdd: string[];
}

const CreatGroups: React.FC<CreateGroupsProps> = ({
	setNewRooms,
}: CreateGroupsProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const [groupName, setGroupName] = useState<string>("");
	const [groupPrivacy, setGroupPrivacy] = useState<string>("Public");
	const [groupPassword, setGroupPassword] = useState<string>("");
	const [grouImage, setGroupImage] = useState<string>("");
	const [errorin, setError] = useState<string>("");
	const { updateChannel, channel } = useContext(socketContext);
	const [idUserAdd, setIdUserAdd] = useState<string[]>([]);
	const { rooms, status, error } = useSelector((state: any) => state.room);
	console.log("useState")
	const handleCreateGroup = () => {
		if (groupPrivacy === "Protected" && !groupPassword) {
			toast.error("Password are required for a Protected group.");
			return;
		}
		if (!groupName) {
			toast.error("Group Name  are required.");
			return;
		}
		if (!groupPrivacy) {
			toast.error("Group Privacy are required.");
			return;
		}

		const newGroupData: createRoom = {
			name: groupName,
			Privacy: groupPrivacy,
			password: groupPassword,
			picture: null,
			idUserAdd: idUserAdd,
		};

		dispatch(createRooms(newGroupData))
			.then((response: any) => {
				if (response.error) {
					toast.error(response.payload);
				} else {
					toast.success("Create Room Successfully! 🎉");
					setNewRooms(false);
				}
			})
			.catch((error: any) => {
				toast.success(error);
			});
	};
	return (
		<div className="no-scrollbar h-[calc(100%-150px)]  overflow-auto  p-2 pt-4 ">
			{errorin && (
				<p className=" w-full rounded-lg bg-[#EA7F87]  p-[10px] text-center">
					{errorin}
				</p>
			)}
			<label
				className="mt-5 flex items-center justify-center"
				htmlFor="imagroupe"
			>
				<Image src="" alt="" width={30} height={30} />
				<div className="rounded-full bg-[#EFEFEF] p-10">
					<BiImageAdd size={30} className="text-[#949494]"></BiImageAdd>
				</div>
			</label>
			<input type="file" id="imagroupe" className="hidden" />
			<div className="flex items-center justify-center">
				<input
					value={groupName}
					onChange={(e) => setGroupName(e.target.value)}
					className="my-5  rounded-full bg-[#D9D9D9] bg-opacity-20   p-3 text-black  focus:outline-none"
					placeholder="Group Name"
				></input>
			</div>
			<div className="mx-auto flex w-[90%] items-center justify-between text-black">
				<label>
					<input
						type="radio"
						name="privacyOptions"
						value="Public"
						className="mr-2"
						checked={groupPrivacy === "Public"}
						onChange={() => setGroupPrivacy("Public")}
					/>
					Public
				</label>

				<label>
					<input
						type="radio"
						name="privacyOptions"
						value="Private"
						className="mr-2"
						checked={groupPrivacy === "Private"}
						onChange={() => setGroupPrivacy("Private")}
					/>
					Private
				</label>

				<label>
					<input
						type="radio"
						name="privacyOptions"
						value="Protected"
						className="mr-2"
						checked={groupPrivacy === "Protected"}
						onChange={() => setGroupPrivacy("Protected")}
					/>
					Protected
				</label>
			</div>
			{groupPrivacy === "Protected" && (
				<div className="mx-auto mt-5 flex items-center justify-center">
					<input
						value={groupPassword}
						onChange={(e) => setGroupPassword(e.target.value)}
						className="w-full rounded-full   bg-[#D9D9D9] bg-opacity-20   p-3 text-black  focus:outline-none"
						placeholder="Set a password for your group"
					></input>
				</div>
			)}
			<div className="no-scrollbar mt-5 h-[50%] min-h-[300px] w-full rounded-lg  bg-opacity-20 p-1  text-black">
				<MemberUser
					idUserAdd={idUserAdd}
					setIdUserAdd={setIdUserAdd}
				></MemberUser>
			</div>

			<div className="absolute  bottom-20 right-5 flex  items-center md:bottom-4">
				<button
					onClick={() => {
						setNewRooms(false);
					}}
					className="mr-4 text-[#5B8CD3]"
				>
					Cancel
				</button>
				<button
					onClick={handleCreateGroup}
					className=" rounded-full bg-[#5B8CD3] p-4 "
				>
					{status === "loading" ? (
						<div className="flex items-center justify-center ">
							<div
								className=" h-4   w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-[white] motion-reduce:animate-[spin_1.5s_linear_infinite]"
								role="status"
							>
								<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
									Loading...
								</span>
							</div>
						</div>
					) : (
						<FaCheck />
					)}
				</button>
			</div>
		</div>
	);
};
export default CreatGroups;
