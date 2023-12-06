import { useState } from "react";
import PopUp from "./popUp";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { CreateChangeParams } from "../utils/types";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { fetchUpdateAvatarUrl, fetchUpdateDisplayName, fetchUpdateUserName } from "../store/usersSlice";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Form = () => {
	const [name, setName] = useState<string>("");
	const [login, setLogin] = useState<string>("");
	const [pass, setPass] = useState<string>("");
	const [confirm, setConfirm] = useState<string>("");
	const [show, setShow] = useState<boolean>(false);
	const {register, handleSubmit, formState: { errors }} = useForm<CreateChangeParams>();
	const dispatch = useDispatch<AppDispatch>();

	const ToastFunction = (message : any) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000, // You can customize the duration
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };

	

	const onSubmit = async (data: CreateChangeParams) => {
		try {
		  const res1 = await dispatch(fetchUpdateDisplayName(data.display_name));
		  if(res1.payload.success)
		  {
			ToastFunction(res1.payload.response.message);

		  }else{
			ToastFunction(res1.payload.message);

		  }
		  const res2 = await dispatch(fetchUpdateUserName(data.username));
		  if(res1.payload.success)
		  {
			ToastFunction(res2.payload.response.message);

		  }else{
			ToastFunction(res2.payload.message);

		  }
		} catch (err: any) {
			ToastFunction(`An unknown error occurred`);
		}
	  };
	const [src, setSrc] = useState<string>("/assets/user2.jpeg");

	return (
		<div>
			<ToastContainer />
			<form
				className="mt-11 text-[15px] text-black md:text-[18px] lg:text-[21px]"
				onSubmit={handleSubmit(onSubmit)}

			>
				<div className="flex flex-col items-center justify-around gap-5 border-b border-[#9f9f9f4a] pb-3 md:flex-row">
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
						{...register('avatarUrl', {required: 'avatarUrl is required'})}

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
			</div>
				{/* {show ? <PopUp setShow={setShow} /> : null} */}
				<div className="my-2">
					<label htmlFor="fullName" className="block py-2 pl-4">
						Username
					</label>
					<input
						type="text"
						placeholder="Enter your name"
						className="w-full rounded-[20px] border border-[#838383] px-4 py-3"
						{...register('username', {required: 'username is required'})}
					/>
				</div>
				<div className="my-2">
					<label htmlFor="Login" className="block pb-1 pl-4 pt-3">
						Display_name
					</label>
					<input
						type="text"
						placeholder="Enter your login"
						className="w-full rounded-[20px] border  border-[#838383] px-4 py-3"
						{...register('display_name', {required: 'display_name is required'})}

						
					/>
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
					
				</div>
			</form>
		</div>
	);
};
export default Form;