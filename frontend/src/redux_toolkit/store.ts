import { configureStore } from "@reduxjs/toolkit";
import gameSlice from "./game/gameSlice";

export const store = configureStore({
	reducer: {
		game: gameSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
