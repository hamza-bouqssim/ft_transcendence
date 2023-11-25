import { createSlice } from "@reduxjs/toolkit";

interface gameState {
	gameMode: string;
	chosenMapIndex: number;
}

const initialState: gameState = {
	gameMode: "",
	chosenMapIndex: 0,
};

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		setGameMode: (state, action) => {
			console.log("payload:", action.payload);
			state.gameMode = action.payload;
		},
		// chosenMapIndex: (state) => {},
	},
});

export const { setGameMode } = gameSlice.actions;

export default gameSlice.reducer;
