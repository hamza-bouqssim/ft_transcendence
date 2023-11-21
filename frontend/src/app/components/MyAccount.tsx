import Form from "./Form";
import Image from "next/image";
import { useState } from "react";

const MyAccount = () => {
	const [src, setSrc] = useState<string>("/assets/user2.jpeg");
	return (
		<div className="font-['Whitney Semibold'] text-xs md:text-sm lg:text-[1.3rem] ">
			{/* <div className="flex flex-col items-center justify-around gap-5 border-b border-[#9f9f9f4a] pb-3 md:flex-row">
				<div className=" ">
					<Image
						className="h-24 w-24 rounded-[50%] bg-sky-200 min-[1750px]:h-24 min-[1750px]:w-24"
						src={src}
						width={72}
						height={51}
						alt="user"
					/>
				</div>
				<div className="">
					<input
						type="file"
						accept="image/*"
						className="hidden"
						id="file"
						onChange={(e) => {
							if (e.target.files)
								setSrc(URL.createObjectURL(e.target.files[0]));
						}}
					/>
					<label
						className="rounded-[20px] bg-[#5B8CD4] px-6 py-3"
						htmlFor="file"
					>
						Change Photo
					</label>
				</div>
				<input
					type="button"
					className="rounded-[20px] bg-[#EA7F87] px-8 py-3"
					onClick={() => {
						setSrc("/assets/unknown.png");
					}}
					value="Delete"
				/>
			</div> */}
			<Form/>
		</div>
	);
};
export default MyAccount;
