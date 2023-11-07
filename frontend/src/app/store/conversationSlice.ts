import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ConversationTypes } from '../utils/types'
import { getConversation } from '../utils/api';

export interface ConversationsState {
  conversations : ConversationTypes[]; 
}

const initialState: ConversationsState = {
  conversations: [],
}

export const fetchConversationThunk = createAsyncThunk('conversations/fetch', async() =>{getConversation()})


export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
        // this is for adding a conversations 
    addConversation: (state , action : PayloadAction<ConversationTypes>) => {
        console.log('add conversation');
        state.conversations.push(action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addConversation } = conversationsSlice.actions

export default conversationsSlice.reducer