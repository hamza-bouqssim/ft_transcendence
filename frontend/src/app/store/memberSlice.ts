import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllMembersApi } from '../utils/api';

interface Member {
  id: string;
  user_id: string;
  chatRoomId: string;
  isAdmin: boolean;
  Status: string;
  user: {
    id: string;
    username: string;
    status: string;
    email: string;
    password: string;
    display_name: string;
    avatar_url: string;
    two_factor_auth: string;
    two_factor_secret_key: string;
  };
}

interface MemberState {
  members: Member[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialStateMember: MemberState = {
  members: [],
  status: 'idle',
  error: null,
};

export const getAllMembers = createAsyncThunk('members/getAllMembers', async (roomId: string, { rejectWithValue }) => {
  try {
    const response = await getAllMembersApi(roomId);
    return response.data;
  } catch (error : any) {
    return rejectWithValue(error.message || 'Failed to fetch members');
  }
});

const membersSlice = createSlice({
  name: 'members',
  initialState: initialStateMember,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(getAllMembers.pending, (state: any) => {
        state.status = 'loading';
      })
      .addCase(getAllMembers.fulfilled, (state: any, action: PayloadAction<Member[]>) => {
        state.status = 'succeeded';
        state.members = action.payload.data;
      })
      .addCase(getAllMembers.rejected, (state: any, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default membersSlice.reducer;
