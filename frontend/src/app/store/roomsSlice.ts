import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllRoomsApi, createRoomsApi, updateRoomsApi, deleteRoomsApi } from '../utils/api';

interface Member {
  user_id: string;
  isAdmin: boolean;
}



interface Room {
  id: string;
  name: string;
  Privacy: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
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
      .addCase(createRooms.pending, (state:any) => {
        state.status = 'loading';
      })
      .addCase(createRooms.fulfilled, (state:any, action:any) => {
        state.status = 'succeeded';
        const newRoom = action.payload;
        state.rooms.push(newRoom);
      })
      .addCase(createRooms.rejected, (state:any, action:any) => {;
        state.status = 'failed';
        state.error = action.payload;
        
      }).
      addCase(updateRooms.pending, (state:any) => {
        state.status = 'loading';
      })
      .addCase(updateRooms.fulfilled, (state:any, action: PayloadAction<Room>) => {
        state.status = 'succeeded';
        const updateData = action.payload.data
        console.log(updateData)
        const index = state.rooms.findIndex((room: Room) => room.id === updateData.id);
        if (index !== -1) {
          state.rooms[index] = action.payload.data;
        }
      })
      .addCase(updateRooms.rejected, (state:any, action:any) => {;
        state.status = 'failed';
        state.error = action.payload;
        
      })
  },
});

export default roomSlice.reducer;