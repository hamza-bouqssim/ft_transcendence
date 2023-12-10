import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getConversationMessage} from '../utils/api';
import { ConversationMessage, messageTypes } from '../utils/types';

export interface MessagesState {
  messages: messageTypes[];
  status: 'success' | 'failed' | 'idle' | 'loading'
  error : string | null;
}

const initialState: MessagesState = {
  messages: [],
  status : 'idle',
  error: null,
};


export const fetchMessagesThunk = createAsyncThunk('messages/fetch', async (id : string) => {
    const response = await getConversationMessage(id);
    return response.data;
  })

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessagesThunk.pending, (state, action) => {
      state.status = 'loading';
    }).addCase(fetchMessagesThunk.fulfilled, (state : any, action) => {
      state.status = 'success';
      state.messages = action.payload;
    }).addCase(fetchMessagesThunk.rejected, (state : any, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  }
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;