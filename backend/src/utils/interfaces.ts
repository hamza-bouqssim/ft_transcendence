/* eslint-disable prettier/prettier */
import { Socket } from "socket.io";

/* eslint-disable prettier/prettier */
export interface AuthenticatedSocket extends Socket{
   
    user: any;
}
