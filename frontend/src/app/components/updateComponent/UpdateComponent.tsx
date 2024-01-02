"use client";
import React, { FC } from "react";
import { MdEdit } from "react-icons/md";
import { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EdiText from "react-editext";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { socketContext } from "../../utils/context/socketContext";
import { RestFriend } from "../RestFriend/RestFriend";
import Image from "next/image";
import { ConversationTypes } from "../../utils/types";
import {Dispatch, SetStateAction } from "react";

interface UpdateComponentProps {
	setOldData: Dispatch<SetStateAction<ConversationTypes | null>>
	olddata :ConversationTypes | null;
}


const UpdateComponent:FC<UpdateComponentProps> = (
	{
		setOldData,
		olddata,
	}
) => {
	
	const { updateChannel, channel } = useContext(socketContext);
	const dispatch = useDispatch();
	const [password, setPassword] = useState<string | null>(null);
	const { rooms, status, error } = useSelector((state: any) => state.room);
	

	return (
		<div className=" no-scrollbar relative h-[calc(100%-90px)]  overflow-auto">
			{error && <div>{error}</div>}
			<div className="mt-7 flex items-center justify-center ">
				<div className="mx-auto flex w-auto  items-center justify-center rounded-full bg-[#F2F3FD] p-4">
					<Image
						className="h-20 w-20 rounded-full  bg-cover"
						src={olddata?.picture as string}
						alt=""
						height={30}
						width={30}
						priority
					/>
					<div className="mx-2 flex items-center justify-center ">
						<EdiText
							saveButtonContent={<FaCheck />}
							cancelButtonContent={<IoClose />}
							saveButtonClassName=" bg-[#5B8CD3]  text-white p-2 py-1 rounded-full mr-2"
							cancelButtonClassName="bg-[#EA7F87] text-white p-2 rounded-full"
							editButtonClassName="bg-[#5B8CD3] text-white p-2  rounded-full"
							editButtonContent={<MdEdit />}
							type="text"
							value={olddata?.name as string}
							className="text-black"
							onSave={(val: string) => {
								setOldData((value: ConversationTypes | null) => {
									return value
										? { ...value , name: val } 
										: null;
								});
							}}
							inputProps={{
								style: {
									backgroundColor: "#F2F3FD",
									border: "none",
								},
							}}
						/>
					</div>
				</div>
			</div>
			<hr className="mx-auto  my-10 w-1/2" />
			<div className="mx-auto my-8 flex w-[90%] items-center justify-between text-black ">
				<label>
					<input
						type="radio"
						name="update"
						value="Public"
						className="mr-2"
						checked={olddata?.Privacy === "Public"}
						onChange={() => {
							setOldData(
								(prevData:  ConversationTypes | null) => {
									if (prevData) {
										return { ...prevData, Privacy: "Public" };
									}
									return null; 
								},
							);
						}}
					/>
					Public
				</label>

				<label>
					<input
						type="radio"
						name="update"
						value="Public"
						className="mr-2"
						checked={olddata?.Privacy === "Private"}
						onChange={() => {
							setOldData((prevData: ConversationTypes | null) => {
								if (prevData) {
									return { ...prevData, Privacy: "Private" };
								}
								return null; // or handle the case where prevData is null
							});
						}}
					/>
					Private
				</label>

				<label>
					<input
						type="radio"
						name="update"
						value="Public"
						className="mr-2"
						checked={olddata?.Privacy === "Protected"}
						onChange={() => {
							setOldData((prevData:  ConversationTypes | null) => {
								if (prevData) {
									return { ...prevData, Privacy: "Protected" };
								}
								return null; // or handle the case where prevData is null
							});
						}}
					/>
					Protected
				</label>
			</div>
			{olddata?.Privacy === "Protected" && (
				<div className="mx-auto flex w-[80%] items-center justify-center">
					<input
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						className="my-5 w-full  rounded-full bg-[#F2F3FD] p-3   text-black   focus:outline-none"
						placeholder="Set a password for your group"
					></input>
					<button
						onClick={() => {
							setOldData((prevData: | ConversationTypes | null) => {
								if (prevData) {
									return { ...prevData, password: password };
								}
								return null; // or handle the case where prevData is null
							});
						}}
						className={`${
							olddata?.password === password ? "hidden" : "block"
						} ml-[-75px] rounded-full bg-[#5B8CD3] px-2 py-2`}
					>
						change
					</button>
				</div>
			)}

			<div className="no-scrollbar mt-5   w-full overflow-auto  rounded-xl    text-black">
				<RestFriend></RestFriend>
			</div>
			<div className="h-10"></div>
		</div>
	);
};

export default UpdateComponent;
