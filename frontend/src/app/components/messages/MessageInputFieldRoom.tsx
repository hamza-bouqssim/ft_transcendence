"use client"
import { MessageInputFieldContainer, MessageInput, BtnStyling } from "@/app/utils/styles"
import { Dispatch, SetStateAction, FC } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { CiImageOn } from "react-icons/ci";
import { socketContext } from "@/app/utils/context/socketContext";
import {useContext, useEffect,useState}  from "react"
import { MessageType, messageTypes } from "@/app/utils/types";
import {useRouter,usePathname} from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';


type props = {
    Message : any[];
    setMessage :Dispatch<React.SetStateAction<any>>   
}

const MessageInputField: FC<props> = ({setMessage, Message}) => {
    const pathname = usePathname();
    const socket = useContext(socketContext).socket;
    const { channel } = useContext(socketContext);
    const [content, setContent] = useState('');
    const {Userdata} = useContext(socketContext)
    const { members, status, error } = useSelector((state:any) => state.member);
    console.log("hi")
    useEffect(() => {
      const handleOnMessage = (message: any) => {
        setMessage((prevMessages: messageTypes[]) => [...prevMessages, message]);
        console.log('Received message:', message);
      };
  
      if (pathname.includes('chat')) {
        socket.on('onMessage', handleOnMessage);
      } else {
        socket.on('messageRome', handleOnMessage);
      }
  
      return () => {
        if (pathname.includes('chat')) {
          socket.off('onMessage', handleOnMessage);
        } else {
          socket.off('messageRome', handleOnMessage);
        }
      };
    }, [channel.id, socket]);

  
    const sendMessage = async () => {
        if(!content)
            return
        if(pathname.includes("chat"))
        {
            console.log("here")
            socket.emit("message.create", { participentsId: channel.id, content: content });
        }
        else
        {
            socket.emit("messageRome", { chatRoomId: channel.id, content: content });
        }
      setContent('');
    };



    return (
      <>
      { members.some(member => member.user_id === Userdata.id && member.Status === "Member")?
        <div className="flex items-center justify-between ">
         
            <CiImageOn className="text-[#5B8CD3] mr-5 " size={40}/>
            <div  className="w-full  flex items-center bg-[#F2F3FD]  rounded-full justify-between">
                <input 
                onFocus={() => {
                  socket?.emit('Typing', { id:channel.id,userId:Userdata.id});
                }}
                onBlur={() => {
                  socket?.emit('leaveTyping', { id:channel.id,userId:Userdata.id});
                }}
                className="w-full p-4 py-3 bg-[#F2F3FD] rounded-full  focus:outline-none text-[#949494]" placeholder="Type a message" value={content}  onChange={(e) => setContent(e.target.value)}/>
                <button onClick={sendMessage} className="bg-[#5B8CD3]  py-1 px-4 mr-2 rounded-full" type="submit"><LuSendHorizonal size={32} /></button>
            </div>

        </div> 
        : <div className="flex items-center justify-between ">
          <h1 className="text-[#5B8CD3]  mx-auto">You can block this discussion to no longer receive messages</h1>
        </div>
        }
      </>
    )
}

export default MessageInputField