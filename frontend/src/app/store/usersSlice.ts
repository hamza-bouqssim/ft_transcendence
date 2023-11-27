import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllUsers, getConversationMessage} from '../utils/api';
import { ConversationMessage, UsersTypes, messageTypes } from '../utils/types';

export interface UsersState {
  users: UsersTypes[];
  loading: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false,
};


export const fetchUsersThunk = createAsyncThunk('users/fetch', async () => {
    const response = await getAllUsers();
    return response;
  })

export const UsersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {
    addMessage: (state) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersThunk.fulfilled, (state, action) => {
   
    });
  }
});

export const { addMessage } = UsersSlice.actions;

export default UsersSlice.reducer;