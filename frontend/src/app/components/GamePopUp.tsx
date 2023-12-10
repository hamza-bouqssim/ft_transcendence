import Swal from "sweetalert2";

export const GameFinishedPopUp = (router: any) => {
	Swal.fire({
		title: "Game Is Finished!",
		icon: "info",
		iconColor: "var(--pink-color)",
		color: "#ffff",
		background: "#2E2F54",
		customClass: "rounded-[30px] font-['Whitney_BlackSc'] text-sm",
		confirmButtonColor: "var(--purple-color)",
		confirmButtonText: "OK",
		allowOutsideClick: false,
	}).then(() => {
		router.back();
	});
};

export const WinnerPlayerPopUp = (router: any) => {
	Swal.fire({
		title: "You Won!",
		icon: "info",
		iconColor: "var(--pink-color)",
		color: "#ffff",
		background: "#2E2F54",
		imageUrl: "/assets/winner-player.gif",
		imageWidth: "90%",
		customClass: "rounded-[30px] font-['Whitney_BlackSc'] text-sm",
		confirmButtonColor: "var(--purple-color)",
		confirmButtonText: "OK",
		allowOutsideClick: false,
	}).then(() => {
		router.push("/dashboard");
	});
};

export const LoserPlayerPopUp = (router: any) => {
	Swal.fire({
		title: "You Lost!, Good Luck Next Time",
		icon: "info",
		iconColor: "var(--pink-color)",
		color: "#ffff",
		background: "#2E2F54",
		imageUrl: "/assets/loser-player.gif",
		imageWidth: "90%",
		customClass: "rounded-[30px] font-['Whitney_BlackSc'] text-sm",
		confirmButtonColor: "var(--purple-color)",
		confirmButtonText: "OK",
		allowOutsideClick: false,
	}).then(() => {
		router.push("/dashboard");
	});
};
