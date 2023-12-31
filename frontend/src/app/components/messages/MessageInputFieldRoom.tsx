"use client"
import { Dispatch,  FC } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { CiImageOn } from "react-icons/ci";
import { socketContext } from "../../utils/context/socketContext";
import {useContext, useEffect,useState}  from "react"
import {  ConversationTypes, MessageType, User, messageTypes } from "../../utils/types";
import {usePathname} from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlockedUsers, fetchBlocksThunk } from "../../store/blockSlice";
import { AppDispatch } from "../../store";
import { updateRoomMessage } from '../../store/roomsSlice';
import React from "react";
interface Members {
	id: string;
	user_id: string;
	chatRoomId: string;
	isAdmin: boolean;
	Status: string;
	user: {
		id: string;
		username: string;
		status: string;
		email: string;
		password: string;
		display_name: string;
		avatar_url: string;
		two_factor_auth: string;
		two_factor_secret_key: string;
	};
}

type props = {
    Message : any[];
    setMessage :Dispatch<React.SetStateAction<any>>   
}
interface Member {
  user_id: string; 
  Status: string;  
}
export type BloqueListRoom = {
  id : string;
  userOne : User;
  userTwo : User;

}
const MessageInputFieldRoom: FC<props> = ({setMessage, Message}) => {
    const pathname = usePathname();
    const socket = useContext(socketContext).socket;
    const { channel } = useContext(socketContext);
    const [content, setContent] = useState('');
    const {Userdata} = useContext(socketContext)
    const dispatch = useDispatch<AppDispatch>();
    const { members, status, error } = useSelector((state:any) => state.member);
    const { rooms} = useSelector((state:any) => state.room);
    const { blocked} = useSelector((state:any) => state.friendsBlock);
    useEffect(() => {
      dispatch(fetchBlockedUsers())
    }, [dispatch]);
    
    useEffect(() => {
      const handleOnMessage = (message: any) => {
        // console.log("message-->", message.senderId);
        // const isSenderBlocked = blocked.some(
        //   (blockedUser: any) => 
        //     blockedUser.userOne.id === message.sender.id || blockedUser.userTwo.id === message.sender.id
        // );
        // console.log("is bloque-->", isSenderBlocked);
    
        // If the sender is blocked, don't update the room message and exit the function
        // if (isSenderBlocked) {
        //   console.log('Sender is blocked. Message not updated.');
        //   return;
        // } sochern
          dispatch(updateRoomMessage({ roomId: channel?.id, updatedMessage: { content: message.content, createdAt: new Date() } }));
          setMessage((prevMessages: messageTypes[]) => [...prevMessages, message]);

      };
      socket.on('messageRome', handleOnMessage);
      return () => {
          socket.off('messageRome', handleOnMessage);
      };
    }, [channel?.id,socket]);

  
    const sendMessage = async () => {
        if(!content)
            return
      socket.emit("messageRome", { chatRoomId: channel?.id, content: content });
      setContent('');
    };
    const handleEnter =(event:any) => {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        sendMessage();   
      }
    }


    return (
      <>
      {
        rooms && rooms.some((room :ConversationTypes) => room.id===channel?.id )
        ?
        (members.some((member : Members) => member.user_id === Userdata?.id && member.Status !== "Mut")?
        <div className="flex items-center justify-between ">
         
            {/* <CiImageOn className="text-[#5B8CD3] mr-5 " size={40}/> */}
            <div  className="w-full  flex items-center bg-[#F2F3FD]  rounded-full justify-between">
                <input 
                onKeyDown={handleEnter}
                onFocus={() => {
                  socket?.emit('Typing', { id:channel?.id,userId:Userdata?.id});
                }}
                onBlur={() => {
                  socket?.emit('leaveTyping', { id:channel?.id,userId:Userdata?.id});
                }}
                className="w-full p-4 py-3 bg-[#F2F3FD] rounded-full  focus:outline-none text-[#949494]" placeholder="Type a message" value={content}  onChange={(e) => setContent(e.target.value)}/>
                <button onClick={sendMessage} className="bg-[#5B8CD3]  py-1 px-4 mr-2 rounded-full" type="submit"><LuSendHorizonal size={32} /></button>
            </div>

        </div> 
        : <div className="flex items-center justify-between ">
          <h1 className="text-[#5B8CD3]  mx-auto">You can block this discussion to no longer receive messages</h1>
        </div>) 
        :
        null       
      }
      </>
    )
}

export default MessageInputFieldRoom