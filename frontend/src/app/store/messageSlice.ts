import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getConversationMessage} from '../utils/api';
import { ConversationMessage, messageTypes } from '../utils/types';

export interface MessagesState {
  messages: messageTypes[];
  loading: boolean;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
};


export const fetchMessagesThunk = createAsyncThunk('messages/fetch', async (id : string) => {
    const response = await getConversationMessage(id);
    return response;
  })

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessagesThunk.fulfilled, (state, action) => {
       const { id, messages } = action.payload.data;
       const index : any = state.messages.findIndex((cm) => cm.id === id);
       const exists = state.messages.find((cm) => cm.id === id);
       if (exists) {
         state.messages[index] = action.payload.data;
       } else {
         state.messages.push(action.payload.data);
       }
    });
  }
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;