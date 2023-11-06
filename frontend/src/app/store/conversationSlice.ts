import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ConversationTypes } from '../utils/types'

export interface ConversationsState {
  conversations : ConversationTypes[]; 
}

const initialState: ConversationsState = {
  conversations: [],
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
        // this is for adding a conversations 
    addConversation: (state , action : PayloadAction<ConversationTypes>) => {
        state.conversations.push(action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addConversation } = conversationsSlice.actions

export default conversationsSlice.reducer