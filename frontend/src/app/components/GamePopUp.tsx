import Swal from "sweetalert2";

export const ReloadPage = (router: any, e: BeforeUnloadEvent) => {
	e.preventDefault();
	Swal.fire({
		title: "Are You Sure?",
		text: "U Wanna Leave Game?",
		icon: "warning",
		iconColor: "var(--pink-color)",
		color: "#ffff",
		background: "#2E2F54",
		customClass: "rounded-[30px] font-['Whitney_BlackSc'] text-sm",
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: "Cancel",
		cancelButtonColor: "var(--pink-color)",
		confirmButtonText: "Leave",
		confirmButtonColor: "var(--purple-color)",
		allowOutsideClick: false,
	}).then((result) => {
		if (result.isConfirmed) router.push("/dashboard");
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
