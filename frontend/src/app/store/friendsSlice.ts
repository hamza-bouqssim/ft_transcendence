import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DebloqueUser, bloqueFriend, getAllFriends, getBloques } from '../utils/api';
import { FriendsTypes } from '../utils/types';


interface FriendsState {
  friends: FriendsTypes[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  status: 'idle',
  error: null,
};

export const fetchGetAllFriendsThunk = createAsyncThunk('friends/fetchGetAllFriendsThunk',  async (_,{rejectWithValue} )  =>{
  try{
    const response = await getAllFriends();
    return response.data;
  }catch(error : any){
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);

    }else {
      return rejectWithValue('Failed to fetch friends');

    }
}
})


const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addFriends: (state) => {}
  },
  extraReducers: (builder:any) => {
    builder
      .addCase(fetchGetAllFriendsThunk.pending, (state : any) => {
        state.status = 'loading';
      })
      .addCase(fetchGetAllFriendsThunk.fulfilled, (state : any, action : any) => {
        state.status = 'success';
        state.friends = action.payload;
      })
      .addCase(fetchGetAllFriendsThunk.rejected, (state: any, action : any) => {;
        state.status = 'failed';
        state.error = action.payload;
      })
     
  },
});
export const { addFriends } = friendsSlice.actions;


export default friendsSlice.reducer;