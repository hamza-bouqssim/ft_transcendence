import { MessageInputFieldContainer, MessageInput, BtnStyling } from "@/app/utils/styles"
import { Dispatch, SetStateAction, FC } from "react";



type props = {
    content : string;
    setContent : Dispatch<SetStateAction<string>>;
    sendMessage : (e: React.FormEvent<HTMLFormElement>) => void;
}

const MessageInputField: FC<props> = ({content, setContent, sendMessage}) => {
    return (<MessageInputFieldContainer>
        <form onSubmit={sendMessage}>
            <MessageInput placeholder="Create a message" value={content}  onChange={(e) => setContent(e.target.value)}/>
            <BtnStyling></BtnStyling>

        </form>
    </MessageInputFieldContainer>)
}

export default MessageInputField