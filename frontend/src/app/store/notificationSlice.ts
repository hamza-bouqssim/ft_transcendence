import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  changeAvatar, changeDisplayedName, changeUserName, dataUser, getAllUsers, getConversationMessage, getNotification, tableFriends} from '../utils/api';
import { ConversationMessage, NotificationTypes, UsersTypes, messageTypes } from '../utils/types';
import axios from 'axios';

export interface NotificationState {
  notification: NotificationTypes[];
  status: 'idle' | 'loading' | 'success' | 'failed';
  error : string | null;
}

const initialState: NotificationState = {
  notification: [],
  status: 'idle' ,
  error : null,
};


export const fetchNotificationThunk = createAsyncThunk('notiication/fetchNotificationThunk', async (_,{rejectWithValue} ) => {
    
    const response = await getNotification();
    return response.data;

})

export const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotificationThunk.pending, (state, action) => {
          state.status = 'loading';
    }).addCase(fetchNotificationThunk.fulfilled, (state : any, action : any) => {
          state.status = 'success';
          state.notification = action.payload;
    }).addCase(fetchNotificationThunk.rejected, (state : any, action) => {
   
      state.status = 'failed';
      state.error = action.payload;

    })
  
  }
});

export const { addNotification } = NotificationSlice.actions;

export default NotificationSlice.reducer;