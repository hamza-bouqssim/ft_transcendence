import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAuthUser} from '../utils/api';
import { UsersTypes } from '../utils/types';

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