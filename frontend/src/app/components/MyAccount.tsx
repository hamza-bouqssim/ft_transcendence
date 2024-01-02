import Form from "./Form";
import Image from "next/image";
import { useState, useContext } from "react";
import axios from "axios";
import { socketContext } from "../utils/context/socketContext";
import { deleteAvatar } from "../utils/api";

const MyAccount = () => {
	const { Userdata, setUserdata } = useContext(socketContext);
	const newAPI = axios.create();
	const [src, setSrc] = useState<string>("/assets/user2.jpeg");
	const [_image, setImage] = useState();

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
			setUserdata((prevUserdata) => ({
				...prevUserdata!,
				avatar_url: res.data.secure_url,
				id: prevUserdata?.id || "",
			}));
		} catch (err) {
		}
	};

	const _deleteAvatar = async () => {
		try {
			await deleteAvatar().then((res) => {
				if (res.data.success)
					setUserdata((prevUserdata) => ({
						...prevUserdata!,
						avatar_url:
							"https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
					}));
			});
		} catch (err) {
		}
	};
	return (
		<div className="font-['Whitney Semibold'] text-xs md:text-sm lg:text-[1.3rem] ">
			<div className="flex flex-col items-center justify-around gap-5 border-b border-[#9f9f9f4a] pb-3 md:flex-row">
				<div className=" ">
					<Image
						className="h-auto w-auto rounded-[50%] bg-sky-200 min-[1750px]:h-24 min-[1750px]:w-24"
						src={Userdata?.avatar_url || "/assets/user2.jpeg"}
						width={70}
						height={70}
						alt="user"
						// placeholder="blur"
						// blurDataURL={Userdata?.avatar_url || "/assets/user2.jpeg"}
					/>
				</div>
				<div className="">
					<input
						type="file"
						accept="image/*"
						className="hidden"
						id="file"
						onChange={handleFile}
					/>
					<label
						className="rounded-[20px] bg-[#5B8CD4] px-6 py-3 font-['Whitney_Semibold']"
						htmlFor="file"
					>
						Change Photo
					</label>
				</div>
				<input
					type="button"
					className="rounded-[20px] bg-[#EA7F87] px-8 py-3 font-['Whitney_Semibold'] "
					onClick={() => _deleteAvatar()}
					value="Delete"
				/>
			</div>
			<Form img={src} />
		</div>
	);
};
export default MyAccount;
