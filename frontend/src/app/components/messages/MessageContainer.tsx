import {MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "@/app/utils/styles"
import { ConversationTypes, User, messageTypes } from "@/app/utils/types";
import { FC, useEffect, useState,useContext } from "react";
import {formatRelative} from 'date-fns'
import { getAuthUser } from "@/app/utils/api";
import MessageInputField from "./MessageInputField";
import {socketContext } from "@/app/utils/context/socketContext";
import {getConversationMessage} from '@/app/utils/api'
import Image from  'next/image'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { MessagesState, fetchMessagesThunk } from "@/app/store/messageSlice";
import { fetchDebloqueUserThunk } from "@/app/store/blockSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const MessageContainer = () => {
  const ToastError = (message: any) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };
	
	  const ToastSuccess = (message: any) => {
		toast.success(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };
    const [setLoadloadinging] = useState<boolean>(false);
    // const [Message,setMessage] = useState<messageTypes[]>([]);
    const controller = new AbortController();
    const { channel } = useContext(socketContext);
    const { oldId,setOldId } = useContext(socketContext);
    const socket  = useContext(socketContext).socket;
    const {Userdata} = useContext(socketContext);
    const dispatch = useDispatch<AppDispatch>();
    const { messages, status, error , isSenderBlocked , isRecipientBlocked} = useSelector((state:any) => state.messages);

    useEffect(() => {
      const joinRoom = (id: string) => {
        if (oldId) socket.emit("leaveToRoom", { id: oldId });
        socket.emit("joinToRoom", { id: id });
        setOldId(id);
      };
    
      // Check if channel is not null before accessing its properties
      if (channel) {
        const id = channel.id;
    
        if (id) {
          dispatch(fetchMessagesThunk(id));
          joinRoom(id);
        }
      }
    }, [dispatch, channel, oldId, socket, setOldId]);
    
    return (

       <>
        <ToastContainer />
        <div className="h-[calc(100%-130px)] no-scrollbar  overflow-y-auto  ">
        <MessageContainerStyle>
          {messages &&
            messages.map((m: messageTypes) => (
                <div className={`flex w-full mt-2 space-x-3 max-w-xs ${Userdata?.id === m.sender.id ? 'self-end' : 'self-start'} overflow-y-auto`} key={m.id}>                <Image
                  src={m.sender?.avatar_url}
                  className="h-10 w-10 rounded-[50%] bg-black "
                  alt="Description of the image"
                  width={60}
                  height={60}
                />

                <div className={`flex-1`}>
                  <div className="flex gap-4	" key={m.id}>
                    <span
                      className="senderName"
                      style={{
                        color: Userdata?.id === m.sender.id ? '#8982a6' : '#778ba5',
                      }}
                    >
                      {m.sender.username}
                    </span>
                    <span className="text-sm text-gray-800	">
                      {formatRelative(new Date(m.createdAt), new Date())}
                    </span>
                  </div >

                  <div
                    className={`relative ml-3 text-sm  py-2 px-4 shadow rounded-xl bg-[#7093c5]  ${
                      Userdata?.display_name === m.sender.display_name ? 'bg-[#718baf] ' : 'bg-[#7093c5] '
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
        </MessageContainerStyle>
        </div>
        {(isSenderBlocked && Userdata?.display_name === channel?.sender.display_name) || (isRecipientBlocked && Userdata?.display_name === channel?.recipient.display_name) ? (
          <button className="w-full p-4 py-3 bg-[#5B8CD3] px-4 mr-2 rounded-full" >
            Unblock
          </button>
        
        ) : (!isRecipientBlocked && !isSenderBlocked) ? (
            <MessageInputField />
        ) : null}
          </>
        )
}

export default MessageContainer; 