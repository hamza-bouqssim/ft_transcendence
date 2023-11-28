"use client"
import React, { useContext, useEffect, useState } from "react"
import CoversationSideBar from "@/app/components/CoversationSideBar/ConversationSideBar";
import { socketContext } from "@/app/utils/context/socketContext";
import { UsersTypes } from "@/app/utils/types";

const CoversationPage = () =>
{
	const socket = useContext(socketContext);
	const [onlineUsers, setOnlineUsers] = useState<UsersTypes[]>([]);


	// useEffect(() => {

		
    //     socket.emit('getOnlineUsers');
    //     socket.on('getOnlineUsers', (onlineUsers) => {
    //         console.log("online friend-->", onlineUsers);
    //         setOnlineUsers(onlineUsers);
    //     });
    // console.log("socket here", socket.id);
    //     return () => {
    //         socket.off('getOnlineUsers');
    //     };
    // }, [socket]);
	useEffect(() => {
		socket.on('updateOnlineUsers', (onlineUsers) => {
			setOnlineUsers(onlineUsers);
		});
	
		return () => {
			socket.off('updateOnlineUsers');
		};
	}, [socket]);
	// useEffect(() => {
	// 	// Listen for user status changes
	// 	socket.on('userStatusChanged', ({ userId, status }) => {
	// 		setOnlineUsers((prevUsers) => {
	// 			const updatedUsers = prevUsers.map((user) => {
	// 				if (user.id === userId) {
	// 					return { ...user, status };
	// 				}
	// 				return user;
	// 			});
	// 			return updatedUsers;
	// 		});
	// 	});
	
	// 	// Fetch initial online users when the component mounts
	// 	socket.emit('getOnlineUsers');
		
	// 	// Clean up event listeners when the component unmounts
	// 	return () => {
	// 		socket.off('getOnlineUsers');
	// 		socket.off('userStatusChanged');
	// 	};
	// }, [socket, setOnlineUsers]);
		return (
			<div className="flex  w-full h-screen xl:container xl:mx-auto">
				<div className ="w-full  h-full xl:w-[35%] xl:p-10 xl:pl-5  xl:pr-2 ">
					<CoversationSideBar onlineUsers={onlineUsers}/>
				</div>
				<div className="xl:my-10 xl:mr-10  w-full xl:ml-2 xl:w-[65%]  xl:rounded-[20px] xl:mt-32 hidden xl:flex items-center justify-center">INITIATE A CONVERSATION WITH A FRIEND YOU WANT TO PLAY WITH</div>
			</div>
)			

}

export default CoversationPage
