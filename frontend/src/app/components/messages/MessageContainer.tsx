import {MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "@/app/utils/styles"
import { User, messageTypes } from "@/app/utils/types";
import { FC, useEffect, useState,useContext } from "react";
import {formatRelative} from 'date-fns'
import { getAuthUser } from "@/app/utils/api";
import MessageInputField from "./MessageInputField";
import {socketContext } from "@/app/utils/context/socketContext";
import {getConversationMessage} from '@/app/utils/api'
import Image from  'next/image'
import { socket } from "@/app/dashboard/game/SocketContext";
const MessageContainer = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [Message,setMessage] = useState<messageTypes[]>([]);
    const controller = new AbortController();
    const [user,setUser] = useState(null)
    const { channel } = useContext(socketContext);
    useEffect(() => {
            getAuthUser().then(({data}) => {  
                setUser(data);
                })
            .catch((err)=> {console.log(err);});
    }, [channel.id])
    // const sendMessage = async (e : React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if(!id || !content)
    //         return ;
    //     const participentsId = id;
    //     console.log(participentsId);
    //     try{
    //         await postNewMessage({participentsId, content});
    //         setContent('');
    //     }catch(err){
    //         alert("error");
    //         console.log(err);
    //     }
    // };

    useEffect(() => {
        const id = channel.id;
        console.log(id)
        getConversationMessage(id)
          .then(( data :any) => {
            setMessage(data.data);
            console.log("sdfdsfsdfsd",data.data)
          })
          .catch((err:any) => console.log(err));
      }, [channel.id]);
    

      
    console.log(Message)
    return (

        <>
        <div className="h-[calc(100%-135px)]   overflow-auto py-3">
             {Message && Message?.map((m:messageTypes) =>(
                <MessageItemContainer key={m.id}>
                    <img src={m.sender?.avatar_url} className="h-10 w-10 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
                        <MessageItemDetails>
                            <MessageItemHeader key={m.id}>
                                <span className="senderName" style={{color : user?.id === m.sender.id ? '#8982a6' : '#778ba5'}}>
                                    {m.sender?.username}
                                </span>
                                <span className="time">
                                    {formatRelative(new Date(m.createdAt), new Date())}
                                </span>
                            </MessageItemHeader>
                        <MessageItemContent>{m.content}</MessageItemContent>
                    </MessageItemDetails>
                </MessageItemContainer> 
            ))}
             
        </div>
            <MessageInputField Message={Message} setMessage={setMessage} />
        </>
    )
}

export default MessageContainer; 
