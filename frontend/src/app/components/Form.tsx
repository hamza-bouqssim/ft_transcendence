import { useState } from "react";
import PopUp from "./popUp";
import Swal from "sweetalert2";

type FormProps = {
	img: string;
};

const Form = ({ img }: FormProps) => {
	const [name, setName] = useState<string>("");
	const [login, setLogin] = useState<string>("");
	const [pass, setPass] = useState<string>("");
	const [confirm, setConfirm] = useState<string>("");

	const [show, setShow] = useState<boolean>(false);
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setShow(false);
		if (pass !== confirm) {
			// alert("Passwords don't match");
			Swal.fire({
				title: "Passwords don't match!",
				confirmButtonColor: "red",
				customClass: "rounded-3xl",
			});
		} else {
			alert("Form submitted");
		}
	};
	return (
		<div>
			<form
				className="mt-11 text-[15px] text-black md:text-[18px] lg:text-[21px]"
				onSubmit={handleSubmit}
			>
				{show ? <PopUp setShow={setShow} /> : null}
				<div className="my-2">
					<label htmlFor="fullName" className="block py-2 pl-4">
						Full name
					</label>
					<input
						type="text"
						id="fullName"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter your name"
						className="w-full rounded-[20px] border border-[#838383] px-4 py-3"
					/>
				</div>
				<div className="my-2">
					<label htmlFor="Login" className="block pb-1 pl-4 pt-3">
						Login
					</label>
					<input
						type="text"
						id="Login"
						value={login}
						onChange={(e) => setLogin(e.target.value)}
						placeholder="Enter your login"
						className="w-full rounded-[20px] border  border-[#838383] px-4 py-3"
					/>
				</div>
				<div className="my-4 flex flex-col justify-between gap-5 md:flex-row ">
					<div>
						<label htmlFor="pass" className="block pb-1 pl-4 pt-3">
							Set Password
						</label>
						<input
							type="password"
							id="pass"
							value={pass}
							onChange={(e) => setPass(e.target.value)}
							placeholder="Enter your password"
							className="w-full rounded-[20px] border border-[#838383] px-4  py-3 md:w-auto"
						/>
					</div>
					<div>
						<label htmlFor="confirm" className="block pb-1 pl-4 pt-3">
							Confirm
						</label>
						<input
							type="password"
							id="confirm"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							placeholder="Confirm your password"
							className="w-full rounded-[20px] border border-[#838383] px-4 py-3 md:w-auto"
						/>
					</div>
				</div>
				<div className="flex flex-col items-center  justify-center border-t border-[#9f9f9f4a] md:flex-row md:justify-evenly">
					<h1 className="p-4 text-black ">Two-factor authentication</h1>
					<div className="my-3">
						<input
							type="button"
							className="rounded-[20px] bg-[#5B8CD4] px-8 py-3 text-white"
							value="Enable"
						/>
					</div>
				</div>
				<div className=" flex items-center  justify-center pt-9 text-white ">
					<div className="m-auto">
						<h1 className="mb-4 text-black">Save Changes</h1>
						<input
							type="submit"
							className="w-full cursor-pointer  rounded-[20px] bg-[#5B8CD3] py-3"
							value="Save"
						/>
					</div>
					<div className="m-auto ">
						<h1 className="mb-4 text-black">Delete Account</h1>
						<input
							type="button"
							className="w-full cursor-pointer rounded-[20px] bg-[#EA7F87] py-3"
							onClick={() => setShow(!show)}
							value="Delete"
						/>
					</div>
				</div>
			</form>
		</div>
	);
};
export default Form;