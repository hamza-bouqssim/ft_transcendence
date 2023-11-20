import axios, { Axios, AxiosRequestConfig } from 'axios'
import { AcceptRequestParams, ConversationTypes, CreateConversationParams, CreateMessageParams, CreateRequestParams, FetchMessagePayload, User, UserCredentialsParams, createUserParams } from './types';


const config : AxiosRequestConfig = { withCredentials: true}

export const postRegisterUser = async (data: createUserParams) => axios.post(`http://localhost:8000/auth/signup`, data, config)



export const postLoginUser = async (data : UserCredentialsParams) => axios.post(`http://localhost:8000/auth/signin`, data, config)


// export const getAuthUser = () => axios.get<User>(`http://localhost:8000/chat/status`, config)
export const getAuthUser = () => axios.get<User>(`http://localhost:8000/user/info`, config)

export const getConversation = () => axios.get(`http://localhost:8000/chat/findconversation`, config)

export const createConversation = async (data : CreateConversationParams) => axios.post(`http://localhost:8000/chat/conversation`,data, config)
export const getConversationMessage = (id : string) => axios.get(`http://localhost:8000/messages/${id}`, config)

export const loginGoogle = () => axios.get(`http://localhost:8000/auth/google/login`, config)

export const getlogout = () => axios.get(`http://localhost:8000/auth/signout`, config);

export const postNewMessage = async (data : CreateMessageParams) => axios.post(`http://localhost:8000/messages/create_messages`, data, config);

// get all friends

export const getAllFriends = () => axios.get(`http://localhost:8000/user/my-friends`, config);

export const getRequest = () => axios.get(`http://localhost:8000/user/pending-requests`, config);

export const getBloques = () => axios.get(`http://localhost:8000/user/blocked-friends`, config);

export const SendRequest =  async (data : CreateRequestParams) => axios.post(`http://localhost:8000/friend-request/send-request`,data,  config)

export const getAllUsers = async () => axios.get(`http://localhost:8000/user/All-users`, config);

export const AcceptRequest = async (id : string) => axios.post(`http://localhost:8000/friend-request/accept-request`, {requestId : id}, config);

export const changeDisplayedName = async (newDisplayName : string) => axios.post(`http://localhost:8000/user/changedisplayname`, {newDisplayName : newDisplayName }, config);

export const changeUserName = async (newUserName : string) => axios.post(``)