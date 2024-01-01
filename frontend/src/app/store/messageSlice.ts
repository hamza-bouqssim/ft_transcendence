import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getConversationMessage} from '../utils/api';
import { ConversationMessage, messageTypes } from '../utils/types';

export interface MessagesState {
  messages: messageTypes[];
  isSenderBlocked: boolean;
  isRecipientBlocked : boolean;
  status: 'success' | 'failed' | 'idle' | 'loading'
  error : string | null;
}

const initialState: MessagesState = {
  messages: [],
  isSenderBlocked: false, 
  isRecipientBlocked : false,
  status : 'idle',
  error: null,
};




export const fetchMessagesThunk = createAsyncThunk('messages/fetch', async (id : string) => {
  try{
    const response = await getConversationMessage(id);
    return response.data.response;

  }catch(err)
  {
     throw new Error("Error while fetching messages");
  }
    
  })

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state) => {},
    setIsBlocked: (state, action: PayloadAction<{ isSenderBlocked: boolean; isRecipientBlocked: boolean }>) => {
      state.isSenderBlocked = action.payload.isSenderBlocked;
      state.isRecipientBlocked = action.payload.isRecipientBlocked;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessagesThunk.pending, (state, action) => {
      state.status = 'loading';
    }).addCase(fetchMessagesThunk.fulfilled, (state : any, action) => {
      state.status = 'success';
      if(action.payload)
      {
        state.messages = action.payload.messages; 
        state.isSenderBlocked = action.payload.isSenderBlocked;
        state.isRecipientBlocked = action.payload.isRecipientBlocked;

      }
     
    }).addCase(fetchMessagesThunk.rejected, (state : any, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  }
});

export const { addMessage, setIsBlocked } = messagesSlice.actions;
export default messagesSlice.reducer;