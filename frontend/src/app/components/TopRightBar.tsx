import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBell } from "@fortawesome/free-solid-svg-icons";
import { LogoutButton, MenuButton } from "./Buttons";
import { useEffect, useState ,useContext} from "react";
import { getAuthUser, getNumberNotification, getlogout } from "../utils/api";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import NotificationComponent from "./NotificationComponent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { socketContext } from "../utils/context/socketContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchCountNotification } from "../store/notificationSlice";

type Change = {
	menu: boolean;
	onClick: any;
};

const TopRightBar = (props: Change) => {
	const dispatch = useDispatch<AppDispatch>();
	const { notification, status, error, count  } = useSelector((state:any) => state.notification);
	const ToastError = (message: any) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };
	
	  const ToastSuccess = (message: any) => {
		toast.success(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };
	const {Userdata , setUserdata} = useContext(socketContext)
    useEffect(() => {
		dispatch(fetchCountNotification());
		getAuthUser().then(({ data }) => {
			setUserdata(prevData => ({
				...prevData,
				...data,
			}));
		}).catch((err) => {
			console.log(err);
		});
	}, [setUserdata, dispatch]);
	const router = useRouter();
	const [notfication , setNotefication] = useState(false)
	const logout = () => {
		try {
			getlogout();
			deleteCookie("logged");
			router.push("/", { scroll: false });
			ToastSuccess(`Logout succefully `);
		} catch (err) {
			ToastError(`Failed to logout`);

		}
	}

	// const [notificationCount, setNotificationCount] = useState(0);

	// const fetchNotificationCount = () => {
	// 	dispatch(fetchCountNotification())
	// 	.unwrap()
	// 	.then(({data}) => {
	// 		setNotificationCount(data);
		 
	// 	}).catch((err : any)=>{
	// 	console.log(err);
	// 	}
	// 	);
	//   };
	
	return (
		<>
		<ToastContainer />
		<div className="fixed z-50 right-0 top-6  flex h-12 w-64 items-center justify-end gap-2 rounded-l-3xl lg:right-7 min-[1750px]:h-14 min-[1750px]:w-80 min-[1750px]:gap-4">
			<div className="relative ">
			<div onClick={() => {setNotefication(!notfication)}} className="relative">
				<FontAwesomeIcon
					icon={faBell}
					className="left-0 cursor-pointer rounded-[50%] bg-[#ffffff38] p-3 hover:bg-[--pink-color] min-[1750px]:h-6 min-[1750px]:w-6"
					/>
				<span className="absolute right-8 top-[-5px] rounded-2xl bg-[--pink-color] px-2 font-['Whitney_Bold']">
				{count}				
				</span>
			</div>
			{
				notfication && 

				<NotificationComponent></NotificationComponent>
				
			}
			</div>
			<div className="flex h-full w-52 items-center justify-between rounded-l-3xl bg-[#ffffff38] pl-1 pr-4 lg:w-56 lg:rounded-3xl min-[1750px]:w-64">
			{Userdata && Userdata.avatar_url && (
  				<Image
    				className="h-10 w-10 rounded-[50%] bg-black min-[1750px]:h-12 min-[1750px]:w-12"
    				key={0}
    				src={Userdata.avatar_url}
    				width={72}
    				height={51}
    				alt="user"
  					
					/>
				)}
				<div className="font-['Whitney_Bold'] leading-3">
					<h6 className="text-sm min-[1750px]:text-lg">{Userdata?.display_name}</h6>
					<span className="text-xs min-[1750px]:text-sm">{Userdata?.username}</span>
				</div>

				<FontAwesomeIcon
					icon={faChevronDown}
					className={`transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl ${
						props.menu ? "rotate-[180deg]" : "rotate-0"
					}`}
					onClick={props.onClick}
				/>
				<div
					className={`absolute ${
						props.menu ? "flex" : "hidden"
					} right-4 top-14 h-[134px] w-[247px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#8E8E8E] bg-white font-['Whitney_Semibold'] lg:right-[32px] lg:top-[64px]`}
				>
					<MenuButton background={"bg-[#d9d9d9]"} value="View Profile" />
					<MenuButton background={"bg-[#BBBBBB]"} value="Settings" />
					<LogoutButton background={"bg-[#EA7F87]"} value="Logout" />
				</div>
			</div>
		</div>
			{
			notfication && 
				<div className=" opacity-100 backdrop-blur-md absolute z-10 left-0 right-0 bottom-0  top-0">

					
				</div>
			}
			</>

	);
};

export default TopRightBar;

function setCookie(arg0: string, arg1: boolean) {
	throw new Error("Function not implemented.");
}
