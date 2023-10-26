import { createSlice } from "@reduxjs/toolkit";

interface gameState {
	leftScore: number;
	rightScore: number;
}

const initialState: gameState = {
	leftScore: 0,
	rightScore: 0,
};

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		incrementLeftScore: (state) => {
			state.leftScore += 1;
		},
		incrementRightScore: (state) => {
			state.rightScore += 1;
		},
	},
});

export const { incrementLeftScore, incrementRightScore } = gameSlice.actions;

export default gameSlice.reducer;
