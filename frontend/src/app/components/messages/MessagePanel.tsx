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
}

const MessagePanel : FC<Props> = ({messages}) => {
        const [content, setContent] = useState('');
        const { id } = useParams();
        
        const sendMessage = async (e : React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log('sending message', content);
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
        <div className="p-2 md:p-6  h-full flex items-center w-full justify-between"> 
                <div className="md:w-[60%] h-full w-full"> 
                    <MessagePanelHeader/>
                    <MessageContainer messages={messages}/>
                    <MessageInputField content= {content} setContent={setContent} sendMessage={sendMessage}/>
                </div>
            <div className="hidden md:block md:w-[40%]  pl-4  h-full ">
                <div  className="bg-[#F2F3FD] w-full h-full rounded-2xl ">

                </div>
            </div>

        </div>
    )
}
export  default MessagePanel;