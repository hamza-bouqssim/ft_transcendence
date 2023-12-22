import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllRoomsApi, createRoomsApi, updateRoomsApi, deleteRoomsApi } from '../utils/api';



interface createRoom {
  name: string;
  Privacy: string;
  password: string | null;
  picture: string | null;
  idUserAdd: string[]; 
}

interface Member {
  user_id: string;
  isAdmin: boolean;
}

interface lastMessage
{
  id: string;
  content: string;
  createdAt: Date;
}

interface Room {
  id: string;
  name: string;
  Privacy: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
  messageRome: lastMessage[]; 
}

interface RoomState {
  rooms: Room[];
  status:
  {
    get:'idle' | 'loading' | 'succeeded' | 'failed';
    create:'idle' | 'loading' | 'succeeded' | 'failed';
    update:'idle' | 'loading' | 'succeeded' | 'failed';
  } 
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
    return response.data; 
  } catch (error : any) {
    console.log(error)
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
    return response.data;
  } catch (error : any) {
    console.log(error.response)
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('Failed to create rooms');
    }
  }
});

export const updateRooms = createAsyncThunk('rooms/updateRooms', async (data: Room,{rejectWithValue}) => {
  try {
    const response = await updateRoomsApi(data);    
    return response.data;
  } catch (error : any) {
    console.log(error.response)
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('Failed to create rooms');
    }
  }
});



const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers: (builder:any) => {
    builder
      .addCase(getAllRooms.pending, (state:any) => {
        state.status.get = 'loading';
      })
      .addCase(getAllRooms.fulfilled, (state:any, action: PayloadAction<Room[]>) => {
        state.status.get = 'succeeded';
        state.rooms = action.payload.data;
      })
      .addCase(getAllRooms.rejected, (state:any, action: PayloadAction<string>) => {;
        state.status.get = 'failed';
        state.error = action.payload;
        
      })
      .addCase(createRooms.pending, (state:any) => {
        state.status.create = 'loading';
      })
      .addCase(createRooms.fulfilled, (state:any, action:any) => {
        state.status.create = 'succeeded';
        const newRoom = action.payload;
        state.rooms.push(newRoom);
      })
      .addCase(createRooms.rejected, (state:any, action:any) => {;
        state.status.create = 'failed';        
      }).
      addCase(updateRooms.pending, (state:any) => {
        state.status.update = 'loading';
      })
      .addCase(updateRooms.fulfilled, (state:any, action: PayloadAction<Room>) => {
        state.status.update = 'succeeded';
        const updateData = action.payload.data
        console.log(updateData)
        const index = state.rooms.findIndex((room: Room) => room.id === updateData.id);
        if (index !== -1) {
          state.rooms[index] = action.payload.data;
        }
      })
      .addCase(updateRooms.rejected, (state:any, action:any) => {;
        state.status.update = 'failed';
        
      })
  },
});

export default roomSlice.reducer;