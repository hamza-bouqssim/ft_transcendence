import { createSlice } from "@reduxjs/toolkit";

interface gameState {
	chosenMapIndex: number;
}

const initialState: gameState = {
	chosenMapIndex: 0,
};

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		incrementLeftScore: (state) => {
			state.chosenMapIndex += 1;
		},
	},
});

export const { chosenMapIndex } = gameSlice.actions;

export default gameSlice.reducer;
