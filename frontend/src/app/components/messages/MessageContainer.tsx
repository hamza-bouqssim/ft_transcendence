import {MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "@/app/utils/styles"
import { ConversationTypes, User, messageTypes } from "@/app/utils/types";
import { FC, useEffect, useState,useContext, useRef } from "react";
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
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const joinRoom = (id: string) => {
        if (oldId) socket.emit("leaveToRoom", { id: oldId });
        socket.emit("joinToRoom", { id: id });
        setOldId(id);
      };
    
      if (channel) {
        const id = channel.id;
    
        if (id) {
          dispatch(fetchMessagesThunk(id));
          joinRoom(id);
        }
      }
    }, [dispatch, channel, oldId, socket, setOldId]);
    useEffect(() => {
      scrollRef.current?.scrollIntoView();
    }, [messages]);

    const breakContentIntoLines = (content : string, lineLength : number) => {
      const regex = new RegExp(`.{1,${lineLength}}`, 'g');
      return content.match(regex) || [];
    };
  
    const debloqueFromPanel  = async () =>{
        let user : User | undefined;
        if( channel && channel?.sender.id === Userdata?.id)
            user = channel?.recipient;
        else
          user =channel?.sender;
        if(user){
          const id = user.id;
          try {
            await dispatch(fetchDebloqueUserThunk(id));
              ToastSuccess("You have Deblocked this friend successfully");
  
          } catch (error) {
            ToastError("Failed to Deblock the friend. Please try again.");
  
          }

        }
        
    }
    return (

       <>
         
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
                      {m.sender.display_name}
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
                    {breakContentIntoLines(m.content, 30).map((line, index) => (
                        <div key={index}>{line}</div>
                              ))} </div>
                </div>
              </div>
            ))}
        </MessageContainerStyle>
        <div ref={scrollRef}></div>

        </div>
        {(isSenderBlocked && Userdata?.display_name === channel?.sender.display_name) || (isRecipientBlocked && Userdata?.display_name === channel?.recipient.display_name) ? (
          <button onClick={() => debloqueFromPanel()} className="w-full p-4 py-3 bg-[#5B8CD3] px-4 mr-2 rounded-full" >
            Unblock
          </button>
        
        ) : (!isRecipientBlocked && !isSenderBlocked) ? (
            <MessageInputField />
        ) : null}
          </>
        )
}

export default MessageContainer; 