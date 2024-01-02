"use client";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRooms } from "../../store/roomsSlice"; // Update with the correct path
import { BiImageAdd } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { socketContext } from "../../utils/context/socketContext";
import { MemberUser } from "../cardMemberUser/MemberUser";
import { FriendsTypes } from "../../utils/types";
import Image from "next/image";
import { AppDispatch } from "../../store";
import axios from "axios";
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
	const [_image, setImage] = useState<string>("");
	const [groupPrivacy, setGroupPrivacy] = useState<string>("Public");
	const [groupPassword, setGroupPassword] = useState<string>("");
	const [grouImage, setGroupImage] = useState<string>("");
	const [errorin, setError] = useState<string>("");
	const { updateChannel, channel } = useContext(socketContext);
	const [idUserAdd, setIdUserAdd] = useState<string[]>([]);
	const { rooms, status, error } = useSelector((state: any) => state.room);
	const newAPI = axios.create();
	const handleCreateGroup = () => {
		if (groupPrivacy === "Protected" && (!groupPassword  || groupPassword.length < 8 )) {
			toast.error("Password are required for a Protected group. 8 character min");
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
			picture: _image,
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
	const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = event.target.files?.[0];
			if (!file) return;
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", `${process.env.NEXT_PUBLIC_CLOUD_PRESET}`);
			formData.append("cloud_name", `${process.env.NEXT_PUBLIC_CLOUD_NAME}`);

			const res = await newAPI.post(
				`${process.env.NEXT_PUBLIC_CLOUD_ENDPOINT}`,
				formData,
			);

			setImage(res.data.secure_url);
		} catch (err) {
		}
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
				
				{!_image ? <div className="rounded-full bg-[#EFEFEF]  p-10">
					<BiImageAdd size={30} className="text-[#949494]" ></BiImageAdd>
				</div>  : <Image src={_image} alt="" className="rounded-full bg-containe h-[120px] w-[120px] " width={100} height={100}   priority={true}/>
				}
				
			</label>
			<input type="file" id="imagroupe" className="hidden"  onChange={handleFile}/>
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
						<div role="status">
						<svg aria-hidden="true" className="w-8  h-8  mx-auto mt-20  text-white    animate-spin  " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100  50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
						</svg>
						<span className="sr-only">Loading...</span>
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
