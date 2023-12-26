import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getConversationMessage, getUnreadMessages} from '../utils/api';
import { ConversationMessage, messageTypes, messageUnread } from '../utils/types';
import { Conversation } from '../utils/styles';

export interface MessagesUnreadState {
  messagesUnread: messageUnread[];
  status: 'success' | 'failed' | 'idle' | 'loading'
  error : string | null;
}

const initialState: MessagesUnreadState = {
  messagesUnread: [],
  status : 'idle',
  error: null,
};


export const fetchMessagesUnreadThunk = createAsyncThunk('messagesUnread/fetch', async (ConversationId : string) => {
    const response = await getUnreadMessages(ConversationId);
    return response.data;
  })
export const markConversationAsRead = createAsyncThunk('AsReadMessage/fetch', async (id : string) =>{
  console.log("redaux") 
  await markConversationAsRead(id);
})

export const MessagesUnreadSlice = createSlice({
  name: 'messagesUnread',
  initialState,
  reducers: {
    addMessageUnread: (state) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessagesUnreadThunk.pending, (state, action) => {
      state.status = 'loading';
    }).addCase(fetchMessagesUnreadThunk.fulfilled, (state : any, action) => {
      state.status = 'success';
      state.messagesUnread = action.payload;
    }).addCase(fetchMessagesUnreadThunk.rejected, (state : any, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }).addCase(markConversationAsRead.pending, (state, action) => {
        state.status = 'loading';
      }).addCase(markConversationAsRead.fulfilled, (state : any, action) => {
        state.status = 'success';
        // state.messagesUnread = action.payload;
      }).addCase(markConversationAsRead.rejected, (state : any, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addMessageUnread } = MessagesUnreadSlice.actions;

export default MessagesUnreadSlice.reducer;