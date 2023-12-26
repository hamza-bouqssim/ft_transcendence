import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  changeAvatar, changeDisplayedName, changeUserName, dataUser, getAllUsers, getAuthUser, getConversationMessage, tableFriends} from '../utils/api';
import { ConversationMessage, UsersTypes, messageTypes } from '../utils/types';
import axios from 'axios';

export interface UsersAuthState {
  UsersAuth : UsersTypes[];
  status: 'idle' | 'loading' | 'success' | 'failed';
  error : string | null;
}

const initialState: UsersAuthState = {
  UsersAuth: [],
  status: 'idle' ,
  error : null,
};

export const fetchAuthUser = createAsyncThunk('AuthUser/fetchAuthUser', async (_,{rejectWithValue} ) => {
  const response = await getAuthUser();
  console.log("redaux")
  return response.data;
})



export const UsersAuthSlice = createSlice({
  name: 'UsersAuth',
  initialState,
  reducers: {
    addUsersAuth: (state) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuthUser.pending, (state, action) => {
      state.status = 'loading';
    })
    .addCase(fetchAuthUser.fulfilled, (state : any, action) => {
      state.status = 'success';
      state.UsersAuth = action.payload;
    
    })
    .addCase(fetchAuthUser.rejected, (state, action) => {
        state.status = 'failed';
    })
    
  
  
  
  }
});

export const { addUsersAuth } = UsersAuthSlice.actions;

export default UsersAuthSlice.reducer;