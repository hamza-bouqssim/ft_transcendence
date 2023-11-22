import { useEffect } from 'react';
import Swal from 'sweetalert2';

const GameFinishedPopUp = (router : any) => {
		Swal.fire({
		title: 'Game Is Finished!',
		icon: 'info',
		iconColor: 'var(--pink-color)',
		color: '#ffff',
		background: '#2E2F54',
		customClass: "rounded-[30px] font-['Whitney_BlackSc'] text-sm",
		confirmButtonColor: 'var(--purple-color)',
		confirmButtonText: 'OK',
		allowOutsideClick: false,
		}).then(() => {
			router.back();
		});
};

export default GameFinishedPopUp;

