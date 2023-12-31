import {MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "../../utils/styles"
import { ConversationTypes, User, messageTypes } from "../../utils/types";
import { FC, useEffect, useState,useContext, useRef } from "react";
import {formatRelative} from 'date-fns'
import { getAuthUser } from "../../utils/api";
import MessageInputField from "./MessageInputField";
import {socketContext } from "../../utils/context/socketContext";
import {getConversationMessage} from '../../utils/api'
import Image from  'next/image'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { MessagesState, fetchMessagesThunk } from "../../store/messageSlice";
import { fetchDebloqueUserThunk } from "../../store/blockSlice";
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
      if(user && user.id != Userdata?.id){
        const id = user.id;
        try {
          const res = await dispatch(fetchDebloqueUserThunk(id));
          if(!res.payload.success)
            ToastError(`${res.payload.message}`)
          else
            ToastSuccess('You are debloqued this user succeffully')

        } catch (error) {
          ToastError("Failed to Deblock the friend. Please try again.");

        }

      }
      
  }
    const [shouldRenderUnblockButton, setShouldRenderUnblockButton] = useState(false);
    useEffect(() => {
  
      if (
        (isSenderBlocked && Userdata?.display_name === channel?.sender.display_name) ||
        (isRecipientBlocked && Userdata?.display_name === channel?.recipient.display_name)
      ) {
        setShouldRenderUnblockButton(true);
      } else {
        setShouldRenderUnblockButton(false);
      }
    }, [isSenderBlocked, isRecipientBlocked, Userdata, channel]);
    return (

       <>
         
        <div className="h-[calc(100%-130px)] no-scrollbar  overflow-y-auto  ">
        <MessageContainerStyle>
          {messages &&
            messages.map((m: messageTypes) => (
                <div className={`flex w-full mt-2 space-x-3 max-w-xs ${Userdata?.id === m.sender.id ? 'self-end' : 'self-start'} overflow-y-auto`} key={m.id}> 
                {!(Userdata?.id === m.sender.id) && <Image
                  src={m.sender?.avatar_url}
                  className="h-10 w-10 rounded-[50%] bg-black"
                  alt="Description of the image"
                  width={60}
                  height={60}
                />}

                <div className={`flex-1`}>
                  {!(Userdata?.id === m.sender.id) && <div className="flex gap-4	" key={m.id}>
                    <span
                      className="senderName  font-['Whitney_Semibold']"
                      style={{
                        color: Userdata?.id === m.sender.id ? '#8982a6' : '#778ba5',
                      }}
                    >
                      {m.sender.display_name}
                    </span>
                  
                  </div >}

                  <div
                    className={`relative ml-3 text-sm  py-2 px-4 shadow rounded-xl bg-[#5B8CD3] font-['Whitney_Semibold'] ${
                      Userdata?.display_name === m.sender.display_name ? 'bg-[#5B8CD3] ' : 'bg-[--gray-color] text-black'
                    }`}
                  >
                    {breakContentIntoLines(m.content, 30).map((line, index) => (
                        <div key={index}>{line}</div> ))} 
                            <span className="text-sm  font-['Whitney_Semibold absolute bottom-2 right-3 text-gray-600"> 	{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>

                  </div>
                           
                  </div>
              


               
              </div>
            ))}
        </MessageContainerStyle>
        <div ref={scrollRef}></div>

        </div>
        {shouldRenderUnblockButton ? (
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