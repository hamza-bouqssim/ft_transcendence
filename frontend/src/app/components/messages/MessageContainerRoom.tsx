import {MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "@/app/utils/styles"
import { User, messageTypes } from "@/app/utils/types";
import { FC, useEffect, useState } from "react";
import {formatRelative} from 'date-fns'
import { getAuthUser } from "@/app/utils/api";

type Props  = {
    messages : messageTypes[];
}
const MessageContainerRoom  : FC<Props>  = ({messages}) => {
    const [ user, setUser] = useState<User | undefined>();
    const controller = new AbortController();
    useEffect(() => {
            getAuthUser().then(({data}) => {  
                setUser(data);})
            .catch((err)=> {console.log(err);});
    }, [])

    return (
    <div className="h-[calc(100%-121px)] overflow-auto py-3">
         {messages?.map((m) =>(
            <MessageItemContainer key={m.id}>
                    <MessageItemAvatar/>
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
         
    </div>
    )
}

export default MessageContainerRoom;