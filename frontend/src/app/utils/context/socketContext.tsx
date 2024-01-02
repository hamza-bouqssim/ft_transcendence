
import { createContext, Dispatch, SetStateAction } from "react";
import { io, Socket } from "socket.io-client";
import { ConversationTypes, User } from "../types";



type SocketContextValue = {
	socket: Socket;
	updateChannel: (newAddress: ConversationTypes | null) => void;
	channel:  ConversationTypes | null;
	oldId: any;
	setOldId: Dispatch<SetStateAction<any>>;
	Userdata: User | null;
	setUserdata: Dispatch<SetStateAction<User | null>>;
  isMessage : boolean;
  setIsMessage: Dispatch<SetStateAction<boolean>>
};

export const socket = io("http://localhost:8000/chat", {
     withCredentials: true,
     autoConnect: false,
});
export const socketContext = createContext<SocketContextValue>({
  socket,
  updateChannel: () => {}, 
  channel: null,
  oldId: null,
  setOldId: () => {}, 
  Userdata: null,
  setUserdata: () => {}, 
  isMessage : false,
  setIsMessage : () => {}
});