import { createContext, Dispatch, SetStateAction } from "react";
import { io, Socket } from "socket.io-client";
import { ConversationTypes, User } from "../types";

type SocketContextValue = {
  socket: Socket;
  updateChannel: (newAddress: ConversationTypes | null) => void;
  channel: ConversationTypes | null;
  oldId: any;
  setOldId: Dispatch<SetStateAction<any>>;
  Userdata: User | null;
  setUserdata: Dispatch<SetStateAction<User | null>>;
};

export const socket = io("http://localhost:8000/chat", {
  withCredentials: true,
});
export const socketContext = createContext<SocketContextValue>({
  socket,
  updateChannel: () => {}, // Provide a default function if needed
  channel: null,
  oldId: null,
  setOldId: () => {}, // Provide a default function if needed
  Userdata: null,
  setUserdata: () => {}, // Provide a default function if needed
});
