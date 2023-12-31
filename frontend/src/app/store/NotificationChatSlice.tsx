import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllRoomsApi, createRoomsApi, updateRoomsApi, deleteRoomsApi, joinRoomApi, getNotificationRoomApi } from '../utils/api';
import { ConversationTypes } from '../utils/types';



interface notification {
    roomId:string;
    number:number;

}


interface NotificationState {
	notificationChat: notification[];
  notificationRoom: notification[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

const initialState: NotificationState = {
    notificationChat: [],
    notificationRoom:[],
    status: "idle",
    error: null,
};


export const getNotificationRoom = createAsyncThunk('rooms/getNotificationRoom', async (_,{rejectWithValue} ) => {
    try {
      const response = await getNotificationRoomApi();
      return response.data.data; 
    } catch (error : any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue('Failed to fetch rooms');
      }
    }
  });


const NotificationChatSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    cleanNotification : (state: { notificationRoom: notification[]; }, action: { payload: { roomId: any} }) => {  
        const notification = state.notificationRoom.find((notification) => notification.roomId === action.payload.roomId);
        if (notification) {
          notification.number = 0;
        }
    },
  },
  extraReducers: (builder:any) => {
    builder
          .addCase(
          getNotificationRoom.fulfilled,
          (state: any, action: PayloadAction<notification[]>) => {
            state.status = "succeeded";
            state.notificationRoom = action.payload;
          },
			  )
		
  },
});
export const { cleanNotification } = NotificationChatSlice.actions
export default NotificationChatSlice.reducer;