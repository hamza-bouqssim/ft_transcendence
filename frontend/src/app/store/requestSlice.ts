import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AcceptRequest, SendRequest, getConversationMessage, getRequest} from '../utils/api';
import { AcceptRequestParams, ConversationMessage, CreateRequestParams, FriendsTypes, UsersTypes, messageTypes } from '../utils/types';

export interface requestState {
  request: FriendsTypes[];
  loading: boolean;
}

const initialState: requestState = {
  request: [],
  loading: false,
};

export const fetchGetRequestThunk = createAsyncThunk('request/fetch', async () => {
  const response = await getRequest();
  return response;

});
export const fetchRequestThunk = createAsyncThunk('request/create', async(data : CreateRequestParams)=>{
    const response = await SendRequest(data);
    return response;
  });

export const fetchAcceptFriendRequestThunk = createAsyncThunk('request/accept', async(id : string) =>{
  const response = await AcceptRequest(id);
  return response;
})



export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    addRequest: (state) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRequestThunk.fulfilled, (state, action) => {
      state.request = action.payload.data;
      state.loading = false;
  }).addCase(fetchGetRequestThunk.pending, (state, action) =>{
      state.loading = true;
  }).addCase(fetchAcceptFriendRequestThunk.fulfilled, (state, action)=>{
      state.loading = true;
  })
  }
});

export const { addRequest } = requestSlice.actions;

export default requestSlice.reducer;