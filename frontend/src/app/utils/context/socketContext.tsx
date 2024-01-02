
import { createContext, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { ConversationTypes, User } from "../types";

type SocketContextValue = {
  socket: Socket;
  updateChannel: (newAddress: ConversationTypes | null) => void;
  channel: ConversationTypes | null;
  oldId: any;
  setOldId: Dispatch<SetStateAction<any>>;
  Userdata: User | null;
  setUserdata: Dispatch<SetStateAction<User | null>>;
  isMessage: boolean;
  setIsMessage: Dispatch<SetStateAction<boolean>>;
};

export const socketContext = createContext<SocketContextValue>({
  socket: {} as Socket, 
  updateChannel: () => {},
  channel: null,
  oldId: null,
  setOldId: () => {},
  Userdata: null,
  setUserdata: () => {},
  isMessage: false,
  setIsMessage: () => {},
});