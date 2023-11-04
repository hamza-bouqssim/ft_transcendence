"use client"
import { io } from "socket.io-client";
import { createContext } from "react";

export const socket = io("http://localhost:8000");
export const socketContext = createContext(socket);