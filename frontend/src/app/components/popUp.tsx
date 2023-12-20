import { deleteAccount } from "../utils/api";

type PopUpProps = {
	setShow: (show: boolean) => void;
};
// const deleting = async () => {
// 	await deleteAccount().then((res) => console.log(res));
// }
const PopUp = ({ setShow }: PopUpProps) => {
	return (
		<div className="absolute inset-0 grid w-full place-content-center backdrop-blur-sm">
			<div
				className=" absolute inset-0 bg-slate-900/50"
				onClick={() => setShow(false)}
			></div>
			<div className="z-10 m-auto flex w-[80%] flex-col items-center gap-10 rounded-[20px] bg-white px-5 py-9 sm:w-auto">
				<h1 className="text-[30px] font-bold md:text-[40px]">Be careful !</h1>
				<h1 className=" text-[12px] md:text-[18px]">
					Are you sure you want to delete your account ?
				</h1>
				<div className="flex w-full justify-center gap-6 px-16 text-[13px] font-bold text-white md:text-[20px]">
					<button className="w-full rounded-[20px] bg-[#EA7F87] px-5 py-3 " >
						Yes
					</button>
					<button
						type="button"
						className="w-full rounded-[20px] bg-[#5B8CD3]  px-5 py-3  "
						onClick={() => setShow(false)}
					>
						No
					</button>
				</div>
			</div>
		</div>
	);
};

export default PopUp;
