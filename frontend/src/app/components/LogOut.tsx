import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const LogOut = () => {
	const MySwal = withReactContent(Swal);

	MySwal.fire({
		title: "Are You Sure?",
		color: "#ffff",
		icon: "question",
		iconColor: "#498cda",
		showCancelButton: true,
		background: "#2E2F54",
		confirmButtonColor: "#fc7785",
		cancelButtonColor: "#6a67f3",
		confirmButtonText: "Yes, Log Out!",
		customClass: "rounded-[30px] font-['Whitney_BlackSc'] text-sm",
	}).then((result: any) => {
		if (result.isConfirmed)
			window.location.href = "http://localhost:8000/auth/logout";
	});
};

export default LogOut;
