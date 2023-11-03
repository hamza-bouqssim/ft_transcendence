"use client";
import MyAccount from "@/app/components/MyAccount";
import Image from "next/image";

const Settings = () => {
	return (
		<div className="min-h-[850px] py-4 text-white">
			<div className="ml-8 mr-8 md:ml-32 md:mr-24 2xl:ml-96">
				<div className="my-32  flex  flex-col gap-16 rounded-[40px] bg-white p-4 md:p-10">
					<div className="">
						<h1 className="font-['Whitney'] text-[2rem] font-bold text-black md:text-[4rem]">
							Settings
						</h1>
						<h1 className="font-['Whitney_Semibold'] text-[1rem] text-[#474747] md:text-[2rem]">
							Customize your account settings
						</h1>
					</div>
					<div className="2xl:gap-50  flex">
						<div className="mr-9 hidden flex-auto border-r border-[#9F9F9F]  font-['Whitney_Semibold'] text-xl text-[#232544] xl:block ">
							<h1>Account settings</h1>
						</div>
						<div className="ml-auto flex-auto">
							<MyAccount />
						</div>
						<div className="hidden flex-auto 2xl:block ">
							<Image
								src="/assets/settingsLogo.svg"
								width={500}
								height={500}
								alt="settings"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Settings;