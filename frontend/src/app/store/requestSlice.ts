import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AcceptRequest, DebloqueUser, SendRequest, bloqueFriend, getAllFriends, getBloques, getConversationMessage, getRequest, refuseRequest} from '../utils/api';
import { AcceptRequestParams, ConversationMessage, CreateRequestParams, FriendsTypes, RequestTypes, UsersTypes, messageTypes } from '../utils/types';

export interface requestState {
  request: RequestTypes[];
  status: 'success' | 'failed' | 'idle' | 'loading'; // Add 'idle' status
  error: string | null;
  }

  const initialState: requestState = {
    request: [],
    status: 'idle', // Initial status is 'idle'
    error: null,
  };

export const fetchGetRequestThunk = createAsyncThunk('request/fetchGetRequestThunk', async (_,{rejectWithValue} ) => {
  try{
    console.log(" i am here-->");
    const response = await getRequest();
    console.log("response here-->", response);
    return response.data.data;
  }catch(error : any){
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);

    }else {
      return rejectWithValue('Failed to fetch requests');

    }


  }
  

});
// export const fetchRequestThunk = createAsyncThunk('request/create', async(data : CreateRequestParams)=>{
//     const response = await SendRequest(data);
//     console.log("rx",response)
//     return response;
//   });

// export const fetchRequestThunk = createAsyncThunk('request/create', async(data : CreateRequestParams, { rejectWithValue }) => {
//   try {
//       const response = await SendRequest(data);

//       if (!response.data.success) {
//           throw new Error(response.data.error);
//       }

//       return response;
//     } catch (err: any) {
//       console.error("Error", err);
  
//       if (err.response && err.response.data) {
//         return rejectWithValue(err.response.data); // Return the entire error object
//       } else {
//         throw new Error("Request failed with an unknown error");
//       }
//     }
   
// });
export const fetchRequestThunk = createAsyncThunk('request/create', async(data: CreateRequestParams, { rejectWithValue }) => {
  try {
    console.log("iam herererere");
    const response = await SendRequest(data);
    console.log("response is -->", response);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    // Return only the relevant data
    return response; // Adjust this based on the structure of your API response
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
    builder
      .addCase(fetchRequestThunk.pending, (state, action) => {
       
      }).addCase(fetchGetRequestThunk.pending, (state: any) =>{
        state.status = 'loading';
      })
      .addCase(fetchGetRequestThunk.fulfilled, (state, action) => {
        state.status = 'success';
        state.request = action.payload;
        console.log("state request-->", state.request); // Change this line to use action.payload
      }).addCase(fetchGetRequestThunk.rejected, (state: any, action )=>{
        state.status = 'failed';
        console.log("failled");
        state.error = action.payload;
      })
      .addCase(fetchAcceptFriendRequestThunk.fulfilled, (state, action) => {
        // Handle fulfilled case for fetchAcceptFriendRequestThunk
      })
      .addCase(fetchREfuseFriendRquestThunk.fulfilled, (state, action) => {
        // Handle fulfilled case for fetchREfuseFriendRquestThunk
      })
      .addCase(fetchBlockFriendThunk.fulfilled, (state, action) => {
        // Handle fulfilled case for fetchBlockFriendThunk
      })
      .addCase(fetchDebloqueUserThunk.fulfilled, (state, action) => {
        // Handle fulfilled case for fetchDebloqueUserThunk
      })
      .addCase(fetchGetAllFriends.pending, (state, action) => {
        // Handle pending case for fetchGetAllFriends
      });
  },
});

export const { addRequest } = requestSlice.actions;

export default requestSlice.reducer;