import { atom } from "jotai";
import { createContext } from "react";
import { Socket } from "socket.io-client";

export const OpponentData = atom<{
	opponent: {
		username: string;
		display_name: string;
		avatar_url: string;
	};
	isRotate: boolean;
	mapIndex: number;
}>({
	opponent: {
		username: "",
		display_name: "",
		avatar_url: "/assets/unknown.png",
	},
	isRotate: false,
	mapIndex: -1,
});

export const getCurrentSizes = (
	currentWidth: number,
	currentHeight: number,
): [number, number] => {
	const aspectRatio: number = 560 / 836;
	let newWidth: number;
	let newHeight: number;

	if (currentWidth < currentHeight) {
		newWidth = currentWidth;
		newHeight = newWidth / aspectRatio;
		if (newHeight > currentHeight) {
			newHeight = currentHeight;
			newWidth = newHeight * aspectRatio;
		}
	} else {
		newHeight = currentHeight;
		newWidth = newHeight * aspectRatio;
		if (newWidth > currentWidth) {
			newWidth = currentWidth;
			newHeight = newWidth / aspectRatio;
		}
	}
	return [newWidth, newHeight];
};

// export const SideBarContext: any = createContext<any>(null);
// export const ChangeContext: React.Context<any> = createContext(null);

//  calculateWidthHeight(): [number, number] {
// 		let width: number, height: number;
// 		if (this.divWidth < this.divHeight) {
// 			width = this.divWidth;
// 			height = (width * 1) / this.ar;
// 			if (height > this.divHeight) {
// 				height = this.divHeight;
// 				width = height * this.ar;
// 			}
// 		} else {
// 			height = this.divHeight;
// 			width = height * this.ar;
// 			if (width > this.divWidth) {
// 				width = this.divWidth;
// 				height = (width * 1) / this.ar;
// 			}
// 		}
// 		return [width, height];
// 	}
