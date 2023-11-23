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
// export const fetchRequestThunk = createAsyncThunk('request/create', async(data : CreateRequestParams)=>{
//     const response = await SendRequest(data);
//     console.log("rx",response)
//     return response;
//   });

export const fetchRequestThunk = createAsyncThunk('request/create', async(data : CreateRequestParams, { rejectWithValue }) => {
  try {
      const response = await SendRequest(data);
      console.log("suceeessss", response);

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
    // } catch (err: any) {
    //   console.error("Errorrrrrrrrrr:", err.response.data.error.response);
  
    //   if (err.response && err.response.data && err.response.data.error && err.response.data.error.response) {
    //     throw new Error(err.response.data.error);
    //   } else {
    //     throw new Error("Request failed with an unknown error");
    //   }
    // }
});

export const fetchAcceptFriendRequestThunk = createAsyncThunk('request/accept', async(id : string) =>{
  const response = await AcceptRequest(id);
  console.log("response here -->", response);
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
  })
  }
});

export const { addRequest } = requestSlice.actions;

export default requestSlice.reducer;