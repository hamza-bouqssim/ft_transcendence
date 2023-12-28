import { useState, useContext, useEffect } from "react";
import PopUp from "./popUp";
import { socketContext } from "../utils/context/socketContext";
import { Qrcodeform } from "./Qrcodefom";
import {
	changeDisplayedName,
	changePhoto,
	changeUserName,
	disable2Fa,
	firstTime,
} from "../utils/api";
import { useRouter } from "next/navigation";

type FormProps = {
	img: string;
};

const Form = ({ img }: FormProps) => {
	const { Userdata, setUserdata }: any = useContext(socketContext);

	const router = useRouter();
	const [display2fa, setDisplay2fa] = useState(false);
	const [show, setShow] = useState<boolean>(false);
	const [_username, setUsername] = useState("");
	const [_display_name, setDisplayname] = useState("");
	const [message, setMessage] = useState("");
	const [userNameMessage, setUsernameMessage] = useState("");
	const [displayNameMessage, setDisplayNameMessage] = useState("");
	const [success, setSuccess] = useState(true);
	const [uSuccess, setUSuccess] = useState(true);
	const [dSuccess, setDSuccess] = useState(true);
	useEffect(() => {
		
		// Set initial values from Userdata only if the state is empty
		if (!_username) {
			setUsername(Userdata?.username || "");
		}
		if (!_display_name) {
			setDisplayname(Userdata?.display_name || "");
		}
	}, [Userdata]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!_username.trim() || !_display_name.trim()) {
			setMessage("Please fill in all fields");
			setSuccess(false);
			return;
		}

		try {
			await changeDisplayedName(_display_name).then((displayNameResponse) => {
				if (
					displayNameResponse.data.success == false &&
					Userdata.first_time == false
				) {
					setDisplayNameMessage(displayNameResponse.data.message);
					setSuccess(displayNameResponse.data.success);
				}
				setDisplayNameMessage(displayNameResponse.data.message);
				setDSuccess(displayNameResponse.data.success);
			});
			await changeUserName(_username).then((res) => {
				if(res.data.success)
				{
					setUsernameMessage("Username " + res.data.message);
					setSuccess(res.data.success);
				}
				setUsernameMessage(res.data.message);
				setUSuccess(res.data.success);
			  });
			await changePhoto(Userdata.avatar_url);
			if (success)
				setUserdata((prevUserData: any) => ({
					...prevUserData,
					username: _username,
					display_name: _display_name,
					first_time: false,
				}));
			if (Userdata.first_time) {
				await firstTime();
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("error:", error);
			setMessage("Error saving");
			setSuccess(false);
		}
	};

	const closeQrForm: () => void = () => {
		setDisplay2fa(false);
	};
	const _disable = async () => {
		await disable2Fa()
			.then((res) => {
				// setIsVerified(res.data.success);
				setUserdata({ ...Userdata, tfa_enabled: false });
			})
			.catch((e) => {
			});
	};
	return (
		<>
			<div>
				<form
					className="mt-11 text-[15px] text-black md:text-[18px] lg:text-[21px]"
					onSubmit={handleSubmit}
				>
					{show ? <PopUp setShow={setShow} /> : null}
					<div className="my-2">
						<label
							htmlFor="fullName"
							className="block py-2 pl-4 font-['Whitney_SemiBold']"
						>
							Username
						</label>
						<input
							type="text"
							id="fullName"
							value={_username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your name"
							className="w-full rounded-[20px] border border-[#838383] px-4 py-3"
						/>
						{userNameMessage != "" && (<p style={{ color: uSuccess ? 'green' : 'red' }}>{userNameMessage}</p>)}
					</div>
					<div className="my-2">
						<label
							htmlFor="Login"
							className="block pb-1 pl-4 pt-3 font-['Whitney_SemiBold']"
						>
							Display_name
						</label>
						<input
							type="text"
							id="Login"
							value={_display_name}
							onChange={(e) => setDisplayname(e.target.value)}
							placeholder="Enter your login"
							className="w-full rounded-[20px] border  border-[#838383] px-4 py-3"
						/>
						{displayNameMessage != "" && (<p style={{ color: dSuccess ? 'green' : 'red' }}>{displayNameMessage}</p>)}
					</div>

					<div className="flex flex-col items-center  justify-center border-t border-[#9f9f9f4a] md:flex-row md:justify-evenly">
						<h1 className="p-4 font-['Whitney_SemiBold'] text-black ">
							Two-factor authentication
						</h1>
						<div className="my-3">
							{Userdata?.tfa_enabled ? (
								<input
									onClick={_disable}
									type="button"
									className="rounded-[20px] bg-[#EA7F87] px-8 py-3 text-white"
									value="Disable 2FA"
								/>
							) : (
								<input
									onClick={() => setDisplay2fa(true)}
									type="button"
									className="cursor-pointer rounded-[20px] bg-[--purple-color] px-8 py-3 font-['Whitney_SemiBold'] text-white"
									value="Enable 2FA"
								/>
							)}
						</div>
					</div>
					<div className=" flex items-center  justify-center pt-9 text-white ">
						<div className="m-auto">
							<h1 className="mb-4 font-['Whitney_SemiBold'] text-black">
								Save Changes
							</h1>
							<input
								type="submit"
								className="w-full cursor-pointer rounded-[20px] bg-[#5B8CD3] py-3 font-['Whitney_SemiBold']"
								value="Save"
							/>
						</div>
						<div className="m-auto ">
							<h1 className="mb-4 font-['Whitney_SemiBold'] text-black">
								Delete Account
							</h1>
							<input
								type="button"
								className="w-full cursor-pointer rounded-[20px] bg-[#EA7F87] py-3 font-['Whitney_SemiBold']"
								onClick={() => setShow(!show)}
								value="Delete"
							/>
						</div>
					</div>
				</form>
			</div>
			{display2fa && (
				<>
					<div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-[#00000095] opacity-100 backdrop-blur-md"></div>
					<Qrcodeform closeQrForm={closeQrForm} />
				</>
			)}
			{message != "" && (
				<p style={{ color: success ? "green" : "red" }}>{message}</p>
			)}
		</>
	);
};
export default Form;