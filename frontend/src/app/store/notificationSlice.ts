import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteNotification, getNotification, getNumberNotification} from '../utils/api';
import {  NotificationTypes } from '../utils/types';

export interface NotificationState {
  notification: NotificationTypes[];
  count : number;
  status: 'idle' | 'loading' | 'success' | 'failed';
  error : string | null;
}

const initialState: NotificationState = {
  notification: [],
  count : 0,
  status: 'idle' ,
  error : null,
};


export const fetchNotificationThunk = createAsyncThunk('notification/fetchNotificationThunk', async (_,{rejectWithValue} ) => {
    const response = await getNotification();
    return response.data;

})

export const fetchCountNotification = createAsyncThunk('notificationCount/fetchNotification', async (_,{rejectWithValue})=>{
  const response = await getNumberNotification();
  return response.data;
})


export const fetchdeleteNotification = createAsyncThunk('notification/delete', async (idNotif : string, { rejectWithValue })=>{ 
  const response = await deleteNotification(idNotif);
  return response;


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

    }).addCase(fetchCountNotification.pending, (state, action) => {
          state.status = 'loading';
    }).addCase(fetchCountNotification.fulfilled, (state : any, action : any) => {
          state.status = 'success';      
          state.count = action.payload;
    }).addCase(fetchCountNotification.rejected, (state : any, action) => {
        state.status = 'failed';

    }).addCase(fetchdeleteNotification.pending, (state, action) => {
          state.status = 'loading';
    }).addCase(fetchdeleteNotification.fulfilled, (state : any, action : any) => {
          state.status = 'success';      
    }).addCase(fetchdeleteNotification.rejected, (state : any, action) => {
        state.status = 'failed';

})
  
  }
});

export const { addNotification } = NotificationSlice.actions;

export default NotificationSlice.reducer;