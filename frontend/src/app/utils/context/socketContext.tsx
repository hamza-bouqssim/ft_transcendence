import { createContext, Dispatch, SetStateAction } from "react";
import { io, Socket } from "socket.io-client";
import { ConversationTypes, GroupChannel, User } from "../types";

interface lastMessage {
	id: string;
	content: string;
	createdAt: Date;
  }
  
  interface Member {
	user_id: string;
	isAdmin: boolean;
  }
  
  interface Room {
	id: string;
	name: string;
	Privacy: string;
	picture: string;
	createdAt: Date;
	updatedAt: Date;
	members: Member[];
	messageRome: lastMessage[];
  }

type SocketContextValue = {
  socket: Socket;
  updateChannel: (newAddress: Room| ConversationTypes | null) => void;
  channel:Room | ConversationTypes | null;
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