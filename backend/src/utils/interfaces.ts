/* eslint-disable prettier/prettier */
import { User } from "@prisma/client";
import { Socket } from "socket.io";

/* eslint-disable prettier/prettier */
export interface AuthenticatedSocket extends Socket{
   
    user: any;
}
