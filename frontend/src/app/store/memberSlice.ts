import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Member, banMember, getAllMembersApi, kickMember, makeAdmin, mutMember, quitRoom } from '../utils/api';

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
interface Memberdata{
  id:string,
  userId:string
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
    console.log("redaux")
    const response = await getAllMembersApi(roomId);
    return response.data.data;
  } catch (error : any) {
    return rejectWithValue(error.message || 'Failed to fetch members');
  }
});

export const quitMember = createAsyncThunk('members/quitMember', async (roomId: string, { rejectWithValue }) => {
  try {
    console.log(roomId)
    const response = await quitRoom(roomId);
    return response.data.data;
  } catch (error : any) {
    return rejectWithValue(error.message || 'Failed to quit members');
  }
});
export const addMemberToRooms = createAsyncThunk('members/addMemberToRooms', async (memberdata:Memberdata, { rejectWithValue }) => {
  try {
    console.log("redaux")
    const response = await addMemberToRooms(memberdata);
    return response.data.data;
  } catch (error : any) {
    return rejectWithValue(error.message || 'Failed to quit members');
  }
});
export const makeAdminMember = createAsyncThunk('members/makeAdminMember', async (memberdata:Memberdata, { rejectWithValue }) => {
  try {
    console.log("redaux")
    const response = await makeAdmin(memberdata.id,memberdata.userId);
    return response.data.data;
  } catch (error : any) {
    return rejectWithValue(error.message || 'Failed to quit members');
  }
});

export const makeMember = createAsyncThunk('members/makeMember', async (memberdata:Memberdata, { rejectWithValue }) => {
  try {
    console.log("redaux")
    const response = await Member(memberdata.id,memberdata.userId);
    return response.data.data;
  } catch (error : any ) {
    return rejectWithValue(error.message || 'Failed to quit members');
  }
});
export const kickMembers = createAsyncThunk('members/kickMembers', async (memberdata:Memberdata, { rejectWithValue }) => {
  try {
    console.log("redaux")
    const response = await kickMember(memberdata.id,memberdata.userId);
    return response.data.data;
  } catch (error : any) {
    return rejectWithValue(error.message || 'Failed to quit members');
  }
});
export const mutMembers = createAsyncThunk('members/mutMembers', async (memberdata:Memberdata, { rejectWithValue }) => {
  try {
    console.log("redaux")
    const response = await mutMember(memberdata.id,memberdata.userId);
    return response.data.data;
  } catch (error : any) {
    return rejectWithValue(error.message || 'Failed to quit members');
  }
});
export const banMembers = createAsyncThunk('members/banMembers', async (memberdata:Memberdata, { rejectWithValue }) => {
  try {
    console.log("redaux")
    const response = await banMember(memberdata.id, memberdata.userId);
    return response.data.data;
  } catch (error:any) {
    return rejectWithValue(error.message || 'Failed to ban members');
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
        state.members = action.payload;
      })
      .addCase(getAllMembers.rejected, (state: any, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(quitMember.pending, (state: any) => {
        state.status = 'loading';
      })
      .addCase(quitMember.fulfilled, (state: any, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.members = state.members.filter((member:Member) => member.id !== action.payload);
      })
      .addCase(quitMember.rejected, (state: any, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // .addCase(banMembers.pending, (state: any) => {
      //   state.status = 'loading';
      // })
      // .addCase(banMembers.fulfilled, (state: any, action: PayloadAction<Member[]>) => {
      //   state.status = 'succeeded';
      //   console.log(action.payload)
      //   state.members = state.members.map((member) => ({
      //     ...member,
      //     Status: member.user_id === action.payload ? 'Ban' : member.Status,
      //   }));
      // })
      // .addCase(banMembers.rejected, (state: any, action: PayloadAction<string>) => {
      //   state.status = 'failed';
      //   state.error = action.payload;
      // })
      
  },
});

export default membersSlice.reducer;
