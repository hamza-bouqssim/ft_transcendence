import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { changeAvatar, changeDisplayedName, changeUserName, getAllUsers, getConversationMessage} from '../utils/api';
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

export const fetchUpdateAvatarUrl = createAsyncThunk('users/updateAvatarUrl', async(avatarUrl : string) =>{
  const response = await changeAvatar(avatarUrl);
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
   
    }).addCase( fetchUpdateDisplayName.fulfilled, (state, action) =>{
      state.loading = true;
  }).addCase(fetchUpdateUserName.fulfilled, (state, action) =>{

  }).addCase(fetchUpdateAvatarUrl.fulfilled, (state, action) =>{

  })
  }
});

export const { addMessage } = UsersSlice.actions;

export default UsersSlice.reducer;