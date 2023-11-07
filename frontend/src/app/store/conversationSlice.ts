import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ConversationTypes } from '../utils/types'
import { getConversation, getConversationMessage } from '../utils/api';

export interface ConversationsState {
  conversations : ConversationTypes[]; 
}

const initialState: ConversationsState = {
  conversations: [],
}

export const fetchConversationThunk = createAsyncThunk('conversations/fetch', async () => {
  const response = await getConversation();
  return response; // Assuming your API response has a 'data' property

});

export const fetchMessagesThunk = createAsyncThunk('messages/fetch', async (id : string) => {
  const response = await getConversationMessage(id);
  return response;
})

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
        // this is for adding a conversations 
    addConversation: (state , action : PayloadAction<ConversationTypes>) => {
        state.conversations.push(action.payload);
    }
  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchConversationThunk.fulfilled, (state, action) => {
        state.conversations = action.payload.data;
    })
    .addCase(fetchMessagesThunk.fulfilled, (state, action) =>{
      console.log("fetch messages")
      console.log(state);
      console.log(action.payload.data);
    })
  }
})

// Action creators are generated for each case reducer function
export const { addConversation } = conversationsSlice.actions

export default conversationsSlice.reducer