import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  changeAvatar, changeDisplayedName, changeUserName, dataUser, getAllUsers, getConversationMessage, tableFriends} from '../utils/api';
import { ConversationMessage, UsersTypes, messageTypes } from '../utils/types';
import axios from 'axios';

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

  export const fetchUpdateDisplayName = createAsyncThunk('users/updateDisplay', async (display_name: string, { rejectWithValue }) => {
    try {
      const response = await changeDisplayedName(display_name);
      console.log("response whithout data-->", response);
      console.log("response  data here-->", response.data);
      return response.data;
    } catch (error : any) {
      console.log("enter here sure"); 
      return rejectWithValue(error.response.data);
    }
  });
  
  export const fetchUpdateUserName = createAsyncThunk('users/updateUserName', async (username: string, {rejectWithValue}) => {
    try {
      const response = await changeUserName(username);
      return response.data;
    } catch (error : any) {
      return rejectWithValue(error.response.data);
    }
  });

  export const fetchUserTable = createAsyncThunk('users/table', async()=>{
    const response = await tableFriends();
    return response;
  })
  export const fetchUserInfo = createAsyncThunk('user/data', async (id_user: string) =>{
    const response = await dataUser(id_user);
    return response;
  })

// export const fetchUpdateAvatarUrl = createAsyncThunk('users/updateAvatarUrl', async(avatarUrl : string) =>{
//   const response = await changeAvatar(avatarUrl);
//   return response;
// })

export const fetchUpdateAvatar = createAsyncThunk(
  'users/updateAvatar',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await changeAvatar(formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UsersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {
    addMessage: (state) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersThunk.fulfilled, (state, action) => {
   
    }).addCase( fetchUpdateDisplayName.fulfilled, (state, action) =>{
      state.loading = true;
  }).addCase(fetchUpdateUserName.fulfilled, (state, action) =>{

  }).addCase(fetchUpdateAvatar.fulfilled, (state, action) =>{

  }).addCase(fetchUserTable.fulfilled, (state, action) => {

  }).addCase(fetchUserInfo.fulfilled, (state, action)=>{
    
  })
  }
});

export const { addMessage } = UsersSlice.actions;

export default UsersSlice.reducer;