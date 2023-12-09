import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DebloqueUser, bloqueFriend, getAllFriends, getBloques } from '../utils/api';
import { BloquesTypes, FriendsTypes } from '../utils/types';


interface BlockState {
  friendsBlock: BloquesTypes[];
  status: 'idle' | 'loading' | 'success' | 'failed';
  error: string | null;
}

const initialState: BlockState = {
  friendsBlock: [],
  status: 'idle',
  error: null,
};


  export const fetchBlockFriendThunk = createAsyncThunk('request/block', async(id : string) => {
    const response = await bloqueFriend(id);
    return response;
  })
  
  export const fetchBlocksThunk = createAsyncThunk('friendsBlock/fetchBlockFriendThunk ', async (_,{rejectWithValue} ) => {
    try{
        const response = await getBloques();
        console.log("response block here-->", response);
        return response.data;

    }catch(error : any){
        if (error.response && error.response.data && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
      
          }else {
            return rejectWithValue('Failed to fetch requests');
      
          }

    }
   
  
  });
  
  export const fetchDebloqueUserThunk = createAsyncThunk('Debloque/fetch', async(id : string)=>{
    const response = await DebloqueUser(id);
    return response;
  })
  

const BlockSlice = createSlice({
  name: 'friendsBlock',
  initialState,
  reducers: {
    addfriendsBlock: (state) => {}
  },
  extraReducers: (builder:any) => {
    builder
    .addCase(fetchBlocksThunk.pending, (state : any) => {
        state.status = 'loading';
      })
      .addCase(fetchBlocksThunk.fulfilled, (state : any, action : any) => {
        state.status = 'success';
        state.friendsBlock = action.payload;
      })
      .addCase(fetchBlocksThunk.rejected, (state: any, action : any) => {;
        state.status = 'failed';
        state.error = action.payload;
      
        
      })
    .addCase(fetchBlockFriendThunk.pending, (state : any) => {
        state.status = 'loading';
      })
      .addCase(fetchBlockFriendThunk.fulfilled, (state : any, action : any) => {
        state.status = 'success';
        // state.friendsBlock = action.payload;
      })
      .addCase(fetchBlockFriendThunk.rejected, (state: any, action : any) => {;
        state.status = 'failed';
        state.error = action.payload;
      
        
      }).addCase(fetchDebloqueUserThunk.pending, (state : any) => {
        state.status = 'loading';
      })
      .addCase(fetchDebloqueUserThunk.fulfilled, (state : any, action : any) => {
        state.status = 'success';
        // state.friendsBlock = action.payload;
      })
      .addCase(fetchDebloqueUserThunk.rejected, (state: any, action : any) => {;
        state.status = 'failed';
        state.error = action.payload;
        
      })
     
  },
});
export const { addfriendsBlock } = BlockSlice.actions;


export default BlockSlice.reducer;