import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AcceptRequest, DebloqueUser, SendRequest, bloqueFriend, getAllFriends, getBloques, getConversationMessage, getRequest, refuseRequest} from '../utils/api';
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
// export const fetchRequestThunk = createAsyncThunk('request/create', async(data : CreateRequestParams)=>{
//     const response = await SendRequest(data);
//     console.log("rx",response)
//     return response;
//   });

export const fetchRequestThunk = createAsyncThunk('request/create', async(data : CreateRequestParams, { rejectWithValue }) => {
  try {
      const response = await SendRequest(data);

      if (!response.data.success) {
          throw new Error(response.data.error);
      }

      return response;
    } catch (err: any) {
      console.error("Error", err);
  
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data); // Return the entire error object
      } else {
        throw new Error("Request failed with an unknown error");
      }
    }
   
});

export const fetchAcceptFriendRequestThunk = createAsyncThunk('request/accept', async(id : string) =>{
  const response = await AcceptRequest(id);
  console.log("response here -->", response);
  return response;
})


export const fetchREfuseFriendRquestThunk = createAsyncThunk('request/refuse', async(id : string) =>{
  const response = await refuseRequest(id);
  return response;
})


export const fetchBlockFriendThunk = createAsyncThunk('request/block', async(id : string) => {
  const response = await bloqueFriend(id);
  return response;
})

export const fetchBlocksThunk = createAsyncThunk('block/fetch', async () => {
  const response = await getBloques();
  return response; // Assuming your API response has a 'data' property

});

export const fetchDebloqueUserThunk = createAsyncThunk('Debloque/fetch', async(id : string)=>{
  const response = await DebloqueUser(id);
  return response;
})

//get all friends

export const fetchGetAllFriends = createAsyncThunk('Get/friends', async () =>{
  const response = await getAllFriends();
  return response;
})

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    addRequest: (state) => {},
    
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRequestThunk.rejected, (state, action) => {
      console.error("Rejected with error:", action.payload);
      // Handle the error state in your Redux store if needed
  }).addCase(fetchGetRequestThunk.pending, (state, action) =>{
      state.loading = true;
  }).addCase(fetchAcceptFriendRequestThunk.fulfilled, (state, action)=>{
      state.loading = true;
  }).addCase(fetchREfuseFriendRquestThunk.fulfilled, (state, action)=>{

  }).addCase(fetchBlockFriendThunk.fulfilled, (state, action)=>{

  }).addCase(fetchDebloqueUserThunk.fulfilled, (state, action) =>{

  }).addCase(fetchGetAllFriends.pending, (state, action)=>{
    
  })
  }
});

export const { addRequest } = requestSlice.actions;

export default requestSlice.reducer;