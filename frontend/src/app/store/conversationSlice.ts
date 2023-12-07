import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ConversationTypes, CreateConversationParams } from '../utils/types'
import { createConversation, findConversationUsers, getConversation, getConversationMessage } from '../utils/api';

export interface ConversationsState {
  conversations: ConversationTypes[];
  loading: boolean;
}

const initialState: ConversationsState = {
  conversations: [],
  loading: false,
};

// for create the conversation

export const createConversationThunk = createAsyncThunk('conversations/create', async(display_name : string , { rejectWithValue })=>{
  try {

    const response = await createConversation(display_name);
    
 
    if (!response.data.success)
    {
      throw new Error(response.data.error);
    }
    return response;
  } catch (err: any) {
    if (err.response && err.response.data) 
    {
      return rejectWithValue(err.response.data); // Return the entire error object
    } else {
      throw new Error("create conversation failed with an unknown error");
    }
}

})

export const fetchConversationThunk = createAsyncThunk('conversations/fetch', async () => {
  const response = await getConversation();
  return response; // Assuming your API response has a 'data' property

});

// export const fetchMessagesThunk = createAsyncThunk('messages/fetch', async (id : string) => {
//   const response = await getConversationMessage(id);
//   return response;
// })


export const fetchConversationUserThunk = createAsyncThunk('conversation/fetch',async(display_name : string) =>{
  const response = await findConversationUsers(display_name);
  return response;

})
export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<ConversationTypes>) => {
      console.log('addConversation');
      // state.conversations.push(action.payload);
    },
 
  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchConversationThunk.fulfilled, (state, action) => {
        // state.conversations = action.payload.data;

        // state.conversations.set(action.payload.data[0].id.toString(), action.payload.data[0])
        state.conversations = action.payload.data;
    }).addCase(fetchConversationThunk.pending, (state, action) =>{
    })
    .addCase(createConversationThunk.fulfilled, (state, action) =>{
        state.conversations.unshift(action.payload.data);
    }).addCase(fetchConversationUserThunk.fulfilled, (state, action) =>{

    });
  }
})

// Action creators are generated for each case reducer function
export const { addConversation} =
  conversationsSlice.actions;

export default conversationsSlice.reducer;