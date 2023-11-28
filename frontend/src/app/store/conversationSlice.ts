import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ConversationTypes, CreateConversationParams } from '../utils/types'
import { createConversation, getConversation, getConversationMessage } from '../utils/api';

export interface ConversationsState {
  conversations: ConversationTypes[];
  loading: boolean;
}

const initialState: ConversationsState = {
  conversations: [],
  loading: false,
};

// for create the conversation

export const createConversationThunk = createAsyncThunk('conversations/create', async(data : CreateConversationParams)=>{
  const response = await createConversation(data);

  return response;
})

export const fetchConversationThunk = createAsyncThunk('conversations/fetch', async () => {
  const response = await getConversation();
  return response; // Assuming your API response has a 'data' property

});

// export const fetchMessagesThunk = createAsyncThunk('messages/fetch', async (id : string) => {
//   const response = await getConversationMessage(id);
//   return response;
// })

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<ConversationTypes>) => {

      // state.conversations.push(action.payload);
    },
    updateConversation: (state, action: PayloadAction<ConversationTypes>) => {

      const conversation = action.payload;
      const index = state.conversations.findIndex(
        (c) => c.id === conversation.id
      );
      state.conversations.splice(index, 1);
      state.conversations.unshift(conversation);
    },
  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchConversationThunk.fulfilled, (state, action) => {
        // state.conversations = action.payload.data;

        // state.conversations.set(action.payload.data[0].id.toString(), action.payload.data[0])
        state.conversations = action.payload.data;
        state.loading = false;
    }).addCase(fetchConversationThunk.pending, (state, action) =>{
        state.loading = true;
    })
    .addCase(createConversationThunk.fulfilled, (state, action) =>{
        state.conversations.unshift(action.payload.data);
    });
  }
})

// Action creators are generated for each case reducer function
export const { addConversation, updateConversation } =
  conversationsSlice.actions;

export default conversationsSlice.reducer;