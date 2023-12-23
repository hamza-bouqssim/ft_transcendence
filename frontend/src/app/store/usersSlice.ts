import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  changeAvatar, changeDisplayedName, changeUserName, dataUser, getAllUsers, getConversationMessage, tableFriends} from '../utils/api';
import { ConversationMessage, UsersTypes, messageTypes } from '../utils/types';
import axios from 'axios';

export interface UsersState {
  users: UsersTypes[];
  status: 'idle' | 'loading' | 'success' | 'failed';
  error : string | null;
}

const initialState: UsersState = {
  users: [],
  status: 'idle' ,
  error : null,
};


export const fetchUsersThunk = createAsyncThunk('users/fetchUsersThunk', async (_,{rejectWithValue} ) => {
    try{
      const response = await getAllUsers();
      return response.data;

    }catch(error : any){
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
  
      }else {
        return rejectWithValue('Failed to fetch users');
  
      }
    }
    
  })

  export const fetchUpdateDisplayName = createAsyncThunk('users/updateDisplay', async (display_name: string, { rejectWithValue }) => {
    try {
      const response = await changeDisplayedName(display_name);
      return response.data;
    } catch (error : any) {
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
  name: 'users',
  initialState,
  reducers: {
    addUsers: (state) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersThunk.pending, (state, action) => {
          state.status = 'loading';
    }).addCase(fetchUsersThunk.fulfilled, (state : any, action : any) => {
          state.status = 'success';
          state.users = action.payload;
    }).addCase(fetchUsersThunk.rejected, (state : any, action) => {
   
      state.status = 'failed';
      state.error = action.payload;

    })
  
  
  .addCase( fetchUpdateDisplayName.fulfilled, (state, action) =>{
  }).addCase(fetchUpdateUserName.fulfilled, (state, action) =>{

  }).addCase(fetchUpdateAvatar.fulfilled, (state, action) =>{

  }).addCase(fetchUserTable.fulfilled, (state, action) => {

  }).addCase(fetchUserInfo.fulfilled, (state, action)=>{
    
  })
  }
});

export const { addUsers } = UsersSlice.actions;

export default UsersSlice.reducer;