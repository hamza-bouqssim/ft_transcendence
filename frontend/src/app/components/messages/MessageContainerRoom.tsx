import {MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "@/app/utils/styles"
import { User, messageTypes } from "@/app/utils/types";
import { FC, useEffect, useState,useContext ,useRef} from "react";
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
    const {Userdata} = useContext(socketContext)
    console.log("hi")
    const joinRoom =(id:string) =>{
		if(oldId)
			socket.emit("leaveToRoom",{id:oldId})
		socket.emit("joinToRoom",{id:id})
        setOldId(id);
	}

    // room and chat
    useEffect(() => {
        const id = channel.id;
        if (pathname.includes("chat"))
        {
            getConversationMessage(id)
            .then(( data :any) => {
                joinRoom(id);
                setMessage(data.data);
            })
            .catch((err:any) => console.log(err));

        }
        else
        {
            getConversationMessageRoom(id)
            .then(( data :any) => {
                joinRoom(id);
                setMessage(data.data.data);
            })
            .catch((err:any) => console.log(err));
        }
    }, [channel.id]);
  
   
    useEffect(()=>{
      scrollRef.current?.scrollIntoView()
    },[Message])

    console.log(Message)
    return (
        
        <>
            <div className="h-[calc(100%-148px)] no-scrollbar  overflow-y-auto py-3 ">
                { Message?.map((m:any) =>(
                    <div className="" key={m.id}>
                       
                        <div className={`${Userdata?.id !== m?.senderId ? " mr-auto justify-start" : "ml-auto justify-end"} my-2    max-w-[70%]  flex  items-start`}>
                            {
                                m?.senderId !== Userdata?.id   && <div className="mr-2 mt-1">
                                <Image src={m?.user.avatar_url} alt="" className=' rounded-full' width={30}
                                                    height={30}/>
                    
                                </div>
                            }
                            <div  className={`${Userdata?.id !== m?.senderId ? "bg-[#F2F3FD] text-[#404040] " : "bg-[#5B8CD3] "} w-fit max-w-[90%] rounded-2xl flex items-end justify-between`}>
                                <h1 className="p-2"> {m.content}</h1>
                                <h1 className=" pl-5 pr-3 pb-1 text-[12px]">19.54</h1>
                            </div>
                            
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
