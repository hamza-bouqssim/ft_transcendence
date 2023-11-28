import {AvatarStyle, MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "@/app/utils/styles"
import { User, messageTypes } from "@/app/utils/types";
import { FC, useEffect, useState } from "react";
import {formatRelative} from 'date-fns'
import { getAuthUser } from "@/app/utils/api";
import Image from "next/image";

type Props  = {
    messages : messageTypes[];
}
const MessageContainer  : FC<Props>  = ({messages}) => {
    const [ user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const controller = new AbortController();
    useEffect(() => {
            setLoading(true);
            getAuthUser().then(({data}) => {  
                setUser(data);
                setLoading(false)})
            .catch((err)=> { setLoading(false);});
    }, [])
    const functionHandleDisplay_name = () =>{
        let test;
            messages?.map((elem)=>{
                test = elem.recipient.display_name;

            })
            return test;
    }

    const functionHandleAvatarUrl = () =>{
        let test;
            messages?.map((elem)=>{
                test = elem.recipient.avatar_url;

            })
            return test;


    }
    const functionHandleUserName = () =>{
        let test;
            messages?.map((elem)=>{
                test = elem.recipient.username;

            })
            return test;
    }

    return (
        
    <div className="h-[calc(100%-121px)] overflow-auto py-3">
        <div className="flex items-center justify-between p-5 rounded-full text-black  bg-[#F2F3FD]">
            <div className="flex items-center">
            <Image src={functionHandleAvatarUrl()} className="h-14 w-14 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />

                    <h1 className="ml-2">{functionHandleUserName()}  {functionHandleDisplay_name()}</h1>
        </div>
        </div>
        <MessageContainerStyle>
        
         {messages && messages.map((m) =>(
            <MessageItemContainer key={m.id}>
                <Image src={m.sender.avatar_url} className="h-10 w-10 rounded-[50%] bg-black " alt="Description of the image" width={60}   height={60} />
                        <MessageItemDetails>
                            <MessageItemHeader key={m.id}>
                            <span className="senderName" style={{color : user?.id === m.sender.id ? '#8982a6' : '#778ba5'}}>
                                {m.sender.username}
                            </span>
                            <span className="time">
                                {formatRelative(new Date(m.createdAt), new Date())}
                            </span>
                            </MessageItemHeader>
                            <MessageItemContent>{m.content}</MessageItemContent>
                        </MessageItemDetails>

            </MessageItemContainer>
         ) )}
         </MessageContainerStyle>
    </div>
    )
}

export default MessageContainer;