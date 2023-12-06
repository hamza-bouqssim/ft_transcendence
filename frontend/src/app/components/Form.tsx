import { useContext, useEffect, useState } from "react";
import PopUp from "./popUp";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { CreateChangeParams, User } from "../utils/types";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import {  fetchUpdateAvatar, fetchUpdateDisplayName, fetchUpdateUserName } from "../store/usersSlice";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { socketContext } from "../utils/context/socketContext";
import { getAuthUser } from "../utils/api";



const Form = () => {
	const [name, setName] = useState<string>("");
	const [login, setLogin] = useState<string>("");
	const [pass, setPass] = useState<string>("");
	const [confirm, setConfirm] = useState<string>("");
	const [show, setShow] = useState<boolean>(false);
	const {register, handleSubmit,formState: { errors }} = useForm<CreateChangeParams>();
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
		  if(res2.payload.success)
		  {
			ToastFunction(res2.payload.response.message);

		  }else{
			ToastFunction(res2.payload.message);

		  }
		  data.avatarUrl = "https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340";
		  console.log("avatar-->", data.avatarUrl[0]);
		  const formData = new FormData();

		  formData.append('file', data.avatarUrl); 
		  const res3 = await dispatch(fetchUpdateAvatar(formData));
		  console.log("res3-->", res3);
    		if (res3.payload.success) {
      			ToastFunction(res3.payload.response.message);
    		} else {
      			ToastFunction(res3.payload.message);
    		}



		 
    	
    
		} catch (err: any) {
			ToastFunction(`An unknown error occurred`);
		}
	  };

	  const [user, setUser] = useState<User | undefined>();

	  useEffect(() => {
        getAuthUser().then(({data}) => {
            setUser(data);
        })
        .catch((err)=> {console.log(err);});
    }, [user])

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
						src={user?.avatar_url}
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
  					{...register('avatarUrl', { required: 'avatarUrl is required' })}
  					// 	onChange={(e) => {
    				// 	const selectedFile = e.target.files && e.target.files[0];
    				// 	console.log('Selected file:', selectedFile);
					// 	console.log("file-->", selectedFile?.name);
					// 	setUser((prevUser) => ({
					// 		...prevUser!,
					// 		avatar_url: selectedFile?.name || prevUser?.avatar_url || '',
					// 	  }));
  					// }}
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
							setUser((prevUser) => ({
							...prevUser!,
							avatar_url:  prevUser?.avatar_url || '',
						  }));
  				
					}}
					value="Delete"
				/>
			</div>
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