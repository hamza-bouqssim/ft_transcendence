"use client"
import { io } from "socket.io-client";
import { createContext } from "react";

export const socket = io("http://localhost:8000/chat", {
     withCredentials: true,
});
export const socketContext = createContext(socket);