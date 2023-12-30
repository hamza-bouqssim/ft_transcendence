import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllRoomsApi, createRoomsApi, updateRoomsApi, deleteRoomsApi, joinRoomApi } from '../utils/api';
import { ConversationTypes } from '../utils/types';



interface createRoom {
  name: string;
  Privacy: string;
  password: string | null;
  picture: string | null;
  idUserAdd: string[]; 
}

interface join {
	id :string;
    Privacy :string;
    password :string;
}



interface RoomState {
	rooms: ConversationTypes[];
	status: {
		get: "idle" | "loading" | "succeeded" | "failed";
		create: "idle" | "loading" | "succeeded" | "failed";
		update: "idle" | "loading" | "succeeded" | "failed";
	};
	error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  status: {
    get: 'idle',
    create: 'idle',
    update: 'idle',
  },
  error: null,
};

export const getAllRooms = createAsyncThunk('rooms/getAllRooms', async (_,{rejectWithValue} ) => {
  try {
    const response = await getAllRoomsApi();
    return response.data.data; 
  } catch (error : any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('Failed to fetch rooms');
    }
  }
});

export const createRooms = createAsyncThunk('rooms/createRooms', async (data: createRoom,{rejectWithValue}) => {
  try
  {
    const response = await createRoomsApi(data);
    return response.data.data;
  } catch (error : any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('Failed to create rooms');
    }
  }
});

export const updateRooms = createAsyncThunk('rooms/updateRooms', async (data: ConversationTypes | null,{rejectWithValue}) => {
  try {
    const response = await updateRoomsApi(data);    
    return response.data.data;
  } catch (error : any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('Failed to create rooms');
    }
  }
});
export const joinToRoom = createAsyncThunk('rooms/joinRoom', async (data: join ,{rejectWithValue}) => {
	try {
	  const response = await joinRoomApi(data);    
	  return response.data.data;
	} catch (error : any) {
	  if (error.response && error.response.data) {
		return rejectWithValue(error.response.data);
	  } else {
		return rejectWithValue('Failed to join rooms');
	  }
	}
  });

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
	updateRoomMessage: (state, action) => {
		const { roomId, updatedMessage } = action.payload;
		const room = state.rooms.find((room) => room.id === roomId);
		if (room) {
		  room.messageRome[0] = {
			...room.messageRome[0],
			...updatedMessage,
		  };
		}
	  },
  },
  extraReducers: (builder:any) => {
    builder
			.addCase(getAllRooms.pending, (state: any) => {
				state.status.get = "loading";
			})
			.addCase(
				getAllRooms.fulfilled,
				(state: any, action: PayloadAction<ConversationTypes[]>) => {
					state.status.get = "succeeded";
					state.rooms = action.payload;
				},
			)
			.addCase(
				getAllRooms.rejected,
				(state: any, action: PayloadAction<string>) => {
					state.status.get = "failed";
					state.error = action.payload;
				},
			)
			.addCase(createRooms.pending, (state: any) => {
				state.status.create = "loading";
			})
			.addCase(createRooms.fulfilled, (state: any, action: any) => {
				state.status.create = "succeeded";
				const newRoom = action.payload;
				state.rooms.push(newRoom);
			})
			.addCase(createRooms.rejected, (state: any, action: any) => {
				state.status.create = "failed";
			})
			.addCase(updateRooms.pending, (state: any) => {
				state.status.update = "loading";
			})
			.addCase(
				updateRooms.fulfilled,
				(state: any, action: PayloadAction<ConversationTypes>) => {
					state.status.update = "succeeded";
					const updateData = action.payload;
					console.log( action.payload)
					const index = state.rooms.findIndex(
						(room: ConversationTypes) => room.id === updateData.id,
					);
					if (index !== -1) {
						state.rooms[index] = action.payload;
					}
				},
			)
			.addCase(updateRooms.rejected, (state: any, action: any) => {
				state.status.update = "failed";
			});
  },
});
export const { updateRoomMessage } = roomSlice.actions
export default roomSlice.reducer;