import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { LogoutButton, MenuButton } from "./Buttons";
import { useEffect, useState, useContext, useRef } from "react";
import { getAuthUser, getNumberNotification, getlogout } from "../utils/api";
import { useRouter } from "next/navigation";
import NotificationComponent from "./NotificationComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socketContext } from "../utils/context/socketContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchCountNotification } from "../store/notificationSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { User } from "../utils/types";

const TopRightBar = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { notification, status, error, count } = useSelector(
		(state: any) => state.notification,
	);
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
	const { Userdata, setUserdata } = useContext(socketContext);
	useEffect(() => {
		
		dispatch(fetchCountNotification());
		getAuthUser()
			.then(({ data }) => {
				setUserdata((prevData) => ({
					...prevData,
					...data,
				}));
			})
			.catch((err) => {
			});
	}, [setUserdata, dispatch]);
	const router = useRouter();
	const [notfication, setNotefication] = useState(false);
	// const logout = () => {
	// 	try {
	// 		getlogout();
	// 		deleteCookie("logged");
	// 		router.push("/", { scroll: false });
	// 		ToastSuccess(`Logout succefully `);
	// 	} catch (err) {
	// 		ToastError(`Failed to logout`);
	// 	}
	// };
	const menuRef = useRef<HTMLDivElement>(null);
	const subMenuRef = useRef<HTMLDivElement>(null);
	const faChevronDownRef = useRef<SVGSVGElement>(null);

	const [rotate, setRotate] = useState<boolean>(false);

	const handleDocumentClick = (event: any) => {
		if (menuRef.current && !menuRef.current.contains(event.target)) {
			setNotefication(false);
		}
	};

	useEffect(() => {
		
		if (notfication) {
			document.addEventListener("click", handleDocumentClick);
		} else {
			document.removeEventListener("click", handleDocumentClick);
		}

		return () => {
			document.removeEventListener("click", handleDocumentClick);
		};
	}, [notfication]);

	useEffect(() => {
		
		const handleCLickEvent = (e: MouseEvent) => {
			if (!faChevronDownRef.current?.contains(e.target as Node))
				setRotate(false);
		};

		document.addEventListener("click", handleCLickEvent);

		return () => document.removeEventListener("click", handleCLickEvent);
	}, []);

	const getDisplayUser = (user : User | null) => {
		
        const truncatedDisplayName =
          user?.display_name.length > 10
            ? `${user?.display_name.substring(0, 10)}...`
            : user?.display_name;
    
        return {
          ...user,
          display_name: truncatedDisplayName,
        };
      };

	return (
		<>
			<ToastContainer />
			<div className="fixed right-0 top-6 z-50  flex h-12 w-64 items-center justify-end gap-2 rounded-l-3xl lg:right-7 min-[1750px]:h-14 min-[1750px]:w-80 min-[1750px]:gap-4">
				<div className="relative ">
					<div
						onClick={() => {
							setNotefication(true);
						}}
						className="relative"
					>
						<FontAwesomeIcon
							icon={faBell}
							className="left-0 cursor-pointer rounded-[50%] bg-[#ffffff38] p-3 hover:bg-[--pink-color] min-[1750px]:h-6 min-[1750px]:w-6"
						/>
						{count > 0 && (
							<span className="absolute right-8 top-[-5px] rounded-2xl bg-[--pink-color] px-2 font-['Whitney_Bold']">
								{count}
							</span>
)}
					</div>
					{notfication && (
						<div ref={menuRef}>
							<NotificationComponent></NotificationComponent>
						</div>
					)}
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
						<h6 className="text-sm min-[1750px]:text-lg">
							{getDisplayUser(Userdata).display_name}
						</h6>
						<span className="text-xs min-[1750px]:text-sm">
							{Userdata?.username}
						</span>
					</div>

					<ExpandMoreIcon
						ref={faChevronDownRef}
						className={`inline-block transform cursor-pointer text-2xl hover:text-[--pink-color] lg:text-3xl ${
							rotate ? "rotate-[180deg]" : "rotate-0"
						}`}
						style={{
							transition: "transform 0.5s ease-in-out",
						}}
						onClick={() => setRotate(!rotate)}
					/>
					{rotate && (
						<div
							ref={subMenuRef}
							className={`absolute right-4 top-14 flex h-[134px] w-[247px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#8E8E8E] bg-white font-['Whitney_Semibold'] lg:right-[32px] lg:top-[64px]`}
						>
							<MenuButton background={"bg-[#d9d9d9]"} value="View Profile" />
							<MenuButton background={"bg-[#BBBBBB]"} value="Settings" />
							<LogoutButton background={"bg-[#EA7F87]"} value="Logout" />
						</div>
					)}
				</div>
			</div>
			{notfication && (
				<div className=" absolute bottom-0 left-0 right-0 top-0 z-10 bg-[#2e2f54d9]  opacity-100"></div>
			)}
		</>
	);
};

export default TopRightBar;
