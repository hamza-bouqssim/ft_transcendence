"use client";
import { useState, createContext } from "react";
import SideBar from "../components/SideBar";
import TopRightBar from "../components/TopRightBar";

export const ChangeContext: React.Context<any> = createContext(null);

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
	});

	const changeValues = { change, setChange };

	return (
		<html lang="en">
			<body>
				<div className=" flex  w-full  h-screen text-white">
					<SideBar
						sideBar={change.sideBar}
						onClick={() =>
							setChange({
								...change,
								sideBar: !change.sideBar,
								chatBox: false,
								menu: false,
							})
						}
					/>
					
					{/* <TopRightBar
						menu={change.menu}
						onClick={() =>
							setChange({
								...change,
								sideBar: false,
								chatBox: false,
								menu: !change.menu,
							})
						}
					/> */}

					{/* <div className="mt-[70px] h-[85%] w-full lg:flex lg:items-center lg:justify-evenly min-[1750px]:ml-72 min-[1750px]:mt-[90px] min-[1750px]:w-[86%]">
						{children}
					</div> */}


					<ChangeContext.Provider value={changeValues}>
						<div className="w-full h-full">

							{children}
						</div>
					</ChangeContext.Provider>
				</div>
			</body>
		</html>
	);
}