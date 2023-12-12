import axios, { Axios, AxiosRequestConfig } from 'axios'
import { AcceptRequestParams, ConversationTypes, CreateConversationParams, CreateMessageParams, CreateRequestParams, FetchMessagePayload, User, UserCredentialsParams, createUserParams } from './types';

const API = axios.create({
    baseURL: "http://localhost:8000/",
    withCredentials: true,
  });


const config : AxiosRequestConfig = { withCredentials: true}

export const postRegisterUser = async (data: createUserParams) => axios.post(`http://localhost:8000/auth/signup`, data, config)



export const postLoginUser = async (data : UserCredentialsParams) => axios.post(`http://localhost:8000/auth/signin`, data, config)


export const getAuthUser = () => axios.get<User>(`http://localhost:8000/user/info`, config)

export const getConversation = () => axios.get(`http://localhost:8000/chat/findconversation`, config)

export const createConversation = async (display_name : string) => axios.post(`http://localhost:8000/chat/conversation`,{display_name : display_name}, config)
export const getConversationMessage = (id : string) => axios.get(`http://localhost:8000/chat/messages/${id}`, config)

export const loginGoogle = () => axios.get(`http://localhost:8000/auth/google/login`, config)

export const getlogout = () => axios.get(`http://localhost:8000/auth/signout`, config);

export const postNewMessage = async (data : CreateMessageParams) => axios.post(`http://localhost:8000/chat/create_messages`, data, config);

// get all friends

export const getAllFriends = () => axios.get(`http://localhost:8000/user/my-friends`, config);

export const getRequest = () => axios.get(`http://localhost:8000/user/pending-requests`, config);

export const getBloques = () => axios.get(`http://localhost:8000/user/blocked-friends`, config);

export const DebloqueUser = async (id : string) => axios.post(`http://localhost:8000/friend-request/unblock-friend`, {friendIdToUnblock : id}, config);

export const bloqueFriend = async (id : string) => axios.post(`http://localhost:8000/friend-request/block-friend`, {friendIdToBlock : id}, config);


export const SendRequest =  async (data : CreateRequestParams) => await axios.post(`http://localhost:8000/friend-request/send-request`,data,  config);
   


export const getAllUsers = async () => axios.get(`http://localhost:8000/user/All-users`, config);

export const AcceptRequest = async (id : string) => axios.post(`http://localhost:8000/friend-request/accept-request`, {requestId : id}, config);

export const refuseRequest = async ( id: string) => axios.post(`http://localhost:8000/friend-request/refuse-request`, {requestId : id }, config);


export const changeDisplayedName = async (DisplayName : string) => axios.post(`http://localhost:8000/user/changedisplayname`, {newDisplayName : DisplayName }, config);

export const changeUserName = async (UserName : string) => axios.post(`http://localhost:8000/user/changeusername`, {newUserName: UserName}, config);

export const changeAvatar = async (AvatarUrl : string) => axios.post(`http://localhost:8000/user/changeAvatar`, {file : AvatarUrl}, config);

export const searchingBar = async (display_name : string) => axios.post(`http://localhost:8000/user/search`, {displayName : display_name}, config);


export const findConversationUsers = async ( display_name : string) => axios.post(`http://localhost:8000/chat/findConversationUser`, {display_name : display_name}, config);


export const createRoomsApi = (data:any) =>{
    const response = API.post("/rooms/createRooms",{data})
    return response;  
}
  
export const updateRoomsApi = (data:any) =>{
    const response = API.post("/rooms/updateRooms",{data})
    return response;  
}
  
export const deleteRoomsApi = (id:string) =>{
    const response = API.post("/rooms/deleteRooms",{id})
    return response;  
}
  
export const getAllRoomsApi = () =>{
    const response = API.get("/rooms/getAllRooms")
    return response;  
}

export const generateQrcode=() =>{
    const response = API.get("/two-factor-authentication/2fa/generate")
    return response;
}

export const verifyCode = async (code : string) => {
    const res = API.post("/two-factor-authentication/2fa/verify", {code})
    return res;
}

export const confirm = async (code : string) => {
    const res = API.post("/two-factor-authentication/2fa/confirm", {code})
    return res;
}

