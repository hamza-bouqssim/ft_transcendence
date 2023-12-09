import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllRoomsApi, createRoomsApi, updateRoomsApi, deleteRoomsApi } from '../utils/api';

interface Room {
  id: string;
  name: string;
  Privacy: string;
  picture: string;
  password?:string,
  createdAt: string;
  updatedAt: string;
  members: {
    isAdmin: boolean;
  };
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

export const getAllRooms = createAsyncThunk('rooms/getAllRooms', async (_,{rejectWithValue} ) => {
  try {
    const response = await getAllRoomsApi();
    return response.data; 
  } catch (error : any) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue('Failed to fetch rooms');
    }
  }
});

export const createRooms = createAsyncThunk('rooms/createRooms', async (data: Room) => {
  try
  {
    const response = await createRoomsApi(data);
    return response.data;
  }catch(error)
  {
    return error
  }
});

export const updateRooms = createAsyncThunk('rooms/updateRooms', async (data: Room) => {
  try
  {
    const response = await updateRoomsApi(data);
    console.log(response.data)
    return response.data;
  }catch(error)
  {
    return error
  }
});

export const deleteRooms = createAsyncThunk('rooms/deleteRooms', async (roomId: string) => {
  try
  {
    const response = await deleteRoomsApi(roomId);
    return response.data;
  }catch(error)
  {
    return error
  }
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
        state.rooms = action.payload.data;
      })
      .addCase(getAllRooms.rejected, (state:any, action: PayloadAction<string>) => {;
        state.status = 'failed';
        state.error = action.payload;
        
      })
      .addCase(createRooms.fulfilled, (state:any, action:any) => {
        const newRoom = action.payload;
        state.rooms.push(newRoom);
      })
      .addCase(updateRooms.fulfilled, (state:any, action: PayloadAction<Room>) => {
        const updateData = action.payload.data
        console.log(updateData)
        const index = state.rooms.findIndex((room: Room) => room.id === updateData.id);
        if (index !== -1) {
          state.rooms[index] = action.payload.data;
        }
      })
      .addCase(deleteRooms.fulfilled, (state:any, action: PayloadAction<Room>) => {
        const deletedRoom = action.payload.data;
        const index = state.rooms.findIndex((room:Room) => room.id === deletedRoom.id);
        if (index !== -1) {
          state.rooms.splice(index, 1);
        }
      });
  },
});

export default roomSlice.reducer;