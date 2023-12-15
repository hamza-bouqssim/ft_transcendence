import { atom } from "jotai";

const OpponentData = atom<{
	opponent: {
		username: string;
		display_name: string;
		avatar_url: string;
	};
	isRotate: boolean;
}>({
	opponent: {
		username: "",
		display_name: "",
		avatar_url: "/assets/unknown.png",
	},
	isRotate: false,
});

export default OpponentData;
