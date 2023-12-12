"use client"
import { MessageInputFieldContainer, MessageInput, BtnStyling } from "@/app/utils/styles"
import { Dispatch, SetStateAction, FC } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { CiImageOn } from "react-icons/ci";
import { socketContext } from "@/app/utils/context/socketContext";
import {useContext, useEffect,useState}  from "react"
import { MessageType, messageTypes } from "@/app/utils/types";
import { fetchMessagesThunk } from "@/app/store/messageSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";




const MessageInputField=() => {

    const socket = useContext(socketContext).socket
    const {channel, updateChannel} = useContext(socketContext)
    const [content,setContent] = useState("");

    

   

const sendMessage = async () => {
    socket.emit("message.create", { participentsId: channel.id, content: content });
    setContent('');  // Assuming you want to clear the content after sending the message
};



    return (
        <div className="flex items-center justify-between ">
        <CiImageOn className="text-[#5B8CD3] mr-5 " size={40}/>
        <div  className="w-full  flex items-center bg-[#F2F3FD]  rounded-full justify-between">
            <input className="w-full p-4 py-3 bg-[#F2F3FD] rounded-full  focus:outline-none text-[#949494]" placeholder="Type a message" value={content}  onChange={(e) => setContent(e.target.value)}/>
            <button onClick={sendMessage} className="bg-[#5B8CD3]  py-1 px-4 mr-2 rounded-full" type="submit"><LuSendHorizonal size={32} /></button>
        </div>
        </div>
    )
}

export default MessageInputField