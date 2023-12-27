import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DebloqueUser, blockedUsers, bloqueFriend, getAllFriends, getBloques } from '../utils/api';
import { BloqueList, BloquesTypes, FriendsTypes } from '../utils/types';


interface BlockState {
  friendsBlock: BloquesTypes[];
  blocked: BloqueList[];
  status: 'idle' | 'loading' | 'success' | 'failed';
  error: string | null;
}

const initialState: BlockState = {
  friendsBlock: [],
  blocked : [],
  status: 'idle',
  error: null,
};

 
  export const fetchBlockFriendThunk = createAsyncThunk('request/block',async(id : string ,{rejectWithValue}) => {
    try{
      console.log("redaux")
      const response = await bloqueFriend(id);
      if(!response.data.success){
        throw new Error(response.data.error)
      }
      return response;

    }catch(err : any){
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data); // Return the entire error object
      } else {
        throw new Error("create conversation failed with an unknown error");
      }

    }
    
  })
  export const fetchBlockedUsers = createAsyncThunk('request/usersBLoque', async() =>{
    const response = await blockedUsers();
    return response.data;
  })
  
  export const fetchBlocksThunk = createAsyncThunk('friendsBlock/fetchBlockFriendThunk ', async (_,{rejectWithValue} ) => {
    try{
      console.log("redaux")
        const response = await getBloques();
        return response.data;

    }catch(error : any){
        if (error.response && error.response.data && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
      
          }else {
            return rejectWithValue('Failed to fetch requests');
      
          }
    }
  
  });
  
  export const fetchDebloqueUserThunk = createAsyncThunk('Debloque/fetch', async(id : string ,{rejectWithValue})=>{
    try{
      const response = await DebloqueUser(id);
      if(!response.data.success){
        throw new Error(response.data.error)
      }
      return response;

    }catch(err : any){
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data); // Return the entire error object
      } else {
        throw new Error("create conversation failed with an unknown error");
      }

    }
    
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
        
      }).addCase(fetchBlockedUsers.pending, (state : any) => {
        state.status = 'loading';
      })
      .addCase(fetchBlockedUsers.fulfilled, (state : any, action : any) => {
        state.status = 'success';
        state.blocked  = action.payload;
      })
      .addCase(fetchBlockedUsers.rejected, (state: any, action : any) => {;
        state.status = 'failed';
        state.error = action.payload;
        
      })
     
  },
});
export const { addfriendsBlock } = BlockSlice.actions;


export default BlockSlice.reducer;