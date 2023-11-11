import {MessageContainerStyle, MessageItemAvatar, MessageItemContainer, MessageItemContent, MessageItemDetails, MessageItemHeader} from "@/app/utils/styles"
import { User, messageTypes } from "@/app/utils/types";
import { FC, useEffect, useState } from "react";
import {formatRelative} from 'date-fns'
import { getAuthUser } from "@/app/utils/api";

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
            .catch((err)=> {console.log(err); setLoading(false);});
    }, [])

    return (
    <MessageContainerStyle>
         {messages.map((m) =>(
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
         
    </MessageContainerStyle>
    )
}

export default MessageContainer;