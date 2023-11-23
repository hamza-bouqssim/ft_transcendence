import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllRoomsApi, createRoomsApi, updateRoomsApi, deleteRoomsApi } from '../utils/api';

interface Room {
  id: string;
  name: string;
  Privacy: string;
  password: string;
  picture: string;
}

interface RoomState {
  rooms: Room[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching all rooms
export const getAllRooms = createAsyncThunk('rooms/getAllRooms', async () => {
    const response = await getAllRoomsApi();
    return response.data;

});

// Async thunk for creating a room
export const createRooms = createAsyncThunk('rooms/createRooms', async (data: Room) => {
  const response = await createRoomsApi(data);
  return response.data;
});

// Async thunk for updating a room
export const updateRooms = createAsyncThunk('rooms/updateRooms', async (data: Room) => {
  const response = await updateRoomsApi(data);
  return response.data;
});

// Async thunk for deleting a room
export const deleteRooms = createAsyncThunk('rooms/deleteRooms', async (roomId: string) => {
  const response = await deleteRoomsApi(roomId);
  return response.data;
});

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers: (builder:any) => {
    builder
      .addCase(getAllRooms.pending, (state:any) => {
        state.status = 'loading';
      })
      .addCase(getAllRooms.fulfilled, (state:any, action: PayloadAction<Room[]>) => {
        state.status = 'succeeded';
        state.rooms = action.payload;
      })
      .addCase(getAllRooms.rejected, (state:any, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createRooms.fulfilled, (state:any, action:any) => {
        state.rooms.push(action.payload);
      })
      .addCase(updateRooms.fulfilled, (state:any, action:any) => {
        const index = state.rooms.findIndex((room: Room) => room.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      .addCase(deleteRooms.fulfilled, (state:any, action:any) => {
        state.rooms = state.rooms.filter((room: Room) => room.id !== action.payload);
      });
  },
});

export default roomSlice.reducer;