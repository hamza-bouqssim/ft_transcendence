import { InputField, MessagePanelStyle } from "@/app/utils/styles"
import MessageContainer from "./MessageContainer";
import MessageInputField from "./MessageInputField";
import { messageTypes } from "@/app/utils/types";
import { FC } from "react";

type Props  = {
    messages : messageTypes[];
}

const MessagePanel : FC<Props> = ({messages}) => {

    return (
    <MessagePanelStyle> 
        <MessageContainer messages={messages}/>
        <MessageInputField/>
    </MessagePanelStyle>)
}
export  default MessagePanel;