import axios, { Axios, AxiosRequestConfig } from 'axios'
import { User, UserCredentialsParams, createUserParams } from './types';


const config : AxiosRequestConfig = { withCredentials: true}

export const postRegisterUser = async (data: createUserParams) => axios.post(`http://localhost:8000/auth/signup`, data, config)



export const postLoginUser = async (data : UserCredentialsParams) => axios.post(`http://localhost:8000/auth/signin`, data, config)


export const getAuthUser = () => axios.get<User>(`http://localhost:8000/chat/status`, config)

export const getConversation = () => axios.get(`http://localhost:8000/chat/findconversation`, config)


export const getConversationMessage = (id : string) => axios.get(`http://localhost:8000/messages/${id}`, config)

export const loginGoogle = () => axios.get(`http://localhost:8000/auth/google/login`, config)