"use client";
import { io } from "socket.io-client";
import { createContext } from "react";

export const socket = io("http://localhost:8000/chat", {
	withCredentials: true,
});

// TODO: mablanch any
export const socketContext = createContext<any>(socket);
