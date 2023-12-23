export interface UserInfoType {
	id: string;
	username: string;
	display_name: string;
	avatar_url: string;
}

export interface PlayerType {
	username: string;
	picture: string;
	rank: number;
}

export interface ResultsType {
	win: number;
	level: number;
	lose: number;
}

export interface HistoryMatchesType {
	playerOne: string;
	resultOne: string;
	playerTwo: string;
	resultTwo: string;
	duration: string;
	date: string;
	totalMatch: string;
}