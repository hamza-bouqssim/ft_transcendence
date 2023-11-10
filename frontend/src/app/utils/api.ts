import axios, { Axios, AxiosRequestConfig } from 'axios'
import { ConversationTypes, CreateMessageParams, FetchMessagePayload, User, UserCredentialsParams, createUserParams } from './types';


const config : AxiosRequestConfig = { withCredentials: true}

export const postRegisterUser = async (data: createUserParams) => axios.post(`http://localhost:8000/auth/signup`, data, config)



export const postLoginUser = async (data : UserCredentialsParams) => axios.post(`http://localhost:8000/auth/signin`, data, config)


// export const getAuthUser = () => axios.get<User>(`http://localhost:8000/chat/status`, config)
export const getAuthUser = () => axios.get<User>(`http://localhost:8000/user/info`, config)

export const getConversation = () => axios.get<ConversationTypes[]>(`http://localhost:8000/chat/findconversation`, config)


export const getConversationMessage = (id : string) => axios.get<FetchMessagePayload>(`http://localhost:8000/messages/${id}`, config)

export const loginGoogle = () => axios.get(`http://localhost:8000/auth/google/login`, config)

export const getlogout = () => axios.get(`http://localhost:8000/auth/signout`, config);

export const postNewMessage = async (data : CreateMessageParams) => axios.post(`http://localhost:8000/messages/create_messages`, data, config);