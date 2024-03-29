import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ConversationTypes, CreateConversationParams } from '../utils/types'
import { createConversation, deleteConversation, findConversationUsers, getConversation } from '../utils/api';

export interface ConversationsState {
  conversations: ConversationTypes[];
  status: 'success' | 'failed' | 'idle' | 'loading';
  error: string | null;
}

const initialState: ConversationsState = {
  conversations: [],
  status: 'idle',
  error : null,
};


export const createConversationThunk = createAsyncThunk(
  'conversations/create',
  async (params: CreateConversationParams, { rejectWithValue }) => {
    try {
      const response = await createConversation(params.display_name ?? '', params.message);
     
      return response.data;
    } catch (err: any) {
        throw new Error("create conversation failed with an unknown error");
      
    }
  }
);


export const fetchConversationThunk = createAsyncThunk('conversations/fetch', async (_,{rejectWithValue} ) => {
  try{
    const response = await getConversation();
    return response.data.data;
  }catch(error : any){
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('Failed to fetch convarsation');
    }
  }
  
});


export const fetchConversationUserThunk = createAsyncThunk('conversation/fetch',async(params: CreateConversationParams, {rejectWithValue}) =>{
  try{
    const response = await findConversationUsers(params.display_name ?? '' , params.message);
    return response.data;

  }catch(error : any){
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('Failed to fetch the conversation');
    }
  }
  

})


export const fetchDeleteConversation = createAsyncThunk('deleteConversation/fetch', async(conversationId : string)=>{
  try{
    const response = await deleteConversation(conversationId);
    return response.data;

  }catch(err){

      throw new Error("Error while deleting the conversation");

  }
   
})
export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addConversation: (state) =>{

    }
   
  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchConversationThunk.pending, (state, action) => {
       state.status = 'loading';
    }).addCase(fetchConversationThunk.fulfilled, (state, action) =>{
      state.status = 'success';
      state.conversations = action.payload;
    }).addCase(fetchConversationThunk.rejected, (state, action) =>{
      state.status = 'failed';
    })
    .addCase(createConversationThunk.pending, (state, action) =>{
        state.status = 'loading';
    }).addCase(createConversationThunk.fulfilled, (state, action) =>{
        state.status = 'success';
    }).addCase(createConversationThunk.rejected, (state, action) =>{
        state.status = 'failed';
    })
    .addCase(fetchConversationUserThunk.pending, (state, action) =>{
        state.status = 'loading';
    }).addCase(fetchConversationUserThunk.fulfilled, (state, action) =>{
        state.status = 'success';
    }).addCase(fetchConversationUserThunk.rejected, (state, action) =>{
        state.status = 'failed';
    }).addCase(fetchDeleteConversation.pending, (state, action) =>{
      state.status = 'loading';
    }).addCase(fetchDeleteConversation.fulfilled, (state, action) =>{
      state.status = 'success';
    }).addCase(fetchDeleteConversation.rejected, (state, action) =>{
      state.status = 'failed';
    });
  }
})

export const { addConversation} =
  conversationsSlice.actions;

export default conversationsSlice.reducer;