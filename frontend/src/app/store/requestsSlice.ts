import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllRequests } from "../utils/api";
import { RequestTypes } from "../utils/types";


export interface requestState {
	requests: RequestTypes[];
	status: "success" | "failed" | "idle" | "loading"; // Add 'idle' status
	error: string | null;
}

const initialState: requestState = {
	requests: [],
	status: "idle", // Initial status is 'idle'
	error: null,
};


export const fetchGetRequestsThunk = createAsyncThunk("request/fetchGetRequestThunk",async (_, { rejectWithValue }) => {
		
			const response = await getAllRequests();
			console.log("response here-->", response);
			return response.data;
		
	},
);


export const requestsSlice = createSlice({
	name: "requests",
	initialState,
	reducers: {
		addRequests: (state) => {},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchGetRequestsThunk.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchGetRequestsThunk.fulfilled, (state, action) => {
				state.status = "success";
				state.requests = action.payload;

			})
			.addCase(fetchGetRequestsThunk.rejected, (state, action) => {
				state.status = "failed";
			})

			
	},
});

export const { addRequests } = requestsSlice.actions;

export default requestsSlice.reducer;
