"use client";
import SideBar from "@/app/components/SideBar";
import { useState } from "react";
import TopRightBar from "@/app/components/TopRightBar";
import Pongg from "./Pongg";

const Game = () => {
	const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
	});

	return (
		<section className="relative h-[100vh] min-h-[850px] py-4 text-white">
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
			<TopRightBar
				menu={change.menu}
				onClick={() =>
					setChange({
						...change,
						sideBar: false,
						chatBox: false,
						menu: !change.menu,
					})
				}
			/>
			<Pongg />
		</section>
	);
};

export default Game;
