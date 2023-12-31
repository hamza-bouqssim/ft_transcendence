import axios, { Axios, AxiosRequestConfig } from 'axios'
import { AcceptRequestParams, ConversationTypes, CreateConversationParams, CreateMessageParams, CreateRequestParams, FetchMessagePayload,  User, UserCredentialsParams, createUserParams } from './types';

const API = axios.create({
    baseURL: "http://10.13.10.3:8000/",
    withCredentials: true,
  });



  interface createRoom {
    name: string;
    Privacy: string;
    password: string | null;
    picture: string | null;
    idUserAdd: string[]; 
  }
  
  interface join {
    id :string;
      Privacy :string;
      password :string;
  }

const config : AxiosRequestConfig = { withCredentials: true}

export const postRegisterUser = async (data: createUserParams) => axios.post(`http://10.13.10.3:8000/auth/signup`, data, config)
 

export const postLoginUser = async (data : UserCredentialsParams) => axios.post(`http://10.13.10.3:8000/auth/signin`, data, config)


export const getAuthUser = () => axios.get<User>(`http://10.13.10.3:8000/user/info`, config)

export const getConversation = () => axios.get(`http://10.13.10.3:8000/chat/findconversation`, config)

export const createConversation = async (display_name : string, message: string) => axios.post(`http://10.13.10.3:8000/chat/conversation`,{display_name : display_name, message: message}, config)
export const getConversationMessage = (id : string) => axios.get(`http://10.13.10.3:8000/chat/messages/${id}`, config)
export const markConversationAsRead = (id : string) => axios.get(`http://10.13.10.3:8000/chat/${id}/mark-as-read`, config);
export const loginGoogle = () => axios.get(`http://10.13.10.3:8000/auth/google/login`, config)

export const getlogout = () => axios.get(`http://10.13.10.3:8000/auth/logout`, config);

export const postNewMessage = async (data : CreateMessageParams) => axios.post(`http://10.13.10.3:8000/chat/create_messages`, data, config);

// get all friends

export const getAllFriends = () => axios.get(`http://10.13.10.3:8000/user/my-friends`, config);

export const getRequest = () => 
{
  const response = API.get(`http://10.13.10.3:8000/user/pending-requests`);
  return response;
}

export const getNotification = () => axios.get(`http://10.13.10.3:8000/user/notification`, config);
export const getBloques = () => axios.get(`http://10.13.10.3:8000/user/blocked-friends`, config);

export const DebloqueUser = async (id : string) => axios.post(`http://10.13.10.3:8000/friend-request/unblock-friend`, {friendIdToUnblock : id}, config);

export const bloqueFriend = async (id : string) => axios.post(`http://10.13.10.3:8000/friend-request/block-friend`, {friendIdToBlock : id}, config);


export const SendRequest =  async (display_name : string) => await axios.post(`http://10.13.10.3:8000/friend-request/send-request`,{display_name : display_name},  config);

export const sendRequestPlay = async (display_name : string) => await axios.post(`http://10.13.10.3:8000/friend-request/send-request-play`, {display_name : display_name}, config);
export const acceptRequestToPlay = async (requestId : string) => await axios.post(`http://10.13.10.3:8000/friend-request/accept_request_play`, {requestId : requestId}, config);
export const refusePLayRequest = async (requestId : string) => await axios.post(`http://10.13.10.3:8000/friend-request/refuse-request-play`, {requestId : requestId}, config)
export const pending_request_play = () => axios.get(`http://10.13.10.3:8000/user/pending-request-play`, config);

export const getAllUsers = async () => axios.get(`http://10.13.10.3:8000/user/All-users`, config);


//count number of the notification

export const getNumberNotification = async () => axios.get(`http://10.13.10.3:8000/friend-request/notification_count`, config);
export const getNumberPending = async () => axios.get(`http://10.13.10.3:8000/user/count-pending`, config);


export const AcceptRequest = async (id : string) => axios.post(`http://10.13.10.3:8000/friend-request/accept-request`, {requestId : id}, config);

export const refuseRequest = async ( id: string) => axios.post(`http://10.13.10.3:8000/friend-request/refuse-request`, {requestId : id }, config);

export const deleteNotification = async (idNotif : string) => axios.post(`http://10.13.10.3:8000/friend-request/delete-notification`, {idNotif : idNotif}, config)

export const changeDisplayedName = async (DisplayName : string) => axios.post(`http://10.13.10.3:8000/user/changedisplayname`, {newDisplayName : DisplayName }, config);

export const changeUserName = async (UserName : string) => axios.post(`http://10.13.10.3:8000/user/changeusername`, {newUserName: UserName}, config);


export const dataUser = async (id_user: string | string[]) => axios.post(`http://10.13.10.3:8000/user/get_user`, {id_user : id_user}, config);


export const getUnreadMessages = async (conversationId : string) => axios.post(`http://10.13.10.3:8000/chat/unread-messages`, {conversationId : conversationId}, config)


export const removeFriendship = async (display_name : string) => axios.post(`http://10.13.10.3:8000/friend-request/remove-friendship`, {display_name : display_name}, config);
//delete conversation

export const deleteConversation = async (conversationId : string) => axios.post(`http://10.13.10.3:8000/chat/delete-conversation`, {conversationId : conversationId}, config)
export const changeAvatar = async (avatarFormData: FormData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  
    return axios.post(`http://10.13.10.3:8000/user/changeAvatar`, avatarFormData, config);
  };
export const searchingBar = async (name : string) => axios.post(`http://10.13.10.3:8000/friend-request/search`, {name: name}, config);
export const getAllRequests = async() => axios.get(`http://10.13.10.3:8000/user/all-pending-request`, config);

export const findConversationUsers = async ( display_name : string, message : string) => axios.post(`http://10.13.10.3:8000/chat/findConversationUser`, {display_name : display_name , message : message}, config);
// tabel friends


export const blockedUsers = async () => axios.get(`http://10.13.10.3:8000/friend-request/blocked`, config);

export const tableFriends = async () => axios.get(`http://10.13.10.3:8000/user/table-friends`, config);

export const createRoomsApi = (data:createRoom) =>{

     API.post("/rooms/createRooms",{data}).then((res)=>{
        console.log(res)
        return res;  
     }).catch((err)=>{
      console.log(err)
     })

   
}

  
export const updateRoomsApi = (data:ConversationTypes | null) => {
	const response = API.post("/rooms/updateRooms", { data });
	return response;
};
  
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
export const disable2Fa = async () => {
    const res = API.post("/two-factor-authentication/2fa/disable");
    return res;
}

export const changePhoto = async (avatar: string) => {
    const res = API.post("/user/changePhoto", {avatar})
    return res;
}

export const deleteAvatar = async () => {
  const res = API.post("/user/deletePhoto");
  return res;
}

export const firstTime = async () => {
    const res = API.post("/user/first_time");
    return res;
}

export const getConversationMessageRoom = (id:string) =>{
  const response = API.post("/rooms/getConversation",{id})
  return response;
}


export const getAllMembersApi =(id:string) =>
{
  const response = API.post("/rooms/allMember",{id})
  return response;
}

export const quitRoom =(id:string) =>
{
  const response = API.post("/rooms/quitRoom",{id})
  return response;
}


export const makeAdmin =(id:string ,userId:string) =>
{
  const response = API.post("/rooms/makeAdmin",{id,userId})
  return response;
}
export const Member =(id:string ,userId:string) =>
{
  const response = API.post("/rooms/Member",{id,userId})
  return response;
}
export const kickMember =(id:string ,userId:string) =>
{
  const response = API.post("/rooms/kickMember",{id,userId})
  return response;
}
export const mutMember =(id:string ,userId:string) =>
{
  const response = API.post("/rooms/mutMember",{id,userId})
  return response;
}
export const banMember =(id:string ,userId:string) =>
{
  const response = API.post("/rooms/banMember",{id,userId})
  return response;
}

export const getMatchHistory = (id: string) =>{
  try{
    const response = API.post("/game/myhistory", {userId:id});
    return response;

  }catch(error : any){
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      return ('Failed to get MatchHistory');
    }

  }

}

export const getStates = (id: string) =>{
  const response = API.post("/game/myresult", {userId:id});
  return response;
}

export const getRanking = () =>{
  const response = API.get("/game/ranking");
  return response;
}

export const deleteAccount = () => {
  const response = API.delete("/user/delete-account");
  return response;
}

export const getUserInfos = (id:string) => {
  const response = API.post("/user/get_user", {id_user:id});
  return response;
}

export const addMemberToRooms = (id:string ,userId:string) =>
{
  const response = API.post("/rooms/addMemberToRooms",{id,userId});
  return response;
}

export const isAuth = () =>
{
  const response = API.post("/auth/isAuth");
  return response;
}

export const joinRoomApi =(data:join) =>{
  const response = API.post("/rooms/joinRooms",data);
  return response;
}

