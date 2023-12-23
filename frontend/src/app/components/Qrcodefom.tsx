"use client";
import React, { useContext, useEffect, useState } from "react";
import { generateQrcode, verifyCode } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { socketContext } from "../utils/context/socketContext";
import Image from "next/image";

interface Props {
	closeQrForm: () => void;
}

export function Qrcodeform({ closeQrForm }: Props) {
	const { Userdata, setUserdata } = useContext(socketContext);
	const [qrCodeData, setQRCodeData] = useState("");
	const [otp, setOtp] = useState("");
	const [Loading, setLoading] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		generateQrcode()
			.then((res) => {
				setQRCodeData(res.data.qrcode);
			})
			.catch(() => {
				console.log("Error");
			});
	}, []);
  
	const _verificationCode = async () => {
		setLoading(true);
		await verifyCode(otp)
			.then((res) => {
				setMessage(res.data.message);
				setIsVerified(res.data.success);
				setUserdata((prevUserData) => ({
					...prevUserData!,
					tfa_enabled: res.data.success,
				}));
				setLoading(false);
			})
			.catch((e) => {
				setLoading(false);
				console.log("error:", e);
			});
	};
	console.log("isVerified:", isVerified);
	return (
		<div className="absolute bottom-0 left-0 right-0 top-0 z-30 m-auto h-[600px] w-[380px] overflow-hidden rounded-[20px] bg-white">
			<div className="relative flex h-full flex-col  items-center font-['Whitney_Semibold']">
				<div className="h-[14%] w-full ">
					<FontAwesomeIcon
						icon={faXmark}
						onClick={closeQrForm}
						className="absolute right-8 top-6 cursor-pointer rounded-xl border-2 px-2 text-[35px] text-black hover:bg-[--purple-color] hover:text-white"
					/>
				</div>
				<div className="-mt-6 flex h-[80%]  w-full flex-col items-center justify-center gap-8 p-5">
					<div className="ml-7 mr-auto">
						<h1 className="font-['Whitney_Semibold'] text-2xl text-black">
							Two-Factor Authentication
						</h1>
						<span className="font-['Whitney_Semibold'] text-xs text-black">
							Enable and secure your account by scanning this QR code
						</span>
					</div>

					<Image
						src={qrCodeData ? qrCodeData : "/assets/unknown.png"}
						alt=""
						className=" w-[165px]"
						width={165}
						height={165}
					/>

					<div className="relative w-full border-t">
						<span className="absolute  -top-[15px] left-[50%] -translate-x-[50%] bg-white px-3 text-lg text-black">
							Verification Code
						</span>
					</div>

					<input
						type="text"
						className="h-10 w-[80%] rounded-lg border-2 border-[--purple-color] py-5 text-center text-xl tracking-[5px] text-black placeholder:tracking-normal"
						placeholder="Enter Your Code"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						maxLength={6}
						required
					/>

					<hr className="w-full" />
					{Loading ? (
						<button className="w-[80%] cursor-pointer  rounded-lg bg-[--purple-color] py-3 duration-300 ease-in-out hover:bg-[--pink-color]">
							Loading...
						</button>
					) : (
						<button
							className="w-[80%] cursor-pointer rounded-[23px] bg-[--purple-color] py-3 duration-300 ease-in-out hover:bg-[--pink-color]"
							onClick={_verificationCode}
						>
							Verify
						</button>
					)}
					{message != "" && (
						<p style={{ color: isVerified ? "green" : "red" }}>{message}</p>
					)}
				</div>
			</div>
		</div>
	);
}

