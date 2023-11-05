import { InputField, MessagePanelStyle, MessagePannelBody, MessagePannelHeaderStyle } from "@/app/utils/styles"
import MessageContainer from "./MessageContainer";
import MessageInputField from "./MessageInputField";
import { messageTypes } from "@/app/utils/types";
import { FC } from "react";
import MessagePanelHeader from "./MessagePanelHeader";

type Props  = {
    messages : messageTypes[];
}

const MessagePanel : FC<Props> = ({messages}) => {

    return (
        <>
            <MessagePanelHeader/>
                <MessagePanelStyle> 
                    <MessagePannelBody>
                    <MessageContainer messages={messages}/>
                    <MessageInputField/>
                </MessagePannelBody>
                </MessagePanelStyle>
        </>
    )
}
export  default MessagePanel;