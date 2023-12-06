import Form from "./Form";
import Image from "next/image";
import { useState } from "react";

const MyAccount = () => {
	const [src, setSrc] = useState<string>("/assets/user2.jpeg");
	return (
		<div className="font-['Whitney Semibold'] text-xs md:text-sm lg:text-[1.3rem] ">
		
			<Form />
		</div>
	);
};
export default MyAccount;
