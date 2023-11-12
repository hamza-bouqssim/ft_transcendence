import { InputField, MessagePanelStyle, MessagePannelBody, MessagePannelHeaderStyle } from "@/app/utils/styles"
import MessageContainer from "./MessageContainer";
import MessageInputField from "./MessageInputField";
import { messageTypes } from "@/app/utils/types";
import { FC, useState } from "react";
import MessagePanelHeader from "./MessagePanelHeader";
import { useParams } from "next/navigation";
import { postNewMessage } from "@/app/utils/api";

type Props  = {
    messages : messageTypes[];
    sendTypingStatus: () => void;
}

const MessagePanel : FC<Props> = ({messages, sendTypingStatus}) => {
        const [content, setContent] = useState('');
        const { id } = useParams();
        
        const sendMessage = async (e : React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if(!id || !content)
                return ;
            const participentsId = id;
            console.log(participentsId);
            try{
                await postNewMessage({participentsId, content});
                setContent('');
            }catch(err){
                alert("error");
                console.log(err);

            }
        };
     
    return (
        <>
            <MessagePanelHeader/>
                <MessagePanelStyle> 
                    <MessagePannelBody>
                    <MessageContainer messages={messages}/>
                    <MessageInputField content= {content} setContent={setContent} sendMessage={sendMessage} sendTypingStatus={sendTypingStatus}/>

                    
                </MessagePannelBody>
                </MessagePanelStyle>
        </>
    )
}
export  default MessagePanel;