"use client"
import { io } from "socket.io-client";
import { createContext } from "react";

export const socket = io("http://localhost:8000/chat", {
     withCredentials: true,
});

export const socketContext = createContext(socket);


// import { createContext, useContext } from "react";
// import { io, Socket } from "socket.io-client";

// // Define the type for the socket context
// interface SocketContextType {
//   socket: Socket;
//   Userdata: any;
// //   updateChannel: (newChannel: string) => void;
// //   channel: string; // Define the channel property
// }

// // Create the socket instance
// export const socket = io("http://localhost:8000/chat", {
//   withCredentials: true,
// });

// // Create the context with the specified type and set a default value
// export const socketContext = createContext<SocketContextType>({
//   socket,
//   Userdata: null,
// //   updateChannel: (newChannel: any) => {
// //     // Implement the logic to update the channel
// //   },
// //   channel: "", // Provide an initial value for the channel
// });