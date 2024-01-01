"use client";
import AuthCheck from "@/app/utils/AuthCheck";
import { Qrcodeform } from "../../components/Qrcodefom";

const TwoFactorVerify = () => {
	return (
		<AuthCheck>

		<div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-[#00000095] opacity-100 backdrop-blur-md">
			<Qrcodeform closeQrForm={() => {}} />
		</div>
		</AuthCheck>
	);
};
export default TwoFactorVerify;
