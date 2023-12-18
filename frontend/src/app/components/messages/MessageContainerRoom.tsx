import {MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "@/app/utils/styles"
import { User, messageTypes } from "@/app/utils/types";
import { FC, useEffect, useState,useContext ,useRef, useCallback} from "react";
import {formatRelative} from 'date-fns'
import { getAuthUser, getConversationMessageRoom } from "@/app/utils/api";
import MessageInputField from "./MessageInputFieldRoom";
import {socketContext } from "@/app/utils/context/socketContext";
import {getConversationMessage} from '@/app/utils/api'
import Image from  'next/image'
import {usePathname} from 'next/navigation'



const MessageContainerRoom = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [Message,setMessage] = useState<any[]>([]);
    const [MessageRoom,setMessageRoom] = useState<any[]>([]);
    const pathname = usePathname()
    const { channel } = useContext(socketContext);
    const { oldId,setOldId } = useContext(socketContext);
    const socket  = useContext(socketContext).socket;
    const {Userdata} = useContext(socketContext);

    const joinRoom = useCallback(
        (id: string) => {
          if (oldId) socket.emit("leaveToRoom", { id: oldId });
          socket.emit("joinToRoom", { id: id });
          setOldId(id);
        },
        [oldId, socket, setOldId]
      );
      useEffect(() => {
     
        const id = channel.id;
        if (pathname.includes("chat")) {
          getConversationMessage(id)
            .then((data: any) => {
              joinRoom(id);
              setMessage(data.data);
            })
            .catch((err: any) => console.log(err));
        } else {
          getConversationMessageRoom(id)
            .then((data: any) => {
              joinRoom(id);
              setMessage(data.data.data);
            })
            .catch((err: any) => console.log(err));
        }
      }, [channel.id, joinRoom, pathname]);
      
      useEffect(() => {
        scrollRef.current?.scrollIntoView();
      }, [Message]);
    return (
        
        <>
            <div className="h-[calc(100%-135px)] no-scrollbar  overflow-y-auto py-3 ">
                { Message?.map((m:any) =>(
                    <div className="" key={m.id}>
                        <div className={`${Userdata?.id !== m?.senderId ? "bg-[#F2F3FD] text-[#404040] mr-auto" : "bg-[#5B8CD3] ml-auto "} my-2 w-fit max-w-[70%]  rounded-2xl    flex justify-between items-end`}>
                            <h1 className="p-2"> {m.content}</h1>
                            <h1 className=" pl-5 pr-3 pb-1 text-[12px]">19.54</h1>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>
            <MessageInputField Message={Message} setMessage={setMessage}/>
        </>
    )
}

export default MessageContainerRoom; 
